'use client'

import { useState, useEffect } from 'react'

export function useScreenSize() {
  const [isMobile, setIsMobile] = useState(true)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768)
      setIsDesktop(window.innerWidth >= 768)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return { isMobile, isDesktop }
}
