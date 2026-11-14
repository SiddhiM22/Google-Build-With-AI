import React, { useState } from 'react';
import { Trip, DayPlan, StopItem, StopCategory } from '../types/travel';
import { ItineraryCard } from './ItineraryCard';
import { TransitNode } from './TransitNode';
import { Plus, Filter, Calendar, MapPin, Sparkles, Footprints, Train, Utensils, Bed, Compass } from 'lucide-react';

interface StoryboardViewProps {
  trip: Trip;
  activeDayNumber: number;
  onSelectDay: (day: number) => void;
  onAddDay: () => void;
  onOpenAddStop: () => void;
  onToggleComplete: (stopId: string) => void;
  onEditStop: (stop: StopItem) => void;
  onDeleteStop: (stopId: string) => void;
  onMoveStop: (fromIndex: number, toIndex: number) => void;
  onAddTip: (stopId: string, tip: string) => void;
  onViewRealTime: (stop: StopItem) => void;
}

export const StoryboardView: React.FC<StoryboardViewProps> = ({
  trip,
  activeDayNumber,
  onSelectDay,
  onAddDay,
  onOpenAddStop,
  onToggleComplete,
  onEditStop,
  onDeleteStop,
  onMoveStop,
  onAddTip,
  onViewRealTime,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | StopCategory>('all');

  const currentDay = trip.days.find((d) => d.dayNumber === activeDayNumber) || trip.days[0];

  const filteredStops = currentDay?.stops.filter((stop) => {
    if (categoryFilter === 'all') return true;
    return stop.category === categoryFilter;
  }) || [];

  return (
    <div className="space-y-6">
      {/* 1. Day Navigation Bar & Day Theme Card */}
      <div className="bg-[#fbf8fc] border-2 border-[#232326] rounded-[14px] p-4 sm:p-5 shadow-[3px_3px_0px_#232326]">
        {/* Horizontal Day Selector Pills */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2 scrollbar-none border-b-2 border-[#232326]/10">
          <div className="flex items-center gap-2">
            {trip.days.map((day) => {
              const isActive = day.dayNumber === activeDayNumber;
              return (
                <button
                  key={day.dayNumber}
                  onClick={() => onSelectDay(day.dayNumber)}
                  className={`px-4 py-2 rounded-full border-2 border-[#232326] text-xs font-mono-code font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#FFB5A7] text-[#232326] shadow-[2.5px_2.5px_0px_#232326] -translate-y-0.5'
                      : 'bg-white hover:bg-[#FDE4CF] text-[#232326] shadow-[1px_1px_0px_#232326]'
                  }`}
                >
                  <span>Day {day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber}</span>
                  <span className="ml-1.5 opacity-60 text-[10px]">({day.stops.length})</span>
                </button>
              );
            })}

            {/* Add Day Button */}
            <button
              onClick={onAddDay}
              className="px-3 py-2 rounded-full border-2 border-dashed border-[#232326] bg-[#f0edf1] hover:bg-[#CDEAC0] text-xs font-mono-code font-bold text-[#232326] transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap"
              title="Add Next Day"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Day 0{trip.days.length + 1}</span>
            </button>
          </div>

          {/* Quick Date display */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono-code text-[#524341] shrink-0">
            <Calendar className="w-3.5 h-3.5 text-[#884f44]" />
            <span>{currentDay?.date}</span>
          </div>
        </div>

        {/* Day Focus Header */}
        <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded border border-[#232326] bg-[#FDE4CF] text-[10px] font-mono-code font-bold uppercase text-[#524341]">
                STORYBOARD CHAPTER {currentDay?.dayNumber}
              </span>
              <span className="text-xs font-mono-code text-[#857370]">{currentDay?.date}</span>
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#232326] mt-1 tracking-tight">
              {currentDay?.title}
            </h2>
            <p className="font-body text-sm text-[#524341] mt-0.5">{currentDay?.theme}</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-2 md:pt-0">
            <span className="text-[11px] font-mono-code text-[#524341] mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Filter:
            </span>
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono-code font-bold border transition-colors cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-[#232326] text-white border-[#232326]'
                  : 'bg-white text-[#232326] border-[#232326]/40 hover:bg-[#f0edf1]'
              }`}
            >
              All ({currentDay?.stops.length || 0})
            </button>
            <button
              onClick={() => setCategoryFilter('transit')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono-code font-bold border transition-colors cursor-pointer ${
                categoryFilter === 'transit'
                  ? 'bg-[#A8DADC] text-[#232326] border-[#232326]'
                  : 'bg-white text-[#232326] border-[#232326]/40 hover:bg-[#A8DADC]/40'
              }`}
            >
              Transit
            </button>
            <button
              onClick={() => setCategoryFilter('food')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono-code font-bold border transition-colors cursor-pointer ${
                categoryFilter === 'food'
                  ? 'bg-[#FDE4CF] text-[#232326] border-[#232326]'
                  : 'bg-white text-[#232326] border-[#232326]/40 hover:bg-[#FDE4CF]/40'
              }`}
            >
              Food
            </button>
            <button
              onClick={() => setCategoryFilter('place')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono-code font-bold border transition-colors cursor-pointer ${
                categoryFilter === 'place'
                  ? 'bg-[#FDE4CF] text-[#232326] border-[#232326]'
                  : 'bg-white text-[#232326] border-[#232326]/40 hover:bg-[#FDE4CF]/40'
              }`}
            >
              Sights
            </button>
            <button
              onClick={() => setCategoryFilter('stay')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono-code font-bold border transition-colors cursor-pointer ${
                categoryFilter === 'stay'
                  ? 'bg-[#CDEAC0] text-[#232326] border-[#232326]'
                  : 'bg-white text-[#232326] border-[#232326]/40 hover:bg-[#CDEAC0]/40'
              }`}
            >
              Stays
            </button>
          </div>
        </div>
      </div>

      {/* 2. Vertical Storyboard Timeline with Itinerary Cards */}
      {filteredStops.length > 0 ? (
        <div className="relative pl-0 sm:pl-3">
          {filteredStops.map((stop, index) => {
            return (
              <React.Fragment key={stop.id}>
                {/* Itinerary panel card */}
                <ItineraryCard
                  stop={stop}
                  index={index}
                  totalStops={filteredStops.length}
                  currencySymbol={trip.currencySymbol}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEditStop}
                  onDelete={onDeleteStop}
                  onMoveUp={(idx) => onMoveStop(idx, idx - 1)}
                  onMoveDown={(idx) => onMoveStop(idx, idx + 1)}
                  onAddTip={onAddTip}
                  onViewRealTime={onViewRealTime}
                />

                {/* Vertical Transit Connector Node if transit info exists and not last item */}
                {index < filteredStops.length - 1 && stop.transitToNext && (
                  <TransitNode transit={stop.transitToNext} />
                )}

                {/* Spacing if no transit node */}
                {index < filteredStops.length - 1 && !stop.transitToNext && (
                  <div className="h-4" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#fbf8fc] border-2 border-dashed border-[#232326] rounded-[14px] p-10 text-center shadow-[3px_3px_0px_#232326]">
          <div className="w-12 h-12 rounded-full bg-[#FFB5A7] border-2 border-[#232326] mx-auto flex items-center justify-center font-display font-bold text-xl mb-3 shadow-[2px_2px_0px_#232326]">
            ✦
          </div>
          <h3 className="font-display font-bold text-lg text-[#232326]">
            No storyboard panels {categoryFilter !== 'all' ? `matching "${categoryFilter}"` : 'for Day 0' + activeDayNumber}
          </h3>
          <p className="font-body text-sm text-[#524341] mt-1 max-w-sm mx-auto">
            Sketch out this chapter of your travel zine with places to visit, coffee spots, or transit tickets!
          </p>
          <button
            onClick={onOpenAddStop}
            className="mt-4 px-4 py-2 rounded-full bg-[#FFB5A7] border-2 border-[#232326] font-display font-bold text-xs uppercase tracking-wider text-[#232326] shadow-[2.5px_2.5px_0px_#232326] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add First Stop to Day 0{activeDayNumber}</span>
          </button>
        </div>
      )}

      {/* Bottom helper card to easily add stop */}
      {filteredStops.length > 0 && (
        <div className="flex items-center justify-between bg-[#f0edf1] border-2 border-dashed border-[#232326] rounded-[14px] p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FDE4CF] border border-[#232326] flex items-center justify-center text-xs font-mono-code font-bold">
              +
            </div>
            <div>
              <div className="font-display font-bold text-sm text-[#232326]">
                Add another stop to Day 0{activeDayNumber}
              </div>
              <div className="text-xs font-mono-code text-[#524341]">
                Food stop, train leg, hotel check-in, or temple visit
              </div>
            </div>
          </div>

          <button
            onClick={onOpenAddStop}
            className="rounded-full bg-[#FFB5A7] border-2 border-[#232326] px-4 py-1.5 font-display font-bold text-xs uppercase tracking-wider text-[#232326] shadow-[2px_2px_0px_#232326] hover:shadow-[3px_3px_0px_#232326] transition-all cursor-pointer whitespace-nowrap"
          >
            + Add Stop
          </button>
        </div>
      )}
    </div>
  );
};
