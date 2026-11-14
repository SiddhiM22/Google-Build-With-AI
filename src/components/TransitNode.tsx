import React from 'react';
import { TransitLeg } from '../types/travel';
import { Footprints, Train, Bus, Plane, Ship, Navigation } from 'lucide-react';

interface TransitNodeProps {
  transit: TransitLeg;
}

export const TransitNode: React.FC<TransitNodeProps> = ({ transit }) => {
  const getModeIcon = () => {
    switch (transit.mode) {
      case 'walk':
        return <Footprints className="w-3.5 h-3.5 text-[#232326]" />;
      case 'train':
      case 'metro':
        return <Train className="w-3.5 h-3.5 text-[#232326]" />;
      case 'bus':
        return <Bus className="w-3.5 h-3.5 text-[#232326]" />;
      case 'flight':
        return <Plane className="w-3.5 h-3.5 text-[#232326]" />;
      case 'ferry':
        return <Ship className="w-3.5 h-3.5 text-[#232326]" />;
      default:
        return <Navigation className="w-3.5 h-3.5 text-[#232326]" />;
    }
  };

  return (
    <div className="relative py-3.5 my-1 flex items-center justify-start pl-6 md:pl-8">
      {/* Dashed vertical connector line (2px dashed #232326) */}
      <div className="absolute left-[27px] md:left-[35px] top-0 bottom-0 w-[2px] border-l-2 border-dashed border-[#232326] -z-0" />

      {/* Transit Connector Capsule Container */}
      <div className="relative z-10 flex items-center gap-2.5 bg-[#fbf8fc] px-2 py-0.5 rounded-full">
        {/* Small circular pastel node (#A8DADC Powder Blue) */}
        <div className="w-7 h-7 rounded-full bg-[#A8DADC] border-2 border-[#232326] flex items-center justify-center shadow-[1.5px_1.5px_0px_#232326] shrink-0">
          {getModeIcon()}
        </div>

        {/* Stamped passport badge in Space Mono */}
        <div className="inline-flex items-center gap-2 bg-[#f0edf1] border-[1.5px] border-[#232326] rounded-full px-3 py-1 text-xs font-mono-code font-bold uppercase tracking-wider text-[#232326] shadow-[1.5px_1.5px_0px_#232326]">
          <span className="text-[#356668]">{transit.duration}</span>
          <span className="text-[#857370]">·</span>
          <span className="text-[#1b1b1e]">{transit.details}</span>
        </div>
      </div>
    </div>
  );
};
