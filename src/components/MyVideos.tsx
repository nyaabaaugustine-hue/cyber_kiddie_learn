'use client'

import { RecommendedVideo } from '@/lib/types'

interface MyVideosProps {
  videos: RecommendedVideo[]
  removeVideo: (id: string) => void
  showToast: (msg: string) => void
}

export function MyVideos({ videos, removeVideo, showToast }: MyVideosProps) {
  const handleRemove = (id: string, title: string) => {
    removeVideo(id)
    showToast(`Removed "${title}"`)
  }

  return (
    <div className="animate-fadeUp">
      <div className="mb-6">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">My Videos</h2>
        <p className="text-slate-500 text-sm mt-1">Videos recommended by your parent!</p>
      </div>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
            <span className="text-4xl">🎬</span>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">No videos yet!</h3>
            <p className="text-slate-500 text-sm">Ask your parent to add some learning videos.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map((video) => (
            <div key={video.id} className="animate-fadeUp">
              <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="relative w-full aspect-video bg-slate-900">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    className="absolute inset-0 w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{video.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Added {new Date(video.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(video.id, video.title)}
                    className="ml-3 shrink-0 w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
