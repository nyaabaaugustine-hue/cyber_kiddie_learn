'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { QuizQuestion, TypeQuestion, ActivityType } from '@/lib/types'
import { useVoice } from '@/lib/useVoice'

interface QuizProps {
  questions: QuizQuestion[]
  typeChallenge: TypeQuestion[]
  subject: string
  addStar: (count?: number) => void
  incrementQuizzes: () => void
  onComplete: (allCorrect: boolean) => void
  recordQuizResult: (subject: string, correct: number, total: number) => void
  showToast: (msg: string) => void
  logActivity: (type: ActivityType, detail: string, meta?: string) => void
}

const TIMER_SECONDS = 20

function getGrade(accuracy: number, timeBonus: number): { grade: string; color: string; emoji: string } {
  const score = accuracy + timeBonus
  if (score >= 100) return { grade: 'S', color: 'text-amber-500', emoji: '👑' }
  if (score >= 85) return { grade: 'A', color: 'text-emerald-500', emoji: '🌟' }
  if (score >= 70) return { grade: 'B', color: 'text-blue-500', emoji: '💪' }
  if (score >= 50) return { grade: 'C', color: 'text-orange-500', emoji: '👍' }
  return { grade: 'D', color: 'text-slate-400', emoji: '📚' }
}

export function Quiz({ questions, typeChallenge, subject, addStar, incrementQuizzes, onComplete, recordQuizResult, showToast, logActivity }: QuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [allCorrect, setAllCorrect] = useState(true)
  const [finished, setFinished] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [showTimeWarning, setShowTimeWarning] = useState(false)
  const [streakCount, setStreakCount] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)

  // Type challenge state
  const [typePhase, setTypePhase] = useState(false)
  const [typeIdx, setTypeIdx] = useState(0)
  const [typeInput, setTypeInput] = useState('')
  const [typeResult, setTypeResult] = useState<'correct' | 'wrong' | null>(null)
  const [typeCorrectCount, setTypeCorrectCount] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const inputRef = useRef<HTMLInputElement>(null)
  const { speak } = useVoice()

  const question = questions[currentIdx]
  const isCorrect = selected === question.correct
  const answered = selected !== null

  useEffect(() => {
    startTimeRef.current = Date.now()
    logActivity('quiz_start', `Started ${subject} quiz`, subject)
  }, [])

  useEffect(() => {
    if (finished || answered || typePhase) return
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          setSelected(-1)
          setAllCorrect(false)
          setShowTimeWarning(false)
          return 0
        }
        if (prev <= 6) setShowTimeWarning(true)
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [currentIdx, finished, answered, typePhase])

  useEffect(() => {
    if (currentIdx === 0 && !typePhase) speak(`${subject} quiz! Question 1: ${question.q}`)
  }, [currentIdx, question.q, subject, speak, typePhase])

  useEffect(() => {
    if (typePhase && typeChallenge[typeIdx]) {
      speak(typeChallenge[typeIdx].q)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [typePhase, typeIdx, typeChallenge, speak])

  const handleSelect = useCallback(
    (idx: number) => {
      if (answered || idx < 0) return
      if (timerRef.current) clearInterval(timerRef.current)
      setSelected(idx)
      incrementQuizzes()

      const timeBonus = Math.round((timeLeft / TIMER_SECONDS) * 10)
      const correct = idx === question.correct
      if (correct) {
        const streakBonus = streakCount >= 2 ? 2 : 1
        addStar(streakBonus)
        setStreakCount((s) => s + 1)
        setCorrectCount((c) => c + 1)
        setTotalScore((s) => s + 10 + timeBonus + (streakCount >= 2 ? 5 : 0))
        if (streakCount >= 2) showToast(`🔥 Streak x${streakCount + 1}! +${streakBonus} stars!`)
        else showToast('⭐ +1 Star!')
        speak('Correct!')
      } else {
        setAllCorrect(false)
        setStreakCount(0)
        speak('Not quite!')
      }
    },
    [answered, question.correct, addStar, incrementQuizzes, showToast, timeLeft, streakCount, subject, speak]
  )

  const handleNext = useCallback(() => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1)
      setSelected(null)
      setTimeLeft(TIMER_SECONDS)
      setShowTimeWarning(false)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      recordQuizResult(subject, correctCount, questions.length)
      if (typeChallenge.length > 0) {
        setTypePhase(true)
        setTypeIdx(0)
        setTypeInput('')
        setTypeResult(null)
        setTypeCorrectCount(0)
        setShowHint(false)
      } else {
        finishQuiz(correctCount, questions.length)
      }
    }
  }, [currentIdx, questions.length, allCorrect, onComplete, correctCount, recordQuizResult, subject, typeChallenge])

  const finishQuiz = useCallback((mcCorrect: number, mcTotal: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000)
    setElapsedTime(elapsed)
    setCorrectCount(mcCorrect)
    setFinished(true)
    const accuracy = mcTotal > 0 ? Math.round((mcCorrect / mcTotal) * 100) : 0
    logActivity('quiz_complete', `Completed ${subject} quiz — ${mcCorrect}/${mcTotal} correct (${accuracy}%) in ${elapsed}s`, `${subject}:${mcCorrect}/${mcTotal}:${elapsed}s:${accuracy}%`)
    onComplete(allCorrect && mcCorrect === mcTotal)
  }, [allCorrect, onComplete, logActivity, subject])

  const handleTypeSubmit = useCallback(() => {
    const tc = typeChallenge[typeIdx]
    const userAnswer = typeInput.trim().toLowerCase()
    const accepted = (tc.acceptedAnswers || [tc.answer]).map((a) => a.toLowerCase())
    const correct = accepted.includes(userAnswer)

    setTypeResult(correct ? 'correct' : 'wrong')
    if (correct) {
      addStar(1)
      setTypeCorrectCount((c) => c + 1)
      showToast('⭐ Bonus star!')
      speak('Correct!')
    } else {
      speak(`The answer is ${tc.answer}`)
    }
  }, [typeIdx, typeInput, typeChallenge, addStar, showToast, speak])

  const handleTypeNext = useCallback(() => {
    if (typeIdx + 1 < typeChallenge.length) {
      setTypeIdx(typeIdx + 1)
      setTypeInput('')
      setTypeResult(null)
      setShowHint(false)
    } else {
      const totalCorrect = correctCount + typeCorrectCount + (typeResult === 'correct' ? 1 : 0)
      const totalQ = questions.length + typeChallenge.length
      finishQuiz(totalCorrect, totalQ)
    }
  }, [typeIdx, typeChallenge.length, correctCount, typeCorrectCount, typeResult, questions.length, finishQuiz])

  const handleRestart = useCallback(() => {
    setCurrentIdx(0)
    setSelected(null)
    setAllCorrect(true)
    setCorrectCount(0)
    setFinished(false)
    setStreakCount(0)
    setTotalScore(0)
    setTimeLeft(TIMER_SECONDS)
    setShowTimeWarning(false)
    setTypePhase(false)
    setTypeIdx(0)
    setTypeInput('')
    setTypeResult(null)
    setTypeCorrectCount(0)
    setShowHint(false)
    startTimeRef.current = Date.now()
  }, [])

  // Type challenge phase
  if (typePhase && !finished) {
    const tc = typeChallenge[typeIdx]
    return (
      <div className="animate-fadeUp">
        {/* Type challenge header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-lg">⌨️</span>
            <span className="text-sm font-extrabold text-indigo-600">Bonus Round!</span>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {typeIdx + 1} / {typeChallenge.length}
          </span>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-5">
          {typeChallenge.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i < typeIdx ? 'bg-indigo-500' : i === typeIdx ? 'bg-indigo-400' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Question */}
        <p className="text-sm font-bold text-slate-400 mb-2">Type your answer</p>
        <h3 className="text-lg font-extrabold text-slate-900 mb-2 leading-snug">{tc.q}</h3>

        {tc.hint && showHint && (
          <p className="text-xs text-indigo-500 mb-3 italic">💡 {tc.hint}</p>
        )}

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            ref={inputRef}
            type="text"
            value={typeInput}
            onChange={(e) => setTypeInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && typeInput.trim() && !typeResult) handleTypeSubmit() }}
            disabled={typeResult !== null}
            placeholder="Type your answer..."
            className={`flex-1 px-5 py-4 rounded-2xl border-2 font-semibold text-[15px] outline-none transition-all ${
              typeResult === 'correct' ? 'border-emerald-400 bg-emerald-50' :
              typeResult === 'wrong' ? 'border-red-400 bg-red-50' :
              'border-slate-200 focus:border-indigo-400'
            }`}
          />
          {typeResult === null ? (
            <button
              onClick={handleTypeSubmit}
              disabled={!typeInput.trim()}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 disabled:opacity-40 active:scale-95 transition-all"
            >
              Check
            </button>
          ) : (
            <button
              onClick={handleTypeNext}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
            >
              {typeIdx + 1 < typeChallenge.length ? 'Next →' : 'See Results'}
            </button>
          )}
        </div>

        {/* Hint button */}
        {typeResult === null && tc.hint && !showHint && (
          <button
            onClick={() => setShowHint(true)}
            className="text-xs text-indigo-400 font-bold mb-3"
          >
            Need a hint?
          </button>
        )}

        {/* Result */}
        {typeResult !== null && (
          <div className={`animate-fadeUp flex items-center gap-3 px-5 py-3.5 rounded-2xl ${
            typeResult === 'correct' ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'
          }`}>
            {typeResult === 'correct' ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span className="text-sm font-bold text-emerald-700">Correct! +1 Star!</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                <span className="text-sm font-bold text-red-700">The answer is: {tc.answer}</span>
              </>
            )}
          </div>
        )}
      </div>
    )
  }

  // Finished results
  if (finished) {
    const totalQ = questions.length + typeChallenge.length
    const totalCorrectFinal = correctCount + typeCorrectCount
    const accuracy = Math.round((totalCorrectFinal / totalQ) * 100)
    const timeBonus = Math.round((correctCount / questions.length) * 5)
    const { grade, color, emoji } = getGrade(accuracy, timeBonus)

    return (
      <div className="flex flex-col items-center gap-5 py-8 animate-scaleIn">
        <div className="relative">
          <div className={`w-28 h-28 rounded-full flex items-center justify-center ${
            accuracy === 100 ? 'bg-gradient-to-br from-amber-100 to-orange-100 shadow-xl shadow-amber-200/40' : 'bg-slate-100'
          }`}>
            <span className={`text-5xl font-black ${color}`}>{grade}</span>
          </div>
          <span className="absolute -top-1 -right-1 text-2xl animate-bounce">{emoji}</span>
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-xl font-extrabold text-slate-900">
            {accuracy === 100 ? 'Perfect Score!' : accuracy >= 66 ? 'Great Job!' : 'Keep Practicing!'}
          </h3>
          <p className="text-slate-500 text-sm">
            {correctCount}/{questions.length} MC · {typeCorrectCount}/{typeChallenge.length} Bonus · {accuracy}%
          </p>
        </div>

        <div className="w-full bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">MC Accuracy</span>
            <span className="font-bold text-slate-700">{questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0}%</span>
          </div>
          {typeChallenge.length > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Bonus Round</span>
              <span className="font-bold text-emerald-600">{typeCorrectCount}/{typeChallenge.length}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Speed Bonus</span>
            <span className="font-bold text-emerald-600">+{timeBonus}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Total Score</span>
            <span className="font-extrabold text-indigo-600">{totalScore + typeCorrectCount}</span>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-3.5 rounded-2xl transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
          Try Again
        </button>
      </div>
    )
  }

  // Main MC quiz
  return (
    <div className="animate-fadeUp">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 flex gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i < currentIdx ? 'bg-indigo-500' : i === currentIdx ? 'bg-indigo-400' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
          showTimeWarning ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600'
        }`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {timeLeft}s
        </div>
      </div>

      <p className="text-sm font-bold text-slate-400 mb-2">
        Q{currentIdx + 1} of {questions.length}
      </p>
      <h3 className="text-lg font-extrabold text-slate-900 mb-5 leading-snug">
        {question.q}
      </h3>

      <div className="space-y-2.5">
        {question.options.map((opt, i) => {
          let style = 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
          if (answered) {
            if (i === question.correct) style = 'bg-emerald-50 border-emerald-400'
            else if (i === selected && !isCorrect) style = 'bg-red-50 border-red-400'
            else style = 'bg-slate-50 border-slate-200 opacity-50'
          } else if (selected === -1) {
            if (i === question.correct) style = 'bg-emerald-50 border-emerald-400'
            else style = 'bg-slate-50 border-slate-200 opacity-50'
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered || selected === -1}
              className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-semibold text-[15px] transition-all duration-200 ${style}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-extrabold text-slate-500 shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-slate-700">{opt}</span>
                {(answered || selected === -1) && i === question.correct && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-auto shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                )}
                {(answered || selected === -1) && i === selected && !isCorrect && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-auto shrink-0"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {(answered || selected === -1) && (
        <div className="mt-5 animate-fadeUp">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl mb-4 ${
              isCorrect ? 'bg-emerald-50 border border-emerald-200' : selected === -1
                ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'
            }`}
          >
            {isCorrect ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span className="text-sm font-bold text-emerald-700">Correct! +{streakCount >= 2 ? '2' : '1'} Star{streakCount >= 2 ? 's' : ''}!</span>
              </>
            ) : selected === -1 ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span className="text-sm font-bold text-amber-700">Time&apos;s up!</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                <span className="text-sm font-bold text-red-700">Not quite — keep trying!</span>
              </>
            )}
          </div>
          <button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-95 transition-all"
          >
            {currentIdx + 1 < questions.length ? 'Next Question →' : typeChallenge.length > 0 ? 'Bonus Round! →' : 'See Results'}
          </button>
        </div>
      )}
    </div>
  )
}
