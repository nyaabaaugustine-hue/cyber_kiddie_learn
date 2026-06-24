'use client'

import { SUBJECTS, SUBJECT_KEYS } from '@/lib/data'

interface TopicSelectionProps {
  completed: Record<string, boolean>
  onSelect: (subject: string) => void
}

const CARD_STYLES: Record<string, { gradient: string; shadow: string }> = {
  Space: { gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/25' },
  Animals: { gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/25' },
  Dinosaurs: { gradient: 'from-orange-500 to-red-500', shadow: 'shadow-orange-500/25' },
  Science: { gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/25' },
  Ocean: { gradient: 'from-cyan-500 to-teal-600', shadow: 'shadow-cyan-500/25' },
  Robots: { gradient: 'from-pink-500 to-rose-600', shadow: 'shadow-pink-500/25' },
  Maths: { gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/25' },
  English: { gradient: 'from-indigo-500 to-violet-600', shadow: 'shadow-indigo-500/25' },
  Programming: { gradient: 'from-emerald-500 to-green-600', shadow: 'shadow-emerald-500/25' },
}

export function TopicSelection({ completed, onSelect }: TopicSelectionProps) {
  return (
    <div className="animate-fadeUp">
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Pick a Topic</h2>
        <p className="text-slate-500 text-sm md:text-base mt-1">Choose what you want to learn about!</p>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-5 stagger">
        {SUBJECT_KEYS.map((key) => {
          const s = SUBJECTS[key]
          const style = CARD_STYLES[key]
          const done = completed[key]

          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`topic-card relative group flex flex-col items-center gap-2 md:gap-3 py-5 px-3 md:py-8 md:px-5 rounded-3xl border-2 border-white/80 bg-gradient-to-br ${style.gradient} text-white shadow-xl ${style.shadow} hover:shadow-2xl active:scale-95 transition-all duration-200 overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />

              {done && (
                <div className="absolute top-2 right-2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/90 flex items-center justify-center animate-popIn">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}

              <span className="text-3xl md:text-5xl drop-shadow-lg select-none group-hover:scale-110 transition-transform duration-200">
                {s.emoji}
              </span>
              <span className="text-xs md:text-sm font-extrabold drop-shadow-sm leading-tight">{s.label}</span>
              <span className="text-[9px] md:text-xs font-semibold opacity-80">
                {done ? '✅ Done' : 'Tap to explore'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
