'use client'

import { Screen } from '@/lib/types'
import { useScreenSize } from '@/lib/useScreenSize'

interface BottomNavProps {
  screen: Screen
  onHome: () => void
  onExplore: () => void
  onMyVideos: () => void
  onParents: () => void
}

export function BottomNav({ screen, onHome, onExplore, onMyVideos, onParents }: BottomNavProps) {
  const { isDesktop } = useScreenSize()
  if (isDesktop) return null

  const items = [
    {
      id: 'home',
      label: 'Home',
      action: onHome,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      ),
    },
    {
      id: 'explore',
      label: 'Explore',
      action: onExplore,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      ),
    },
    {
      id: 'myvideos',
      label: 'My Videos',
      action: onMyVideos,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      ),
    },
    {
      id: 'parents',
      label: 'Parents',
      action: onParents,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      ),
    },
  ]

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] glass border-t border-slate-100 z-50">
      <div className="flex items-center justify-around py-2 px-2">
        {items.map(({ id, icon, label, action }) => {
          const isActive =
            (id === 'home' && screen === 'welcome') ||
            (id === 'explore' && (screen === 'selection' || screen === 'learning')) ||
            (id === 'myvideos' && screen === 'myvideos')

          return (
            <button
              key={id}
              onClick={action}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                {icon}
              </span>
              <span className="text-[10px] font-semibold leading-tight">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
