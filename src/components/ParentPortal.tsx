'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { AppState, RecommendedVideo, ActivityType } from '@/lib/types'
import { useScreenSize } from '@/lib/useScreenSize'
import { SUBJECTS, SUBJECT_KEYS } from '@/lib/data'

interface ParentPortalProps {
  isOpen: boolean
  onClose: () => void
  state: AppState
  resetProgress: () => void
  addRecommendedVideo: (url: string, title: string) => boolean
  removeRecommendedVideo: (id: string) => void
  clearActivityLog: () => void
  addStreakFreeze: () => void
  useStreakFreeze: () => boolean
  setDailyGoal: (goal: number) => void
}

const ACTIVITY_ICONS: Record<ActivityType, string> = {
  screen: '📱',
  subject_open: '📖',
  tab_switch: '🔄',
  quiz_start: '📝',
  quiz_complete: '✅',
  video_watch: '🎬',
  ai_question: '✨',
  star_earned: '⭐',
  streak: '🔥',
  login: '👋',
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay === 1) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function groupByDate(entries: { ts: number; text: string; icon: string; meta?: string }[]) {
  const groups: Record<string, typeof entries> = {}
  for (const e of entries) {
    const date = new Date(e.ts).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
    if (!groups[date]) groups[date] = []
    groups[date].push(e)
  }
  return groups
}

export function ParentPortal({
  isOpen, onClose, state, resetProgress,
  addRecommendedVideo, removeRecommendedVideo,
  clearActivityLog, addStreakFreeze, useStreakFreeze, setDailyGoal,
}: ParentPortalProps) {
  const [pin, setPin] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { isDesktop } = useScreenSize()
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'settings'>('overview')

  const [videoUrl, setVideoUrl] = useState('')
  const [videoTitle, setVideoTitle] = useState('')
  const [videoError, setVideoError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setPin('')
      setAuthenticated(false)
      setError(false)
      setVideoUrl('')
      setVideoTitle('')
      setVideoError('')
      setActiveTab('overview')
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [isOpen])

  const checkPin = useCallback(
    (value: string) => {
      setPin(value)
      if (value.length === 4) {
        if (value === '1234') {
          setAuthenticated(true)
          setError(false)
        } else {
          setError(true)
          setTimeout(() => {
            setPin('')
            setError(false)
          }, 1000)
        }
      }
    },
    []
  )

  const handleAddVideo = useCallback(() => {
    if (!videoUrl.trim() || !videoTitle.trim()) {
      setVideoError('Please enter both URL and title')
      return
    }
    const success = addRecommendedVideo(videoUrl.trim(), videoTitle.trim())
    if (success) {
      setVideoUrl('')
      setVideoTitle('')
      setVideoError('')
    } else {
      setVideoError('Invalid YouTube URL')
    }
  }, [videoUrl, videoTitle, addRecommendedVideo])

  const handleReset = useCallback(() => {
    if (confirm('Reset all progress? This cannot be undone.')) {
      resetProgress()
      onClose()
    }
  }, [resetProgress, onClose])

  const todayActivities = state.activityLog.filter(
    (a) => new Date(a.timestamp).toDateString() === new Date().toDateString()
  )

  const groupedActivities = groupByDate(
    state.activityLog.slice(-100).reverse().map((a) => ({
      ts: a.timestamp,
      text: a.detail,
      icon: ACTIVITY_ICONS[a.type] || '📌',
      meta: a.meta,
    }))
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative w-full bg-white ${
        isDesktop
          ? 'max-w-lg rounded-[2rem] mx-4 animate-scaleIn max-h-[85vh] overflow-y-auto'
          : 'max-w-[480px] rounded-t-[2rem] animate-slideUp max-h-[90vh] overflow-y-auto'
      } px-6 pt-4 pb-10`}>
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />

        {!authenticated ? (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
            </div>
            <h2 className="text-xl font-extrabold text-center text-slate-900 mb-2">Parent Portal</h2>
            <p className="text-sm text-center text-slate-500 mb-5">Enter your 4-digit PIN to access settings</p>

            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => checkPin(e.target.value)}
              placeholder="••••"
              className={`w-full text-center text-2xl font-black tracking-[0.5em] py-4 rounded-2xl border-2 outline-none transition-colors ${
                error ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-indigo-400'
              }`}
            />
            <p className="text-center text-xs text-slate-400 mt-2">Default PIN: 1234</p>

            <button
              onClick={onClose}
              className="w-full mt-5 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
            </div>
            <h2 className="text-xl font-extrabold text-center text-slate-900 mb-4">Dashboard</h2>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-5">
              {[
                { id: 'overview' as const, label: 'Overview', icon: '📊' },
                { id: 'activity' as const, label: 'Activity', icon: '📋' },
                { id: 'settings' as const, label: 'Settings', icon: '⚙️' },
              ].map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === id
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                <div className="space-y-1">
                  {[
                    { icon: '⭐', label: 'Total Stars', value: `${state.stars}`, color: 'text-amber-500' },
                    { icon: '🎯', label: 'Topics Completed', value: `${Object.keys(state.completed).length} / 9`, color: 'text-emerald-500' },
                    { icon: '🧠', label: 'Quizzes Taken', value: state.quizzesPassed.toString(), color: 'text-indigo-500' },
                    { icon: '🔥', label: 'Learning Streak', value: `${state.streak} days`, color: 'text-orange-500' },
                    { icon: '📊', label: 'Overall Accuracy', value: state.totalAttempts > 0 ? `${Math.round((state.totalCorrect / state.totalAttempts) * 100)}%` : '—', color: 'text-blue-500' },
                    { icon: '📋', label: 'Activities Today', value: todayActivities.length.toString(), color: 'text-purple-500' },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <span>{icon}</span>
                        <span className="text-sm font-medium text-slate-500">{label}</span>
                      </div>
                      <span className="text-sm font-extrabold text-slate-800">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Per-Subject Scores */}
                <div className="mt-5">
                  <h3 className="text-sm font-extrabold text-slate-700 mb-3">Subject Breakdown</h3>
                  <div className="space-y-3">
                    {SUBJECT_KEYS.map((key) => {
                      const s = SUBJECTS[key]
                      const score = state.subjectScores[key]
                      const accuracy = score ? score.lastAccuracy : 0
                      const attempts = score ? score.attempts : 0
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <span className="text-lg w-7 text-center">{s.emoji}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-slate-600">{key}</span>
                              <span className="text-[10px] font-bold text-slate-400">
                                {attempts > 0 ? `${accuracy}% · ${attempts} attempt${attempts > 1 ? 's' : ''}` : 'Not attempted'}
                              </span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${attempts > 0 ? accuracy : 0}%`,
                                  backgroundColor: score?.mastered ? '#10b981' : attempts > 0 ? '#6366f1' : '#e2e8f0',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div>
                {state.activityLog.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-12">
                    <span className="text-4xl">📋</span>
                    <p className="text-sm text-slate-400 text-center">No activity recorded yet</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-slate-400">{state.activityLog.length} events logged</p>
                      <button
                        onClick={() => {
                          if (confirm('Clear all activity logs?')) clearActivityLog()
                        }}
                        className="text-[11px] font-bold text-red-400 hover:text-red-600"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                      {Object.entries(groupedActivities).map(([date, activities]) => (
                        <div key={date}>
                          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">{date}</p>
                          <div className="space-y-1.5">
                            {activities.map((a, i) => (
                              <div key={i} className="flex items-start gap-2.5 py-2 px-3 bg-slate-50 rounded-xl">
                                <span className="text-sm mt-0.5 shrink-0">{a.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-slate-700 leading-snug">{a.text}</p>
                                </div>
                                <span className="text-[10px] text-slate-400 shrink-0 mt-0.5">{formatTime(a.ts)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <>
                {/* Recommended Videos */}
                <div className="mb-5">
                  <h3 className="text-sm font-extrabold text-slate-700 mb-3 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    Recommended Videos
                  </h3>
                  <div className="space-y-2 mb-4">
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => { setVideoUrl(e.target.value); setVideoError('') }}
                      placeholder="Paste YouTube URL..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-indigo-400 transition-colors"
                    />
                    <input
                      type="text"
                      value={videoTitle}
                      onChange={(e) => { setVideoTitle(e.target.value); setVideoError('') }}
                      placeholder="Video title..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-indigo-400 transition-colors"
                    />
                    {videoError && <p className="text-xs text-red-500 font-bold">{videoError}</p>}
                    <button
                      onClick={handleAddVideo}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
                    >
                      + Add Video
                    </button>
                  </div>
                  {state.recommendedVideos.length > 0 ? (
                    <div className="space-y-2">
                      {state.recommendedVideos.map((v) => (
                        <div key={v.id} className="flex items-center gap-3 py-2.5 px-3 bg-slate-50 rounded-xl">
                          <span className="text-lg">🎬</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-700 truncate">{v.title}</p>
                            <p className="text-[10px] text-slate-400 truncate">{v.url}</p>
                          </div>
                          <button
                            onClick={() => removeRecommendedVideo(v.id)}
                            className="shrink-0 w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-3">No videos added yet</p>
                  )}
                </div>

                {/* Streak Freeze */}
                <div className="py-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-700">Streak Freezes</p>
                      <p className="text-[11px] text-slate-400">Protect your streak if you miss a day</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-amber-500">❄️ {state.streakFreezes}</span>
                      <button
                        onClick={addStreakFreeze}
                        className="px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-600 text-[11px] font-bold hover:bg-indigo-200 transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Daily Goal */}
                <div className="py-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-bold text-slate-700">Daily Learning Goal</p>
                      <p className="text-[11px] text-slate-400">Subjects to explore per day</p>
                    </div>
                    <span className="text-sm font-extrabold text-indigo-600">{state.dailyGoal} / day</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 5, 7].map((g) => (
                      <button
                        key={g}
                        onClick={() => setDailyGoal(g)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                          state.dailyGoal === g
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-slate-100">
                  <span className="text-sm font-medium text-slate-500">Safety Filter</span>
                  <span className="text-sm font-bold text-emerald-600">🟢 High</span>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full mt-4 py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-extrabold text-sm shadow-lg shadow-red-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                  Reset Child&apos;s Progress
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="w-full mt-5 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  )
}
