export interface Fact {
  emoji: string
  text: string
}

export interface QuizQuestion {
  q: string
  options: string[]
  correct: number
}

export interface TypeQuestion {
  q: string
  answer: string
  hint?: string
  acceptedAnswers?: string[]
}

export interface Subject {
  emoji: string
  label: string
  color: string
  bg: string
  border: string
  video: string
  facts: Fact[]
  quiz: QuizQuestion[]
  typeChallenge: TypeQuestion[]
}

export interface SubjectScore {
  attempts: number
  correctAnswers: number
  totalQuestions: number
  bestAccuracy: number
  lastAccuracy: number
  mastered: boolean
}

export interface RecommendedVideo {
  id: string
  url: string
  title: string
  videoId: string
  addedAt: string
}

export interface AppState {
  onboarded: boolean
  childName: string
  childAvatar: string
  stars: number
  completed: Record<string, boolean>
  quizzesPassed: number
  streak: number
  lastDate: string | null
  subjectScores: Record<string, SubjectScore>
  totalCorrect: number
  totalAttempts: number
  recommendedVideos: RecommendedVideo[]
  activityLog: ActivityEntry[]
  streakFreezes: number
  dailyGoal: number
}

export type Screen = 'welcome' | 'selection' | 'learning' | 'myvideos'
export type Tab = 'facts' | 'quiz' | 'ask' | 'forYou'

export type ActivityType = 'screen' | 'subject_open' | 'tab_switch' | 'quiz_start' | 'quiz_complete' | 'video_watch' | 'ai_question' | 'star_earned' | 'streak' | 'login'

export interface ActivityEntry {
  id: string
  type: ActivityType
  detail: string
  meta?: string
  timestamp: number
}
