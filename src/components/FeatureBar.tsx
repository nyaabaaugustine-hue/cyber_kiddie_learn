'use client'

const features = [
  { icon: '⭐', title: 'Learn', subtitle: 'Amazing Facts', color: 'from-amber-400 to-orange-500' },
  { icon: '🧠', title: 'Quiz', subtitle: 'Test Knowledge', color: 'from-indigo-400 to-violet-500' },
  { icon: '🏆', title: 'Earn Stars', subtitle: 'Unlock Rewards', color: 'from-emerald-400 to-teal-500' },
  { icon: '🔥', title: 'Streak', subtitle: 'Keep Learning', color: 'from-red-400 to-rose-500' },
]

export function FeatureBar() {
  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="flex gap-2">
        {features.map(({ icon, title, subtitle, color }) => (
          <div
            key={title}
            className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center"
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
              <span className="text-base">{icon}</span>
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-white leading-tight">{title}</p>
              <p className="text-[8px] text-white/50 font-medium leading-tight">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
