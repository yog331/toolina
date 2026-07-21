
import React, { useEffect } from 'react';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ 
  slot, 
  format = 'auto', 
  responsive = true,
  className = "" 
}) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('AdSense error:', e);
    }
  }, []);

  // Using the actual Google AdSense publisher ID configured for this site
  return (
    <div className={`ad-container my-8 overflow-hidden flex justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 min-h-[100px] items-center relative ${className}`}>
      <span className="absolute top-2 left-2 text-[8px] font-black text-slate-300 uppercase tracking-widest pointer-events-none">Advertisement</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '250px' }}
        data-ad-client="ca-pub-4736100194327866"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <span className="text-xs font-bold text-slate-400">Ad Slot: {slot}</span>
      </div>
    </div>
  );
};

export default AdUnit;
