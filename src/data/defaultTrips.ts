import { Trip } from '../types/travel';

// Default trips starts completely empty - removing all default settings as requested.
export const DEFAULT_TRIPS: Trip[] = [];

// Curated Indian and international inspirations tailored for Indian travelers
export interface DestinationInspiration {
  id: string;
  name: string;
  region: string;
  country: string;
  tagline: string;
  suggestedDays: number;
  estimatedBudgetInr: number;
  highlights: string[];
  vibe: string;
  coverImage: string;
  lat: number;
  lng: number;
  foodTips: string;
}

export const POPULAR_INDIAN_DESTINATIONS: DestinationInspiration[] = [
  {
    id: 'jaipur-amer',
    name: 'Jaipur & Amer',
    region: 'Rajasthan',
    country: 'India',
    tagline: 'The Pink City of Royal Forts & Spicy Pyaaz Kachoris',
    suggestedDays: 3,
    estimatedBudgetInr: 14000,
    highlights: ['Amer Fort & Sheesh Mahal', 'Hawa Mahal Dawn View', 'City Palace & Jantar Mantar', 'Johari Bazaar Gems'],
    vibe: 'Regal sandstone palaces, vibrant block print textiles, and royal Rajput heritage.',
    coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
    lat: 26.9124,
    lng: 75.7873,
    foodTips: 'Rawat Mishthan Bhandar for hot Pyaaz Kachori & Lassiwala on MI Road (since 1944).',
  },
  {
    id: 'goa-coastal',
    name: 'Goa (North & South)',
    region: 'Goa',
    country: 'India',
    tagline: 'Portuguese Heritage, Latin Quarters & Sunset Beach Shacks',
    suggestedDays: 4,
    estimatedBudgetInr: 22000,
    highlights: ['Fontainhas Latin Quarter', 'Anjuna & Vagator Cliff Cafes', 'Palolem Kayaking', 'Old Goa Basilica'],
    vibe: 'Susegad tropical ease, colorful colonial villas, and chilled coastal breeze.',
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
    lat: 15.2993,
    lng: 74.1240,
    foodTips: 'Poi bread with Goan curry, Kokum juice, and seaside butter garlic prawns.',
  },
  {
    id: 'munnar-alleppey',
    name: 'Munnar & Alleppey Backwaters',
    region: 'Kerala',
    country: 'India',
    tagline: 'Misty Tea Plantations & Serene Houseboat Lagoons',
    suggestedDays: 4,
    estimatedBudgetInr: 26000,
    highlights: ['Kolukkumalai Sunrise Tea Trek', 'Alleppey Canal Cruise', 'Eravikulam Tahr Sanctuary', 'Kathakali Center'],
    vibe: 'Lush emerald hills, calming waterways, and Ayurvedic tranquility.',
    coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
    lat: 10.0889,
    lng: 77.0595,
    foodTips: 'Kerala sadhya feast on banana leaf, appam with stew, and fresh tender coconut.',
  },
  {
    id: 'manali-solang',
    name: 'Manali & Solang Valley',
    region: 'Himachal Pradesh',
    country: 'India',
    tagline: 'Snow-Capped Peaks, Pine Woods & Cozy Riverside Cafes',
    suggestedDays: 4,
    estimatedBudgetInr: 18000,
    highlights: ['Atal Tunnel & Sissu Waterfalls', 'Old Manali Bohemian Cafes', 'Hadimba Cedar Temple', 'Solang Paragliding'],
    vibe: 'Crisp mountain air, wood-and-stone architecture, and Himalayan tranquility.',
    coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
    lat: 32.2432,
    lng: 77.1892,
    foodTips: 'Siddu with desi ghee, hot steamed momos along Mall Road, and cinnamon apple crumble.',
  },
  {
    id: 'varanasi-ghats',
    name: 'Varanasi & Sarnath',
    region: 'Uttar Pradesh',
    country: 'India',
    tagline: 'Timeless Ganga Aarti, Ancient Alleys & Mystical Dawn Boats',
    suggestedDays: 3,
    estimatedBudgetInr: 11000,
    highlights: ['Dashashwamedh Evening Aarti', 'Dawn Wooden Boat Ride', 'Kashi Vishwanath Corridor', 'Sarnath Stupa'],
    vibe: 'Spiritual chanting, glowing earthen diyas on the river, and 3000-year-old living tradition.',
    coverImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=80',
    lat: 25.3176,
    lng: 82.9739,
    foodTips: 'Banarasi Tamatar Chaat at Kashi Chaat Bhandar, malaiyo winter foam dessert, and Blue Lassi.',
  },
  {
    id: 'udaipur-pichola',
    name: 'Udaipur City of Lakes',
    region: 'Rajasthan',
    country: 'India',
    tagline: 'Fairytale Lake Pichola, Rooftop Sunsets & Royal Courtyards',
    suggestedDays: 3,
    estimatedBudgetInr: 17000,
    highlights: ['City Palace Complex', 'Pichola Boat Cruise to Jagmandir', 'Bagore Ki Haveli Dance Show', 'Saheliyon Ki Bari'],
    vibe: 'Shimmering marble waters, romantic lakefront rooftops, and opulent mewar legacy.',
    coverImage: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1000&q=80',
    lat: 24.5854,
    lng: 73.7125,
    foodTips: 'Dal Baati Churma at traditional thali spots and sunset masala chai over Gangaur Ghat.',
  },
  {
    id: 'ladakh-pangong',
    name: 'Leh & Pangong Tso',
    region: 'Ladakh',
    country: 'India',
    tagline: 'High Altitude Desert, Monasteries & Azure Lakes',
    suggestedDays: 5,
    estimatedBudgetInr: 32000,
    highlights: ['Pangong Tso Blue Lake', 'Khardung La High Pass', 'Thiksey Dawn Chants', 'Nubra Valley Dunes'],
    vibe: 'Dramatic moonscapes, fluttering prayer flags, and pure Himalayan silence.',
    coverImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1000&q=80',
    lat: 34.1526,
    lng: 77.5771,
    foodTips: 'Thukpa noodle soup, butter tea, and fresh sea buckthorn juice.',
  },
  {
    id: 'dubai-international',
    name: 'Dubai & Desert Dunes',
    region: 'UAE (Short Flight from India)',
    country: 'UAE',
    tagline: 'Burj Skyline, Gold Souks & Golden Sand Safaris',
    suggestedDays: 4,
    estimatedBudgetInr: 58000,
    highlights: ['Burj Khalifa Observation Deck', 'Desert Safari & Dune Bashing', 'Old Dubai & Gold Souk Abra Ride', 'Museum of the Future'],
    vibe: 'Futuristic architectural spectacle with seamless visa-on-arrival and direct 3-4h flights from India.',
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
    lat: 25.2048,
    lng: 55.2708,
    foodTips: 'Middle Eastern shawarma, kunafa, and fragrant saffron biryani at historic Deira spots.',
  },
];
