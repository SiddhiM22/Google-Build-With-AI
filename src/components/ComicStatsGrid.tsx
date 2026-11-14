import React from 'react';
import { Trip } from '../types/travel';
import { Calendar, Wallet, CheckCircle2, Train, MapPin, Sparkles } from 'lucide-react';

interface ComicStatsGridProps {
  trip: Trip;
  activeDayNumber: number;
  onSelectDay: (day: number) => void;
  onOpenTripSwitcher: () => void;
  onOpenGenerator: () => void;
}

export const ComicStatsGrid: React.FC<ComicStatsGridProps> = ({
  trip,
  activeDayNumber,
  onSelectDay,
  onOpenTripSwitcher,
  onOpenGenerator,
}) => {
  // Compute aggregate metrics
  const totalStops = trip.days.reduce((acc, d) => acc + d.stops.length, 0);
  const confirmedStops = trip.days.reduce(
    (acc, d) => acc + d.stops.filter((s) => s.isConfirmed).length,
    0
  );
  const completedStops = trip.days.reduce(
    (acc, d) => acc + d.stops.filter((s) => s.isCompleted).length,
    0
  );
  const transitLegsCount = trip.days.reduce(
    (acc, d) => acc + d.stops.filter((s) => s.category === 'transit' || s.transitToNext).length,
    0
  );

  const totalSpent = trip.expenses.reduce((acc, e) => acc + e.amount, 0);
  const remainingBudget = Math.max(0, trip.totalBudget - totalSpent);
  const budgetPercent = Math.min(100, Math.round((totalSpent / trip.totalBudget) * 100));

  return (
    <div className="mb-8">
      {/* Asymmetric 2-column comic grid panels separated by 12px (gap-3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* Left Column (Span 7): Hero Storyboard Banner Panel */}
        <div className="lg:col-span-7 bg-[#fbf8fc] border-2 border-[#232326] rounded-[14px] p-5 shadow-[3px_3px_0px_#232326] relative overflow-hidden flex flex-col justify-between">
          {/* Subtle zine halftone dots background */}
          <div className="absolute inset-0 zine-halftone pointer-events-none" />

          {/* Top Stamp Tag & Generator Action */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-[#232326] bg-[#FFB5A7] text-xs font-mono-code font-bold uppercase tracking-wider text-[#232326] shadow-[1.5px_1.5px_0px_#232326]">
                ✦ POCKET ZINE #{trip.id.substring(0, 5).toUpperCase()}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-mono-code text-[#524341]">
                <Calendar className="w-3.5 h-3.5" />
                {trip.dateRange}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenGenerator}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-[#232326] bg-[#A8DADC] hover:bg-[#b9ecee] text-xs font-mono-code font-bold uppercase tracking-wider text-[#002021] shadow-[1.5px_1.5px_0px_#232326] transition-all cursor-pointer hover:-translate-y-0.5"
                title="Search city & generate itinerary with Google Search"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Search & Generate</span>
              </button>

              <button
                onClick={onOpenTripSwitcher}
                className="text-xs font-mono-code font-bold text-[#884f44] hover:underline cursor-pointer flex items-center gap-1"
              >
                Switch ➔
              </button>
            </div>
          </div>

          {/* Title & destination */}
          <div className="relative z-10 my-2">
            <div className="flex items-center gap-1.5 text-xs font-mono-code text-[#356668] mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#356668]" />
              <span className="uppercase tracking-wide">{trip.destination}</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#232326] tracking-tight leading-tight">
              {trip.title}
            </h1>
            <p className="font-body text-sm sm:text-base text-[#524341] mt-1.5 max-w-xl">
              {trip.subtitle}
            </p>
          </div>

          {/* Storyboard progress indicator & day pills */}
          <div className="pt-4 border-t-2 border-[#232326]/15 relative z-10 mt-3">
            <div className="flex items-center justify-between text-xs font-mono-code font-bold text-[#232326] mb-2">
              <span>EXPLORE STORYBOARD DAYS</span>
              <span className="text-[#884f44]">
                DAY {activeDayNumber} OF {trip.days.length}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {trip.days.map((day) => {
                const isActive = day.dayNumber === activeDayNumber;
                return (
                  <button
                    key={day.dayNumber}
                    onClick={() => onSelectDay(day.dayNumber)}
                    className={`shrink-0 px-3 py-1.5 rounded-full border-2 border-[#232326] text-xs font-mono-code font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#FFB5A7] text-[#232326] shadow-[2px_2px_0px_#232326] scale-105'
                        : 'bg-[#f0edf1] hover:bg-[#FDE4CF] text-[#232326] shadow-[1px_1px_0px_#232326]'
                    }`}
                  >
                    Day 0{day.dayNumber}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (Span 5): 2 Asymmetric Stacked Comic Metric Panels */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Panel A: Sage Mint Budget Ledger Card */}
          <div className="bg-[#fbf8fc] border-2 border-[#232326] rounded-[14px] p-4 shadow-[3px_3px_0px_#232326] relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-code uppercase font-bold text-[#232326] flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-[#4c6544]" />
                BUDGET & REMAINING
              </span>
              <span className="px-2 py-0.5 rounded-md border border-[#232326] bg-[#CDEAC0] text-[11px] font-mono-code font-bold text-[#232326]">
                {budgetPercent}% SPENT
              </span>
            </div>

            <div className="my-2.5">
              <div className="flex items-baseline justify-between">
                <span className="font-display font-bold text-2xl text-[#232326] tabular-nums">
                  {trip.currencySymbol}
                  {remainingBudget.toLocaleString()}
                </span>
                <span className="text-xs font-mono-code text-[#524341]">
                  of {trip.currencySymbol}
                  {trip.totalBudget.toLocaleString()} Total
                </span>
              </div>

              {/* Comic styled progress bar */}
              <div className="w-full h-3 bg-[#e4e1e5] border-2 border-[#232326] rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full bg-[#CDEAC0] border-r-2 border-[#232326] transition-all duration-300"
                  style={{ width: `${budgetPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono-code text-[#524341] pt-1 border-t border-[#232326]/10">
              <span>Spent: {trip.currencySymbol}{totalSpent.toLocaleString()}</span>
              <span className="text-[#4c6544] font-bold">Sage Mint Verified</span>
            </div>
          </div>

          {/* Panel B: 2-in-1 Asymmetric Stops & Transit Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Stops Panel in Buttercream (#FDE4CF) tint */}
            <div className="bg-[#fbf8fc] border-2 border-[#232326] rounded-[14px] p-3.5 shadow-[3px_3px_0px_#232326] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono-code font-bold text-[#232326] uppercase">
                  STOPS
                </span>
                <span className="w-5 h-5 rounded-full border border-[#232326] bg-[#FDE4CF] flex items-center justify-center text-[10px] font-bold">
                  ★
                </span>
              </div>
              <div className="my-1.5">
                <div className="font-display font-bold text-2xl text-[#232326] tabular-nums">
                  {totalStops}
                </div>
                <div className="text-[11px] font-mono-code text-[#524341]">
                  {completedStops} Visited · {confirmedStops} Booked
                </div>
              </div>
              <div className="w-full bg-[#FDE4CF] border border-[#232326] rounded px-1.5 py-0.5 text-[10px] font-mono-code font-bold text-[#232326] text-center">
                Day {activeDayNumber}: {trip.days.find((d) => d.dayNumber === activeDayNumber)?.stops.length || 0} Stops
              </div>
            </div>

            {/* Transit Legs Panel in Powder Blue (#A8DADC) tint */}
            <div className="bg-[#fbf8fc] border-2 border-[#232326] rounded-[14px] p-3.5 shadow-[3px_3px_0px_#232326] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono-code font-bold text-[#232326] uppercase">
                  TRANSIT
                </span>
                <Train className="w-4 h-4 text-[#356668]" />
              </div>
              <div className="my-1.5">
                <div className="font-display font-bold text-2xl text-[#232326] tabular-nums">
                  {transitLegsCount}
                </div>
                <div className="text-[11px] font-mono-code text-[#524341]">
                  Rail, Metro & Walk
                </div>
              </div>
              <div className="w-full bg-[#A8DADC] border border-[#232326] rounded px-1.5 py-0.5 text-[10px] font-mono-code font-bold text-[#232326] text-center">
                Powder Blue Track
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
