'use client'

import { useCallback, useRef } from 'react'

export function useVoice() {
  const speaking = useRef(false)

  const speak = useCallback((text: string, lang = 'en-US') => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9
    utterance.pitch = 1.1
    utterance.volume = 1

    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(
      (v) => v.lang === lang && (v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Microsoft'))
    )
    if (preferred) utterance.voice = preferred

    speaking.current = true
    utterance.onend = () => { speaking.current = false }
    utterance.onerror = () => { speaking.current = false }

    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      speaking.current = false
    }
  }, [])

  return { speak, stop, speaking }
}
