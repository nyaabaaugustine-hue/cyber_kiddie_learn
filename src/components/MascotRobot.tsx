'use client'

export function MascotRobot() {
  return (
    <div className="relative animate-robotFloat">
      {/* Glow behind robot */}
      <div className="absolute inset-0 -m-6 bg-[radial-gradient(ellipse_at_center,_#3b82f620,_transparent)] animate-glow" />

      <svg width="120" height="140" viewBox="0 0 120 140" className="drop-shadow-2xl">
        <defs>
          <linearGradient id="robotBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="visorGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <radialGradient id="starGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
          <filter id="robotShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#1e40af" floodOpacity="0.3" />
          </filter>
          <filter id="starGlowFilter">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#robotShadow)">
          {/* Antenna */}
          <line x1="60" y1="20" x2="60" y2="8" stroke="#94a3b8" strokeWidth="2.5" />
          <circle cx="60" cy="6" r="4" fill="#fbbf24" className="animate-glow" />

          {/* Head / Helmet */}
          <ellipse cx="60" cy="32" rx="26" ry="24" fill="url(#robotBody)" />
          <ellipse cx="60" cy="32" rx="22" ry="20" fill="#0f172a" />
          {/* Visor shine */}
          <ellipse cx="54" cy="28" rx="8" ry="6" fill="#1e3a5f" opacity="0.6" />

          {/* Eyes */}
          <ellipse cx="50" cy="30" rx="6" ry="7" fill="#60a5fa" />
          <ellipse cx="70" cy="30" rx="6" ry="7" fill="#60a5fa" />
          {/* Pupils */}
          <ellipse cx="52" cy="30" rx="3" ry="3.5" fill="white" />
          <ellipse cx="72" cy="30" rx="3" ry="3.5" fill="white" />
          {/* Eye highlights */}
          <circle cx="53" cy="28" r="1.5" fill="white" opacity="0.8" />
          <circle cx="73" cy="28" r="1.5" fill="white" opacity="0.8" />

          {/* Smile */}
          <path d="M50,40 Q60,48 70,40" stroke="#60a5fa" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Helmet rim */}
          <ellipse cx="60" cy="32" rx="26" ry="24" fill="none" stroke="#e2e8f0" strokeWidth="2" />

          {/* Neck */}
          <rect x="52" y="54" width="16" height="8" rx="4" fill="#94a3b8" />

          {/* Body */}
          <rect x="35" y="60" width="50" height="40" rx="12" fill="url(#robotBody)" />
          {/* Body detail */}
          <rect x="42" y="68" width="36" height="24" rx="8" fill="#0f172a" />
          {/* Chest light */}
          <circle cx="60" cy="80" r="5" fill="#3b82f6" opacity="0.8" className="animate-glow" />
          <circle cx="60" cy="80" r="3" fill="#60a5fa" />

          {/* Left arm */}
          <rect x="18" y="65" width="14" height="30" rx="7" fill="url(#robotBody)" />
          <circle cx="25" cy="98" r="7" fill="#cbd5e1" />

          {/* Right arm - holding star */}
          <rect x="88" y="60" width="14" height="28" rx="7" fill="url(#robotBody)" />
          <circle cx="95" cy="91" r="7" fill="#cbd5e1" />

          {/* Star in right hand */}
          <g filter="url(#starGlowFilter)" className="animate-glow">
            <polygon
              points="95,72 98,80 107,80 100,86 103,94 95,89 87,94 90,86 83,80 92,80"
              fill="url(#starGlow)"
            />
          </g>

          {/* Legs */}
          <rect x="40" y="100" width="12" height="20" rx="6" fill="#94a3b8" />
          <rect x="68" y="100" width="12" height="20" rx="6" fill="#94a3b8" />
          {/* Feet */}
          <ellipse cx="46" cy="124" rx="10" ry="5" fill="#cbd5e1" />
          <ellipse cx="74" cy="124" rx="10" ry="5" fill="#cbd5e1" />

          {/* Blue accent lines on body */}
          <line x1="38" y1="72" x2="38" y2="88" stroke="#3b82f6" strokeWidth="1.5" opacity="0.5" />
          <line x1="82" y1="72" x2="82" y2="88" stroke="#3b82f6" strokeWidth="1.5" opacity="0.5" />
        </g>
      </svg>
    </div>
  )
}
