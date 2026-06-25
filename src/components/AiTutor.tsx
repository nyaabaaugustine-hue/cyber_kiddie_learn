'use client'

import { useState, useCallback } from 'react'
import { ActivityType } from '@/lib/types'

interface AiTutorProps {
  subject: string
  addStar: (count?: number) => void
  showToast: (msg: string) => void
  logActivity: (type: ActivityType, detail: string, meta?: string) => void
}

export function AiTutor({ subject, addStar, showToast, logActivity }: AiTutorProps) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAsk = useCallback(async () => {
    const q = question.trim()
    if (!q) {
      showToast('Type a question first!')
      return
    }

    setLoading(true)
    setAnswer('')

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, question: q }),
      })
      const data = await res.json()
      setAnswer(data.answer || 'Hmm, I need to think about that! Ask a grown-up too!')
      addStar(1)
      showToast('⭐ +1 Star for curiosity!')
      logActivity('ai_question', `Asked about ${subject}: "${q}"`, subject)
    } catch {
      setAnswer("🤔 I couldn't answer right now — check your internet and try again!")
    }

    setLoading(false)
  }, [question, subject, addStar, showToast, logActivity])

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-indigo-50/80 to-violet-50/60 border border-indigo-100/60 rounded-3xl p-5">
        <p className="text-sm font-extrabold text-indigo-700 mb-3 flex items-center gap-2">
          <span>✨</span> Ask anything about {subject}!
        </p>
        <div className="flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="e.g. How big is the Sun?"
            maxLength={120}
            className="flex-1 bg-white border-2 border-indigo-100 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 transition-colors"
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <span className="block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            )}
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-6">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {answer && !loading && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 animate-scaleIn">
          <p className="text-[15px] font-medium text-slate-700 leading-relaxed">{answer}</p>
        </div>
      )}

      <p className="text-center text-[11px] text-slate-400 font-medium">
        AI answers are simplified for kids. Always check with a trusted adult!
      </p>
    </div>
  )
}
