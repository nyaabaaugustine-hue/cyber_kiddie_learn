'use client'

export function HeroBackground({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative w-full min-h-dvh overflow-hidden bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#1a2a5a]">
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Galaxy swirl - top left */}
      <div className="absolute top-8 left-[10%] w-32 h-32 opacity-30 animate-drift" style={{ animationDuration: '20s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <radialGradient id="galaxy" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <ellipse cx="50" cy="50" rx="40" ry="20" fill="url(#galaxy)" transform="rotate(-30 50 50)" />
          <ellipse cx="50" cy="50" rx="30" ry="12" fill="url(#galaxy)" transform="rotate(20 50 50)" />
        </svg>
      </div>

      {/* Saturn - top right */}
      <div className="absolute top-12 right-[15%] animate-drift" style={{ animationDuration: '25s' }}>
        <svg width="70" height="50" viewBox="0 0 70 50">
          <defs>
            <radialGradient id="saturnBody" cx="50%" cy="40%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>
          </defs>
          <ellipse cx="35" cy="30" rx="30" ry="18" fill="none" stroke="#fbbf2460" strokeWidth="3" transform="rotate(-15 35 30)" />
          <circle cx="35" cy="28" r="12" fill="url(#saturnBody)" />
          <ellipse cx="35" cy="30" rx="28" ry="8" fill="none" stroke="#fbbf2450" strokeWidth="2.5" transform="rotate(-15 35 30)" />
        </svg>
      </div>

      {/* Small planet - top center */}
      <div className="absolute top-20 left-[45%] animate-drift" style={{ animationDuration: '18s' }}>
        <svg width="24" height="24" viewBox="0 0 24 24">
          <defs>
            <radialGradient id="planet1" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#9333ea" />
            </radialGradient>
          </defs>
          <circle cx="12" cy="12" r="10" fill="url(#planet1)" />
          <ellipse cx="12" cy="12" rx="9" ry="3" fill="none" stroke="#f472b640" strokeWidth="1.5" transform="rotate(-20 12 12)" />
        </svg>
      </div>

      {/* Satellite - top right area */}
      <div className="absolute top-16 right-[8%] opacity-60 animate-drift" style={{ animationDuration: '30s' }}>
        <svg width="30" height="20" viewBox="0 0 30 20" fill="white" opacity="0.7">
          <rect x="12" y="6" width="6" height="8" rx="1" />
          <rect x="2" y="8" width="10" height="4" rx="1" fill="#60a5fa" />
          <rect x="18" y="8" width="10" height="4" rx="1" fill="#60a5fa" />
          <line x1="15" y1="2" x2="15" y2="6" stroke="white" strokeWidth="1" />
          <circle cx="15" cy="2" r="1.5" fill="#fbbf24" />
        </svg>
      </div>

      {/* Constellation - right side */}
      <div className="absolute top-[15%] right-[20%] opacity-40">
        <svg width="80" height="60" viewBox="0 0 80 60">
          <circle cx="10" cy="10" r="2" fill="#93c5fd" />
          <circle cx="30" cy="5" r="2" fill="#93c5fd" />
          <circle cx="50" cy="15" r="2" fill="#93c5fd" />
          <circle cx="70" cy="8" r="2" fill="#93c5fd" />
          <circle cx="40" cy="40" r="2" fill="#93c5fd" />
          <line x1="10" y1="10" x2="30" y2="5" stroke="#93c5fd40" strokeWidth="0.5" />
          <line x1="30" y1="5" x2="50" y2="15" stroke="#93c5fd40" strokeWidth="0.5" />
          <line x1="50" y1="15" x2="70" y2="8" stroke="#93c5fd40" strokeWidth="0.5" />
          <line x1="50" y1="15" x2="40" y2="40" stroke="#93c5fd40" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Horizon glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#f59e0b10] to-[#f59e0b05]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-[radial-gradient(ellipse_at_center,_#f59e0b20,_transparent)]" />
      </div>

      {/* Mountain range silhouette */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1200 120" className="w-full" preserveAspectRatio="none">
          <path d="M0,120 L0,80 L75,60 L150,75 L250,40 L350,70 L450,35 L550,65 L650,30 L750,55 L850,25 L950,50 L1050,35 L1150,60 L1200,45 L1200,120 Z" fill="#0a162880" />
          <path d="M0,120 L0,90 L100,75 L200,85 L300,60 L400,80 L500,55 L600,75 L700,50 L800,70 L900,45 L1000,65 L1100,55 L1200,70 L1200,120 Z" fill="#0d1f3c60" />
        </svg>
      </div>

      {/* Volcano - left side */}
      <div className="absolute bottom-[15%] left-[2%] pointer-events-none">
        <svg width="100" height="90" viewBox="0 0 100 90">
          <defs>
            <linearGradient id="volcanoGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4a3728" />
              <stop offset="100%" stopColor="#2d1f15" />
            </linearGradient>
            <radialGradient id="lavaGlow" cx="50%" cy="0%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <polygon points="50,5 85,85 15,85" fill="url(#volcanoGrad)" />
          <polygon points="50,5 60,30 40,30" fill="#ef444480" />
          <circle cx="50" cy="10" r="15" fill="url(#lavaGlow)" />
          {/* Lava streaks */}
          <path d="M48,15 Q46,30 44,45" stroke="#f9731660" strokeWidth="2" fill="none" />
          <path d="M52,18 Q55,35 53,50" stroke="#ef444450" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {/* Dinosaur silhouette - left */}
      <div className="absolute bottom-[18%] left-[8%] pointer-events-none animate-dinoWalk">
        <svg width="80" height="70" viewBox="0 0 80 70">
          <defs>
            <linearGradient id="dinoGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
          </defs>
          {/* Body */}
          <ellipse cx="40" cy="40" rx="22" ry="16" fill="url(#dinoGrad)" />
          {/* Neck */}
          <path d="M55,35 Q65,20 60,10" stroke="url(#dinoGrad)" strokeWidth="8" fill="none" strokeLinecap="round" />
          {/* Head */}
          <circle cx="60" cy="10" r="8" fill="#22c55e" />
          <circle cx="63" cy="8" r="2" fill="#15803d" />
          {/* Eye */}
          <circle cx="64" cy="7" r="1.5" fill="white" />
          {/* Tail */}
          <path d="M18,40 Q8,35 5,42" stroke="url(#dinoGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
          {/* Legs */}
          <rect x="30" y="52" width="5" height="14" rx="2" fill="#15803d" />
          <rect x="45" y="52" width="5" height="14" rx="2" fill="#15803d" />
          {/* Back spikes */}
          <polygon points="45,25 48,20 42,25" fill="#15803d" />
          <polygon points="38,24 41,18 35,24" fill="#15803d" />
          <polygon points="31,26 34,21 28,26" fill="#15803d" />
        </svg>
      </div>

      {/* Pterodactyl - flying */}
      <div className="absolute top-[25%] left-[15%] pointer-events-none animate-pteroFly">
        <svg width="40" height="25" viewBox="0 0 40 25" fill="#f9731690">
          <path d="M20,12 Q10,2 2,8 L8,14 L2,18 Q15,15 20,12 Z" />
          <path d="M20,12 Q30,2 38,8 L32,14 L38,18 Q25,15 20,12 Z" />
          <circle cx="20" cy="10" r="2.5" fill="#ea580c" />
        </svg>
      </div>

      {/* Lion - left bottom */}
      <div className="absolute bottom-[12%] left-[18%] pointer-events-none">
        <svg width="50" height="45" viewBox="0 0 50 45">
          {/* Mane */}
          <circle cx="25" cy="18" r="14" fill="#d97706" />
          <circle cx="15" cy="14" r="8" fill="#b45309" />
          <circle cx="35" cy="14" r="8" fill="#b45309" />
          <circle cx="12" cy="22" r="7" fill="#b45309" />
          <circle cx="38" cy="22" r="7" fill="#b45309" />
          {/* Face */}
          <circle cx="25" cy="20" r="10" fill="#f59e0b" />
          {/* Eyes */}
          <circle cx="21" cy="18" r="2" fill="#1e1b4b" />
          <circle cx="29" cy="18" r="2" fill="#1e1b4b" />
          <circle cx="21.5" cy="17.5" r="0.8" fill="white" />
          <circle cx="29.5" cy="17.5" r="0.8" fill="white" />
          {/* Nose */}
          <ellipse cx="25" cy="22" rx="2.5" ry="2" fill="#92400e" />
          {/* Mouth */}
          <path d="M22,25 Q25,28 28,25" stroke="#92400e" strokeWidth="1" fill="none" />
          {/* Body */}
          <ellipse cx="25" cy="38" rx="10" ry="7" fill="#f59e0b" />
        </svg>
      </div>

      {/* Whale - right side */}
      <div className="absolute bottom-[10%] right-[2%] pointer-events-none animate-whaleFloat">
        <svg width="120" height="80" viewBox="0 0 120 80">
          <defs>
            <linearGradient id="whaleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
          {/* Body */}
          <ellipse cx="55" cy="45" rx="40" ry="25" fill="url(#whaleGrad)" />
          {/* Belly */}
          <ellipse cx="55" cy="52" rx="30" ry="14" fill="#93c5fd" opacity="0.4" />
          {/* Tail */}
          <path d="M15,45 Q5,35 2,25 Q10,35 15,38 Z" fill="#2563eb" />
          <path d="M15,45 Q5,55 2,65 Q10,55 15,52 Z" fill="#2563eb" />
          {/* Eye */}
          <circle cx="75" cy="38" r="4" fill="white" />
          <circle cx="76" cy="38" r="2.5" fill="#1e1b4b" />
          <circle cx="77" cy="37" r="1" fill="white" />
          {/* Smile */}
          <path d="M80,48 Q85,52 90,48" stroke="#1e3a8a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Fin */}
          <path d="M50,35 Q55,20 60,35" fill="#2563eb" />
          {/* Water splash */}
          <g className="animate-splash">
            <circle cx="60" cy="15" r="3" fill="#60a5fa" opacity="0.6" />
            <circle cx="55" cy="10" r="2" fill="#93c5fd" opacity="0.5" />
            <circle cx="65" cy="8" r="2.5" fill="#60a5fa" opacity="0.4" />
            <circle cx="58" cy="5" r="1.5" fill="#bfdbfe" opacity="0.6" />
            <circle cx="62" cy="3" r="2" fill="#93c5fd" opacity="0.3" />
          </g>
        </svg>
      </div>

      {/* Ocean waves - bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 480 40" className="w-full animate-waveMove" preserveAspectRatio="none">
          <path d="M0,20 Q60,5 120,20 Q180,35 240,20 Q300,5 360,20 Q420,35 480,20 L480,40 L0,40 Z" fill="#1e3a8a40" />
          <path d="M0,25 Q60,10 120,25 Q180,40 240,25 Q300,10 360,25 Q420,40 480,25 L480,40 L0,40 Z" fill="#1e3a8a30" />
        </svg>
      </div>

      {/* Palm tree - right */}
      <div className="absolute bottom-[18%] right-[12%] pointer-events-none">
        <svg width="40" height="70" viewBox="0 0 40 70">
          <rect x="17" y="30" width="6" height="40" rx="2" fill="#92400e" />
          <path d="M20,30 Q5,20 0,25" stroke="#16a34a" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M20,30 Q35,20 40,25" stroke="#16a34a" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M20,28 Q10,10 5,15" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M20,28 Q30,10 35,15" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M20,26 Q20,8 18,5" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* Small planet - center left */}
      <div className="absolute top-[40%] left-[5%] opacity-50 animate-drift" style={{ animationDuration: '22s' }}>
        <svg width="18" height="18" viewBox="0 0 18 18">
          <circle cx="9" cy="9" r="7" fill="#6366f1" />
          <circle cx="7" cy="7" r="2" fill="#818cf8" opacity="0.5" />
        </svg>
      </div>

      {/* Content overlay */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
