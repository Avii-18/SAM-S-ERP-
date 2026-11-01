import React from 'react';

interface DubaiSkylineProps {
  className?: string;
  color?: string;
}

export const DubaiSkylineIllustration: React.FC<DubaiSkylineProps> = ({
  className = 'h-16 w-auto',
  color = '#d4af37',
}) => {
  return (
    <svg
      viewBox="0 0 540 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient id="goldSkylineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#dfa86c" stopOpacity="0.4" />
          <stop offset="40%" stopColor="#d4af37" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#dfa86c" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Ground baseline */}
      <line x1="0" y1="116" x2="540" y2="116" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />

      {/* Building 1: Low-rise modern stepped block */}
      <path d="M10 116V85H24V92H36V75H50V116" stroke={color} strokeWidth="1.2" strokeOpacity="0.75" />
      <line x1="16" y1="90" x2="16" y2="112" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="30" y1="96" x2="30" y2="112" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="42" y1="80" x2="42" y2="112" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />

      {/* Building 2: Slanted Roof Commercial Tower */}
      <path d="M55 116V55L75 42V116" stroke={color} strokeWidth="1.2" strokeOpacity="0.85" />
      <line x1="62" y1="62" x2="62" y2="112" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="68" y1="58" x2="68" y2="112" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />

      {/* Building 3: Twin triangular spire tower */}
      <path d="M80 116V60L92 35L104 60V116" stroke={color} strokeWidth="1.2" strokeOpacity="0.8" />
      <line x1="92" y1="35" x2="92" y2="116" stroke={color} strokeWidth="1" strokeOpacity="0.6" />

      {/* Building 4: Dubai Frame tribute / Gateway */}
      <rect x="110" y="45" width="28" height="71" stroke={color} strokeWidth="1.2" strokeOpacity="0.75" />
      <rect x="116" y="55" width="16" height="52" stroke={color} strokeWidth="1" strokeOpacity="0.5" />

      {/* Building 5: Stepped High-Rise with Spire */}
      <path d="M144 116V50H152V38H160V25L164 12L168 25V38H176V50H184V116" stroke={color} strokeWidth="1.3" strokeOpacity="0.9" />
      <line x1="164" y1="12" x2="164" y2="116" stroke={color} strokeWidth="1" strokeOpacity="0.7" />
      <line x1="152" y1="58" x2="176" y2="58" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="152" y1="74" x2="176" y2="74" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="152" y1="90" x2="176" y2="90" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />

      {/* Building 6: Curved Sail Tower (Burj Al Arab silhouette) */}
      <path d="M190 116V40C202 46 215 58 222 78C227 90 228 104 228 116" stroke={color} strokeWidth="1.3" strokeOpacity="0.85" />
      <line x1="190" y1="40" x2="228" y2="116" stroke={color} strokeWidth="0.9" strokeOpacity="0.4" />
      <path d="M184 62H202" stroke={color} strokeWidth="1" strokeOpacity="0.7" />

      {/* Building 7: Crowned Skyscraper */}
      <path d="M232 116V30L242 22L252 30V116" stroke={color} strokeWidth="1.2" strokeOpacity="0.8" />
      <line x1="237" y1="36" x2="237" y2="112" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="247" y1="36" x2="247" y2="112" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />

      {/* Building 8: Iconic Burj Khalifa Centerpiece */}
      <path
        d="M260 116V68H264V54H268V38H272V24H275V4L277 4V24H280V38H284V54H288V68H292V116"
        stroke={color}
        strokeWidth="1.6"
        strokeOpacity="1"
      />
      <line x1="276" y1="0" x2="276" y2="116" stroke={color} strokeWidth="1.2" strokeOpacity="0.85" />
      <circle cx="276" cy="3" r="1.5" fill={color} />

      {/* Building 9: High-tech Facet Tower */}
      <path d="M298 116V48L312 32L326 48V116" stroke={color} strokeWidth="1.2" strokeOpacity="0.8" />
      <line x1="312" y1="32" x2="312" y2="116" stroke={color} strokeWidth="0.9" strokeOpacity="0.6" />
      <line x1="302" y1="65" x2="322" y2="65" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="302" y1="85" x2="322" y2="85" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />

      {/* Building 10: Slanted Diagonal Twist High-Rise */}
      <path d="M332 116V42L348 28V116" stroke={color} strokeWidth="1.2" strokeOpacity="0.85" />
      <path d="M348 28L360 40V116" stroke={color} strokeWidth="1.2" strokeOpacity="0.85" />
      <line x1="338" y1="52" x2="348" y2="112" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />

      {/* Building 11: Stepped Modern Financial Center */}
      <path d="M366 116V55H376V42H388V30H398V42H410V55H420V116" stroke={color} strokeWidth="1.3" strokeOpacity="0.85" />
      <line x1="393" y1="18" x2="393" y2="30" stroke={color} strokeWidth="1.2" strokeOpacity="0.9" />

      {/* Building 12: Construction Crane */}
      <path d="M428 116V45H460" stroke={color} strokeWidth="1.2" strokeOpacity="0.75" />
      <line x1="428" y1="45" x2="442" y2="28" stroke={color} strokeWidth="1" strokeOpacity="0.7" />
      <line x1="442" y1="28" x2="458" y2="45" stroke={color} strokeWidth="1" strokeOpacity="0.7" />
      <line x1="452" y1="45" x2="452" y2="70" stroke={color} strokeWidth="0.8" strokeOpacity="0.5" />
      <rect x="449" y="70" width="6" height="5" stroke={color} strokeWidth="0.8" fill={color} fillOpacity="0.3" />

      {/* Building 13: Marina Bay Skyline Edge */}
      <path d="M466 116V65L478 52L490 65V116" stroke={color} strokeWidth="1.1" strokeOpacity="0.7" />
      <path d="M496 116V75H510V60H524V116" stroke={color} strokeWidth="1.1" strokeOpacity="0.6" />
      <line x1="532" y1="88" x2="540" y2="88" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  );
};
