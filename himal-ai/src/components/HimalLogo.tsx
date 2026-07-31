import React from 'react';

interface LogoProps {
  className?: string; // Controls icon size (e.g., "w-10 h-10")
  showText?: boolean;
}

export const HimalLogo: React.FC<LogoProps> = ({ 
  className = "w-10 h-10", 
  showText = true 
}) => {
  return (
    <div className="flex items-center gap-3 select-none">
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          {/* Temple Gold Gradient */}
          <linearGradient id="himalGold" x1="50" y1="15" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Cyan/Blue Tech Pulse Accent */}
          <linearGradient id="techPulse" x1="20" y1="50" x2="80" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          {/* Subtle Glow Effect */}
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Tech Orbit (Decentralized Trail Wire Ring) */}
        <circle 
          cx="50" 
          cy="50" 
          r="44" 
          stroke="url(#himalGold)" 
          strokeWidth="1.5" 
          strokeDasharray="8 5" 
          opacity="0.35" 
        />
        <circle cx="50" cy="50" r="47" stroke="#FFFFFF" strokeWidth="0.75" opacity="0.1" />

        {/* Secondary Back Peak */}
        <polygon 
          points="28,75 48,35 68,75" 
          fill="#1E293B" 
          stroke="#334155" 
          strokeWidth="1.5" 
        />

        {/* Primary Himalayan Peak (Temple Gold Facets) */}
        <polygon 
          points="18,78 50,18 82,78" 
          fill="url(#himalGold)" 
        />
        {/* Shadow Facet for 3D Mountain Depth */}
        <polygon 
          points="50,18 82,78 50,78" 
          fill="#B45309" 
          opacity="0.45" 
        />

        {/* Snow Cap Geometry */}
        <polygon 
          points="50,18 57,32 52,36 48,32 43,33" 
          fill="#FFFFFF" 
        />

        {/* AI Circuit Pulse Line crossing the mountain base */}
        <path 
          d="M20 62 Q50 48 80 62" 
          stroke="url(#techPulse)" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          fill="none" 
          filter="url(#goldGlow)"
        />

        {/* Geotag & Dispatch Data Nodes */}
        <circle cx="20" cy="62" r="3.5" fill="#38BDF8" />
        <circle cx="50" cy="55" r="3" fill="#F59E0B" />
        <circle cx="80" cy="62" r="3.5" fill="#38BDF8" />
      </svg>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-display font-black text-xl tracking-wider text-white flex items-center gap-1">
            हिमाल<span className="text-amber-500 font-mono text-lg">.AI</span>
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-mono mt-0.5">
            Trail Intelligence
          </span>
        </div>
      )}
    </div>
  );
};