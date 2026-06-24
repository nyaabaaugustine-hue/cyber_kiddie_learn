'use client'

import { useEffect } from 'react'
import { SUBJECTS, SUBJECT_KEYS } from '@/lib/data'
import { AppState } from '@/lib/types'
import { HeroBackground } from '@/components/HeroBackground'
import { MascotRobot } from '@/components/MascotRobot'
import { FeatureBar } from '@/components/FeatureBar'

interface WelcomeScreenProps {
  state: AppState
  loaded: boolean
  onStart: () => void
  onSelectSubject: (subject: string) => void
  updateStreak: () => void
  onParents: () => void
}

const SUBJECT_CARDS: Record<string, { gradient: string; shadow: string }> = {
  Space: { gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/40' },
  Animals: { gradient: 'from-emerald-500 to-green-600', shadow: 'shadow-emerald-500/40' },
  Dinosaurs: { gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/40' },
  Science: { gradient: 'from-violet-500 to-indigo-600', shadow: 'shadow-violet-500/40' },
  Ocean: { gradient: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/40' },
  Robots: { gradient: 'from-orange-500 to-red-500', shadow: 'shadow-orange-500/40' },
  Maths: { gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/40' },
  English: { gradient: 'from-rose-400 to-pink-500', shadow: 'shadow-rose-400/40' },
  Programming: { gradient: 'from-teal-400 to-cyan-500', shadow: 'shadow-teal-400/40' },
}

export function WelcomeScreen({ state, loaded, onStart, onSelectSubject, updateStreak, onParents }: WelcomeScreenProps) {
  useEffect(() => {
    if (loaded) updateStreak()
  }, [loaded, updateStreak])

  const streakText =
    state.streak > 1
      ? `${state.streak}-day learning streak!`
      : state.streak === 1
        ? 'Start your streak today!'
        : 'Start your streak today!'

  const totalCompleted = Object.keys(state.completed).length

  return (
    <HeroBackground>
      <div className="flex flex-col min-h-dvh px-4 pt-6 pb-8 overflow-y-auto">
        {/* Top bar - settings */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {state.childName && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-3 py-1.5">
                <span className="text-lg">{state.childAvatar}</span>
                <span className="text-xs font-bold text-white">{state.childName}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-3 py-1.5">
              <span className="text-sm">⭐</span>
              <span className="text-xs font-extrabold text-amber-300 tabular-nums">{state.stars}</span>
            </div>
            <button
              onClick={onParents}
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </button>
          </div>
        </div>

        {/* Mascot */}
        <div className="flex justify-center -mb-4 mt-2">
          <MascotRobot />
        </div>

        {/* Logo */}
        <div className="text-center mb-5">
          <h1 className="leading-none">
            <span className="block text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-500 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]">
              Kids
            </span>
            <span className="block text-4xl md:text-5xl font-black text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
              Explorer
            </span>
            <span className="block text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]">
              AI
            </span>
          </h1>
        </div>

        {/* Greeting */}
        <div className="text-center mb-5">
          <p className="text-white/80 text-sm font-medium">
            Hi <span className="font-extrabold text-white">{state.childName || 'Explorer'}</span>! {streakText}
          </p>
        </div>

        {/* Subject cards - 2 rows of 3 */}
        <div className="w-full max-w-md mx-auto mb-5">
          <div className="grid grid-cols-3 gap-2.5">
            {SUBJECT_KEYS.map((key) => {
              const s = SUBJECTS[key]
              const style = SUBJECT_CARDS[key]
              const done = state.completed[key]
              return (
                <button
                  key={key}
                  onClick={() => onSelectSubject(key)}
                  className={`relative flex flex-col items-center gap-1.5 py-4 px-2 rounded-2xl bg-gradient-to-br ${style.gradient} text-white shadow-xl ${style.shadow} active:scale-95 transition-all duration-200 overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
                  {done && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                  <span className="text-3xl drop-shadow-lg select-none">{s.emoji}</span>
                  <span className="text-[11px] font-extrabold drop-shadow-sm leading-tight">{s.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Feature bar */}
        <FeatureBar />

        {/* Progress + Streak */}
        <div className="w-full max-w-md mx-auto mt-5">
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-3 py-2.5">
              <span className="text-lg">🔥</span>
              <div>
                <p className="text-[10px] text-white/50 font-medium">Streak</p>
                <p className="text-xs font-extrabold text-white">{state.streak} day{state.streak !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-3 py-2.5">
              <span className="text-lg">🎯</span>
              <div>
                <p className="text-[10px] text-white/50 font-medium">Completed</p>
                <p className="text-xs font-extrabold text-white">{totalCompleted} / {SUBJECT_KEYS.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-6 animate-bounce">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>
    </HeroBackground>
  )
}
