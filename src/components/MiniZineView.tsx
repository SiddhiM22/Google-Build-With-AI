import React, { useState } from 'react';
import { Trip } from '../types/travel';
import { Printer, BookOpen, Layers, ChevronLeft, ChevronRight, Scissors, Sparkles } from 'lucide-react';

interface MiniZineViewProps {
  trip: Trip;
}

export const MiniZineView: React.FC<MiniZineViewProps> = ({ trip }) => {
  const [viewMode, setViewMode] = useState<'flat' | 'booklet'>('flat');
  const [currentPage, setCurrentPage] = useState<number>(0);

  // 8 Pages for the pocket mini-zine:
  // Page 1: Cover
  // Page 2: Day 1 Storyboard Highlights
  // Page 3: Day 2 Storyboard Highlights
  // Page 4: Day 3 Storyboard Highlights
  // Page 5: Day 4 / Finale Highlights
  // Page 6: Pocket Ledger & Confirmed Vouchers
  // Page 7: Packing & Field Notes
  // Page 8: Back Cover & Stamped Visa Notes

  const totalSpent = trip.expenses.reduce((acc, e) => acc + e.amount, 0);

  const pages = [
    {
      title: 'POCKET COVER',
      bg: 'bg-[#FFB5A7]',
      content: (
        <div className="h-full flex flex-col justify-between p-4 text-[#232326]">
          <div className="flex items-center justify-between border-b-2 border-[#232326] pb-2">
            <span className="font-mono-code font-bold text-xs">VOL. 01 · ISSUE 2026</span>
            <span className="text-xs">✦ ✦ ✦</span>
          </div>

          <div className="my-auto text-center py-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#fbf8fc] border-2 border-[#232326] flex items-center justify-center font-display font-bold text-2xl shadow-[2px_2px_0px_#232326] mb-3">
              ✈
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-full border border-[#232326] bg-[#fbf8fc] text-[10px] font-mono-code font-bold uppercase tracking-wider mb-2">
              POCKET TRAVEL ZINE
            </div>
            <h2 className="font-display font-bold text-2xl leading-tight">
              {trip.title}
            </h2>
            <p className="font-mono-code text-xs mt-1 font-bold text-[#884f44]">
              {trip.destination}
            </p>
            <div className="w-16 h-0.5 bg-[#232326] mx-auto my-3" />
            <p className="text-xs font-body italic max-w-xs mx-auto text-[#524341]">
              "{trip.introZineNote}"
            </p>
          </div>

          <div className="border-t-2 border-[#232326] pt-2 flex items-center justify-between text-[10px] font-mono-code font-bold">
            <span>{trip.dateRange}</span>
            <span className="px-1.5 py-0.5 rounded bg-white border border-[#232326]">EDITION: 1/1</span>
          </div>
        </div>
      ),
    },
    {
      title: 'PAGE 1: DAY 01',
      bg: 'bg-[#A8DADC]',
      content: (
        <div className="h-full flex flex-col justify-between p-4 text-[#232326]">
          <div>
            <div className="flex items-center justify-between border-b border-[#232326] pb-1.5 mb-2">
              <span className="font-display font-bold text-xs uppercase">DAY 01 · STORYBOARD</span>
              <span className="font-mono-code text-[10px] font-bold">{trip.days[0]?.date}</span>
            </div>
            <h3 className="font-display font-bold text-sm leading-tight text-[#002021]">
              {trip.days[0]?.title}
            </h3>

            <div className="space-y-2 mt-3">
              {trip.days[0]?.stops.slice(0, 3).map((stop, i) => (
                <div key={stop.id} className="bg-white/80 border border-[#232326] rounded p-2 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono-code font-bold text-[#884f44]">
                    <span>{stop.time}</span>
                    <span>{stop.category.toUpperCase()}</span>
                  </div>
                  <div className="font-display font-bold text-xs text-[#232326] mt-0.5 truncate">
                    {stop.title}
                  </div>
                  {stop.tip && (
                    <div className="text-[10px] font-mono-code text-[#524341] mt-1 bg-[#FDE4CF] p-1 rounded border border-[#232326]/40">
                      ★ {stop.tip.slice(0, 50)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] font-mono-code text-center border-t border-[#232326]/40 pt-1">
            PAGE 01
          </div>
        </div>
      ),
    },
    {
      title: 'PAGE 2: DAY 02',
      bg: 'bg-[#FDE4CF]',
      content: (
        <div className="h-full flex flex-col justify-between p-4 text-[#232326]">
          <div>
            <div className="flex items-center justify-between border-b border-[#232326] pb-1.5 mb-2">
              <span className="font-display font-bold text-xs uppercase">DAY 02 · STORYBOARD</span>
              <span className="font-mono-code text-[10px] font-bold">{trip.days[1]?.date || 'Day 2'}</span>
            </div>
            <h3 className="font-display font-bold text-sm leading-tight text-[#524341]">
              {trip.days[1]?.title || 'Adventure Continues'}
            </h3>

            <div className="space-y-2 mt-3">
              {trip.days[1]?.stops.slice(0, 3).map((stop, i) => (
                <div key={stop.id} className="bg-white/80 border border-[#232326] rounded p-2 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono-code font-bold text-[#884f44]">
                    <span>{stop.time}</span>
                    <span>{stop.category.toUpperCase()}</span>
                  </div>
                  <div className="font-display font-bold text-xs text-[#232326] mt-0.5 truncate">
                    {stop.title}
                  </div>
                  {stop.tip && (
                    <div className="text-[10px] font-mono-code text-[#524341] mt-1 bg-[#FFB5A7]/60 p-1 rounded border border-[#232326]/40">
                      ★ {stop.tip.slice(0, 50)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] font-mono-code text-center border-t border-[#232326]/40 pt-1">
            PAGE 02
          </div>
        </div>
      ),
    },
    {
      title: 'PAGE 3: DAY 03',
      bg: 'bg-[#CDEAC0]',
      content: (
        <div className="h-full flex flex-col justify-between p-4 text-[#232326]">
          <div>
            <div className="flex items-center justify-between border-b border-[#232326] pb-1.5 mb-2">
              <span className="font-display font-bold text-xs uppercase">DAY 03 · STORYBOARD</span>
              <span className="font-mono-code text-[10px] font-bold">{trip.days[2]?.date || 'Day 3'}</span>
            </div>
            <h3 className="font-display font-bold text-sm leading-tight text-[#0a2006]">
              {trip.days[2]?.title || 'Sacred Paths'}
            </h3>

            <div className="space-y-2 mt-3">
              {trip.days[2]?.stops.slice(0, 3).map((stop, i) => (
                <div key={stop.id} className="bg-white/80 border border-[#232326] rounded p-2 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono-code font-bold text-[#884f44]">
                    <span>{stop.time}</span>
                    <span>{stop.category.toUpperCase()}</span>
                  </div>
                  <div className="font-display font-bold text-xs text-[#232326] mt-0.5 truncate">
                    {stop.title}
                  </div>
                  {stop.tip && (
                    <div className="text-[10px] font-mono-code text-[#524341] mt-1 bg-[#FDE4CF] p-1 rounded border border-[#232326]/40">
                      ★ {stop.tip.slice(0, 50)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] font-mono-code text-center border-t border-[#232326]/40 pt-1">
            PAGE 03
          </div>
        </div>
      ),
    },
    {
      title: 'PAGE 4: DAY 04',
      bg: 'bg-[#E8D7F1]',
      content: (
        <div className="h-full flex flex-col justify-between p-4 text-[#232326]">
          <div>
            <div className="flex items-center justify-between border-b border-[#232326] pb-1.5 mb-2">
              <span className="font-display font-bold text-xs uppercase">DAY 04 · FINALE</span>
              <span className="font-mono-code text-[10px] font-bold">{trip.days[3]?.date || 'Day 4'}</span>
            </div>
            <h3 className="font-display font-bold text-sm leading-tight text-[#232326]">
              {trip.days[3]?.title || 'Farewell & Memories'}
            </h3>

            <div className="space-y-2 mt-3">
              {(trip.days[3]?.stops || trip.days[0]?.stops).slice(0, 3).map((stop, i) => (
                <div key={stop.id} className="bg-white/80 border border-[#232326] rounded p-2 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono-code font-bold text-[#884f44]">
                    <span>{stop.time}</span>
                    <span>{stop.category.toUpperCase()}</span>
                  </div>
                  <div className="font-display font-bold text-xs text-[#232326] mt-0.5 truncate">
                    {stop.title}
                  </div>
                  {stop.tip && (
                    <div className="text-[10px] font-mono-code text-[#524341] mt-1 bg-[#FDE4CF] p-1 rounded border border-[#232326]/40">
                      ★ {stop.tip.slice(0, 50)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] font-mono-code text-center border-t border-[#232326]/40 pt-1">
            PAGE 04
          </div>
        </div>
      ),
    },
    {
      title: 'PAGE 5: CONFIRMED TICKETS',
      bg: 'bg-[#CDEAC0]',
      content: (
        <div className="h-full flex flex-col justify-between p-4 text-[#232326]">
          <div>
            <div className="flex items-center justify-between border-b border-[#232326] pb-1.5 mb-2">
              <span className="font-display font-bold text-xs uppercase">CONFIRMED VOUCHERS</span>
              <span className="text-[10px] font-mono-code font-bold">VERIFIED</span>
            </div>

            <div className="space-y-2 mt-2">
              {trip.days
                .flatMap((d) => d.stops)
                .filter((s) => s.isConfirmed)
                .slice(0, 4)
                .map((stop) => (
                  <div key={stop.id} className="bg-white border border-[#232326] rounded p-1.5 text-xs font-mono-code">
                    <div className="flex items-center justify-between font-bold text-[10px]">
                      <span className="text-[#0a2006]">✓ {stop.confirmationCode || 'CONFIRMED'}</span>
                      <span className="text-[#524341]">{stop.time}</span>
                    </div>
                    <div className="font-display font-bold text-xs truncate mt-0.5">{stop.title}</div>
                  </div>
                ))}
            </div>
          </div>

          <div className="border-t border-[#232326]/40 pt-1 flex justify-between text-[10px] font-mono-code">
            <span>Budget: {trip.currencySymbol}{totalSpent.toLocaleString()} Spent</span>
            <span>PAGE 05</span>
          </div>
        </div>
      ),
    },
    {
      title: 'PAGE 6: POCKET PACKING',
      bg: 'bg-[#FDE4CF]',
      content: (
        <div className="h-full flex flex-col justify-between p-4 text-[#232326]">
          <div>
            <div className="flex items-center justify-between border-b border-[#232326] pb-1.5 mb-2">
              <span className="font-display font-bold text-xs uppercase">PACKING CHECKLIST</span>
              <span className="text-[10px] font-mono-code font-bold">POCKET</span>
            </div>

            <div className="space-y-1.5 mt-2">
              {trip.packingList.slice(0, 6).map((item) => (
                <div key={item.id} className="flex items-center gap-1.5 text-[11px] font-mono-code">
                  <span className="w-3 h-3 rounded border border-[#232326] bg-white flex items-center justify-center text-[8px] font-bold">
                    {item.isPacked ? '✓' : ''}
                  </span>
                  <span className={`truncate ${item.isPacked ? 'line-through text-[#857370]' : ''}`}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] font-mono-code text-center border-t border-[#232326]/40 pt-1">
            PAGE 06
          </div>
        </div>
      ),
    },
    {
      title: 'BACK COVER',
      bg: 'bg-[#fbf8fc]',
      content: (
        <div className="h-full flex flex-col justify-between p-4 text-[#232326]">
          <div className="flex items-center justify-between border-b-2 border-[#232326] pb-2">
            <span className="font-mono-code font-bold text-xs">POCKET ZINE PASSPORT</span>
            <span className="text-xs">✦</span>
          </div>

          <div className="my-auto text-center py-4">
            <div className="border-2 border-dashed border-[#232326] rounded-xl p-3 bg-[#f0edf1]">
              <span className="text-xs font-mono-code font-bold uppercase text-[#884f44] block mb-1">
                MEMORABILIA STAMP BOX
              </span>
              <div className="h-20 flex items-center justify-center text-xs font-mono-code text-[#857370]">
                [ Collect temple stamps & train station chops here ]
              </div>
            </div>
          </div>

          <div className="border-t-2 border-[#232326] pt-2 text-center text-[10px] font-mono-code text-[#524341]">
            Hand-crafted with Pastel Zine Travel · Happy Wandering!
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="bg-[#fbf8fc] border-2 border-[#232326] rounded-[14px] p-4 shadow-[3px_3px_0px_#232326] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FFB5A7] border-2 border-[#232326] flex items-center justify-center font-display font-bold text-sm shadow-[1.5px_1.5px_0px_#232326]">
            📖
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-[#232326] leading-tight">
              8-Panel Pocket Mini-Zine
            </h2>
            <p className="text-xs font-mono-code text-[#524341]">
              Foldable 1-sheet travel booklet to print or flip
            </p>
          </div>
        </div>

        {/* View Mode Switcher & Print Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#f0edf1] border-2 border-[#232326] rounded-full p-0.5">
            <button
              onClick={() => setViewMode('flat')}
              className={`px-3 py-1 rounded-full text-xs font-mono-code font-bold transition-all cursor-pointer ${
                viewMode === 'flat' ? 'bg-[#FFB5A7] text-[#232326] shadow-[1px_1px_0px_#232326]' : 'text-[#524341]'
              }`}
            >
              8-Panel Sheet
            </button>
            <button
              onClick={() => setViewMode('booklet')}
              className={`px-3 py-1 rounded-full text-xs font-mono-code font-bold transition-all cursor-pointer ${
                viewMode === 'booklet' ? 'bg-[#FFB5A7] text-[#232326] shadow-[1px_1px_0px_#232326]' : 'text-[#524341]'
              }`}
            >
              Flippable Booklet
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="rounded-full bg-[#CDEAC0] border-2 border-[#232326] px-4 py-1.5 font-display font-bold text-xs uppercase tracking-wider text-[#232326] shadow-[2px_2px_0px_#232326] hover:shadow-[3px_3px_0px_#232326] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Zine</span>
          </button>
        </div>
      </div>

      {/* Mode A: Flat 8-Panel Sheet (Foldable sheet layout) */}
      {viewMode === 'flat' ? (
        <div className="bg-[#fbf8fc] border-2 border-[#232326] rounded-[14px] p-5 shadow-[4px_4px_0px_#232326]">
          {/* Fold guide instructions banner */}
          <div className="mb-4 p-3 bg-[#FDE4CF] border-2 border-[#232326] rounded-xl flex items-center justify-between text-xs font-mono-code text-[#232326] shadow-[2px_2px_0px_#232326]">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-[#884f44]" />
              <span>
                <strong>Mini-Zine Folding Guide:</strong> Print single-sided, fold into 8 panels, cut the middle slit line, and fold into a pocket booklet!
              </span>
            </div>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-white border border-[#232326] text-[10px] font-bold">
              1 SHEET = 8 PAGES
            </span>
          </div>

          {/* 8-Panel Grid (4 columns × 2 rows) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
            {pages.map((p, idx) => (
              <div
                key={idx}
                className={`${p.bg} border-2 border-[#232326] rounded-[12px] h-[320px] shadow-[3px_3px_0px_#232326] relative flex flex-col overflow-hidden`}
              >
                {/* Header Sticker */}
                <div className="bg-[#232326] text-white text-[10px] font-mono-code font-bold px-2 py-0.5 text-center tracking-wider">
                  PANEL {idx + 1}: {p.title}
                </div>

                <div className="flex-1 overflow-hidden">{p.content}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Mode B: Flippable Pocket Booklet */
        <div className="bg-[#fbf8fc] border-2 border-[#232326] rounded-[14px] p-6 shadow-[4px_4px_0px_#232326] flex flex-col items-center">
          <div className="w-full max-w-sm">
            {/* The active page booklet card */}
            <div
              className={`${pages[currentPage].bg} border-2 border-[#232326] rounded-[14px] h-[440px] shadow-[4px_4px_0px_#232326] relative overflow-hidden`}
            >
              <div className="bg-[#232326] text-white text-xs font-mono-code font-bold px-3 py-1 text-center tracking-wider flex items-center justify-between">
                <span>POCKET ZINE</span>
                <span>PAGE {currentPage + 1} OF {pages.length}</span>
              </div>
              <div className="h-[395px] overflow-hidden">{pages[currentPage].content}</div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="rounded-full bg-white border-2 border-[#232326] px-4 py-2 text-xs font-mono-code font-bold flex items-center gap-1 shadow-[2px_2px_0px_#232326] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Page</span>
              </button>

              <div className="flex items-center gap-1.5">
                {pages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-3 h-3 rounded-full border border-[#232326] transition-all cursor-pointer ${
                      i === currentPage ? 'bg-[#FFB5A7] scale-125' : 'bg-white'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(pages.length - 1, prev + 1))}
                disabled={currentPage === pages.length - 1}
                className="rounded-full bg-[#FFB5A7] border-2 border-[#232326] px-4 py-2 text-xs font-mono-code font-bold flex items-center gap-1 shadow-[2px_2px_0px_#232326] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
