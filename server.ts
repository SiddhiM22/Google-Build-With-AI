import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { searchFallbackCities, buildProgrammaticTrip } from './src/server/fallbackData.ts';

dotenv.config();

const app = express();
app.use(express.json());

// In-memory caches to prevent redundant Gemini API calls and prevent 429 quota exhaustion
const citySearchCache = new Map<string, any>();
const itineraryCache = new Map<string, any>();

// Initialize GoogleGenAI client with standard User-Agent header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to call Gemini with automatic fallback for 429 rate limits
async function generateWithFallback(prompt: string, withSearch: boolean = true) {
  const config = withSearch ? { tools: [{ googleSearch: {} }] } : undefined;

  // Attempt 1: Primary gemini-4-hydrogen
  try {
    return await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config,
    });
  } catch (err: any) {
    const isRateLimit =
      err?.status === 429 ||
      err?.message?.includes('429') ||
      err?.message?.includes('RESOURCE_EXHAUSTED') ||
      err?.message?.includes('quota');

    if (!isRateLimit) throw err;
    console.warn('gemini-4-hydrogen rate limited (429). Retrying with gemini-3.1-flash-lite...');
  }

  // Attempt 2: gemini-3.1-flash-lite (higher rate limits)
  try {
    return await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config,
    });
  } catch (err: any) {
    const isRateLimit =
      err?.status === 429 ||
      err?.message?.includes('429') ||
      err?.message?.includes('RESOURCE_EXHAUSTED') ||
      err?.message?.includes('quota');

    if (!isRateLimit) throw err;

    // Attempt 3: gemini-3.1-flash-lite without Search tool if tool quota was exceeded
    if (withSearch) {
      console.warn('Search tool rate limited. Retrying gemini-3.1-flash-lite without tools...');
      return await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
      });
    }

    throw err;
  }
}

// Provide Maps API key configuration to client
app.get('/api/config/maps', (_req, res) => {
  const mapsKey =
    process.env.VITE_GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.MAPS_API_KEY ||
    '';
  res.json({ apiKey: mapsKey });
});

// 1. City Autopopulate & Destination Search with Google Search Grounding (Tailored to Indian Audience)
app.post('/api/ai/search-cities', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const cacheKey = query.toLowerCase().trim();
    if (citySearchCache.has(cacheKey)) {
      return res.json(citySearchCache.get(cacheKey));
    }

    if (!apiKey) {
      const fallbackCities = searchFallbackCities(query);
      return res.json({ cities: fallbackCities, sources: [] });
    }

    const prompt = `You are a specialist travel concierge for Indian travelers.
Use Google Search to find accurate, up-to-date travel destinations matching: "${query}".
The destination may be within India (e.g. Rajasthan, Goa, Kerala, Himachal Pradesh, Uttarakhand, Kashmir, Varanasi, Ladakh, Northeast, Karnataka, Tamil Nadu) or a popular international holiday spot for Indian travelers (e.g. Dubai, Bali, Thailand, Vietnam, Singapore, Georgia, Baku, Europe).

Provide realistic estimates in Indian Rupees (INR / ₹).
Return ONLY a valid JSON object with the following structure (no markdown fences, no explanatory text):
{
  "cities": [
    {
      "name": "City or Region Name",
      "country": "Country",
      "region": "State / Province",
      "vibe": "Short 1-sentence poetic atmosphere / aesthetic highlight",
      "suggestedDays": 3,
      "currencySymbol": "₹",
      "currency": "INR",
      "dailyBudget": 4500,
      "lat": 26.9124,
      "lng": 75.7873,
      "highlights": ["Top landmark 1", "Local food / thali specialty", "Scenic spot"]
    }
  ]
}
Provide 4 to 6 top matching destinations. All budgets must be in Indian Rupees (INR). Ensure latitude and longitude are accurate numbers.`;

    let response: any;
    try {
      response = await generateWithFallback(prompt, true);
    } catch (genError: any) {
      console.warn('Gemini search rate limit or error. Serving resilient fallback cities:', genError?.message);
      const fallbackCities = searchFallbackCities(query);
      const result = { cities: fallbackCities, sources: [] };
      citySearchCache.set(cacheKey, result);
      return res.json(result);
    }

    const rawText = response?.text || '';
    const cleanedText = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    let parsedData: any = { cities: [] };
    try {
      parsedData = JSON.parse(cleanedText);
    } catch (e) {
      const match = cleanedText.match(/\{[\s\S]*\}/);
      if (match) {
        parsedData = JSON.parse(match[0]);
      } else {
        parsedData = { cities: searchFallbackCities(query) };
      }
    }

    const groundingChunks =
      response?.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const searchSources = groundingChunks
      .filter((chunk: any) => chunk.web?.uri)
      .map((chunk: any) => ({
        title: chunk.web?.title || 'Google Search Result',
        url: chunk.web?.uri,
      }));

    const result = {
      cities: parsedData?.cities?.length ? parsedData.cities : searchFallbackCities(query),
      sources: searchSources,
    };

    citySearchCache.set(cacheKey, result);
    res.json(result);
  } catch (error: any) {
    console.error('Error searching cities:', error);
    res.json({
      cities: searchFallbackCities(req.body?.query || 'India'),
      sources: [],
    });
  }
});

// 2. Full Itinerary Generator with Google Search Grounding (Tailored to Indian Audience)
app.post('/api/ai/generate-itinerary', async (req, res) => {
  try {
    const { destination, country, daysCount = 3, travelStyle = 'balanced', focusTheme, departureCity = 'India' } = req.body;

    if (!destination) {
      return res.status(400).json({ error: 'Destination is required' });
    }

    const numDays = Math.min(7, Math.max(1, parseInt(daysCount) || 3));
    const cacheKey = `${destination.toLowerCase().trim()}-${numDays}-${travelStyle}`;

    if (itineraryCache.has(cacheKey)) {
      return res.json(itineraryCache.get(cacheKey));
    }

    if (!apiKey) {
      const fallbackTrip = buildProgrammaticTrip(destination, country, numDays, travelStyle, departureCity);
      return res.json({ trip: fallbackTrip, sources: [] });
    }

    const prompt = `You are designing an illustrated pocket travel zine itinerary specifically tailored for Indian travelers.
Use Google Search to find current, verified travel information for "${destination}, ${country || ''}" (departure from ${departureCity}).
Search for real attractions, current famous food spots, authentic transit connections (Vande Bharat / IRCTC trains, flights, metro, local autos, or cabs), opening hours, local customs, and real coordinates (latitude and longitude).
Design an unforgettable ${numDays}-day illustrated travel zine with a "${travelStyle}" style${focusTheme ? ` and focus on "${focusTheme}"` : ''}.

CRITICAL REQUIREMENTS FOR INDIAN TRAVELERS:
1. CURRENCY: ALL costs and budgets MUST be in Indian Rupees (currency: "INR", currencySymbol: "₹").
2. REALISTIC INR ESTIMATES:
   - Street foods / snacks / chai: ₹40 - ₹150
   - Restaurant meals / thalis / cafes: ₹350 - ₹1,200
   - Monument / temple / fort entry tickets: ₹50 - ₹600 (or international converted equivalent in ₹)
   - Local transit / auto / metro / cab: ₹80 - ₹600
   - Total budget for ${numDays} days in ₹ (e.g. ₹12,000 to ₹35,000 for domestic, or realistic INR for international).
3. CULTURALLY RELEVANT TIPS IN ZINE SPEECH BUBBLES:
   - Specific local food recommendations (famous local chaat, thali, biryani, dosas, sweets, veg options, or iconic cafe dishes).
   - Practical timings (best morning hours for darshan / monument photography to avoid the hot afternoon sun).
   - Local transport tips (prepaid auto booths, metro card tokens, UPI payment acceptance, auto bargaining notes).
4. ACCURATE COORDINATES: lat and lng MUST be accurate decimal degrees for real-time Google Maps Street View.

Return ONLY a valid JSON object (no markdown fences, no backticks, no introductory commentary):
{
  "title": "Creative Zine Title (e.g. Jaipur Forts, Amber Dawns & Royal Kachoris)",
  "subtitle": "Inspiring 1-line subtitle tailored for Indian explorers",
  "destination": "${destination}",
  "country": "${country || destination}",
  "currency": "INR",
  "currencySymbol": "₹",
  "totalBudget": 18000,
  "introZineNote": "2-3 sentences capturing the tactile atmosphere, fragrances of cardamom and chai, scenic views, and zine wanderlust.",
  "days": [
    {
      "dayNumber": 1,
      "title": "Chapter Theme (e.g. Royal Courtyards & Johari Bazaar)",
      "theme": "Atmospheric subtitle for this day",
      "date": "Day 01",
      "stops": [
        {
          "time": "09:00 AM",
          "period": "morning",
          "title": "Real Place Name",
          "subtitle": "Real street address or closest metro/landmark",
          "category": "place",
          "description": "2-3 descriptive sentences on what to see and experience.",
          "cost": 150,
          "flightOrTrainCode": "Optional flight or Vande Bharat/IRCTC train code",
          "confirmationCode": "Optional ticket code",
          "isConfirmed": false,
          "tip": "Concrete insider tip (e.g. Best morning light, secret entrance, famous chai stall next door, UPI accepted).",
          "lat": 26.9855,
          "lng": 75.8513,
          "transitToNext": {
            "duration": "15 min auto",
            "mode": "taxi",
            "details": "Direction notes"
          },
          "tags": ["Heritage", "Photography"]
        }
      ]
    }
  ],
  "packingList": [
    { "name": "Aadhaar Card / Govt ID / Passport", "category": "documents", "essential": true },
    { "name": "UPI apps activated (GPay / PhonePe) & emergency cash", "category": "documents", "essential": true },
    { "name": "Comfortable slip-on shoes for temple & fort walks", "category": "clothing", "essential": true },
    { "name": "Power bank & charging cables", "category": "gear", "essential": true },
    { "name": "Pocket zine sketchpad & gel pen", "category": "zine", "essential": true }
  ]
}

Ensure:
- Category is one of: "place", "food", "transit", "stay", "activity".
- Period is one of: "morning", "afternoon", "evening", "night".
- "lat" and "lng" are accurate floating point numbers for Google Maps and Street View.
- Provide 3 to 4 stops per day with sequential transit connection between stops.`;

    let response: any;
    try {
      response = await generateWithFallback(prompt, true);
    } catch (genError: any) {
      console.warn('Gemini generate quota exhausted or error. Serving resilient programmatic itinerary:', genError?.message);
      const fallbackTrip = buildProgrammaticTrip(destination, country, numDays, travelStyle, departureCity);
      const result = { trip: fallbackTrip, sources: [] };
      itineraryCache.set(cacheKey, result);
      return res.json(result);
    }

    const rawText = response?.text || '';
    const cleanedText = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    let parsedData: any;
    try {
      parsedData = JSON.parse(cleanedText);
    } catch (e) {
      const match = cleanedText.match(/\{[\s\S]*\}/);
      if (match) {
        parsedData = JSON.parse(match[0]);
      } else {
        console.warn('Could not parse JSON from Gemini. Serving programmatic trip.');
        const fallbackTrip = buildProgrammaticTrip(destination, country, numDays, travelStyle, departureCity);
        const result = { trip: fallbackTrip, sources: [] };
        itineraryCache.set(cacheKey, result);
        return res.json(result);
      }
    }

    // Extract search grounding citations
    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const searchSources = groundingChunks
      .filter((chunk: any) => chunk.web?.uri)
      .map((chunk: any) => ({
        title: chunk.web?.title || 'Google Search Source',
        url: chunk.web?.uri,
      }));

    // Post-process to ensure IDs and structure
    const tripId = 'trip-' + Date.now();
    const formattedDays = (parsedData.days || []).map((day: any, dIdx: number) => ({
      dayNumber: day.dayNumber || dIdx + 1,
      title: day.title || `Day 0${dIdx + 1}`,
      theme: day.theme || 'Wandering and discovery',
      date: day.date || `Day ${dIdx + 1}`,
      stops: (day.stops || []).map((stop: any, sIdx: number) => ({
        id: `stop-${dIdx + 1}-${sIdx + 1}-${Date.now()}`,
        time: stop.time || '10:00 AM',
        period: stop.period || 'morning',
        title: stop.title || 'Sight',
        subtitle: stop.subtitle || '',
        category: stop.category || 'place',
        description: stop.description || '',
        cost: typeof stop.cost === 'number' ? stop.cost : 100,
        flightOrTrainCode: stop.flightOrTrainCode,
        confirmationCode: stop.confirmationCode,
        isConfirmed: !!stop.isConfirmed,
        isCompleted: false,
        transitToNext: stop.transitToNext,
        tip: stop.tip,
        photoUrl: stop.photoUrl || `https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80`,
        coordinates: {
          x: 20 + Math.floor(Math.random() * 60),
          y: 20 + Math.floor(Math.random() * 60),
          label: (stop.title || '').slice(0, 14),
          lat: stop.lat || 26.9124,
          lng: stop.lng || 75.7873,
        },
        tags: Array.isArray(stop.tags) ? stop.tags : ['Explore'],
        groundingSources: searchSources.slice(0, 3),
      })),
    }));

    const packingList = (parsedData.packingList || []).map((item: any, i: number) => ({
      id: `pack-gen-${i}-${Date.now()}`,
      name: item.name || 'Travel item',
      category: item.category || 'gear',
      isPacked: false,
      essential: !!item.essential,
    }));

    const fullTrip = {
      id: tripId,
      title: parsedData.title || `${destination} Zine Safar`,
      subtitle: parsedData.subtitle || `A curated itinerary for ${destination}`,
      destination: parsedData.destination || destination,
      country: parsedData.country || country || destination,
      dateRange: `${numDays} Days Discovery`,
      currency: parsedData.currency || 'INR',
      currencySymbol: parsedData.currencySymbol || '₹',
      totalBudget: parsedData.totalBudget || (numDays * 4500),
      coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      introZineNote: parsedData.introZineNote || 'Curated with Google Search live grounding for Indian travelers.',
      days: formattedDays,
      packingList:
        packingList.length > 0
          ? packingList
          : [
              { id: 'p-1', name: 'Aadhaar / Govt ID / Passport', category: 'documents', isPacked: false, essential: true },
              { id: 'p-2', name: 'UPI Payment Apps (GPay/PhonePe) & Emergency Cash', category: 'documents', isPacked: false, essential: true },
              { id: 'p-3', name: 'Comfortable slip-on shoes for temple & fort walks', category: 'clothing', isPacked: false, essential: true },
              { id: 'p-4', name: 'Power bank & fast charger', category: 'gear', isPacked: false, essential: true },
              { id: 'p-5', name: 'Pocket travel notebook & marker pen', category: 'zine', isPacked: true, essential: true },
            ],
      expenses: [],
    };

    const finalResult = {
      trip: fullTrip,
      sources: searchSources,
    };

    itineraryCache.set(cacheKey, finalResult);
    res.json(finalResult);
  } catch (error: any) {
    console.error('Error generating itinerary, using programmatic fallback:', error);
    const fallbackTrip = buildProgrammaticTrip(
      req.body?.destination || 'Jaipur',
      req.body?.country || 'India',
      parseInt(req.body?.daysCount) || 3,
      req.body?.travelStyle || 'balanced',
      req.body?.departureCity || 'India'
    );
    res.json({
      trip: fallbackTrip,
      sources: [],
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const PORT = process.env.PORT || 3000;

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
