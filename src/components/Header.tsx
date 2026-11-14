import React from 'react';
import { Plus, Compass, BookOpen, MapPin, Receipt, CheckSquare, Layers } from 'lucide-react';

export type NavTab = 'storyboard' | 'map' | 'zine' | 'budget' | 'packing';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenAddStop: () => void;
  onOpenTripSwitcher: () => void;
  currentTripTitle: string;
  onGoToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenAddStop,
  onOpenTripSwitcher,
  currentTripTitle,
  onGoToLanding,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fbf8fc]/95 backdrop-blur-sm border-b-2 border-[#232326] px-4 md:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand title, single line */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onGoToLanding || (() => onTabChange('storyboard'))}
            className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none"
            title="Return to Destination Planner"
          >
            <div className="w-8 h-8 rounded-lg bg-[#FFB5A7] border-2 border-[#232326] flex items-center justify-center font-display font-bold text-sm shadow-[2px_2px_0px_#232326] group-hover:rotate-3 transition-transform">
              ✦
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg md:text-xl text-[#232326] tracking-tight whitespace-nowrap leading-tight">
                Pastel Zine Safar
              </span>
            </div>
          </button>

          {/* Quick trip selector chip */}
          <button
            onClick={onOpenTripSwitcher}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border-[1.5px] border-[#232326] bg-[#f0edf1] hover:bg-[#eae7eb] text-xs font-mono-code font-bold text-[#232326] shadow-[1.5px_1.5px_0px_#232326] transition-all cursor-pointer"
            title="Switch Trip"
          >
            <Layers className="w-3.5 h-3.5 text-[#884f44]" />
            <span className="max-w-[130px] truncate">{currentTripTitle}</span>
            <span className="text-[10px] text-[#524341]">▾</span>
          </button>

          {onGoToLanding && (
            <button
              onClick={onGoToLanding}
              className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#232326] bg-[#FFB5A7]/40 hover:bg-[#FFB5A7] text-xs font-mono-code font-bold text-[#232326] shadow-[1px_1px_0px_#232326] transition-all cursor-pointer"
              title="Plan a new destination"
            >
              <span>+ New Safar</span>
            </button>
          )}
        </div>

        {/* Zone 2: 4–5 concise nav links, single line */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#232326]">
          <button
            onClick={() => onTabChange('storyboard')}
            className={`whitespace-nowrap shrink-0 pb-1 cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'storyboard'
                ? 'border-b-2 border-[#232326] text-[#884f44]'
                : 'hover:text-[#884f44] text-[#232326]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Storyboard</span>
          </button>

          <button
            onClick={() => onTabChange('map')}
            className={`whitespace-nowrap shrink-0 pb-1 cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'map'
                ? 'border-b-2 border-[#232326] text-[#884f44]'
                : 'hover:text-[#884f44] text-[#232326]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Route Map</span>
          </button>

          <button
            onClick={() => onTabChange('zine')}
            className={`whitespace-nowrap shrink-0 pb-1 cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'zine'
                ? 'border-b-2 border-[#232326] text-[#884f44]'
                : 'hover:text-[#884f44] text-[#232326]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Mini-Zine</span>
          </button>

          <button
            onClick={() => onTabChange('budget')}
            className={`whitespace-nowrap shrink-0 pb-1 cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'budget'
                ? 'border-b-2 border-[#232326] text-[#884f44]'
                : 'hover:text-[#884f44] text-[#232326]'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Budget</span>
          </button>

          <button
            onClick={() => onTabChange('packing')}
            className={`whitespace-nowrap shrink-0 pb-1 cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'packing'
                ? 'border-b-2 border-[#232326] text-[#884f44]'
                : 'hover:text-[#884f44] text-[#232326]'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Packing</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenAddStop}
            className="rounded-full bg-[#FFB5A7] border-2 border-[#232326] px-4 md:px-5 py-2 font-display font-bold text-xs md:text-sm text-[#232326] uppercase tracking-wider shadow-[3px_3px_0px_#232326] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#232326] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#232326] transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Stop</span>
          </button>
        </div>
      </div>

      {/* Mobile sub-nav bar */}
      <div className="flex md:hidden items-center justify-around mt-2.5 pt-2 border-t border-[#232326]/20 text-xs font-semibold">
        <button
          onClick={() => onTabChange('storyboard')}
          className={`flex items-center gap-1 py-1 px-2 rounded-lg cursor-pointer ${
            activeTab === 'storyboard' ? 'bg-[#FFB5A7] border border-[#232326] shadow-[1px_1px_0px_#232326]' : 'text-[#232326]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Timeline</span>
        </button>

        <button
          onClick={() => onTabChange('map')}
          className={`flex items-center gap-1 py-1 px-2 rounded-lg cursor-pointer ${
            activeTab === 'map' ? 'bg-[#FFB5A7] border border-[#232326] shadow-[1px_1px_0px_#232326]' : 'text-[#232326]'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Map</span>
        </button>

        <button
          onClick={() => onTabChange('zine')}
          className={`flex items-center gap-1 py-1 px-2 rounded-lg cursor-pointer ${
            activeTab === 'zine' ? 'bg-[#FFB5A7] border border-[#232326] shadow-[1px_1px_0px_#232326]' : 'text-[#232326]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Zine</span>
        </button>

        <button
          onClick={() => onTabChange('budget')}
          className={`flex items-center gap-1 py-1 px-2 rounded-lg cursor-pointer ${
            activeTab === 'budget' ? 'bg-[#FFB5A7] border border-[#232326] shadow-[1px_1px_0px_#232326]' : 'text-[#232326]'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Budget</span>
        </button>

        <button
          onClick={() => onTabChange('packing')}
          className={`flex items-center gap-1 py-1 px-2 rounded-lg cursor-pointer ${
            activeTab === 'packing' ? 'bg-[#FFB5A7] border border-[#232326] shadow-[1px_1px_0px_#232326]' : 'text-[#232326]'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Pack</span>
        </button>
      </div>
    </header>
  );
};
