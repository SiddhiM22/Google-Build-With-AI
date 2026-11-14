import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { StopItem } from '../types/travel';
import { X, Eye, Navigation, MapPin, Compass, ExternalLink, RotateCw, Layers } from 'lucide-react';

interface RealTimePlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  stop: StopItem | null;
  mapsApiKey: string;
}

// Street View Panorama Component
function StreetViewContainer({ lat, lng }: { lat: number; lng: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [streetViewStatus, setStreetViewStatus] = useState<'loading' | 'available' | 'unavailable'>('loading');

  useEffect(() => {
    const googleMaps = (window as any).google?.maps;
    if (!containerRef.current || !googleMaps) return;

    try {
      const svService = new googleMaps.StreetViewService();
      const position = { lat, lng };

      svService.getPanorama({ location: position, radius: 100 }, (data: any, status: any) => {
        if (status === googleMaps.StreetViewStatus.OK && data && data.location) {
          setStreetViewStatus('available');
          new googleMaps.StreetViewPanorama(containerRef.current!, {
            position: data.location.latLng,
            pov: { heading: 165, pitch: 0 },
            zoom: 1,
            addressControl: true,
            showRoadLabels: true,
            motionTracking: false,
            motionTrackingControl: false,
          });
        } else {
          setStreetViewStatus('unavailable');
        }
      });
    } catch (e) {
      console.error('Street View error', e);
      setStreetViewStatus('unavailable');
    }
  }, [lat, lng]);

  return (
    <div className="relative w-full h-full min-h-[350px] bg-[#f0edf1] rounded-xl overflow-hidden border-2 border-[#232326]">
      <div ref={containerRef} className="w-full h-full min-h-[350px]" />

      {streetViewStatus === 'loading' && (
        <div className="absolute inset-0 bg-[#fbf8fc]/90 flex flex-col items-center justify-center p-4">
          <RotateCw className="w-6 h-6 animate-spin text-[#884f44] mb-2" />
          <p className="text-xs font-mono-code font-bold text-[#232326]">
            Locating Real-Time 360° Street View...
          </p>
        </div>
      )}

      {streetViewStatus === 'unavailable' && (
        <div className="absolute inset-0 bg-[#fbf8fc]/95 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#FDE4CF] border-2 border-[#232326] flex items-center justify-center font-bold text-lg mb-2 shadow-[2px_2px_0px_#232326]">
            📍
          </div>
          <p className="font-display font-bold text-base text-[#232326]">
            Street View imagery not available right here
          </p>
          <p className="text-xs font-mono-code text-[#524341] mt-1 max-w-sm">
            Switch to Live Google Satellite or Roadmap view above for aerial overhead perspective!
          </p>
        </div>
      )}
    </div>
  );
}

export const RealTimePlaceModal: React.FC<RealTimePlaceModalProps> = ({
  isOpen,
  onClose,
  stop,
  mapsApiKey,
}) => {
  const [viewType, setViewType] = useState<'streetview' | 'satellite' | 'roadmap'>('streetview');

  if (!isOpen || !stop) return null;

  const lat = stop.coordinates.lat || 35.6595;
  const lng = stop.coordinates.lng || 139.7005;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    stop.title + ' ' + (stop.subtitle || '')
  )}&query_place_id=${stop.id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#fbf8fc] border-2 border-[#232326] rounded-[16px] shadow-[6px_6px_0px_#232326] w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 border-b-2 border-[#232326] bg-[#FFB5A7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white border border-[#232326] flex items-center justify-center font-display font-bold text-sm shadow-[1.5px_1.5px_0px_#232326]">
              👁
            </div>
            <div>
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#884f44] block">
                REAL-TIME VIEW OF THE PLACE
              </span>
              <h3 className="font-display font-bold text-base sm:text-lg text-[#232326] leading-tight truncate max-w-xs sm:max-w-md">
                {stop.title}
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

        {/* View mode switcher bar */}
        <div className="px-5 py-2.5 bg-[#f0edf1] border-b-2 border-[#232326] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewType('streetview')}
              className={`px-3 py-1 rounded-full text-xs font-mono-code font-bold border-2 transition-all cursor-pointer flex items-center gap-1 ${
                viewType === 'streetview'
                  ? 'bg-[#FFB5A7] border-[#232326] text-[#232326] shadow-[1.5px_1.5px_0px_#232326]'
                  : 'bg-white border-[#232326]/40 text-[#524341] hover:bg-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>360° Street View</span>
            </button>

            <button
              onClick={() => setViewType('satellite')}
              className={`px-3 py-1 rounded-full text-xs font-mono-code font-bold border-2 transition-all cursor-pointer flex items-center gap-1 ${
                viewType === 'satellite'
                  ? 'bg-[#FFB5A7] border-[#232326] text-[#232326] shadow-[1.5px_1.5px_0px_#232326]'
                  : 'bg-white border-[#232326]/40 text-[#524341] hover:bg-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Satellite Live</span>
            </button>

            <button
              onClick={() => setViewType('roadmap')}
              className={`px-3 py-1 rounded-full text-xs font-mono-code font-bold border-2 transition-all cursor-pointer flex items-center gap-1 ${
                viewType === 'roadmap'
                  ? 'bg-[#FFB5A7] border-[#232326] text-[#232326] shadow-[1.5px_1.5px_0px_#232326]'
                  : 'bg-white border-[#232326]/40 text-[#524341] hover:bg-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Roadmap View</span>
            </button>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono-code font-bold text-[#884f44] hover:underline flex items-center gap-1"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Viewport Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 flex flex-col gap-4">
          <div className="w-full h-[400px] sm:h-[460px] relative rounded-xl overflow-hidden border-2 border-[#232326] shadow-[3px_3px_0px_#232326]">
            <APIProvider apiKey={mapsApiKey}>
              {viewType === 'streetview' ? (
                <StreetViewContainer lat={lat} lng={lng} />
              ) : (
                <Map
                  key={`${viewType}-${lat}-${lng}`}
                  mapId="DEMO_MAP_ID"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  defaultCenter={{ lat, lng }}
                  defaultZoom={17}
                  mapTypeId={viewType === 'satellite' ? 'hybrid' : 'roadmap'}
                  gestureHandling="greedy"
                  className="w-full h-full"
                >
                  <AdvancedMarker position={{ lat, lng }}>
                    <div className="w-10 h-10 rounded-full bg-[#FFB5A7] border-2 border-[#232326] flex items-center justify-center font-display font-bold text-sm text-[#232326] shadow-[2px_2px_0px_#232326]">
                      ✦
                    </div>
                  </AdvancedMarker>
                </Map>
              )}
            </APIProvider>
          </div>

          {/* Place details footer card */}
          <div className="p-3.5 bg-white border-2 border-[#232326] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[2px_2px_0px_#232326]">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded border border-[#232326] bg-[#FDE4CF] text-[10px] font-mono-code font-bold uppercase text-[#524341]">
                  {stop.category.toUpperCase()}
                </span>
                <span className="text-xs font-mono-code text-[#524341] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#884f44]" />
                  {stop.subtitle || 'Verified destination'}
                </span>
              </div>

              {stop.tip && (
                <p className="text-xs font-body text-[#232326] mt-1.5 italic bg-[#FDE4CF]/50 p-2 rounded border border-[#232326]/30">
                  ★ <strong>Zine Tip:</strong> {stop.tip}
                </p>
              )}
            </div>

            <div className="text-right shrink-0">
              <span className="text-[11px] font-mono-code text-[#524341] block">
                COORDINATES
              </span>
              <span className="text-xs font-mono-code font-bold text-[#232326]">
                {lat.toFixed(4)}, {lng.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
