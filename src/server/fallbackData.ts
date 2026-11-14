// Comprehensive fallback travel data and resilient generator for Indian travelers
export interface FallbackCity {
  name: string;
  country: string;
  region: string;
  vibe: string;
  suggestedDays: number;
  currencySymbol: string;
  currency: string;
  dailyBudget: number;
  lat: number;
  lng: number;
  highlights: string[];
}

export const KNOWN_CITIES: FallbackCity[] = [
  {
    name: 'Jaipur & Amer',
    country: 'India',
    region: 'Rajasthan',
    vibe: 'Regal sandstone palaces, vibrant block print textiles, and royal Rajput heritage.',
    suggestedDays: 3,
    currencySymbol: '₹',
    currency: 'INR',
    dailyBudget: 4500,
    lat: 26.9124,
    lng: 75.7873,
    highlights: ['Amer Fort & Sheesh Mahal', 'Hawa Mahal Dawn View', 'City Palace & Jantar Mantar', 'Johari Bazaar Gems'],
  },
  {
    name: 'Goa (North & South)',
    country: 'India',
    region: 'Goa',
    vibe: 'Susegad tropical ease, colorful colonial Latin quarters, and chilled coastal breeze.',
    suggestedDays: 4,
    currencySymbol: '₹',
    currency: 'INR',
    dailyBudget: 5500,
    lat: 15.2993,
    lng: 74.1240,
    highlights: ['Fontainhas Latin Quarter', 'Anjuna & Vagator Cliff Cafes', 'Palolem Kayaking', 'Old Goa Basilica'],
  },
  {
    name: 'Manali & Solang Valley',
    country: 'India',
    region: 'Himachal Pradesh',
    vibe: 'Crisp mountain air, wood-and-stone architecture, and Himalayan tranquility.',
    suggestedDays: 4,
    currencySymbol: '₹',
    currency: 'INR',
    dailyBudget: 4200,
    lat: 32.2432,
    lng: 77.1892,
    highlights: ['Atal Tunnel & Sissu Waterfalls', 'Old Manali Bohemian Cafes', 'Hadimba Cedar Temple', 'Solang Paragliding'],
  },
  {
    name: 'Munnar & Alleppey Backwaters',
    country: 'India',
    region: 'Kerala',
    vibe: 'Lush emerald tea hills, calming waterways, and Ayurvedic tranquility.',
    suggestedDays: 4,
    currencySymbol: '₹',
    currency: 'INR',
    dailyBudget: 6000,
    lat: 10.0889,
    lng: 77.0595,
    highlights: ['Kolukkumalai Sunrise Tea Trek', 'Alleppey Canal Cruise', 'Eravikulam Tahr Sanctuary', 'Kathakali Center'],
  },
  {
    name: 'Varanasi & Sarnath',
    country: 'India',
    region: 'Uttar Pradesh',
    vibe: 'Spiritual chanting, glowing earthen diyas on the river, and 3000-year-old living tradition.',
    suggestedDays: 3,
    currencySymbol: '₹',
    currency: 'INR',
    dailyBudget: 3500,
    lat: 25.3176,
    lng: 82.9739,
    highlights: ['Dashashwamedh Evening Aarti', 'Dawn Wooden Boat Ride', 'Kashi Vishwanath Corridor', 'Sarnath Stupa'],
  },
  {
    name: 'Udaipur City of Lakes',
    country: 'India',
    region: 'Rajasthan',
    vibe: 'Shimmering marble waters, romantic lakefront rooftops, and opulent Mewar legacy.',
    suggestedDays: 3,
    currencySymbol: '₹',
    currency: 'INR',
    dailyBudget: 5000,
    lat: 24.5854,
    lng: 73.7125,
    highlights: ['City Palace Complex', 'Pichola Boat Cruise to Jagmandir', 'Bagore Ki Haveli Dance Show', 'Saheliyon Ki Bari'],
  },
  {
    name: 'Leh & Pangong Tso',
    country: 'India',
    region: 'Ladakh',
    vibe: 'Dramatic moonscapes, fluttering prayer flags, and pure Himalayan silence.',
    suggestedDays: 5,
    currencySymbol: '₹',
    currency: 'INR',
    dailyBudget: 6500,
    lat: 34.1526,
    lng: 77.5771,
    highlights: ['Pangong Tso Blue Lake', 'Khardung La High Pass', 'Thiksey Dawn Chants', 'Nubra Valley Dunes'],
  },
  {
    name: 'Rishikesh & Haridwar',
    country: 'India',
    region: 'Uttarakhand',
    vibe: 'Ganga river rafting, serene ashrams, sunset aarti bells, and cliffside health cafes.',
    suggestedDays: 3,
    currencySymbol: '₹',
    currency: 'INR',
    dailyBudget: 3800,
    lat: 30.0869,
    lng: 78.2676,
    highlights: ['Triveni Ghat Aarti', 'Shivpuri White Water Rafting', 'Beatles Ashram Murals', 'Lakshman Jhula Cafes'],
  },
  {
    name: 'Srinagar & Gulmarg',
    country: 'India',
    region: 'Jammu & Kashmir',
    vibe: 'Dal Lake shikaras, floating flower markets, fragrant kehwa tea, and snow gondolas.',
    suggestedDays: 4,
    currencySymbol: '₹',
    currency: 'INR',
    dailyBudget: 5800,
    lat: 34.0837,
    lng: 74.7973,
    highlights: ['Dal Lake Shikara Dawn Ride', 'Gulmarg Phase 2 Gondola', 'Mughal Nishat Bagh', 'Pahalgam Betaab Valley'],
  },
  {
    name: 'Agra Heritage',
    country: 'India',
    region: 'Uttar Pradesh',
    vibe: 'Sublime white marble sunrise at Taj Mahal and grand Mughal red sandstone architecture.',
    suggestedDays: 2,
    currencySymbol: '₹',
    currency: 'INR',
    dailyBudget: 3800,
    lat: 27.1767,
    lng: 78.0081,
    highlights: ['Taj Mahal Sunrise View', 'Agra Fort Diwan-i-Khas', 'Mehtab Bagh River Sunset', 'Historic Petha Markets'],
  },
  {
    name: 'Amritsar & Wagah',
    country: 'India',
    region: 'Punjab',
    vibe: 'Sacred serenity at the Golden Temple, communal langar devotion, and patriotic Wagah energy.',
    suggestedDays: 2,
    currencySymbol: '₹',
    currency: 'INR',
    dailyBudget: 3200,
    lat: 31.6340,
    lng: 74.8723,
    highlights: ['Golden Temple Sanctum & Langar', 'Wagah Border Beating Retreat', 'Jallianwala Bagh Memorial', 'Kesar Da Dhaba Thali'],
  },
  {
    name: 'Hampi Ruins',
    country: 'India',
    region: 'Karnataka',
    vibe: 'Surreal granite boulder landscapes, Vijayanagara stone chariots, and Tungabhadra sunsets.',
    suggestedDays: 3,
    currencySymbol: '₹',
    currency: 'INR',
    dailyBudget: 3500,
    lat: 15.3350,
    lng: 76.4600,
    highlights: ['Virupaksha Temple Riverfront', 'Vijaya Vittala Stone Chariot', 'Sanapur Lake Bouldering & Coracle', 'Matanga Hill Dawn'],
  },
  {
    name: 'Dubai & Desert Dunes',
    country: 'UAE',
    region: 'UAE',
    vibe: 'Futuristic Burj skyline, gold souks, golden desert safaris, and seamless flights from India.',
    suggestedDays: 4,
    currencySymbol: '₹',
    currency: 'INR',
    dailyBudget: 12000,
    lat: 25.2048,
    lng: 55.2708,
    highlights: ['Burj Khalifa Level 124 View', 'Evening Red Dune Desert Safari', 'Old Dubai Abra & Spice Souk', 'Dubai Marina Walk'],
  },
  {
    name: 'Bali & Ubud',
    country: 'Indonesia',
    region: 'Indonesia',
    vibe: 'Tropical Hindu temples, emerald Tegallalang rice terraces, and cliffside ocean sunsets.',
    suggestedDays: 5,
    currencySymbol: '₹',
    currency: 'INR',
    dailyBudget: 8500,
    lat: -8.4095,
    lng: 115.1889,
    highlights: ['Tanah Lot Sea Temple', 'Tegallalang Rice Terraces', 'Uluwatu Sunset Kecak Dance', 'Seminyak Beach Cafes'],
  },
  {
    name: 'Thailand (Bangkok & Phuket)',
    country: 'Thailand',
    region: 'Thailand',
    vibe: 'Gilded Buddhist wats, bustling night markets, island longtail boats, and vibrant street food.',
    suggestedDays: 5,
    currencySymbol: '₹',
    currency: 'INR',
    dailyBudget: 7500,
    lat: 13.7563,
    lng: 100.5018,
    highlights: ['Grand Palace & Wat Pho Reclining Buddha', 'Phuket Old Town Sino-Portuguese Walk', 'Phi Phi Island Cruise', 'Chatuchak Weekend Market'],
  },
];

export function searchFallbackCities(query: string): FallbackCity[] {
  const q = query.toLowerCase().trim();
  const matched = KNOWN_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.region.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.highlights.some((h) => h.toLowerCase().includes(q))
  );

  if (matched.length > 0) return matched;

  // Fallback return top popular cities
  return KNOWN_CITIES.slice(0, 4);
}

export function buildProgrammaticTrip(
  destination: string,
  country: string,
  daysCount: number,
  travelStyle: string,
  departureCity: string = 'India'
) {
  const q = destination.toLowerCase();
  const known = KNOWN_CITIES.find(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      q.includes(c.name.toLowerCase()) ||
      c.region.toLowerCase().includes(q) ||
      q.includes(c.region.toLowerCase())
  ) || {
    name: destination,
    country: country || 'India',
    region: 'Scenic Getaway',
    vibe: `A bespoke ${travelStyle} adventure crafted with local secrets and verified sights.`,
    suggestedDays: daysCount,
    currencySymbol: '₹',
    currency: 'INR',
    dailyBudget: 4500,
    lat: 26.9124,
    lng: 75.7873,
    highlights: ['Historic Old Town', 'Local Food & Chai Trail', 'Scenic Sunset Viewpoint'],
  };

  const tripId = 'trip-' + Date.now();
  const numDays = Math.min(7, Math.max(1, daysCount));

  // Pre-curated day stop templates based on city
  const isJaipur = q.includes('jaipur') || q.includes('amer') || q.includes('rajasthan');
  const isGoa = q.includes('goa') || q.includes('panaji');
  const isManali = q.includes('manali') || q.includes('himachal') || q.includes('solang');
  const isKerala = q.includes('kerala') || q.includes('munnar') || q.includes('alleppey');
  const isVaranasi = q.includes('varanasi') || q.includes('banaras') || q.includes('kashi');

  const days = Array.from({ length: numDays }).map((_, dIdx) => {
    const dayNumber = dIdx + 1;
    let title = `Day 0${dayNumber} Explorations`;
    let theme = `${travelStyle} discovery and local cultural trail`;
    let stops: any[] = [];

    if (isJaipur) {
      if (dayNumber === 1) {
        title = 'Amber Dawns & Fort Architecture';
        theme = 'Royal palaces, mirror work & traditional MI Road lassi';
        stops = [
          {
            time: '08:30 AM',
            period: 'morning',
            title: 'Amer Fort & Sheesh Mahal',
            subtitle: 'Devisingh Pura, Amer, Jaipur',
            category: 'place',
            description: 'Grand Rajput fortress on the Cheel ka Teela hill with breathtaking marble mirror mosaics.',
            cost: 200,
            flightOrTrainCode: 'VANDE-BHARAT-20977',
            isConfirmed: true,
            tip: 'Arrive at 8:30 AM before the heat and bus groups. Sheesh Mahal mirrors catch the morning sun best!',
            lat: 26.9855,
            lng: 75.8513,
            photoUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
            transitToNext: { duration: '15 min auto', mode: 'taxi', details: 'Head down to Jal Mahal roadside' },
            tags: ['Royal', 'Heritage', 'Fort'],
          },
          {
            time: '01:00 PM',
            period: 'afternoon',
            title: 'Lassiwala & Rawat Pyaaz Kachori',
            subtitle: 'MI Road & Station Road',
            category: 'food',
            description: 'Historic terracotta clay kulhad lassi topped with thick malai and piping hot spiced onion kachoris.',
            cost: 280,
            isConfirmed: false,
            tip: 'Look for "Shop 312" (since 1944). Closes once the fresh curd batches sell out around 3 PM!',
            lat: 26.9174,
            lng: 75.8118,
            photoUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
            transitToNext: { duration: '10 min walk', mode: 'walk', details: 'Walk through Ajmeri Gate into the Pink City bazaar' },
            tags: ['Street Food', 'Lassi', 'Iconic'],
          },
          {
            time: '05:30 PM',
            period: 'evening',
            title: 'Nahargarh Fort Sunset Point',
            subtitle: 'Krishna Nagar, Brahampuri, Jaipur',
            category: 'place',
            description: 'Perched on the Aravalli ridge, offering a 360-degree panoramic view of Jaipur glowing golden in the dusk.',
            cost: 100,
            isConfirmed: false,
            tip: 'Order hot ginger tea from the RTDC Padao cafe while watching city lights illuminate below.',
            lat: 26.9376,
            lng: 75.8156,
            photoUrl: 'https://images.unsplash.com/photo-1609137144822-79015949d214?auto=format&fit=crop&w=800&q=80',
            transitToNext: { duration: '20 min cab', mode: 'taxi', details: 'Drive back down to Johari Bazaar' },
            tags: ['Sunset', 'Viewpoint', 'Aravalli'],
          },
        ];
      } else {
        title = 'Pink City Alleys & Palace Corridors';
        theme = 'Honeycomb windows, cosmic sundials & block-print textiles';
        stops = [
          {
            time: '09:00 AM',
            period: 'morning',
            title: 'Hawa Mahal Palace of Winds',
            subtitle: 'Hawa Mahal Rd, Badi Choupad',
            category: 'place',
            description: 'Pink and red sandstone facade with 953 intricate jharokhas designed for royal ladies to view city festivals.',
            cost: 150,
            isConfirmed: true,
            tip: 'The best photo angle is from The Tattoo Cafe or Wind View Cafe across the street on the 3rd floor terrace.',
            lat: 26.9239,
            lng: 75.8267,
            photoUrl: 'https://images.unsplash.com/photo-1600100397608-f010f443b711?auto=format&fit=crop&w=800&q=80',
            transitToNext: { duration: '5 min walk', mode: 'walk', details: 'Cross into City Palace royal courtyard' },
            tags: ['Iconic', 'Windows', 'Architecture'],
          },
          {
            time: '01:30 PM',
            period: 'afternoon',
            title: 'City Palace & Chandra Mahal Museum',
            subtitle: 'Tulsi Marg, Gangori Bazaar',
            category: 'place',
            description: 'A blend of Rajasthani and Mughal court architecture with courtyards showcasing the four peacock seasons.',
            cost: 300,
            isConfirmed: false,
            tip: 'Visit the Pritam Niwas Chowk peacock gate for the most vibrant colors.',
            lat: 26.9258,
            lng: 75.8237,
            photoUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
            transitToNext: { duration: '10 min walk', mode: 'walk', details: 'Stroll into Johari Bazaar for blue pottery' },
            tags: ['Palace', 'Museum', 'Royalty'],
          },
        ];
      }
    } else if (isGoa) {
      title = dayNumber === 1 ? 'Latin Quarter Heritage & Panaji Riverside' : 'Coastal Shacks & Cliffside Sunsets';
      theme = 'Colonial villas, feni cocktails, beach walks & fresh seafood';
      stops = [
        {
          time: '09:00 AM',
          period: 'morning',
          title: 'Fontainhas Latin Quarter Walking Trail',
          subtitle: 'Altinho, Panaji, Goa',
          category: 'place',
          description: 'Centuries-old Portuguese quarters with mustard yellow and indigo blue heritage houses, tiled roofs, and cozy bakeries.',
          cost: 0,
          flightOrTrainCode: 'AI-844 BOM-GOI',
          isConfirmed: true,
          tip: 'Grab a warm poi bread and cinnamon bebinca pastry from Confeitaria 31 de Janeiro (serving since 1930).',
          lat: 15.4989,
          lng: 73.8278,
          photoUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
          transitToNext: { duration: '25 min cab', mode: 'taxi', details: 'Drive coastal road toward Vagator cliff' },
          tags: ['Portuguese', 'Heritage', 'Walk'],
        },
        {
          time: '01:30 PM',
          period: 'afternoon',
          title: 'Fisherman’s Wharf or Vinayak Family Restaurant',
          subtitle: 'Main St, Assagao / Panaji',
          category: 'food',
          description: 'Authentic Goan fish thali with kingfish fry, crab xacuti, sol kadhi, and warm red rice.',
          cost: 650,
          isConfirmed: false,
          tip: 'Vinayak in Assagao serves the freshest local fish thali. Arrive by 1:15 PM to avoid the lunch rush.',
          lat: 15.5898,
          lng: 73.7745,
          photoUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
          transitToNext: { duration: '15 min cab', mode: 'taxi', details: 'Drive over to Chapora Fort ridge' },
          tags: ['Fish Thali', 'Goan Cuisine', 'Lunch'],
        },
        {
          time: '05:30 PM',
          period: 'evening',
          title: 'Chapora Fort & Vagator Sunset Point',
          subtitle: 'Chapora, Vagator, Goa',
          category: 'place',
          description: 'The iconic hilltop laterite ramparts overlooking the Arabian Sea and the curved red cliffs of Vagator.',
          cost: 0,
          isConfirmed: false,
          tip: 'Wear good grip sandals for the 10-minute stone pathway up. Stay until the sun dips into the sea.',
          lat: 15.6058,
          lng: 73.7371,
          photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
          transitToNext: { duration: '10 min walk', mode: 'walk', details: 'Walk down to Little Vagator shacks' },
          tags: ['Sunset', 'Fort', 'Ocean'],
        },
      ];
    } else {
      // General authentic Indian / worldwide destination structure
      stops = [
        {
          time: '09:00 AM',
          period: 'morning',
          title: `${known.name} Heritage & Iconic Landmark`,
          subtitle: `Central Landmark, ${known.name}`,
          category: 'place',
          description: `Begin your morning exploration of ${known.name}'s signature landmark and peaceful morning courtyards.`,
          cost: 250,
          flightOrTrainCode: `EXP-${1000 + dayNumber}`,
          isConfirmed: true,
          tip: 'Early morning entry has the best soft lighting and zero queues. UPI payments accepted at the ticket kiosk.',
          lat: known.lat + (dIdx * 0.005),
          lng: known.lng + (dIdx * 0.005),
          photoUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
          transitToNext: { duration: '15 min auto', mode: 'taxi', details: 'Quick auto-rickshaw connection' },
          tags: ['Sightseeing', 'Culture', 'Morning'],
        },
        {
          time: '01:00 PM',
          period: 'afternoon',
          title: `Famous Local Culinary & Chai Spot`,
          subtitle: `Old Market Lane, ${known.name}`,
          category: 'food',
          description: `Taste the authentic delicacies of ${known.name}, paired with local spiced tea and regional sweets.`,
          cost: 450,
          isConfirmed: false,
          tip: 'Ask for the house specialty thali or local chef recommendation. Pure vegetarian choices always available.',
          lat: known.lat + 0.008,
          lng: known.lng - 0.006,
          photoUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
          transitToNext: { duration: '10 min walk', mode: 'walk', details: 'Stroll through the local bazaar' },
          tags: ['Foodie', 'Local Flavors', 'Lunch'],
        },
        {
          time: '05:30 PM',
          period: 'evening',
          title: `Scenic Sunset Promenade & Evening Bazaar`,
          subtitle: `Sunset Viewpoint, ${known.name}`,
          category: 'place',
          description: `Watch the sunset over the valley or riverfront while browsing handmade crafts and street delights.`,
          cost: 50,
          isConfirmed: false,
          tip: 'Perfect evening breeze for photography. Bring a light jacket or scarf depending on the weather.',
          lat: known.lat - 0.006,
          lng: known.lng + 0.008,
          photoUrl: 'https://images.unsplash.com/photo-1609137144822-79015949d214?auto=format&fit=crop&w=800&q=80',
          transitToNext: { duration: '15 min cab', mode: 'taxi', details: 'Return to hotel or dinner' },
          tags: ['Sunset', 'Viewpoint', 'Evening'],
        },
      ];
    }

    return {
      dayNumber,
      title,
      theme,
      date: `Day 0${dayNumber}`,
      stops: stops.map((s, sIdx) => ({
        ...s,
        id: `stop-${dayNumber}-${sIdx + 1}-${Date.now()}`,
        isCompleted: false,
        coordinates: {
          x: 25 + ((sIdx * 25) % 60),
          y: 20 + ((dayNumber * 20) % 60),
          label: s.title.slice(0, 14),
          lat: s.lat,
          lng: s.lng,
        },
        groundingSources: [
          { title: `${known.name} Tourism Guide`, url: `https://www.google.com/search?q=${encodeURIComponent(s.title + ' ' + known.name)}` },
        ],
      })),
    };
  });

  return {
    id: tripId,
    title: `${known.name} Zine Safar`,
    subtitle: `A curated ${numDays}-day pocket itinerary with realistic ₹ budgets`,
    destination: known.name,
    country: known.country,
    dateRange: `${numDays} Days Journey from ${departureCity}`,
    currency: 'INR',
    currencySymbol: '₹',
    totalBudget: numDays * (known.dailyBudget || 4500),
    coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    introZineNote: `A tactile illustrated pocket exploration of ${known.name} tailored for Indian travelers. Keep your UPI apps ready, camera set, and sense of wonder alive.`,
    days,
    packingList: [
      { id: 'p-1', name: 'Aadhaar / Govt ID / Passport', category: 'documents', isPacked: false, essential: true },
      { id: 'p-2', name: 'UPI Payment Apps (GPay/PhonePe) & Emergency Cash', category: 'documents', isPacked: false, essential: true },
      { id: 'p-3', name: 'Comfortable walking shoes for temple & fort paths', category: 'clothing', isPacked: false, essential: true },
      { id: 'p-4', name: 'Power bank & fast charging cables', category: 'gear', isPacked: false, essential: true },
      { id: 'p-5', name: 'Pocket travel sketchpad & gel pen', category: 'zine', isPacked: true, essential: true },
    ],
    expenses: [],
  };
}
