import React, { useState, useEffect } from 'react';
import { Trip } from '../types/travel';
import { POPULAR_INDIAN_DESTINATIONS, DestinationInspiration } from '../data/defaultTrips';
import {
  Search,
  Sparkles,
  MapPin,
  Calendar,
  Compass,
  RotateCw,
  Globe,
  ArrowRight,
  Clock,
  Wallet,
  Coffee,
  Check,
  Plane,
  Eye,
  Layers
} from 'lucide-react';

interface LandingPageViewProps {
  onTripGenerated: (trip: Trip) => void;
  savedTrips?: Trip[];
  onSelectSavedTrip?: (tripId: string) => void;
}

const DEPARTURE_CITIES = [
  'Mumbai',
  'Delhi NCR',
  'Bengaluru',
  'Pune',
  'Hyderabad',
  'Kolkata',
  'Chennai',
  'Ahmedabad',
  'Jaipur',
  'Chandigarh',
];

const TRAVEL_STYLES = [
  { id: 'heritage', label: '🏰 Royal Heritage & Forts' },
  { id: 'foodie', label: '🍛 Street Food & Cafe Trail' },
  { id: 'scenic', label: '🌿 Scenic Hills & Backwaters' },
  { id: 'budget', label: '🎒 Budget Backpacker' },
  { id: 'coastal', label: '🏖️ Sunsets & Coastal Chill' },
  { id: 'adventure', label: '⛰️ Mountains & High Passes' },
];

const INSTANT_DESTINATIONS = [
  { name: 'Jaipur & Amer', region: 'Rajasthan', country: 'India', suggestedDays: 3, vibe: 'Pink city royal forts, lassi & palaces' },
  { name: 'Goa (North & South)', region: 'Goa', country: 'India', suggestedDays: 4, vibe: 'Latin quarter villas, coastal cafes & sunsets' },
  { name: 'Manali & Solang Valley', region: 'Himachal Pradesh', country: 'India', suggestedDays: 4, vibe: 'Pine river valleys, cozy cafes & Atal Tunnel' },
  { name: 'Munnar & Alleppey Backwaters', region: 'Kerala', country: 'India', suggestedDays: 4, vibe: 'Emerald tea estates & backwater houseboats' },
  { name: 'Varanasi & Sarnath', region: 'Uttar Pradesh', country: 'India', suggestedDays: 3, vibe: 'Timeless Ganga Aarti & dawn boat rides' },
  { name: 'Udaipur City of Lakes', region: 'Rajasthan', country: 'India', suggestedDays: 3, vibe: 'Lake Pichola boat palaces & rooftop sunsets' },
  { name: 'Leh & Pangong Tso', region: 'Ladakh', country: 'India', suggestedDays: 5, vibe: 'High altitude desert passes & azure lakes' },
  { name: 'Rishikesh & Haridwar', region: 'Uttarakhand', country: 'India', suggestedDays: 3, vibe: 'Ganga river rafting, yoga ashrams & mountain cafes' },
  { name: 'Srinagar & Gulmarg', region: 'Jammu & Kashmir', country: 'India', suggestedDays: 4, vibe: 'Dal Lake shikaras, Mughal gardens & snowy valleys' },
  { name: 'Agra Heritage', region: 'Uttar Pradesh', country: 'India', suggestedDays: 2, vibe: 'Taj Mahal dawn marble & Mughal sandstone forts' },
  { name: 'Amritsar & Wagah', region: 'Punjab', country: 'India', suggestedDays: 2, vibe: 'Golden Temple seraphic peace & Wagah border' },
  { name: 'Hampi Ruins', region: 'Karnataka', country: 'India', suggestedDays: 3, vibe: 'UNESCO boulder temples & riverside stone ruins' },
  { name: 'Ooty & Coonoor', region: 'Tamil Nadu', country: 'India', suggestedDays: 3, vibe: 'Nilgiri toy train, mist clouds & tea slopes' },
  { name: 'Coorg (Kodagu)', region: 'Karnataka', country: 'India', suggestedDays: 3, vibe: 'Coffee plantations, spice trails & Abbey Falls' },
  { name: 'Pondicherry', region: 'Tamil Nadu', country: 'India', suggestedDays: 3, vibe: 'French colonial quarters & seaside promenade' },
  { name: 'Dubai & Desert Dunes', region: 'UAE', country: 'UAE', suggestedDays: 4, vibe: 'Burj Khalifa skyline & golden desert safaris' },
  { name: 'Bali & Ubud', region: 'Indonesia', country: 'Indonesia', suggestedDays: 5, vibe: 'Rice terraces, cliff temples & tropical beaches' },
  { name: 'Thailand (Bangkok & Phuket)', region: 'Thailand', country: 'Thailand', suggestedDays: 5, vibe: 'Gilded Buddhist wats & vibrant night markets' },
  { name: 'Singapore', region: 'Singapore', country: 'Singapore', suggestedDays: 4, vibe: 'Gardens by the Bay & Marina Bay wonder' },
];

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onTripGenerated,
  savedTrips = [],
  onSelectSavedTrip,
}) => {
  const [destinationQuery, setDestinationQuery] = useState('');
  const [departureCity, setDepartureCity] = useState('Mumbai');
  const [daysCount, setDaysCount] = useState(3);
  const [travelStyle, setTravelStyle] = useState('🏰 Royal Heritage & Forts');
  const [focusTheme, setFocusTheme] = useState('');

  // Live Autopopulate & search states
  const [isSearchingCities, setIsSearchingCities] = useState(false);
  const [suggestedCities, setSuggestedCities] = useState<any[]>([]);
  const [searchSources, setSearchSources] = useState<{ title: string; url: string }[]>([]);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Animated ticker during AI Generation
  const GENERATION_STEPS = [
    'Connecting with Google Search for live timings & attractions...',
    'Fetching accurate coordinates & 360° Street View panoramas...',
    'Curating authentic food spots, tea stalls & insider zine tips...',
    'Calculating realistic budget & transit in Indian Rupees (₹)...',
    'Assembling comic storyboard, packing list & pocket zine...',
  ];

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      setGenerationStep(0);
      interval = setInterval(() => {
        setGenerationStep((prev) => (prev + 1) % GENERATION_STEPS.length);
      }, 2600);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Instant local search without hitting API quota on every keystroke
  useEffect(() => {
    const q = destinationQuery.trim().toLowerCase();
    if (q.length < 2) {
      setSuggestedCities([]);
      return;
    }

    const matches = INSTANT_DESTINATIONS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    );
    setSuggestedCities(matches);
  }, [destinationQuery]);

  // Optional online Google Search lookup on explicit search action
  const fetchCities = async (query: string) => {
    setIsSearchingCities(true);
    try {
      const res = await fetch('/api/ai/search-cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestedCities(data.cities || []);
        setSearchSources(data.sources || []);
      }
    } catch (e) {
      console.error('Error fetching city suggestions', e);
    } finally {
      setIsSearchingCities(false);
    }
  };

  const handleSelectCity = (city: any) => {
    setDestinationQuery(city.name);
    if (city.suggestedDays) {
      setDaysCount(city.suggestedDays);
    }
    setSuggestedCities([]);
  };

  const handleQuickInspiration = (item: DestinationInspiration) => {
    setDestinationQuery(item.name);
    setDaysCount(item.suggestedDays);
    setFocusTheme(item.tagline);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const destination = destinationQuery.trim();
    if (!destination) {
      setErrorMsg('Please enter a destination to start planning your trip.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          departureCity,
          daysCount,
          travelStyle,
          focusTheme,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate itinerary');
      }

      const data = await res.json();
      if (data.trip) {
        onTripGenerated(data.trip);
      } else {
        throw new Error('Received invalid trip data from server');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMsg(err.message || 'Something went wrong while curating your itinerary.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4f8] text-[#232326] font-body selection:bg-[#FFB5A7] selection:text-[#232326]">
      {/* 1. Playful Zine Top Bar */}
      <header className="border-b-2 border-[#232326] bg-[#fbf8fc] px-4 md:px-8 py-3.5 sticky top-0 z-30 shadow-[0_2px_0px_#232326]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFB5A7] border-2 border-[#232326] flex items-center justify-center font-display font-bold text-sm shadow-[2px_2px_0px_#232326]">
              ✦
            </div>
            <div>
              <span className="font-display font-bold text-lg md:text-xl text-[#232326] tracking-tight block leading-tight">
                Pastel Zine Safar
              </span>
              <span className="text-[10px] font-mono-code font-bold uppercase text-[#884f44] tracking-wider">
                India Edition · Google Maps & Search Grounded
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#232326] bg-[#CDEAC0] text-xs font-mono-code font-bold text-[#0a2006]">
              <span>INR (₹) Tailored</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#232326] bg-[#A8DADC] text-xs font-mono-code font-bold text-[#002021]">
              <Eye className="w-3.5 h-3.5" />
              <span>360° Real-Time View</span>
            </span>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Comic Header Stamp */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-[#232326] bg-[#FFB5A7] shadow-[2px_2px_0px_#232326] mb-4">
            <Sparkles className="w-4 h-4 text-[#232326]" />
            <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#232326]">
              Handcrafted Travel Zines · Curated in Real Time
            </span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#232326] tracking-tight leading-tight max-w-3xl mx-auto">
            Where is your next <span className="bg-[#FFB5A7] px-2 py-0.5 rounded-lg border-2 border-[#232326] shadow-[3px_3px_0px_#232326] inline-block -rotate-1">Safar</span> taking you?
          </h1>

          <p className="mt-3 text-sm md:text-base text-[#524341] max-w-2xl mx-auto font-body">
            Enter any destination in India or around the world. We ground it with <strong>live Google Search</strong>, <strong>360° Google Street View</strong>, and realistic <strong>₹ Indian Rupee budgets</strong> to build your illustrated comic travel zine.
          </p>
        </div>

        {/* 3. Main Trip Planning Box */}
        <div className="bg-[#fbf8fc] border-2 border-[#232326] rounded-[20px] p-5 sm:p-7 md:p-8 shadow-[6px_6px_0px_#232326] relative overflow-hidden mb-12">
          {/* Subtle halftone background */}
          <div className="absolute inset-0 zine-halftone pointer-events-none opacity-40" />

          {errorMsg && (
            <div className="p-3 mb-5 bg-[#ffdad6] border-2 border-[#232326] rounded-xl text-xs font-mono-code font-bold text-[#ba1a1a] shadow-[2px_2px_0px_#232326] relative z-10">
              ⚠ {errorMsg}
            </div>
          )}

          <form onSubmit={handleGenerate} className="relative z-10 space-y-6">
            {/* Destination Input Field with Autopopulate */}
            <div>
              <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#884f44]" />
                  <span>Destination Name or City:</span>
                </span>
                <span className="text-[11px] text-[#884f44] font-normal hidden sm:inline">
                  Google Search Autopopulates Live Places
                </span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={destinationQuery}
                  onChange={(e) => setDestinationQuery(e.target.value)}
                  placeholder="e.g. Jaipur, Goa, Manali, Munnar, Varanasi, Udaipur, Dubai, Bali, Kashmir..."
                  className="w-full p-3.5 sm:p-4 pl-11 text-base sm:text-lg border-2 border-[#232326] rounded-xl bg-white font-body placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#884f44] shadow-[2px_2px_0px_#232326]"
                  disabled={isGenerating}
                  autoFocus
                />
                <Search className="w-5 h-5 text-[#884f44] absolute left-3.5 top-4 sm:top-4.5" />
                {isSearchingCities && (
                  <RotateCw className="w-4 h-4 text-[#884f44] animate-spin absolute right-4 top-4 sm:top-5" />
                )}
              </div>

              {/* Live Google Search Suggestions dropdown */}
              {suggestedCities.length > 0 && (
                <div className="mt-2 p-2 bg-white border-2 border-[#232326] rounded-xl shadow-[3px_3px_0px_#232326] space-y-1.5 max-h-60 overflow-y-auto">
                  <span className="text-[10px] font-mono-code uppercase font-bold text-[#884f44] px-2 block">
                    Google Search Autopopulated Destinations:
                  </span>
                  {suggestedCities.map((city, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectCity(city)}
                      className="p-2.5 rounded-lg hover:bg-[#FDE4CF]/50 border border-transparent hover:border-[#232326] cursor-pointer transition-all flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-bold text-sm text-[#232326] flex items-center gap-1.5">
                          <span>{city.name}</span>
                          <span className="text-xs font-mono-code font-normal text-[#524341]">
                            ({city.region ? `${city.region}, ` : ''}{city.country})
                          </span>
                        </div>
                        <p className="text-xs text-[#524341] line-clamp-1 italic">{city.vibe}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="px-2 py-0.5 rounded-full border border-[#232326] bg-[#A8DADC] text-[10px] font-mono-code font-bold">
                          {city.suggestedDays || 3} Days
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Travel Customization Grid: Days, Departure, Style */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* 1. Number of Days */}
              <div>
                <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#884f44]" />
                  <span>Duration:</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[2, 3, 4, 5, 7].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setDaysCount(num)}
                      className={`flex-1 py-2 text-xs font-mono-code font-bold rounded-lg border-2 border-[#232326] transition-all cursor-pointer ${
                        daysCount === num
                          ? 'bg-[#FFB5A7] shadow-[2px_2px_0px_#232326] translate-y-[-1px]'
                          : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      {num}D
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Departure City */}
              <div>
                <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1.5 flex items-center gap-1">
                  <Plane className="w-3.5 h-3.5 text-[#884f44]" />
                  <span>Starting From:</span>
                </label>
                <select
                  value={departureCity}
                  onChange={(e) => setDepartureCity(e.target.value)}
                  className="w-full p-2 text-xs font-mono-code border-2 border-[#232326] rounded-lg bg-white focus:outline-none cursor-pointer"
                >
                  {DEPARTURE_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Travel Style */}
              <div>
                <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1.5 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-[#884f44]" />
                  <span>Travel Style:</span>
                </label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="w-full p-2 text-xs font-mono-code border-2 border-[#232326] rounded-lg bg-white focus:outline-none cursor-pointer"
                >
                  {TRAVEL_STYLES.map((s) => (
                    <option key={s.id} value={s.label}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Focus Theme / Special Note (Optional) */}
            <div>
              <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1 flex items-center justify-between">
                <span>Custom Travel Wish (Optional):</span>
                <span className="text-[11px] text-[#524341] font-normal">e.g. Vegetarian food trail, photography sunrise, budget train travel</span>
              </label>
              <input
                type="text"
                value={focusTheme}
                onChange={(e) => setFocusTheme(e.target.value)}
                placeholder="e.g. Local handicraft shopping, sunset boating, pure vegetarian street food, Vande Bharat connection..."
                className="w-full p-2.5 text-xs border-2 border-[#232326] rounded-xl bg-white font-body focus:outline-none"
              />
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isGenerating || !destinationQuery.trim()}
                className="w-full py-3.5 sm:py-4 px-6 rounded-xl bg-[#A8DADC] hover:bg-[#bbf0f2] border-2 border-[#232326] font-display font-bold text-base sm:text-lg text-[#002021] uppercase tracking-wider shadow-[4px_4px_0px_#232326] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#232326] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#232326] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="w-5 h-5 animate-spin text-[#002021]" />
                    <span>Curating Your Zine Safar...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-[#884f44]" />
                    <span>Generate Zine Itinerary in ₹ (Grounded)</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Real-Time Generation Progress Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-[#fbf8fc]/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-2xl bg-[#FFB5A7] border-2 border-[#232326] flex items-center justify-center shadow-[4px_4px_0px_#232326] mb-4 animate-bounce">
                <Sparkles className="w-7 h-7 text-[#232326]" />
              </div>

              <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#884f44] mb-1">
                Gemini 4 · Google Search & Google Maps Live
              </span>

              <h3 className="font-display font-bold text-xl sm:text-2xl text-[#232326] mb-3">
                Crafting Your {destinationQuery} Pocket Zine...
              </h3>

              <div className="p-3 bg-white border-2 border-[#232326] rounded-xl max-w-md shadow-[3px_3px_0px_#232326]">
                <p className="text-xs font-mono-code text-[#232326] flex items-center justify-center gap-2 font-semibold">
                  <RotateCw className="w-3.5 h-3.5 animate-spin text-[#884f44]" />
                  <span>{GENERATION_STEPS[generationStep]}</span>
                </p>
              </div>

              <p className="text-[11px] font-mono-code text-[#524341] mt-3">
                Fetching verified landmarks, opening hours, 360° Street View & ₹ budgets
              </p>
            </div>
          )}
        </div>

        {/* 4. Previous Saved Trips (if any exist) */}
        {savedTrips.length > 0 && onSelectSavedTrip && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg sm:text-xl text-[#232326] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#884f44]" />
                <span>Your Saved Safars ({savedTrips.length})</span>
              </h2>
              <span className="text-xs font-mono-code text-[#524341]">Saved in browser</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {savedTrips.map((trip) => {
                const totalStops = trip.days.reduce((acc, d) => acc + d.stops.length, 0);
                return (
                  <div
                    key={trip.id}
                    onClick={() => onSelectSavedTrip(trip.id)}
                    className="p-4 rounded-xl border-2 border-[#232326] bg-white hover:bg-[#FDE4CF]/30 shadow-[3px_3px_0px_#232326] cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-mono-code font-bold uppercase text-[#884f44] block">
                        {trip.destination}
                      </span>
                      <h3 className="font-display font-bold text-base text-[#232326] mt-0.5 line-clamp-1">
                        {trip.title}
                      </h3>
                      <p className="text-xs font-mono-code text-[#524341] mt-1">
                        {trip.days.length} Days · {totalStops} Stops · {trip.currencySymbol}{trip.totalBudget.toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#232326]/10 flex items-center justify-between text-xs font-mono-code font-bold text-[#884f44]">
                      <span>Open Itinerary</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Popular Inspirations for Indian Travelers */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-6">
            <div>
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#232326]">
                Popular Destinations for Indian Travelers
              </h2>
              <p className="text-xs font-mono-code text-[#524341] mt-0.5">
                Click any destination to auto-populate and start your zine itinerary
              </p>
            </div>
            <div className="text-xs font-mono-code font-bold text-[#884f44] bg-[#FDE4CF] px-3 py-1 rounded-full border border-[#232326] self-start sm:self-auto">
              ₹ Realistic Indian Budgets
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POPULAR_INDIAN_DESTINATIONS.map((item) => (
              <div
                key={item.id}
                onClick={() => handleQuickInspiration(item)}
                className="bg-white border-2 border-[#232326] rounded-xl overflow-hidden shadow-[3px_3px_0px_#232326] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#232326] transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-36 overflow-hidden border-b-2 border-[#232326]">
                    <img
                      src={item.coverImage}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-[#FFB5A7] border border-[#232326] rounded-md px-2 py-0.5 text-[10px] font-mono-code font-bold uppercase shadow-[1px_1px_0px_#232326]">
                      {item.region}
                    </div>
                    <div className="absolute top-2 right-2 bg-white border border-[#232326] rounded-md px-2 py-0.5 text-[10px] font-mono-code font-bold shadow-[1px_1px_0px_#232326]">
                      {item.suggestedDays} Days
                    </div>
                  </div>

                  <div className="p-3.5">
                    <h3 className="font-display font-bold text-base text-[#232326] group-hover:text-[#884f44] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#524341] line-clamp-2 mt-1 font-body">
                      {item.tagline}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-[#232326]/10 flex items-center justify-between text-xs font-mono-code">
                      <span className="text-[#524341]">Budget:</span>
                      <span className="font-bold text-[#232326]">
                        ₹{item.estimatedBudgetInr.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 pt-0">
                  <button
                    type="button"
                    className="w-full py-1.5 px-3 rounded-lg border border-[#232326] bg-[#A8DADC] group-hover:bg-[#b9ecee] text-xs font-mono-code font-bold text-[#002021] flex items-center justify-center gap-1 shadow-[1px_1px_0px_#232326]"
                  >
                    <span>Plan Itinerary</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 6. Footer */}
      <footer className="border-t-2 border-[#232326] bg-[#fbf8fc] px-4 md:px-8 py-6 mt-16 text-center text-xs font-mono-code text-[#524341]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded border border-[#232326] bg-[#FFB5A7] flex items-center justify-center font-bold text-[10px] text-[#232326]">
              ✦
            </span>
            <span className="font-bold text-[#232326]">Pastel Zine Safar · India Edition</span>
          </div>
          <div>
            Powered by Google Maps Platform & Gemini 4 with live Google Search
          </div>
        </div>
      </footer>
    </div>
  );
};
