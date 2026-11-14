import React, { useState, useEffect } from 'react';
import { StopItem, StopCategory, DayPlan, TransitLeg } from '../types/travel';
import { X, Clock, MapPin, Ticket, MessageSquare, Train, Footprints, Image, DollarSign } from 'lucide-react';

interface StopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (stopData: Partial<StopItem>, targetDayNumber: number) => void;
  initialStop?: StopItem | null;
  days: DayPlan[];
  activeDayNumber: number;
  currencySymbol: string;
}

export const StopModal: React.FC<StopModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialStop,
  days,
  activeDayNumber,
  currencySymbol,
}) => {
  const [targetDay, setTargetDay] = useState<number>(activeDayNumber);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [period, setPeriod] = useState<StopItem['period']>('morning');
  const [category, setCategory] = useState<StopCategory>('place');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [flightOrTrainCode, setFlightOrTrainCode] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [tip, setTip] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  // Transit to next stop
  const [hasTransit, setHasTransit] = useState(false);
  const [transitDuration, setTransitDuration] = useState('15 min walk');
  const [transitMode, setTransitMode] = useState<TransitLeg['mode']>('walk');
  const [transitDetails, setTransitDetails] = useState('');

  useEffect(() => {
    if (initialStop) {
      setTitle(initialStop.title);
      setSubtitle(initialStop.subtitle || '');
      setTime(initialStop.time || '10:00 AM');
      setPeriod(initialStop.period || 'morning');
      setCategory(initialStop.category);
      setDescription(initialStop.description || '');
      setCost(initialStop.cost !== undefined ? String(initialStop.cost) : '');
      setFlightOrTrainCode(initialStop.flightOrTrainCode || '');
      setConfirmationCode(initialStop.confirmationCode || '');
      setIsConfirmed(!!initialStop.isConfirmed);
      setTip(initialStop.tip || '');
      setPhotoUrl(initialStop.photoUrl || '');
      setTargetDay(activeDayNumber);

      if (initialStop.transitToNext) {
        setHasTransit(true);
        setTransitDuration(initialStop.transitToNext.duration);
        setTransitMode(initialStop.transitToNext.mode);
        setTransitDetails(initialStop.transitToNext.details);
      } else {
        setHasTransit(false);
      }
    } else {
      // Reset form
      setTitle('');
      setSubtitle('');
      setTime('10:00 AM');
      setPeriod('morning');
      setCategory('place');
      setDescription('');
      setCost('');
      setFlightOrTrainCode('');
      setConfirmationCode('');
      setIsConfirmed(false);
      setTip('');
      setPhotoUrl('');
      setHasTransit(false);
      setTransitDuration('15 min walk');
      setTransitMode('walk');
      setTransitDetails('');
      setTargetDay(activeDayNumber);
    }
  }, [initialStop, isOpen, activeDayNumber]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const stopPayload: Partial<StopItem> = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      time,
      period,
      category,
      description: description.trim(),
      cost: cost ? parseFloat(cost) : undefined,
      flightOrTrainCode: flightOrTrainCode.trim() || undefined,
      confirmationCode: confirmationCode.trim() || undefined,
      isConfirmed,
      tip: tip.trim() || undefined,
      photoUrl: photoUrl.trim() || undefined,
      coordinates: initialStop?.coordinates || {
        x: 30 + Math.floor(Math.random() * 40),
        y: 20 + Math.floor(Math.random() * 50),
        label: title.trim().slice(0, 15),
      },
      transitToNext: hasTransit
        ? {
            duration: transitDuration.trim(),
            mode: transitMode,
            details: transitDetails.trim() || 'Next connection',
          }
        : undefined,
    };

    onSave(stopPayload, targetDay);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[#fbf8fc] border-2 border-[#232326] rounded-[16px] shadow-[6px_6px_0px_#232326] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b-2 border-[#232326] bg-[#FFB5A7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-white border border-[#232326] flex items-center justify-center font-display font-bold text-sm shadow-[1px_1px_0px_#232326]">
              ✦
            </span>
            <h3 className="font-display font-bold text-lg text-[#232326]">
              {initialStop ? 'Edit Storyboard Stop' : 'Add New Storyboard Stop'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[#232326] bg-white hover:bg-slate-100 cursor-pointer shadow-[1px_1px_0px_#232326]"
            title="Close"
          >
            <X className="w-4 h-4 text-[#232326]" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 font-body">
          {/* Target Day & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1">
                Day Itinerary:
              </label>
              <select
                value={targetDay}
                onChange={(e) => setTargetDay(Number(e.target.value))}
                className="w-full p-2 text-xs border-2 border-[#232326] rounded-lg bg-white font-mono-code focus:outline-none"
              >
                {days.map((d) => (
                  <option key={d.dayNumber} value={d.dayNumber}>
                    Day 0{d.dayNumber} · {d.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1">
                Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as StopCategory)}
                className="w-full p-2 text-xs border-2 border-[#232326] rounded-lg bg-white font-mono-code focus:outline-none"
              >
                <option value="place">Sight & Culture (Buttercream #FDE4CF)</option>
                <option value="food">Food & Drink (Buttercream #FDE4CF)</option>
                <option value="transit">Transit & Rail (Powder Blue #A8DADC)</option>
                <option value="stay">Hotel & Lodging (Buttercream #FDE4CF)</option>
                <option value="activity">Experience & Tickets (Sage Mint #CDEAC0)</option>
              </select>
            </div>
          </div>

          {/* Time & Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1">
                Scheduled Time:
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 09:30 AM"
                  className="w-full p-2 pl-8 text-xs border-2 border-[#232326] rounded-lg bg-white font-mono-code focus:outline-none"
                />
                <Clock className="w-3.5 h-3.5 text-[#884f44] absolute left-2.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1">
                Time of Day Period:
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="w-full p-2 text-xs border-2 border-[#232326] rounded-lg bg-white font-mono-code focus:outline-none"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1">
              Stop Title / Destination:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fushimi Inari Torii Gate Trail"
              className="w-full p-2 text-sm border-2 border-[#232326] rounded-lg bg-white font-display font-bold focus:outline-none"
            />
          </div>

          {/* Subtitle / Address */}
          <div>
            <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1">
              Location / Station / Address:
            </label>
            <div className="relative">
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. 68 Fukakusa Yabunouchicho, Fushimi Ward"
                className="w-full p-2 pl-8 text-xs border-2 border-[#232326] rounded-lg bg-white font-body focus:outline-none"
              />
              <MapPin className="w-3.5 h-3.5 text-[#884f44] absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1">
              Storyboard Description:
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What to see, taste, or photograph at this stop..."
              className="w-full p-2 text-xs border-2 border-[#232326] rounded-lg bg-white font-body focus:outline-none"
            />
          </div>

          {/* Speech-Bubble Tip */}
          <div className="p-3 bg-[#FDE4CF] border-2 border-[#232326] rounded-xl shadow-[2px_2px_0px_#232326]">
            <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#884f44]" />
              <span>Speech-Bubble Travel Tip (Rendered with pointer):</span>
            </label>
            <textarea
              rows={2}
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              placeholder="e.g. Walk 15 min past the crossroads for crowd-free views and warm matcha soft serve!"
              className="w-full p-2 text-xs border border-[#232326] rounded bg-white font-body focus:outline-none"
            />
          </div>

          {/* Cost, Codes & Confirmation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1">
                Estimated Cost ({currencySymbol}):
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="0"
                className="w-full p-2 text-xs border-2 border-[#232326] rounded-lg bg-white font-mono-code focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1">
                Flight / Train Code:
              </label>
              <input
                type="text"
                value={flightOrTrainCode}
                onChange={(e) => setFlightOrTrainCode(e.target.value)}
                placeholder="e.g. JR-YMT-04"
                className="w-full p-2 text-xs border-2 border-[#232326] rounded-lg bg-white font-mono-code uppercase focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1">
                Voucher / Booking Ref:
              </label>
              <input
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                placeholder="e.g. CONF #TKY-89"
                className="w-full p-2 text-xs border-2 border-[#232326] rounded-lg bg-white font-mono-code uppercase focus:outline-none"
              />
            </div>
          </div>

          {/* Confirmed Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isConfirmedCheck"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="w-4 h-4 accent-[#4c6544]"
            />
            <label
              htmlFor="isConfirmedCheck"
              className="text-xs font-mono-code font-bold text-[#232326] cursor-pointer"
            >
              Mark as Confirmed Reservation (Sage Mint Badge)
            </label>
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1">
              Photo URL (Optional travel snapshot):
            </label>
            <div className="relative">
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2 pl-8 text-xs border-2 border-[#232326] rounded-lg bg-white font-mono-code focus:outline-none"
              />
              <Image className="w-3.5 h-3.5 text-[#884f44] absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Transit Leg to Next Stop */}
          <div className="border-t-2 border-[#232326]/10 pt-3">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="hasTransitCheck"
                checked={hasTransit}
                onChange={(e) => setHasTransit(e.target.checked)}
                className="w-4 h-4 accent-[#356668]"
              />
              <label
                htmlFor="hasTransitCheck"
                className="text-xs font-mono-code font-bold uppercase text-[#232326] cursor-pointer flex items-center gap-1.5"
              >
                <Train className="w-3.5 h-3.5 text-[#356668]" />
                <span>Add Transit Connector to Next Stop</span>
              </label>
            </div>

            {hasTransit && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#f0edf1] p-3 rounded-xl border border-[#232326]">
                <div>
                  <label className="block text-[11px] font-mono-code text-[#524341] mb-1">
                    Duration:
                  </label>
                  <input
                    type="text"
                    value={transitDuration}
                    onChange={(e) => setTransitDuration(e.target.value)}
                    placeholder="e.g. 15 min walk"
                    className="w-full p-1.5 text-xs border border-[#232326] rounded bg-white font-mono-code"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono-code text-[#524341] mb-1">
                    Mode:
                  </label>
                  <select
                    value={transitMode}
                    onChange={(e) => setTransitMode(e.target.value as any)}
                    className="w-full p-1.5 text-xs border border-[#232326] rounded bg-white font-mono-code"
                  >
                    <option value="walk">Walk</option>
                    <option value="train">Train</option>
                    <option value="metro">Metro</option>
                    <option value="bus">Bus</option>
                    <option value="ferry">Ferry</option>
                    <option value="flight">Flight</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono-code text-[#524341] mb-1">
                    Details / Route:
                  </label>
                  <input
                    type="text"
                    value={transitDetails}
                    onChange={(e) => setTransitDetails(e.target.value)}
                    placeholder="e.g. Yamanote Line to Shibuya"
                    className="w-full p-1.5 text-xs border border-[#232326] rounded bg-white font-mono-code"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t-2 border-[#232326] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border-2 border-[#232326] bg-white text-xs font-mono-code font-bold text-[#232326] hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#FFB5A7] border-2 border-[#232326] font-display font-bold text-xs uppercase tracking-wider text-[#232326] shadow-[3px_3px_0px_#232326] hover:shadow-[4px_4px_0px_#232326] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#232326] transition-all cursor-pointer"
            >
              {initialStop ? 'Save Changes' : '+ Add Stop to Storyboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
