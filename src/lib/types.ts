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
}

export type Screen = 'welcome' | 'selection' | 'learning' | 'myvideos'
export type Tab = 'facts' | 'quiz' | 'ask' | 'forYou'
