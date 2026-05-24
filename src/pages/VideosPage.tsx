import { useRef, useState, useCallback } from 'react'
import { Download, ExternalLink, QrCode, ChevronLeft, ChevronRight } from 'lucide-react'
import { videoPageData } from '@/data/videos'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const QR_PLATFORMS = [
  { key: 'wechat', label: '微信视频号' },
  { key: 'netease', label: '网易云音乐' },
] as const

const PLATFORM_COUNT = QR_PLATFORMS.length

export default function VideosPage() {
  const { wechatChannel, neteaseChannel, downloads } = videoPageData
  const headerRef = useScrollReveal()
  const channelRef = useScrollReveal()
  const qrImgRef = useScrollReveal()
  const downloadRef = useScrollReveal()

  const channels = [wechatChannel, neteaseChannel]
  const [activeQr, setActiveQr] = useState(0)
  const [slideDir, setSlideDir] = useState<'left' | 'right' | null>(null)
  const [qrErrors, setQrErrors] = useState<Record<string, boolean>>({})
  const touchRef = useRef({ startX: 0, startY: 0 })

  const currentChannel = channels[activeQr]

  const goToQr = useCallback((index: number) => {
    if (index === activeQr) return
    setSlideDir(index > activeQr ? 'left' : 'right')
    setActiveQr(index)
    setTimeout(() => setSlideDir(null), 400)
  }, [activeQr])

  const goToPrev = useCallback(() => {
    goToQr(activeQr === 0 ? PLATFORM_COUNT - 1 : activeQr - 1)
  }, [activeQr, goToQr])

  const goToNext = useCallback(() => {
    goToQr(activeQr === PLATFORM_COUNT - 1 ? 0 : activeQr + 1)
  }, [activeQr, goToQr])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchRef.current = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const { startX, startY } = touchRef.current
    const dx = e.changedTouches[0].clientX - startX
    const dy = e.changedTouches[0].clientY - startY
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx > 0) goToPrev()
      else goToNext()
    }
  }

  const handleQrError = (key: string) => {
    setQrErrors((prev) => ({ ...prev, [key]: true }))
  }

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
        {/* Left: Channel Info */}
        <div
          ref={channelRef}
          className="reveal glass-card rounded-2xl p-8"
        >
          <h2
            className="text-xl font-display font-bold mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            {currentChannel.name}
          </h2>
          <p className="leading-relaxed mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            {currentChannel.description}
          </p>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: 'var(--color-accent-bg)',
              color: 'var(--color-accent)',
            }}
          >
            <ExternalLink className="w-4 h-4" />
            扫码关注{activeQr === 0 ? '微信视频号' : '网易云音乐'}
          </div>
        </div>

        {/* Right: QR Code Carousel */}
        <div
          ref={qrImgRef}
          className="reveal reveal-delay-1 glass-card rounded-2xl p-6 flex flex-col items-center justify-center gap-4"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* QR image slider with shadow space */}
          <div className="relative mx-auto" style={{ padding: '24px' }}>
            {/* Glow layer — sits behind the image, outside overflow clip */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-48 h-48 rounded-xl"
                style={{
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.35), 0 0 50px var(--color-accent-glow), 0 0 100px var(--color-accent-glow)',
                }}
              />
            </div>

            {/* Clipped slide track */}
            <div className="relative w-48 h-48 overflow-hidden rounded-xl mx-auto" style={{ zIndex: 1 }}>
              <div
                className="flex h-full transition-transform ease-out"
                style={{ transform: `translateX(-${activeQr * 100}%)`, transitionDuration: '0.4s' }}
              >
                {channels.map((ch, i) => (
                  <div
                    key={ch.qrCodeUrl}
                    className="w-48 h-48 flex-shrink-0"
                  >
                    {!qrErrors[ch.qrCodeUrl] ? (
                      <img
                        src={ch.qrCodeUrl}
                        alt={`${QR_PLATFORMS[i].label}二维码`}
                        className="w-48 h-48 rounded-xl bg-white p-3 object-contain"
                        onError={() => handleQrError(ch.qrCodeUrl)}
                        loading="lazy"
                        draggable={false}
                      />
                    ) : (
                      <div
                        className="w-48 h-48 rounded-xl flex flex-col items-center justify-center gap-3"
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          border: '2px dashed var(--color-border)',
                        }}
                      >
                        <QrCode className="w-10 h-10" style={{ color: 'var(--color-text-muted)' }} />
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          加载失败
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation: arrows + label */}
          <div className="flex items-center gap-3">
            <button
              onClick={goToPrev}
              className="w-8 h-8 flex items-center justify-center rounded-full
                transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
              aria-label="上一个二维码"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span
              className="text-sm font-medium min-w-[80px] text-center transition-colors duration-300"
              style={{ color: 'var(--color-text)' }}
            >
              {QR_PLATFORMS[activeQr].label}
            </span>

            <button
              onClick={goToNext}
              className="w-8 h-8 flex items-center justify-center rounded-full
                transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
              aria-label="下一个二维码"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {QR_PLATFORMS.map((p, i) => (
              <button
                key={p.key}
                onClick={() => goToQr(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeQr ? '20px' : '6px',
                  height: '6px',
                  backgroundColor: i === activeQr
                    ? 'var(--color-accent)'
                    : 'var(--color-border)',
                  boxShadow: i === activeQr
                    ? '0 0 8px var(--color-accent-glow)'
                    : 'none',
                }}
                aria-label={`切换到${p.label}二维码`}
              />
            ))}
          </div>

          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {slideDir !== null ? `${slideDir === 'left' ? '←' : '→'} 滑动切换` : '点击或滑动切换二维码'}
          </p>
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
              className="flex items-center justify-between gap-3 p-4 rounded-xl
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
              <div className="flex items-center gap-3 min-w-0">
                <Download
                  className="w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ color: 'var(--color-accent)' }}
                />
                <span
                  className="font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{ color: 'var(--color-text)' }}
                  title={item.label}
                >
                  {item.label}
                </span>
              </div>
              <span
                className="text-xs px-3 py-1 rounded-full flex-shrink-0 whitespace-nowrap transition-colors duration-300"
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