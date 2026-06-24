'use client'

import { useState, useCallback } from 'react'
import { SUBJECTS } from '@/lib/data'
import { Tab, RecommendedVideo } from '@/lib/types'
import { Quiz } from '@/components/Quiz'
import { AiTutor } from '@/components/AiTutor'

interface LearningScreenProps {
  subject: string
  onBack: () => void
  addStar: (count?: number) => void
  markCompleted: (subject: string) => void
  incrementQuizzes: () => void
  recordQuizResult: (subject: string, correct: number, total: number) => void
  completed: Record<string, boolean>
  showToast: (msg: string) => void
  recommendedVideos: RecommendedVideo[]
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'facts', label: 'Cool Facts', icon: '📚' },
  { id: 'quiz', label: 'Quick Quiz', icon: '🧠' },
  { id: 'ask', label: 'Ask AI', icon: '✨' },
  { id: 'forYou', label: 'For You', icon: '🎬' },
]

export function LearningScreen({
  subject,
  onBack,
  addStar,
  markCompleted,
  incrementQuizzes,
  recordQuizResult,
  completed,
  showToast,
  recommendedVideos,
}: LearningScreenProps) {
  const [tab, setTab] = useState<Tab>('facts')
  const info = SUBJECTS[subject]

  const handleQuizComplete = useCallback(
    (allCorrect: boolean) => {
      if (allCorrect && !completed[subject]) {
        addStar(3)
        markCompleted(subject)
        showToast(`🎉 ${subject} mastered! +3 bonus stars!`)
      }
    },
    [subject, completed, addStar, markCompleted, showToast]
  )

  return (
    <div className="animate-fadeUp">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 mb-5 group"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
        Back
      </button>

      {/* Video */}
      <div className="relative w-full aspect-video md:aspect-[21/9] bg-slate-900 rounded-3xl overflow-hidden mb-5 shadow-2xl shadow-slate-900/20">
        <iframe
          src={`https://www.youtube.com/embed/${info.video}`}
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
          loading="lazy"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100/80 p-1 rounded-2xl mb-5">
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              tab === id
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>{icon}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'facts' && (
        <div className="space-y-3 stagger">
          {info.facts.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-3.5 bg-gradient-to-r from-indigo-50/80 to-violet-50/60 border border-indigo-100/60 rounded-2xl p-4"
            >
              <span className="text-2xl shrink-0 mt-0.5">{f.emoji}</span>
              <p className="text-[15px] font-semibold text-slate-700 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'quiz' && (
        <Quiz
          questions={info.quiz}
          typeChallenge={info.typeChallenge}
          subject={subject}
          addStar={addStar}
          incrementQuizzes={incrementQuizzes}
          onComplete={handleQuizComplete}
          recordQuizResult={recordQuizResult}
          showToast={showToast}
        />
      )}

      {tab === 'ask' && <AiTutor subject={subject} addStar={addStar} showToast={showToast} />}

      {tab === 'forYou' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🎬</span>
            <h3 className="text-base font-extrabold text-slate-900">Recommended for You</h3>
          </div>
          {recommendedVideos.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="text-3xl">📺</span>
              </div>
              <p className="text-sm text-slate-400 text-center">No videos yet — ask your parent to add some!</p>
            </div>
          ) : (
            recommendedVideos.map((video) => (
              <div key={video.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="relative w-full aspect-video bg-slate-900">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    className="absolute inset-0 w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="px-4 py-3">
                  <h4 className="text-sm font-bold text-slate-900">{video.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Added {new Date(video.addedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
