import React, { useState } from 'react';
import { Trip } from '../types/travel';
import {
  X,
  Search,
  Sparkles,
  MapPin,
  Calendar,
  Globe,
  Compass,
  RotateCw,
  ExternalLink,
  Check,
  ArrowRight
} from 'lucide-react';

interface SearchItineraryGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripGenerated: (trip: Trip) => void;
}

export const SearchItineraryGeneratorModal: React.FC<SearchItineraryGeneratorModalProps> = ({
  isOpen,
  onClose,
  onTripGenerated,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingCities, setIsSearchingCities] = useState(false);
  const [suggestedCities, setSuggestedCities] = useState<any[]>([]);
  const [searchSources, setSearchSources] = useState<{ title: string; url: string }[]>([]);

  // Selected city & generator configuration
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [daysCount, setDaysCount] = useState<number>(3);
  const [travelStyle, setTravelStyle] = useState<string>('Cultural & Historical Storyboard');
  const [focusTheme, setFocusTheme] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Autopopulate city search via Google Search grounding
  const handleSearchCities = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearchingCities(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/search-cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to search cities');
      }

      const data = await res.json();
      setSuggestedCities(data.cities || []);
      setSearchSources(data.sources || []);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error autopopulating city with Google Search.');
    } finally {
      setIsSearchingCities(false);
    }
  };

  // Select city from autopopulate suggestions
  const handleSelectCity = (city: any) => {
    setSelectedCity(city.name);
    setCountry(city.country);
    if (city.suggestedDays) {
      setDaysCount(city.suggestedDays);
    }
  };

  // Generate full itinerary via Google Search grounding
  const handleGenerateItinerary = async () => {
    if (!selectedCity) {
      setErrorMsg('Please select or enter a destination first.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: selectedCity,
          country,
          daysCount,
          travelStyle,
          focusTheme,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to generate itinerary');
      }

      const data = await res.json();
      if (data.trip) {
        onTripGenerated(data.trip);
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error generating itinerary with Google Search.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#fbf8fc] border-2 border-[#232326] rounded-[16px] shadow-[6px_6px_0px_#232326] w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b-2 border-[#232326] bg-[#FFB5A7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white border border-[#232326] flex items-center justify-center font-display font-bold text-sm shadow-[1.5px_1.5px_0px_#232326]">
              ✦
            </div>
            <div>
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#884f44] block">
                GOOGLE SEARCH GROUNDING · GEMINI 4
              </span>
              <h3 className="font-display font-bold text-lg text-[#232326] leading-tight">
                Autopopulate City & Generate Itinerary
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[#232326] bg-white hover:bg-slate-100 cursor-pointer shadow-[1px_1px_0px_#232326]"
          >
            <X className="w-4 h-4 text-[#232326]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 font-body flex-1">
          {errorMsg && (
            <div className="p-3 bg-[#ffdad6] border-2 border-[#232326] rounded-xl text-xs font-mono-code font-bold text-[#ba1a1a] shadow-[2px_2px_0px_#232326]">
              ⚠ {errorMsg}
            </div>
          )}

          {/* Section 1: City Search & Autopopulate */}
          <div>
            <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1.5 flex items-center justify-between">
              <span>1. Autopopulate City with Google Search:</span>
              <span className="text-[#884f44]">Live Web Grounding</span>
            </label>

            <form onSubmit={handleSearchCities} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type any city or region (e.g. Kyoto, Barcelona, Oaxaca, Reykjavik)..."
                  className="w-full p-2.5 pl-9 text-xs border-2 border-[#232326] rounded-xl bg-white font-body focus:outline-none focus:ring-2 focus:ring-[#884f44]"
                />
                <Search className="w-4 h-4 text-[#884f44] absolute left-3 top-3.5" />
              </div>

              <button
                type="submit"
                disabled={isSearchingCities || !searchQuery.trim()}
                className="px-4 py-2 rounded-xl bg-[#A8DADC] border-2 border-[#232326] font-display font-bold text-xs uppercase tracking-wider text-[#232326] shadow-[2px_2px_0px_#232326] hover:shadow-[3px_3px_0px_#232326] disabled:opacity-50 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
              >
                {isSearchingCities ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5" />
                    <span>Search City</span>
                  </>
                )}
              </button>
            </form>

            {/* Suggested Popular Cities Quick Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap mt-2">
              <span className="text-[10px] font-mono-code text-[#524341]">Try:</span>
              {['Jaipur, Rajasthan', 'Goa, India', 'Manali, Himachal', 'Munnar, Kerala', 'Varanasi, UP', 'Dubai, UAE', 'Bali, Indonesia'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setSearchQuery(item);
                    setSelectedCity(item.split(',')[0].trim());
                    setCountry(item.split(',')[1]?.trim() || '');
                  }}
                  className="px-2 py-0.5 rounded-full border border-[#232326]/40 bg-white hover:bg-[#FDE4CF] text-[10px] font-mono-code text-[#232326] cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Autopopulated City Results */}
            {suggestedCities.length > 0 && (
              <div className="mt-3 space-y-2">
                <span className="text-[11px] font-mono-code font-bold uppercase text-[#356668] block">
                  ✦ Click a city to autopopulate itinerary generator:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestedCities.map((city, idx) => {
                    const isSelected = selectedCity === city.name;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectCity(city)}
                        className={`text-left p-2.5 rounded-xl border-2 border-[#232326] transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FFB5A7] shadow-[2.5px_2.5px_0px_#232326]'
                            : 'bg-white hover:bg-[#FDE4CF]/40 shadow-[1.5px_1.5px_0px_#232326]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-display font-bold text-sm text-[#232326]">
                            {city.name}
                          </span>
                          <span className="text-[10px] font-mono-code font-bold text-[#884f44] px-1.5 py-0.5 rounded bg-white/70 border border-[#232326]">
                            {city.country}
                          </span>
                        </div>
                        <p className="text-[11px] font-body text-[#524341] mt-1 line-clamp-1">
                          {city.vibe}
                        </p>
                        <div className="flex items-center justify-between text-[10px] font-mono-code text-[#354d2e] mt-1 font-bold">
                          <span>{city.suggestedDays || 3} Days suggested</span>
                          <span>{city.currencySymbol || '₹'}{city.dailyBudget ? Number(city.dailyBudget).toLocaleString() : '4,500'}/day</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Google Search Grounding Citations */}
            {searchSources.length > 0 && (
              <div className="mt-2 pt-2 border-t border-[#232326]/10 flex items-center gap-2 overflow-x-auto text-[10px] font-mono-code text-[#524341]">
                <span className="font-bold shrink-0">Google Search Sources:</span>
                {searchSources.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 underline hover:text-[#884f44] flex items-center gap-0.5"
                  >
                    <span>{source.title.slice(0, 20)}...</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Trip Configuration */}
          <div className="p-4 bg-[#f0edf1] border-2 border-[#232326] rounded-xl space-y-3 shadow-[2px_2px_0px_#232326]">
            <span className="text-xs font-mono-code font-bold uppercase text-[#232326] block">
              2. Itinerary Specifications:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono-code font-bold uppercase text-[#232326] mb-1">
                  Destination City:
                </label>
                <input
                  type="text"
                  required
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  placeholder="e.g. Kyoto"
                  className="w-full p-2 text-xs border border-[#232326] rounded-lg bg-white font-display font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono-code font-bold uppercase text-[#232326] mb-1">
                  Country / Region:
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Japan"
                  className="w-full p-2 text-xs border border-[#232326] rounded-lg bg-white font-body"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono-code font-bold uppercase text-[#232326] mb-1">
                  Trip Duration (Days):
                </label>
                <div className="flex items-center gap-1.5">
                  {[2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setDaysCount(num)}
                      className={`flex-1 py-1.5 rounded-lg border border-[#232326] text-xs font-mono-code font-bold cursor-pointer transition-colors ${
                        daysCount === num ? 'bg-[#FFB5A7] text-[#232326]' : 'bg-white text-[#524341]'
                      }`}
                    >
                      {num} Days
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono-code font-bold uppercase text-[#232326] mb-1">
                  Travel Vibe / Style:
                </label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="w-full p-2 text-xs border border-[#232326] rounded-lg bg-white font-mono-code"
                >
                  <option value="Cultural & Historical Storyboard">Cultural & Historical</option>
                  <option value="Foodie, Street Eats & Cafes">Foodie & Street Eats</option>
                  <option value="Scenic Nature & Panoramic Walks">Scenic Nature & Views</option>
                  <option value="Art, Stationery & Indie Boutiques">Art & Indie Boutiques</option>
                  <option value="Fast-Paced City Exploration">Fast-Paced Highlights</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono-code font-bold uppercase text-[#232326] mb-1">
                Custom Focus (Optional):
              </label>
              <input
                type="text"
                value={focusTheme}
                onChange={(e) => setFocusTheme(e.target.value)}
                placeholder="e.g. Matcha tea houses, bamboo groves, vintage records, local bakeries..."
                className="w-full p-2 text-xs border border-[#232326] rounded-lg bg-white font-body"
              />
            </div>
          </div>

          {/* Generation Trigger Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGenerateItinerary}
              disabled={isGenerating || !selectedCity}
              className="w-full py-3.5 rounded-full bg-[#FFB5A7] border-2 border-[#232326] font-display font-bold text-sm uppercase tracking-wider text-[#232326] shadow-[3.5px_3.5px_0px_#232326] hover:shadow-[4.5px_4.5px_0px_#232326] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#232326] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 transition-all"
            >
              {isGenerating ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-[#884f44]" />
                  <span>Grounding with Google Search & Inking Itinerary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate {daysCount}-Day {selectedCity || 'City'} Itinerary with Google Search</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[11px] font-mono-code text-center text-[#524341] mt-2">
              Fetches up-to-date attractions, verified coordinates for Google Maps & insider speech-bubble tips.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
