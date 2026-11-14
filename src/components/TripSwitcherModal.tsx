import React, { useState } from 'react';
import { Trip } from '../types/travel';
import { X, Plus, MapPin, Calendar, Wallet, Check, RotateCcw } from 'lucide-react';

interface TripSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  trips: Trip[];
  activeTripId: string;
  onSelectTrip: (id: string) => void;
  onCreateTrip: (newTrip: Trip) => void;
  onResetDefaults: () => void;
  onOpenGenerator: () => void;
}

export const TripSwitcherModal: React.FC<TripSwitcherModalProps> = ({
  isOpen,
  onClose,
  trips,
  activeTripId,
  onSelectTrip,
  onCreateTrip,
  onResetDefaults,
  onOpenGenerator,
}) => {
  const [tab, setTab] = useState<'switch' | 'create'>('switch');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [destination, setDestination] = useState('');
  const [country, setCountry] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [totalBudget, setTotalBudget] = useState('18000');
  const [daysCount, setDaysCount] = useState(3);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !destination.trim()) return;

    const newTripId = 'trip-' + Date.now();
    const days = Array.from({ length: daysCount }).map((_, i) => ({
      dayNumber: i + 1,
      title: `Day 0${i + 1} Discovery`,
      theme: 'Wandering and exploring local culture',
      date: `Day ${i + 1}`,
      stops: [],
    }));

    const newTrip: Trip = {
      id: newTripId,
      title: title.trim(),
      subtitle: subtitle.trim() || 'A new pocket travel story',
      destination: destination.trim(),
      country: country.trim() || destination.trim(),
      dateRange: dateRange.trim() || 'Upcoming Trip',
      currency: currencySymbol === '₹' ? 'INR' : currencySymbol === '$' ? 'USD' : currencySymbol === '€' ? 'EUR' : 'INR',
      currencySymbol,
      totalBudget: parseFloat(totalBudget) || 15000,
      coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      introZineNote: 'Fresh blank pocket zine ready for travel sketches, tickets, and coffee memories.',
      days,
      packingList: [
        { id: 'p-1', name: 'Passport & Identification', category: 'documents', isPacked: false, essential: true },
        { id: 'p-2', name: 'Credit card & travel cash', category: 'documents', isPacked: false, essential: true },
        { id: 'p-3', name: 'Phone charger & adapter', category: 'gear', isPacked: false, essential: true },
        { id: 'p-4', name: 'Pocket travel sketchpad & pen', category: 'zine', isPacked: false, essential: true },
      ],
      expenses: [],
    };

    onCreateTrip(newTrip);
    onSelectTrip(newTripId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[#fbf8fc] border-2 border-[#232326] rounded-[16px] shadow-[6px_6px_0px_#232326] w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b-2 border-[#232326] bg-[#FFB5A7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-white border border-[#232326] flex items-center justify-center font-display font-bold text-sm shadow-[1px_1px_0px_#232326]">
              ✦
            </span>
            <h3 className="font-display font-bold text-lg text-[#232326]">
              Travel Zine Itineraries
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[#232326] bg-white hover:bg-slate-100 cursor-pointer shadow-[1px_1px_0px_#232326]"
          >
            <X className="w-4 h-4 text-[#232326]" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b-2 border-[#232326] bg-[#f0edf1]">
          <button
            onClick={() => setTab('switch')}
            className={`flex-1 py-2.5 text-xs font-mono-code font-bold uppercase transition-colors cursor-pointer ${
              tab === 'switch' ? 'bg-[#fbf8fc] text-[#232326] border-b-2 border-[#884f44]' : 'text-[#524341] hover:bg-white/50'
            }`}
          >
            Itineraries ({trips.length})
          </button>
          <button
            onClick={() => setTab('create')}
            className={`flex-1 py-2.5 text-xs font-mono-code font-bold uppercase transition-colors cursor-pointer ${
              tab === 'create' ? 'bg-[#fbf8fc] text-[#232326] border-b-2 border-[#884f44]' : 'text-[#524341] hover:bg-white/50'
            }`}
          >
            Manual Trip
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenGenerator();
            }}
            className="flex-1 py-2.5 text-xs font-mono-code font-bold uppercase bg-[#A8DADC] text-[#002021] hover:bg-[#b9ecee] transition-colors cursor-pointer flex items-center justify-center gap-1 border-l-2 border-[#232326]"
          >
            <span>⚡ AI Search</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto">
          {tab === 'switch' ? (
            <div className="space-y-3">
              {trips.map((trip) => {
                const isActive = trip.id === activeTripId;
                const totalStops = trip.days.reduce((acc, d) => acc + d.stops.length, 0);

                return (
                  <div
                    key={trip.id}
                    onClick={() => {
                      onSelectTrip(trip.id);
                      onClose();
                    }}
                    className={`p-4 rounded-xl border-2 border-[#232326] transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-[#FFB5A7]/30 border-[#232326] shadow-[3px_3px_0px_#232326] ring-2 ring-[#FFB5A7]'
                        : 'bg-white hover:bg-[#FDE4CF]/30 shadow-[2px_2px_0px_#232326]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono-code font-bold uppercase text-[#884f44]">
                          {trip.destination}
                        </span>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full border border-[#232326] bg-[#CDEAC0] text-[10px] font-mono-code font-bold text-[#0a2006]">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <h4 className="font-display font-bold text-base text-[#232326] mt-0.5">
                        {trip.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs font-mono-code text-[#524341] mt-1">
                        <span>{trip.dateRange}</span>
                        <span>·</span>
                        <span>{trip.days.length} Days</span>
                        <span>·</span>
                        <span>{totalStops} Stops</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono-code font-bold text-[#232326]">
                        {trip.currencySymbol}{trip.totalBudget.toLocaleString()}
                      </div>
                      <div className="text-[10px] font-mono-code text-[#524341]">Budget</div>
                    </div>
                  </div>
                );
              })}

              {/* Reset to initial presets */}
              <div className="pt-3 border-t border-[#232326]/10 flex justify-between items-center">
                <button
                  type="button"
                  onClick={onResetDefaults}
                  className="text-xs font-mono-code text-[#857370] hover:text-[#232326] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Trips</span>
                </button>

                <button
                  onClick={() => setTab('create')}
                  className="text-xs font-mono-code font-bold text-[#884f44] hover:underline cursor-pointer"
                >
                  + Add Custom Trip
                </button>
              </div>
            </div>
          ) : (
            /* Create Trip Form */
            <form onSubmit={handleCreate} className="space-y-3 font-body">
              <div>
                <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1">
                  Trip Title:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Paris Art & Vintage Cafes"
                  className="w-full p-2 text-sm border-2 border-[#232326] rounded-lg bg-white font-display font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1">
                    Destination:
                  </label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Paris, France"
                    className="w-full p-2 text-xs border-2 border-[#232326] rounded-lg bg-white font-body focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1">
                    Dates:
                  </label>
                  <input
                    type="text"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    placeholder="e.g. Sep 10 – Sep 14, 2026"
                    className="w-full p-2 text-xs border-2 border-[#232326] rounded-lg bg-white font-mono-code focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1">
                    Days:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={daysCount}
                    onChange={(e) => setDaysCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-2 text-xs border-2 border-[#232326] rounded-lg bg-white font-mono-code focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1">
                    Currency:
                  </label>
                  <select
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    className="w-full p-2 text-xs border-2 border-[#232326] rounded-lg bg-white font-mono-code focus:outline-none"
                  >
                    <option value="₹">₹ (INR - Indian Rupee)</option>
                    <option value="$">$ (USD)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="£">£ (GBP)</option>
                    <option value="¥">¥ (JPY)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1">
                    Total Budget:
                  </label>
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    className="w-full p-2 text-xs border-2 border-[#232326] rounded-lg bg-white font-mono-code focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1">
                  Trip Subtitle / Theme:
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Cobblestone bakeries, flea markets & riverside walks"
                  className="w-full p-2 text-xs border-2 border-[#232326] rounded-lg bg-white font-body focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t-2 border-[#232326] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTab('switch')}
                  className="px-4 py-2 rounded-full border-2 border-[#232326] bg-white text-xs font-mono-code font-bold cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#FFB5A7] border-2 border-[#232326] font-display font-bold text-xs uppercase tracking-wider text-[#232326] shadow-[2.5px_2.5px_0px_#232326] cursor-pointer"
                >
                  Create Trip Zine
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
