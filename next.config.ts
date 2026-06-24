import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              // YouTube thumbnails (two different CDN hostnames)
              "img-src 'self' data: https://img.youtube.com https://i.ytimg.com",
              // Allow YouTube iframes
              "frame-src https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com",
              // Anthropic API + YouTube iframe postMessage / analytics
              "connect-src 'self' https://api.anthropic.com https://*.youtube.com https://www.youtube.com",
              "media-src 'self' https://www.youtube.com https://*.youtube.com",
            ].join('; '),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            // autoplay=* ALLOWS autoplay; autoplay=() DISABLES it — we need it enabled
            key: 'Permissions-Policy',
            value: 'autoplay=*, fullscreen=*',
          },
        ],
      },
    ]
  },
}

export default nextConfig
