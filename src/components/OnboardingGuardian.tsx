'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface OnboardingGuardianProps {
  onComplete: () => void
}

export function OnboardingGuardian({ onComplete }: OnboardingGuardianProps) {
  const [step, setStep] = useState(0)
  const [pin, setPin] = useState('')
  const [pinConfirm, setPinConfirm] = useState('')
  const [childName, setChildName] = useState('')
  const [error, setError] = useState('')
  const [pinError, setPinError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (step === 1) setTimeout(() => inputRef.current?.focus(), 300)
    if (step === 2) setTimeout(() => nameRef.current?.focus(), 300)
  }, [step])

  const handlePinEntry = useCallback((value: string) => {
    setPin(value)
    setPinError(false)
    if (value.length === 4) {
      if (value === '1234') {
        setPinConfirm(value)
        setStep(2)
      } else {
        setPinConfirm(value)
        setStep(2)
      }
    }
  }, [])

  const handlePinConfirm = useCallback((value: string) => {
    setPinConfirm(value)
    setPinError(false)
    if (value.length === 4) {
      if (value === pin) {
        setStep(2)
      } else {
        setPinError(true)
        setTimeout(() => {
          setPinConfirm('')
          setPinError(false)
        }, 1000)
      }
    }
  }, [pin])

  const handleNameSubmit = useCallback(() => {
    if (!childName.trim()) {
      setError('Please enter a name')
      return
    }
    onComplete()
  }, [childName, onComplete])

  // Step 0: Welcome
  if (step === 0) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 animate-fadeUp">
        <div className="w-24 h-24 rounded-full overflow-hidden shadow-2xl shadow-indigo-200/40 mb-8">
          <img src="/logo.png" alt="KidLearner" className="w-full h-full object-cover" />
        </div>

        <h1 className="text-3xl font-black tracking-tight text-slate-900 text-center mb-3">
          Welcome to <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">KidLearner</span>
        </h1>
        <p className="text-slate-500 text-center text-[15px] leading-relaxed max-w-[300px] mb-10">
          A fun, safe learning adventure for your child. Let&apos;s set things up!
        </p>

        <div className="w-full max-w-sm space-y-3">
          {[
            { emoji: '🔒', text: 'Set a PIN to protect parent settings' },
            { emoji: '👤', text: 'Enter your child\'s name' },
            { emoji: '🎨', text: 'Let your child pick their avatar' },
          ].map(({ emoji, text }, i) => (
            <div key={i} className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-4 py-3.5">
              <span className="text-lg">{emoji}</span>
              <span className="text-sm font-medium text-slate-600">{text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setStep(1)}
          className="mt-10 w-full max-w-sm py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-lg shadow-xl shadow-indigo-500/30 active:scale-95 transition-all"
        >
          Get Started
        </button>
      </div>
    )
  }

  // Step 1: Set PIN
  if (step === 1) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 animate-fadeUp">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>

        <h2 className="text-2xl font-black text-slate-900 text-center mb-2">Set Your PIN</h2>
        <p className="text-slate-500 text-sm text-center mb-8">Choose a 4-digit PIN to protect parent settings</p>

        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) => handlePinEntry(e.target.value)}
          placeholder="••••"
          className={`w-full max-w-[240px] text-center text-3xl font-black tracking-[0.5em] py-5 rounded-2xl border-2 outline-none transition-colors ${
            pinError ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-indigo-400'
          }`}
        />

        <p className="text-xs text-slate-400 mt-3">Default PIN: 1234</p>

        <button
          onClick={onComplete}
          className="mt-6 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
        >
          Skip for now
        </button>
      </div>
    )
  }

  // Step 2: Enter child's name
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 animate-fadeUp">
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 via-violet-50 to-amber-50 flex items-center justify-center shadow-xl animate-float">
          <span className="text-4xl select-none">👦</span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg animate-popIn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      </div>

      <h2 className="text-2xl font-black text-slate-900 text-center mb-2">What&apos;s your name?</h2>
      <p className="text-slate-500 text-sm text-center mb-8">Your child will see this in the app</p>

      <input
        ref={nameRef}
        type="text"
        value={childName}
        onChange={(e) => { setChildName(e.target.value); setError('') }}
        onKeyDown={(e) => { if (e.key === 'Enter') handleNameSubmit() }}
        placeholder="Type your name..."
        maxLength={20}
        className={`w-full max-w-[280px] text-center text-xl font-bold py-4 px-6 rounded-2xl border-2 outline-none transition-colors ${
          error ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-indigo-400'
        }`}
      />
      {error && <p className="text-xs text-red-500 font-bold mt-2">{error}</p>}

      <button
        onClick={handleNameSubmit}
        className="mt-8 w-full max-w-[280px] py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-lg shadow-xl shadow-indigo-500/30 active:scale-95 transition-all"
      >
        Continue →
      </button>
    </div>
  )
}
