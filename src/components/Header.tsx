'use client'

import { Screen } from '@/lib/types'
import { useScreenSize } from '@/lib/useScreenSize'

interface HeaderProps {
  screen: Screen
  selectedSubject: string | null
  stars: number
  childName: string
  childAvatar: string
  onHome: () => void
  onExplore: () => void
  onParents: () => void
}

const SUBJECT_EMOJIS: Record<string, string> = {
  Space: '🚀',
  Animals: '🦁',
  Dinosaurs: '🦕',
  Science: '🧪',
  Ocean: '🐋',
  Robots: '🤖',
  Maths: '🔢',
  English: '📖',
  Programming: '💻',
}

export function Header({ screen, selectedSubject, stars, childName, childAvatar, onHome, onExplore, onParents }: HeaderProps) {
  const { isDesktop } = useScreenSize()

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-100/60">
      <div className="flex items-center justify-between px-5 md:px-8 py-3">
        <button onClick={onHome} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-shadow">
            <img src="/logo.png" alt="KidLearner" className="w-full h-full object-cover" />
          </div>
          <span className="text-[15px] font-extrabold tracking-tight text-slate-800">
            KidLearner
          </span>
        </button>

        {/* Desktop nav */}
        {isDesktop && (
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: 'Home', action: onHome, active: screen === 'welcome' },
              { label: 'Explore', action: onExplore, active: screen === 'selection' || screen === 'learning' },
              { label: 'Parents', action: onParents, active: false },
            ].map(({ label, action, active }) => (
              <button
                key={label}
                onClick={action}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  active
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {screen !== 'welcome' && selectedSubject && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-full px-3 py-1.5 text-sm font-bold text-slate-600 animate-scaleIn">
              <span>{SUBJECT_EMOJIS[selectedSubject]}</span>
              <span className="hidden sm:inline">{selectedSubject}</span>
            </div>
          )}
          {childName && (
            <div className="hidden sm:flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1.5">
              <span className="text-sm">{childAvatar}</span>
              <span className="text-xs font-bold text-indigo-700">{childName}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
            <span className="text-sm">⭐</span>
            <span className="text-sm font-extrabold text-amber-700 tabular-nums">{stars}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
