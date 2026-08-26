import React from 'react';

interface MallusLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  animate?: boolean;
  blackBackground?: boolean;
}

export const MallusLogo: React.FC<MallusLogoProps> = ({
  className = '',
  size = 48,
  showText = true,
  animate = false,
  blackBackground = false
}) => {
  return (
    <div 
      className={`inline-flex items-center justify-center relative select-none shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 500 500"
        width="100%"
        height="100%"
        className={`w-full h-full ${animate ? 'transition-transform duration-300 hover:scale-105' : ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Smooth Rainbow Gradient for Top Arc */}
          <linearGradient id="rainbowTopRingComp" x1="0%" y1="60%" x2="100%" y2="60%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="10%" stopColor="#2563EB" />
            <stop offset="25%" stopColor="#0284C7" />
            <stop offset="40%" stopColor="#10B981" />
            <stop offset="55%" stopColor="#84CC16" />
            <stop offset="70%" stopColor="#FACC15" />
            <stop offset="85%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>

          {/* Lion Fiery Mane Gradient */}
          <linearGradient id="lionManeGradComp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="20%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#FB923C" />
            <stop offset="80%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>

          {/* Jerusalem Text Gradient */}
          <linearGradient id="jerusalemTextGradComp" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="25%" stopColor="#0EA5E9" />
            <stop offset="55%" stopColor="#6366F1" />
            <stop offset="80%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          {/* Mallus Text Gradient */}
          <linearGradient id="mallusTextGradComp" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="22%" stopColor="#38BDF8" />
            <stop offset="45%" stopColor="#3B82F6" />
            <stop offset="70%" stopColor="#8B5CF6" />
            <stop offset="88%" stopColor="#D946EF" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>

          <filter id="subtleLionGlowComp" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="2.5" floodOpacity="0.2" floodColor="#F97316" />
          </filter>

          <radialGradient id="darkBgDiscComp" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#15120E" />
            <stop offset="85%" stopColor="#0B0907" />
            <stop offset="100%" stopColor="#040302" />
          </radialGradient>
        </defs>

        {/* Optional High-Contrast Pitch Black Background Disc */}
        {blackBackground && (
          <>
            <circle
              cx="250"
              cy="250"
              r="242"
              fill="url(#darkBgDiscComp)"
            />
            <circle
              cx="250"
              cy="250"
              r="241"
              stroke="#D4AF37"
              strokeWidth="2.5"
              strokeOpacity="0.35"
            />
          </>
        )}

        {/* 1. Top Rainbow Arc (9 o'clock around the top to 4:30 o'clock) */}
        <path
          d="M 68 250 A 185 185 0 1 1 430 270"
          stroke="url(#rainbowTopRingComp)"
          strokeWidth="13"
          strokeLinecap="round"
        />

        {/* 2. Bottom Brush Stroke Arc with distressed/tapered strokes matching the artwork */}
        <path
          d="M 432 278 A 185 185 0 0 1 76 270"
          stroke={blackBackground ? '#E2E8F0' : '#0F172A'}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray="85 14 42 16 70 12 50 18 35 15"
          opacity={blackBackground ? 0.9 : 0.95}
        />
        <path
          d="M 140 422 A 185 185 0 0 1 84 315"
          stroke={blackBackground ? '#94A3B8' : '#1E293B'}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="30 15 20"
          opacity={0.8}
        />
        <path
          d="M 370 380 A 185 185 0 0 1 200 442"
          stroke={blackBackground ? '#CBD5E1' : '#0F172A'}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray="25 18 40"
          opacity={0.85}
        />

        {/* Center Lion Profile Artwork */}
        <g 
          id="lion-art" 
          transform={showText ? "translate(18, 5)" : "translate(6, 15) scale(1.15)"}
          filter="url(#subtleLionGlowComp)"
        >
          {/* Main Lion Flame Mane */}
          <path
            d="M 215 132
               C 224 130, 246 135, 258 140
               C 276 128, 298 133, 310 142
               C 316 156, 304 168, 292 174
               C 306 172, 322 178, 326 188
               C 316 200, 296 200, 282 198
               C 292 208, 298 222, 290 234
               C 278 232, 268 226, 260 218
               C 256 236, 242 252, 222 260
               C 216 244, 218 232, 212 220
               C 202 238, 186 254, 162 262
               C 158 248, 164 234, 172 222
               C 152 230, 138 230, 130 220
               C 138 208, 150 204, 158 198
               C 142 196, 134 188, 134 178
               C 148 174, 164 178, 172 170
               C 158 162, 152 152, 158 142
               C 172 144, 182 152, 192 158
               C 190 144, 198 134, 215 132 Z"
            fill="url(#lionManeGradComp)"
          />

          {/* Lion Face / Snout / Profile Details */}
          <path
            d="M 252 154
               C 268 154, 290 165, 300 176
               C 308 181, 320 186, 328 192
               C 324 198, 314 199, 306 197
               C 316 205, 322 214, 316 220
               C 308 218, 300 211, 294 206
               C 294 216, 286 224, 278 224
               C 272 216, 270 206, 264 198
               C 256 190, 246 182, 252 154 Z"
            fill="#FFFBEB"
          />

          {/* Eye, Nose and Mouth Details */}
          <path
            d="M 258 172 C 263 170, 268 172, 271 177 C 266 178, 261 177, 258 172 Z"
            fill="#1E293B"
          />
          <path
            d="M 310 192 C 313 194, 316 197, 313 200 C 309 198, 308 196, 310 192 Z"
            fill="#1E293B"
          />
          <path
            d="M 292 216 C 299 218, 304 224, 299 229 C 291 228, 286 222, 292 216 Z"
            fill="#EA580C"
          />
        </g>

        {/* Integrated Brand Typography */}
        {showText && (
          <g id="brand-typography">
            {/* JERUSALEM Top Subheading */}
            <text
              x="250"
              y="306"
              textAnchor="middle"
              fill="url(#jerusalemTextGradComp)"
              style={{
                fontFamily: "'Syne', 'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: 800,
                fontSize: '34px',
                letterSpacing: '5px'
              }}
            >
              JERUSALEM
            </text>

            {/* MALLUS Main Brand Name */}
            <text
              x="250"
              y="370"
              textAnchor="middle"
              fill="url(#mallusTextGradComp)"
              style={{
                fontFamily: "'Syne', 'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: 900,
                fontSize: '58px',
                letterSpacing: '6px'
              }}
            >
              MALLUS
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
