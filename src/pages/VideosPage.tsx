import { useEffect, useRef, useState } from 'react'
import { Download, ExternalLink, QrCode } from 'lucide-react'
import { videoPageData } from '@/data/videos'

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}

export default function VideosPage() {
  const { wechatChannel, downloads } = videoPageData
  const headerRef = useScrollReveal()
  const channelRef = useScrollReveal()
  const qrImgRef = useScrollReveal()
  const downloadRef = useScrollReveal()
  const [qrError, setQrError] = useState(false)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-6">
      <div ref={headerRef} className="reveal mb-10 text-center">
        <h1
          className="text-3xl sm:text-4xl font-display font-bold mb-3"
          style={{ color: 'var(--color-text)' }}
        >
          表演视频
        </h1>
        <p
          className="font-scifi text-xs tracking-[0.3em] uppercase"
          style={{ color: 'var(--color-accent)', opacity: 0.6 }}
        >
          Videos & Downloads
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div
          ref={channelRef}
          className="reveal glass-card rounded-2xl p-8"
        >
          <h2
            className="text-xl font-display font-bold mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            {wechatChannel.name}
          </h2>
          <p className="leading-relaxed mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            {wechatChannel.description}
          </p>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: 'var(--color-accent-bg)',
              color: 'var(--color-accent)',
            }}
          >
            <ExternalLink className="w-4 h-4" />
            扫码关注微信视频号
          </div>
        </div>

        <div
          ref={qrImgRef}
          className="reveal reveal-delay-1 glass-card rounded-2xl p-8 flex items-center justify-center"
        >
          <div className="text-center">
            {!qrError ? (
              <div className="relative inline-block">
                <img
                  src={wechatChannel.qrCodeUrl}
                  alt="微信视频号二维码"
                  className="w-48 h-48 mx-auto rounded-xl bg-white p-3 object-contain"
                  style={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2), 0 0 40px var(--color-accent-glow)' }}
                  onError={() => setQrError(true)}
                  loading="lazy"
                />
              </div>
            ) : (
              <div
                className="w-48 h-48 mx-auto rounded-xl flex flex-col items-center justify-center gap-3"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '2px dashed var(--color-border)',
                }}
              >
                <QrCode className="w-10 h-10" style={{ color: 'var(--color-text-muted)' }} />
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  二维码加载失败
                </span>
              </div>
            )}
            <p className="mt-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              微信扫码关注
            </p>
          </div>
        </div>
      </div>

      <div
        ref={downloadRef}
        className="reveal glass-card rounded-2xl p-8"
      >
        <h2
          className="text-xl font-display font-bold mb-6 flex items-center gap-2"
          style={{ color: 'var(--color-text)' }}
        >
          <Download className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
          演出视频下载
        </h2>
        <div className="space-y-3">
          {downloads.map((item) => (
            <a
              key={item.label}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl
                border border-transparent transition-all duration-300 group"
              style={{
                backgroundColor: 'var(--color-surface)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-hover)'
                e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent'
                e.currentTarget.style.backgroundColor = 'var(--color-surface)'
              }}
            >
              <div className="flex items-center gap-3">
                <Download
                  className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ color: 'var(--color-accent)' }}
                />
                <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                  {item.label}
                </span>
              </div>
              <span
                className="text-xs px-3 py-1 rounded-full transition-colors duration-300"
                style={{
                  color: 'var(--color-text-muted)',
                  backgroundColor: 'var(--color-card-bg)',
                }}
              >
                {item.platform}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}