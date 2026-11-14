import React, { useState } from 'react';
import { StopItem, StopCategory } from '../types/travel';
import {
  Clock,
  CheckCircle2,
  Circle,
  Edit3,
  Trash2,
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Sparkles,
  MapPin,
  Ticket,
  DollarSign,
  AlertCircle,
  Eye,
  ExternalLink
} from 'lucide-react';

interface ItineraryCardProps {
  stop: StopItem;
  index: number;
  totalStops: number;
  currencySymbol: string;
  onToggleComplete: (id: string) => void;
  onEdit: (stop: StopItem) => void;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onAddTip: (id: string, tip: string) => void;
  onViewRealTime?: (stop: StopItem) => void;
}

export const ItineraryCard: React.FC<ItineraryCardProps> = ({
  stop,
  index,
  totalStops,
  currencySymbol,
  onToggleComplete,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddTip,
  onViewRealTime,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState(stop.tip || '');

  // Category styling configuration
  const getCategoryConfig = (category: StopCategory) => {
    switch (category) {
      case 'transit':
        return {
          headerBg: 'bg-[#A8DADC]',
          tagLabel: 'TRANSIT & FLIGHT',
          borderColor: 'border-[#232326]',
          badgeText: 'text-[#002021]',
        };
      case 'stay':
      case 'place':
      case 'food':
        return {
          headerBg: 'bg-[#FDE4CF]',
          tagLabel: category === 'stay' ? 'HOTEL & STAY' : category === 'food' ? 'FOOD & DRINK' : 'SIGHT & CULTURE',
          borderColor: 'border-[#232326]',
          badgeText: 'text-[#524341]',
        };
      case 'activity':
      default:
        return {
          headerBg: 'bg-[#CDEAC0]',
          tagLabel: 'EXPERIENCE & TICKETS',
          borderColor: 'border-[#232326]',
          badgeText: 'text-[#0a2006]',
        };
    }
  };

  const config = getCategoryConfig(stop.category);

  const handleSaveNote = () => {
    if (noteText.trim()) {
      onAddTip(stop.id, noteText.trim());
    }
    setIsAddingNote(false);
  };

  return (
    <div
      className={`relative bg-[#fbf8fc] border-2 border-[#232326] rounded-[14px] shadow-[3px_3px_0px_#232326] transition-all overflow-hidden ${
        stop.isCompleted ? 'opacity-90 ring-1 ring-[#cdeac0]' : ''
      }`}
    >
      {/* 1. Pastel Header Strip indicating Time of Day & Category */}
      <div
        className={`px-4 py-2 border-b-2 border-[#232326] ${config.headerBg} flex items-center justify-between gap-2`}
      >
        <div className="flex items-center gap-2">
          {/* Time of Day Corner Sticker Badge in Space Mono */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#232326] bg-white text-xs font-mono-code font-bold uppercase tracking-wider text-[#232326] shadow-[1px_1px_0px_#232326]">
            <Clock className="w-3 h-3 text-[#232326]" />
            <span>{stop.time}</span>
            <span className="text-[#857370]">·</span>
            <span>{stop.period}</span>
          </div>

          {/* Stamped category label */}
          <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#232326]">
            {config.tagLabel}
          </span>
        </div>

        {/* Right side status / vouchers in Space Mono */}
        <div className="flex items-center gap-2">
          {stop.isConfirmed && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[#232326] bg-[#CDEAC0] text-[11px] font-mono-code font-bold uppercase text-[#0a2006] shadow-[1px_1px_0px_#232326]">
              <CheckCircle2 className="w-3 h-3 text-[#0a2006]" />
              <span>{stop.confirmationCode || 'CONFIRMED'}</span>
            </div>
          )}

          {stop.flightOrTrainCode && (
            <div className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[#232326] bg-white text-[11px] font-mono-code font-bold text-[#232326] shadow-[1px_1px_0px_#232326]">
              <Ticket className="w-3 h-3 text-[#884f44]" />
              <span>{stop.flightOrTrainCode}</span>
            </div>
          )}

          {/* Visit completion toggle */}
          <button
            onClick={() => onToggleComplete(stop.id)}
            className={`cursor-pointer p-1 rounded-full hover:scale-110 transition-transform ${
              stop.isCompleted ? 'text-[#356668]' : 'text-[#857370] hover:text-[#232326]'
            }`}
            title={stop.isCompleted ? 'Mark as pending' : 'Mark as visited'}
          >
            {stop.isCompleted ? (
              <CheckCircle2 className="w-5 h-5 fill-[#CDEAC0] text-[#232326]" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Main Card Content */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Title & Location */}
            <div className="flex items-baseline gap-2 flex-wrap">
              <h3
                className={`font-display font-bold text-lg sm:text-xl text-[#232326] tracking-tight leading-snug ${
                  stop.isCompleted ? 'line-through text-[#857370]' : ''
                }`}
              >
                {stop.title}
              </h3>
            </div>

            {stop.subtitle && (
              <p className="flex items-center gap-1.5 text-xs font-mono-code text-[#524341] mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#884f44] shrink-0" />
                <span className="truncate">{stop.subtitle}</span>
              </p>
            )}

            {/* Description */}
            <p className="font-body text-sm sm:text-[15px] text-[#1b1b1e] mt-2.5 leading-relaxed">
              {stop.description}
            </p>

            {/* Tags & Price pill badge */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {stop.cost !== undefined && stop.cost > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-[#232326] bg-[#CDEAC0] text-xs font-mono-code font-bold text-[#0a2006] shadow-[1px_1px_0px_#232326]">
                  <span>{currencySymbol}</span>
                  <span className="tabular-nums">{stop.cost.toLocaleString()}</span>
                </span>
              )}

              {stop.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md border border-[#232326]/30 bg-[#f0edf1] text-[11px] font-mono-code text-[#524341]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Optional Photo Thumbnail with Comic Ink Border */}
          {stop.photoUrl && (
            <div className="shrink-0 w-full sm:w-44 md:w-36 h-28 relative rounded-lg border-2 border-[#232326] overflow-hidden shadow-[2px_2px_0px_#232326] bg-[#f0edf1]">
              {!imageError ? (
                <img
                  src={stop.photoUrl}
                  alt={stop.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#FDE4CF] p-2 text-center text-xs font-mono-code text-[#524341]">
                  <Sparkles className="w-5 h-5 text-[#884f44] mb-1" />
                  <span>{stop.title.slice(0, 15)}...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. Speech-Bubble Tips & Notes with tail pointer */}
        {(stop.tip || isAddingNote) && (
          <div className="mt-4 pt-2">
            {!isAddingNote && stop.tip ? (
              <div className="relative border-[1.5px] border-[#232326] bg-[#FDE4CF] rounded-xl p-3 shadow-[2px_2px_0px_#232326] text-xs font-body text-[#232326] leading-relaxed speech-bubble-tail">
                <div className="flex items-start gap-2">
                  <span className="font-mono-code font-bold uppercase text-[10px] bg-[#ffb5a7] px-1.5 py-0.5 rounded border border-[#232326] shrink-0 text-[#232326]">
                    ZINE TIP
                  </span>
                  <p className="flex-1">{stop.tip}</p>
                  <button
                    onClick={() => {
                      setNoteText(stop.tip || '');
                      setIsAddingNote(true);
                    }}
                    className="text-[#857370] hover:text-[#232326] p-0.5 cursor-pointer"
                    title="Edit Note"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : isAddingNote ? (
              <div className="border-2 border-[#232326] bg-[#FDE4CF] rounded-xl p-3 shadow-[2px_2px_0px_#232326]">
                <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1">
                  Travel Tip / Storyboard Note:
                </label>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="e.g. Secret back entrance, best matcha soft serve flavor, stamp spot location..."
                  className="w-full p-2 text-xs border border-[#232326] rounded bg-white font-body focus:outline-none focus:ring-1 focus:ring-[#884f44]"
                  rows={2}
                />
                <div className="flex items-center justify-end gap-2 mt-2">
                  <button
                    onClick={() => setIsAddingNote(false)}
                    className="px-2.5 py-1 text-xs font-mono-code font-bold rounded border border-[#232326] bg-white hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNote}
                    className="px-3 py-1 text-xs font-mono-code font-bold rounded border border-[#232326] bg-[#FFB5A7] shadow-[1px_1px_0px_#232326] cursor-pointer hover:bg-[#ffdad3]"
                  >
                    Save Tip
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* 4. Action bar footer */}
        <div className="mt-4 pt-3 border-t border-[#232326]/10 flex items-center justify-between text-xs font-mono-code text-[#524341]">
          {/* Left quick actions */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {onViewRealTime && (
              <button
                onClick={() => onViewRealTime(stop)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#232326] bg-[#A8DADC] hover:bg-[#b9ecee] text-[11px] font-mono-code font-bold text-[#002021] shadow-[1px_1px_0px_#232326] cursor-pointer transition-all"
                title="360° Street View & Live Google Maps"
              >
                <Eye className="w-3.5 h-3.5 text-[#232326]" />
                <span>Real-Time View</span>
              </button>
            )}

            {!stop.tip && !isAddingNote && (
              <button
                onClick={() => setIsAddingNote(true)}
                className="flex items-center gap-1 px-2 py-1 rounded border border-[#232326]/40 hover:bg-[#FDE4CF] text-[11px] font-bold text-[#232326] cursor-pointer transition-colors"
              >
                <MessageSquare className="w-3 h-3 text-[#884f44]" />
                <span>+ Add Tip Bubble</span>
              </button>
            )}

            <button
              onClick={() => onEdit(stop)}
              className="flex items-center gap-1 px-2 py-1 rounded border border-[#232326]/40 hover:bg-[#f0edf1] text-[11px] font-bold text-[#232326] cursor-pointer transition-colors"
            >
              <Edit3 className="w-3 h-3 text-[#356668]" />
              <span>Edit</span>
            </button>
          </div>

          {/* Right order and delete controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              className="p-1 rounded border border-[#232326]/30 hover:bg-[#f0edf1] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Move Up"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onMoveDown(index)}
              disabled={index === totalStops - 1}
              className="p-1 rounded border border-[#232326]/30 hover:bg-[#f0edf1] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Move Down"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onDelete(stop.id)}
              className="p-1 rounded border border-[#232326]/30 hover:bg-[#ffdad6] text-[#ba1a1a] cursor-pointer ml-1"
              title="Delete Stop"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
