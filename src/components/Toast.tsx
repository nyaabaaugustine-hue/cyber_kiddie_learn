'use client'

export function Toast({ msg, visible }: { msg: string; visible: boolean }) {
  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[300] px-6 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold shadow-2xl shadow-slate-900/30 transition-all duration-300 pointer-events-none whitespace-nowrap ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
      }`}
    >
      {msg}
    </div>
  )
}
