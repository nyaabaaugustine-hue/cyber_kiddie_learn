'use client'

import { useState, useCallback, useEffect } from 'react'
import { Screen } from '@/lib/types'
import { useAppStore } from '@/lib/store'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { OnboardingGuardian } from '@/components/OnboardingGuardian'
import { OnboardingChild } from '@/components/OnboardingChild'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { TopicSelection } from '@/components/TopicSelection'
import { LearningScreen } from '@/components/LearningScreen'
import { MyVideos } from '@/components/MyVideos'
import { ParentPortal } from '@/components/ParentPortal'
import { Toast } from '@/components/Toast'
import { WhatsAppButton } from '@/components/WhatsAppButton'

export default function Home() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [parentOpen, setParentOpen] = useState(false)
  const [toast, setToast] = useState<{ msg: string; visible: boolean }>({ msg: '', visible: false })
  const [onboardStep, setOnboardStep] = useState<'guardian' | 'child' | 'done'>('guardian')
  const store = useAppStore()

  useEffect(() => {
    if (store.loaded) {
      setOnboardStep(store.state.onboarded ? 'done' : 'guardian')
    }
  }, [store.loaded, store.state.onboarded])

  const showToast = useCallback((msg: string) => {
    setToast({ msg, visible: true })
    setTimeout(() => setToast({ msg: '', visible: false }), 2500)
  }, [])

  const navigateTo = useCallback((s: Screen) => {
    setScreen(s)
  }, [])

  const handleSubjectSelect = useCallback((subject: string) => {
    setSelectedSubject(subject)
    setScreen('learning')
  }, [])

  const handleBack = useCallback(() => {
    setSelectedSubject(null)
    setScreen('selection')
  }, [])

  const handleGuardianComplete = useCallback(() => {
    setOnboardStep('child')
  }, [])

  const handleChildComplete = useCallback((avatar: string) => {
    store.completeOnboarding(store.state.childName || 'Explorer', avatar)
    setOnboardStep('done')
  }, [store])

  if (!store.loaded) return null

  if (onboardStep !== 'done') {
    return (
      <div className="mx-auto flex min-h-dvh max-w-[480px] lg:mx-0 lg:max-w-none flex-col bg-white relative">
        {onboardStep === 'guardian' && (
          <OnboardingGuardian onComplete={handleGuardianComplete} />
        )}
        {onboardStep === 'child' && (
          <OnboardingChild
            childName={store.state.childName || ''}
            onComplete={handleChildComplete}
          />
        )}
      </div>
    )
  }

  const isWelcome = screen === 'welcome'

  return (
    <div className="mx-auto flex min-h-dvh max-w-[480px] lg:mx-0 lg:max-w-none flex-col bg-white relative">
      {!isWelcome && (
        <Header
          screen={screen}
          selectedSubject={selectedSubject}
          stars={store.state.stars}
          childName={store.state.childName}
          childAvatar={store.state.childAvatar}
          onHome={() => navigateTo('welcome')}
          onExplore={() => navigateTo('selection')}
          onParents={() => setParentOpen(true)}
        />
      )}

      <main className={`flex-1 overflow-y-auto ${isWelcome ? '' : 'px-5 pt-4 pb-28'}`}>
        {isWelcome && (
          <WelcomeScreen
            state={store.state}
            loaded={store.loaded}
            onStart={() => navigateTo('selection')}
            onSelectSubject={handleSubjectSelect}
            updateStreak={store.updateStreak}
            onParents={() => setParentOpen(true)}
          />
        )}
        {screen === 'selection' && (
          <TopicSelection
            completed={store.state.completed}
            onSelect={handleSubjectSelect}
          />
        )}
        {screen === 'learning' && selectedSubject && (
          <LearningScreen
            subject={selectedSubject}
            onBack={handleBack}
            addStar={store.addStar}
            markCompleted={store.markCompleted}
            incrementQuizzes={store.incrementQuizzes}
            recordQuizResult={store.recordQuizResult}
            completed={store.state.completed}
            showToast={showToast}
            recommendedVideos={store.state.recommendedVideos || []}
          />
        )}
        {screen === 'myvideos' && (
          <MyVideos
            videos={store.state.recommendedVideos || []}
            removeVideo={store.removeRecommendedVideo}
            showToast={showToast}
          />
        )}
      </main>

      {!isWelcome && (
        <BottomNav
          screen={screen}
          onHome={() => navigateTo('welcome')}
          onExplore={() => navigateTo('selection')}
          onMyVideos={() => navigateTo('myvideos')}
          onParents={() => setParentOpen(true)}
        />
      )}

      <ParentPortal
        isOpen={parentOpen}
        onClose={() => setParentOpen(false)}
        state={store.state}
        resetProgress={store.resetProgress}
        addRecommendedVideo={store.addRecommendedVideo}
        removeRecommendedVideo={store.removeRecommendedVideo}
      />

      <Toast msg={toast.msg} visible={toast.visible} />
      <WhatsAppButton screen={screen} />
    </div>
  )
}
