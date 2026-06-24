'use client'

import { useState, useCallback } from 'react'

interface OnboardingChildProps {
  childName: string
  onComplete: (avatar: string) => void
}

const AVATARS = [
  { emoji: '🚀', label: 'Explorer' },
  { emoji: '🦁', label: 'Brave' },
  { emoji: '🦕', label: 'Adventurer' },
  { emoji: '🧪', label: 'Scientist' },
  { emoji: '🐋', label: 'Ocean' },
  { emoji: '🤖', label: 'Robotic' },
  { emoji: '🔢', label: 'Numbers' },
  { emoji: '📖', label: 'Reader' },
  { emoji: '💻', label: 'Coder' },
]

export function OnboardingChild({ childName, onComplete }: OnboardingChildProps) {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)

  const handlePick = useCallback((emoji: string) => {
    setSelected(emoji)
  }, [])

  const handleConfirm = useCallback(() => {
    if (selected) {
      setStep(1)
    }
  }, [selected])

  // Step 0: Avatar picker
  if (step === 0) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 animate-fadeUp">
        <h1 className="text-3xl font-black text-slate-900 text-center mb-2">
          Hi <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{childName || 'Explorer'}</span>!
        </h1>
        <p className="text-slate-500 text-sm text-center mb-8">Pick your avatar!</p>

        <div className="grid grid-cols-3 gap-3 w-full max-w-[320px]">
          {AVATARS.map(({ emoji, label }) => (
            <button
              key={emoji}
              onClick={() => handlePick(emoji)}
              className={`flex flex-col items-center gap-2 py-5 rounded-3xl border-2 transition-all duration-200 ${
                selected === emoji
                  ? 'bg-indigo-50 border-indigo-400 shadow-lg shadow-indigo-200/40 scale-105'
                  : 'bg-white border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50'
              }`}
            >
              <span className="text-4xl select-none">{emoji}</span>
              <span className="text-[10px] font-bold text-slate-500">{label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selected}
          className="mt-8 w-full max-w-[280px] py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-lg shadow-xl shadow-indigo-500/30 disabled:opacity-40 active:scale-95 transition-all"
        >
          That&apos;s Me! →
        </button>
      </div>
    )
  }

  // Step 1: Celebration + ready to go
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 animate-scaleIn">
      {/* Floating emoji celebration */}
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 via-violet-50 to-amber-50 flex items-center justify-center shadow-2xl shadow-indigo-200/40 animate-float">
          <span className="text-6xl select-none animate-popIn">{selected}</span>
        </div>
        {/* Sparkle particles */}
        <span className="absolute -top-4 left-4 text-2xl animate-popIn" style={{ animationDelay: '200ms' }}>✨</span>
        <span className="absolute top-2 -right-4 text-xl animate-popIn" style={{ animationDelay: '400ms' }}>⭐</span>
        <span className="absolute -bottom-2 left-0 text-lg animate-popIn" style={{ animationDelay: '600ms' }}>🎉</span>
        <span className="absolute bottom-0 -right-2 text-xl animate-popIn" style={{ animationDelay: '300ms' }}>🌟</span>
      </div>

      <h1 className="text-3xl font-black text-slate-900 text-center mb-2 animate-popIn" style={{ animationDelay: '300ms' }}>
        You&apos;re all set, {childName || 'Explorer'}!
      </h1>
      <p className="text-slate-500 text-sm text-center mb-10 max-w-[260px] animate-fadeIn" style={{ animationDelay: '500ms' }}>
        Ready to discover amazing things? Let&apos;s go!
      </p>

      <button
        onClick={() => onComplete(selected || '🚀')}
        className="group flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-lg px-10 py-4 rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-95 transition-all duration-200 animate-popIn"
        style={{ animationDelay: '700ms' }}
      >
        Let&apos;s Learn!
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </button>
    </div>
  )
}
