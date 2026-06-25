'use client'

import { useState, useCallback, useMemo } from 'react'
import { SUBJECTS, SUBJECT_RECOMMENDATIONS } from '@/lib/data'
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

function VideoPlayer({ videoId, title, emoji }: { videoId: string; title: string; emoji: string }) {
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="relative w-full aspect-video bg-slate-100 rounded-3xl overflow-hidden mb-5 flex flex-col items-center justify-center gap-3 border border-slate-200">
        <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center">
          <span className="text-3xl">😕</span>
        </div>
        <p className="text-sm font-semibold text-slate-500 text-center px-4">This video isn't available right now</p>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
        >
          Open on YouTube instead
        </a>
      </div>
    )
  }

  if (playing) {
    return (
      <div className="relative w-full aspect-video bg-slate-900 rounded-3xl overflow-hidden mb-5 shadow-2xl shadow-slate-900/20">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
          allow="autoplay"
          onError={() => setFailed(true)}
        />
      </div>
    )
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="relative w-full aspect-video bg-slate-900 rounded-3xl overflow-hidden mb-5 shadow-2xl shadow-slate-900/20 group cursor-pointer"
    >
      <img
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={() => setFailed(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-white transition-all duration-200">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#1e293b"><polygon points="8,5 20,12 8,19"/></svg>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <span className="text-white text-sm font-bold drop-shadow-lg">{title}</span>
        </div>
        <span className="text-white/70 text-[10px] font-semibold bg-black/40 rounded-full px-2 py-0.5 backdrop-blur-sm">Watch</span>
      </div>
    </button>
  )
}

function RecommendedVideoCard({ video }: { video: RecommendedVideo }) {
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="relative w-full aspect-video bg-slate-100 flex flex-col items-center justify-center gap-2">
          <span className="text-3xl">😕</span>
          <p className="text-xs text-slate-400 text-center px-4">Video unavailable</p>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-indigo-600 underline underline-offset-2"
          >
            Open on YouTube
          </a>
        </div>
        <div className="px-4 py-3">
          <h4 className="text-sm font-bold text-slate-900">{video.title}</h4>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Added {new Date(video.addedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    )
  }

  if (playing) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="relative w-full aspect-video bg-slate-900">
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            allow="autoplay"
            onError={() => setFailed(true)}
          />
        </div>
        <div className="px-4 py-3">
          <h4 className="text-sm font-bold text-slate-900">{video.title}</h4>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Added {new Date(video.addedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="w-full text-left bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm group cursor-pointer"
    >
      <div className="relative w-full aspect-video bg-slate-900">
        <img
          src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1e293b"><polygon points="8,5 20,12 8,19"/></svg>
          </div>
        </div>
      </div>
      <div className="px-4 py-3">
        <h4 className="text-sm font-bold text-slate-900">{video.title}</h4>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Added {new Date(video.addedAt).toLocaleDateString()}
        </p>
      </div>
    </button>
  )
}

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

  const suggestedVideos = useMemo(() => {
    return (SUBJECT_RECOMMENDATIONS[subject] || []).map((v, i) => ({
      id: `suggested_${subject}_${i}`,
      url: `https://www.youtube.com/watch?v=${v.videoId}`,
      title: v.title,
      videoId: v.videoId,
      addedAt: new Date().toISOString(),
    }))
  }, [subject])

  const displayVideos = recommendedVideos.length > 0 ? recommendedVideos : suggestedVideos

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
      <VideoPlayer videoId={info.video} title={info.label} emoji={info.emoji} />

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
            <h3 className="text-base font-extrabold text-slate-900">
              {recommendedVideos.length > 0 ? 'Recommended for You' : `${info.label} Videos`}
            </h3>
          </div>
          {recommendedVideos.length === 0 && (
            <p className="text-xs text-slate-400 -mt-2 mb-2">Curated picks for this subject — your parent can add more!</p>
          )}
          <div className="space-y-4">
            {displayVideos.map((video) => (
              <RecommendedVideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
