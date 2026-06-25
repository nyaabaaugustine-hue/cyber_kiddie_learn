'use client'

import { useState, useEffect, useCallback } from 'react'
import { AppState, SubjectScore, RecommendedVideo } from './types'

const STORAGE_KEY = 'kl_state'

const DEFAULT_STATE: AppState = {
  onboarded: false,
  childName: '',
  childAvatar: '🚀',
  stars: 0,
  completed: {},
  quizzesPassed: 0,
  streak: 0,
  lastDate: null,
  subjectScores: {},
  totalCorrect: 0,
  totalAttempts: 0,
  recommendedVideos: [
    {
      id: 'default_coding',
      url: 'https://www.youtube.com/watch?v=iGQRj5V5TVc',
      title: 'Learn Block Coding for Kids',
      videoId: 'iGQRj5V5TVc',
      addedAt: new Date().toISOString(),
    },
  ],
}

function loadState(): AppState {
  if (typeof window === 'undefined') return DEFAULT_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const s = JSON.parse(raw)
    return {
      onboarded: s.onboarded ?? false,
      childName: s.childName ?? '',
      childAvatar: s.childAvatar ?? '🚀',
      stars: s.stars ?? 0,
      completed: s.completed ?? {},
      quizzesPassed: s.quizzesPassed ?? 0,
      streak: s.streak ?? 0,
      lastDate: s.lastDate ?? null,
      subjectScores: s.subjectScores ?? {},
      totalCorrect: s.totalCorrect ?? 0,
      totalAttempts: s.totalAttempts ?? 0,
      recommendedVideos: s.recommendedVideos ?? DEFAULT_STATE.recommendedVideos,
    }
  } catch {
    return DEFAULT_STATE
  }
}

function saveState(state: AppState) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function makeDefaultScore(): SubjectScore {
  return {
    attempts: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    bestAccuracy: 0,
    lastAccuracy: 0,
    mastered: false,
  }
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export function useAppStore() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setState(loadState())
    setLoaded(true)
  }, [])

  const persist = useCallback((next: AppState) => {
    setState(next)
    saveState(next)
  }, [])

  const completeOnboarding = useCallback(
    (name: string, avatar: string) => {
      persist({ ...state, onboarded: true, childName: name, childAvatar: avatar })
    },
    [state, persist]
  )

  const addStar = useCallback(
    (count = 1) => {
      persist({ ...state, stars: state.stars + count })
    },
    [state, persist]
  )

  const updateStreak = useCallback(() => {
    const today = new Date().toDateString()
    if (state.lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      const streak = state.lastDate === yesterday ? state.streak + 1 : 1
      persist({ ...state, streak, lastDate: today })
    }
  }, [state, persist])

  const markCompleted = useCallback(
    (subject: string) => {
      if (!state.completed[subject]) {
        persist({
          ...state,
          completed: { ...state.completed, [subject]: true },
        })
      }
    },
    [state, persist]
  )

  const incrementQuizzes = useCallback(() => {
    persist({ ...state, quizzesPassed: state.quizzesPassed + 1 })
  }, [state, persist])

  const recordQuizResult = useCallback(
    (subject: string, correct: number, total: number) => {
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
      const prev = state.subjectScores[subject] || makeDefaultScore()
      const newScore: SubjectScore = {
        attempts: prev.attempts + 1,
        correctAnswers: prev.correctAnswers + correct,
        totalQuestions: prev.totalQuestions + total,
        bestAccuracy: Math.max(prev.bestAccuracy, accuracy),
        lastAccuracy: accuracy,
        mastered: accuracy === 100,
      }
      persist({
        ...state,
        subjectScores: { ...state.subjectScores, [subject]: newScore },
        totalCorrect: state.totalCorrect + correct,
        totalAttempts: state.totalAttempts + total,
      })
    },
    [state, persist]
  )

  const addRecommendedVideo = useCallback(
    (url: string, title: string) => {
      const videoId = extractYouTubeId(url)
      if (!videoId) return false
      const video: RecommendedVideo = {
        id: Date.now().toString(),
        url,
        title,
        videoId,
        addedAt: new Date().toISOString(),
      }
      persist({
        ...state,
        recommendedVideos: [...state.recommendedVideos, video],
      })
      return true
    },
    [state, persist]
  )

  const removeRecommendedVideo = useCallback(
    (id: string) => {
      persist({
        ...state,
        recommendedVideos: state.recommendedVideos.filter((v) => v.id !== id),
      })
    },
    [state, persist]
  )

  const resetProgress = useCallback(() => {
    persist({ ...DEFAULT_STATE, recommendedVideos: state.recommendedVideos })
  }, [state, persist])

  return {
    state,
    loaded,
    completeOnboarding,
    addStar,
    updateStreak,
    markCompleted,
    incrementQuizzes,
    recordQuizResult,
    addRecommendedVideo,
    removeRecommendedVideo,
    resetProgress,
  }
}
