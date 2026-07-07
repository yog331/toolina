
import React from 'react';

interface BrandLogoProps {
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ className = "w-12 h-12" }) => {
  return (
    <div className={className}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>
          <linearGradient id="t1" x1="50" y1="50" x2="150" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>
          <linearGradient id="t2" x1="100" y1="80" x2="100" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="accent" x1="130" y1="130" x2="160" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#b8a262" />
            <stop offset="100%" stopColor="#d4af37" />
          </linearGradient>
        </defs>

        {/* Background rounded rect */}
        <rect x="15" y="15" width="170" height="170" rx="45" fill="url(#bg)" />
        
        {/* Stylized 'T' Top Bar */}
        <rect x="50" y="55" width="100" height="32" rx="16" fill="url(#t1)" />
        
        {/* Stylized 'T' Vertical Bar */}
        <rect x="84" y="70" width="32" height="80" rx="16" fill="url(#t2)" />
        
        {/* Accent Circle (Golden) */}
        <circle cx="130" cy="130" r="16" fill="url(#accent)" />
        
        {/* Inner cutout for accent */}
        <circle cx="130" cy="130" r="6" fill="#0f766e" />
      </svg>
    </div>
  );
};

export default BrandLogo;
