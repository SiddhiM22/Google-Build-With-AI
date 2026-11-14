import React, { useState, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { Trip, StopItem } from '../types/travel';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Navigation,
  MapPin,
  Clock,
  Sparkles,
  Ticket,
  ChevronRight,
  Train,
  CheckCircle2,
  Eye,
  Layers,
  Compass
} from 'lucide-react';

interface PastelMapViewProps {
  trip: Trip;
  activeDayNumber: number;
  onSelectDay: (day: number) => void;
  onEditStop: (stop: StopItem) => void;
  onToggleComplete: (stopId: string) => void;
  onViewRealTime: (stop: StopItem) => void;
  mapsApiKey: string;
}

export const PastelMapView: React.FC<PastelMapViewProps> = ({
  trip,
  activeDayNumber,
  onSelectDay,
  onEditStop,
  onToggleComplete,
  onViewRealTime,
  mapsApiKey,
}) => {
  const [mapEngine, setMapEngine] = useState<'realtime' | 'illustrated'>('realtime');
  const [googleMapType, setGoogleMapType] = useState<'roadmap' | 'hybrid'>('roadmap');
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>(activeDayNumber);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Gather stops based on filter
  const activeStops: { stop: StopItem; dayNum: number; index: number }[] = [];
  trip.days.forEach((day) => {
    if (selectedDayFilter === 'all' || day.dayNumber === selectedDayFilter) {
      day.stops.forEach((stop, index) => {
        activeStops.push({ stop, dayNum: day.dayNumber, index: index + 1 });
      });
    }
  });

  const selectedStopItem = activeStops.find((s) => s.stop.id === selectedStopId)?.stop;
  const selectedStopMeta = activeStops.find((s) => s.stop.id === selectedStopId);

  // Compute center for Google Map
  const mapCenter = selectedStopItem?.coordinates.lat && selectedStopItem?.coordinates.lng
    ? { lat: selectedStopItem.coordinates.lat, lng: selectedStopItem.coordinates.lng }
    : activeStops[0]?.stop.coordinates.lat && activeStops[0]?.stop.coordinates.lng
    ? { lat: activeStops[0].stop.coordinates.lat, lng: activeStops[0].stop.coordinates.lng }
    : { lat: 35.6595, lng: 139.7005 };

  // Illustrated map pan handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(2.2, Math.max(0.7, prev + delta)));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedStopId(null);
  };

  // Generate SVG path connecting stops
  const getRouteSvgPath = () => {
    if (activeStops.length < 2) return '';
    return activeStops.reduce((path, item, i) => {
      const x = item.stop.coordinates.x * 10;
      const y = item.stop.coordinates.y * 7;
      if (i === 0) return `M ${x} ${y}`;
      return `${path} L ${x} ${y}`;
    }, '');
  };

  return (
    <div className="space-y-4">
      {/* Top Map Control Bar */}
      <div className="bg-[#fbf8fc] border-2 border-[#232326] rounded-[14px] p-4 shadow-[3px_3px_0px_#232326] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#A8DADC] border-2 border-[#232326] flex items-center justify-center font-display font-bold text-sm shadow-[1.5px_1.5px_0px_#232326]">
            🗺
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-[#232326] leading-tight">
              {mapEngine === 'realtime' ? 'Google Maps Real-Time View' : 'Pastel Route Canvas'}
            </h2>
            <p className="text-xs font-mono-code text-[#524341]">
              {mapEngine === 'realtime'
                ? 'Live Google vector tiles, real coordinates & 360° street view'
                : 'Light paper zine canvas with powder blue water & sage mint parks'}
            </p>
          </div>
        </div>

        {/* Engine Switcher & Day Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Map Engine Toggle */}
          <div className="flex items-center bg-[#f0edf1] border-2 border-[#232326] rounded-full p-0.5">
            <button
              onClick={() => setMapEngine('realtime')}
              className={`px-3 py-1 rounded-full text-xs font-mono-code font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mapEngine === 'realtime'
                  ? 'bg-[#FFB5A7] text-[#232326] shadow-[1px_1px_0px_#232326]'
                  : 'text-[#524341] hover:text-[#232326]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Real-Time Google Map</span>
            </button>

            <button
              onClick={() => setMapEngine('illustrated')}
              className={`px-3 py-1 rounded-full text-xs font-mono-code font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mapEngine === 'illustrated'
                  ? 'bg-[#FFB5A7] text-[#232326] shadow-[1px_1px_0px_#232326]'
                  : 'text-[#524341] hover:text-[#232326]'
              }`}
            >
              <span>Illustrated Canvas</span>
            </button>
          </div>

          {/* Day Filter Switcher */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedDayFilter('all')}
              className={`px-2.5 py-1 rounded-full border-2 border-[#232326] text-xs font-mono-code font-bold transition-all cursor-pointer ${
                selectedDayFilter === 'all'
                  ? 'bg-[#A8DADC] text-[#232326] shadow-[1.5px_1.5px_0px_#232326]'
                  : 'bg-white hover:bg-[#f0edf1] text-[#232326]'
              }`}
            >
              All Stops ({trip.days.reduce((a, d) => a + d.stops.length, 0)})
            </button>

            {trip.days.map((day) => {
              const isSelected = selectedDayFilter === day.dayNumber;
              return (
                <button
                  key={day.dayNumber}
                  onClick={() => {
                    setSelectedDayFilter(day.dayNumber);
                    onSelectDay(day.dayNumber);
                  }}
                  className={`px-2.5 py-1 rounded-full border-2 border-[#232326] text-xs font-mono-code font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFB5A7] text-[#232326] shadow-[1.5px_1.5px_0px_#232326]'
                      : 'bg-white hover:bg-[#FDE4CF] text-[#232326]'
                  }`}
                >
                  Day 0{day.dayNumber}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="relative bg-[#fbf8fc] border-2 border-[#232326] rounded-[14px] shadow-[4px_4px_0px_#232326] overflow-hidden select-none min-h-[520px]">
        {mapEngine === 'realtime' ? (
          /* Real-Time Google Maps View */
          <div className="w-full h-[540px] relative">
            {/* Map Type layer toggle (Roadmap vs Satellite) */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-white/95 border-2 border-[#232326] rounded-xl p-1 shadow-[2px_2px_0px_#232326]">
              <button
                onClick={() => setGoogleMapType('roadmap')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono-code font-bold cursor-pointer transition-colors ${
                  googleMapType === 'roadmap' ? 'bg-[#FFB5A7] text-[#232326]' : 'text-[#524341] hover:bg-slate-100'
                }`}
              >
                Roadmap
              </button>
              <button
                onClick={() => setGoogleMapType('hybrid')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono-code font-bold cursor-pointer transition-colors ${
                  googleMapType === 'hybrid' ? 'bg-[#FFB5A7] text-[#232326]' : 'text-[#524341] hover:bg-slate-100'
                }`}
              >
                Satellite Real-Time
              </button>
            </div>

            <APIProvider apiKey={mapsApiKey}>
              <Map
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                defaultCenter={mapCenter}
                defaultZoom={14}
                mapTypeId={googleMapType}
                gestureHandling="greedy"
                className="w-full h-full"
              >
                {activeStops.map((item) => {
                  const { stop, dayNum, index } = item;
                  const isSelected = stop.id === selectedStopId;
                  const lat = stop.coordinates.lat || 35.6595;
                  const lng = stop.coordinates.lng || 139.7005;

                  const getPinBg = () => {
                    if (stop.category === 'transit') return 'bg-[#A8DADC]';
                    if (stop.category === 'food' || stop.category === 'place') return 'bg-[#FDE4CF]';
                    return 'bg-[#CDEAC0]';
                  };

                  return (
                    <AdvancedMarker
                      key={stop.id}
                      position={{ lat, lng }}
                      onClick={() => setSelectedStopId(stop.id)}
                    >
                      <div
                        className={`relative cursor-pointer transition-transform duration-150 ${
                          isSelected ? 'scale-125 z-40' : 'hover:scale-110 z-30'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full border-2 border-[#232326] ${
                            isSelected ? 'bg-[#FFB5A7] ring-4 ring-[#232326]/20' : getPinBg()
                          } flex items-center justify-center font-display font-bold text-sm text-[#232326] shadow-[2.5px_2.5px_0px_#232326]`}
                        >
                          {stop.isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-[#232326]" />
                          ) : (
                            <span>{index}</span>
                          )}
                        </div>

                        {/* Title pill */}
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 border border-[#232326] rounded px-1.5 py-0.5 text-[10px] font-mono-code font-bold text-[#232326] shadow-[1px_1px_0px_#232326]">
                          {stop.coordinates.label || stop.title.slice(0, 14)}
                        </div>
                      </div>
                    </AdvancedMarker>
                  );
                })}
              </Map>
            </APIProvider>
          </div>
        ) : (
          /* Illustrated Zine Canvas View */
          <>
            {/* Zoom & Pan Controls in Top-Right */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-white/95 border-2 border-[#232326] rounded-xl p-1 shadow-[2px_2px_0px_#232326]">
              <button
                onClick={() => handleZoom(0.2)}
                className="w-8 h-8 rounded-lg hover:bg-[#f0edf1] flex items-center justify-center font-bold text-[#232326] cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleZoom(-0.2)}
                className="w-8 h-8 rounded-lg hover:bg-[#f0edf1] flex items-center justify-center font-bold text-[#232326] cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="w-8 h-8 rounded-lg hover:bg-[#f0edf1] flex items-center justify-center font-bold text-[#232326] cursor-pointer border-t border-[#232326]/20 pt-1"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Legend in Top-Left */}
            <div className="absolute top-4 left-4 z-20 hidden sm:flex items-center gap-3 bg-white/90 backdrop-blur-sm border-2 border-[#232326] rounded-xl px-3 py-1.5 shadow-[2px_2px_0px_#232326] text-[11px] font-mono-code text-[#232326]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#A8DADC] border border-[#232326]" />
                <span>Waterway</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#CDEAC0] border border-[#232326]" />
                <span>Sage Parks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FFB5A7] border border-[#232326]" />
                <span>Comic Pins</span>
              </div>
            </div>

            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="w-full h-[540px] cursor-grab active:cursor-grabbing relative overflow-hidden bg-[#faf7fa] flex items-center justify-center"
            >
              <div
                className="transition-transform duration-75 origin-center w-[1000px] h-[700px] relative shrink-0"
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                }}
              >
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 1000 700"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern id="mapGrid2" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#232326" strokeWidth="0.5" strokeOpacity="0.08" />
                    </pattern>
                  </defs>

                  <rect width="1000" height="700" fill="#fbf8fc" />
                  <rect width="1000" height="700" fill="url(#mapGrid2)" />

                  <path
                    d="M 680 700 C 650 600 710 520 800 480 C 890 440 940 380 1000 350 L 1000 700 Z"
                    fill="#A8DADC"
                    stroke="#232326"
                    strokeWidth="2"
                  />
                  <path
                    d="M 0 240 C 200 220 280 290 420 310 C 560 330 630 260 760 280 C 860 300 930 260 1000 290"
                    fill="none"
                    stroke="#A8DADC"
                    strokeWidth="32"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 0 240 C 200 220 280 290 420 310 C 560 330 630 260 760 280 C 860 300 930 260 1000 290"
                    fill="none"
                    stroke="#232326"
                    strokeWidth="2"
                    strokeDasharray="12 6"
                  />

                  <path
                    d="M 120 180 C 180 120 320 130 380 200 C 440 270 380 340 300 350 C 220 360 100 320 80 260 Z"
                    fill="#CDEAC0"
                    stroke="#232326"
                    strokeWidth="2"
                  />

                  <path
                    d="M 680 110 C 740 90 840 100 890 160 C 920 200 880 250 820 260 C 760 270 690 240 660 190 Z"
                    fill="#CDEAC0"
                    stroke="#232326"
                    strokeWidth="2"
                  />

                  {getRouteSvgPath() && (
                    <>
                      <path
                        d={getRouteSvgPath()}
                        fill="none"
                        stroke="#FFB5A7"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeOpacity="0.6"
                      />
                      <path
                        d={getRouteSvgPath()}
                        fill="none"
                        stroke="#232326"
                        strokeWidth="2.5"
                        strokeDasharray="8 6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  )}
                </svg>

                {activeStops.map((item) => {
                  const { stop, index } = item;
                  const isSelected = stop.id === selectedStopId;
                  const leftPos = stop.coordinates.x * 10;
                  const topPos = stop.coordinates.y * 7;

                  const getPinColor = () => {
                    if (stop.category === 'transit') return 'bg-[#A8DADC]';
                    if (stop.category === 'food' || stop.category === 'place') return 'bg-[#FDE4CF]';
                    return 'bg-[#CDEAC0]';
                  };

                  return (
                    <div
                      key={stop.id}
                      className="absolute -translate-x-1/2 -translate-y-full cursor-pointer z-30 transition-transform duration-150 hover:scale-125"
                      style={{ left: `${leftPos}px`, top: `${topPos}px` }}
                      onClick={() => setSelectedStopId(stop.id)}
                    >
                      <div
                        className={`relative w-9 h-9 rounded-full border-2 border-[#232326] ${
                          isSelected ? 'bg-[#FFB5A7] scale-110 ring-4 ring-[#232326]/20' : getPinColor()
                        } flex items-center justify-center font-display font-bold text-sm text-[#232326] shadow-[2.5px_2.5px_0px_#232326]`}
                      >
                        {stop.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-[#232326]" />
                        ) : (
                          <span>{index}</span>
                        )}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#232326]" />
                      </div>

                      <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 border border-[#232326] rounded px-1.5 py-0.5 text-[10px] font-mono-code font-bold text-[#232326] shadow-[1px_1px_0px_#232326]">
                        {stop.coordinates.label || stop.title.slice(0, 14)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Selected Stop Inspector Bottom Sheet */}
        {selectedStopItem && selectedStopMeta && (
          <div className="p-4 bg-[#fbf8fc] border-t-2 border-[#232326] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-[#FFB5A7] border-2 border-[#232326] flex items-center justify-center font-display font-bold text-base shadow-[2px_2px_0px_#232326] shrink-0">
                {selectedStopMeta.index}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded border border-[#232326] bg-[#FDE4CF] text-[10px] font-mono-code font-bold uppercase">
                    DAY 0{selectedStopMeta.dayNum} · {selectedStopItem.time}
                  </span>
                  {selectedStopItem.isConfirmed && (
                    <span className="px-2 py-0.5 rounded border border-[#232326] bg-[#CDEAC0] text-[10px] font-mono-code font-bold text-[#0a2006]">
                      CONFIRMED
                    </span>
                  )}
                  {selectedStopItem.flightOrTrainCode && (
                    <span className="px-2 py-0.5 rounded border border-[#232326] bg-white text-[10px] font-mono-code font-bold">
                      {selectedStopItem.flightOrTrainCode}
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-lg text-[#232326] mt-0.5">
                  {selectedStopItem.title}
                </h3>
                <p className="text-xs font-body text-[#524341] max-w-xl">
                  {selectedStopItem.description}
                </p>

                {selectedStopItem.tip && (
                  <p className="text-xs font-mono-code text-[#884f44] mt-1 italic">
                    ★ Tip: {selectedStopItem.tip}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end flex-wrap">
              <button
                onClick={() => onViewRealTime(selectedStopItem)}
                className="px-3.5 py-1.5 rounded-full bg-[#A8DADC] border-2 border-[#232326] text-xs font-mono-code font-bold text-[#002021] shadow-[2px_2px_0px_#232326] hover:bg-[#b9ecee] cursor-pointer flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-[#232326]" />
                <span>360° Real-Time View</span>
              </button>

              <button
                onClick={() => onToggleComplete(selectedStopItem.id)}
                className={`px-3 py-1.5 rounded-full border-2 border-[#232326] text-xs font-mono-code font-bold cursor-pointer transition-all ${
                  selectedStopItem.isCompleted
                    ? 'bg-[#CDEAC0] text-[#0a2006]'
                    : 'bg-white hover:bg-[#FDE4CF]'
                }`}
              >
                {selectedStopItem.isCompleted ? '✓ Visited' : 'Mark Visited'}
              </button>

              <button
                onClick={() => onEditStop(selectedStopItem)}
                className="px-3.5 py-1.5 rounded-full bg-[#FFB5A7] border-2 border-[#232326] text-xs font-display font-bold text-[#232326] uppercase shadow-[2px_2px_0px_#232326] hover:shadow-[3px_3px_0px_#232326] cursor-pointer"
              >
                Edit Stop
              </button>

              <button
                onClick={() => setSelectedStopId(null)}
                className="p-1.5 text-xs text-[#857370] hover:text-[#232326] cursor-pointer"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs font-mono-code text-[#524341] px-2">
        <span>Click pin to inspect place · Real-time 360° Street View & Google Maps vector view enabled</span>
        <span>{activeStops.length} Pins Mapped</span>
      </div>
    </div>
  );
};
