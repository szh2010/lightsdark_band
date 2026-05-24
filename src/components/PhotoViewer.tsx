import { useEffect, useCallback, useRef } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Photo } from '@/data/photos'

interface PhotoViewerProps {
  photos: Photo[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function PhotoViewer({ photos, currentIndex, onClose, onPrev, onNext }: PhotoViewerProps) {
  const photo = photos[currentIndex]
  const touchRef = useRef({ startX: 0, startY: 0 })

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft') onPrev()
    if (e.key === 'ArrowRight') onNext()
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchRef.current = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const { startX, startY } = touchRef.current
    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const dx = endX - startX
    const dy = endY - startY

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx > 0) onPrev()
      else onNext()
    }
  }

  return (
    <div
      className="photo-viewer-overlay fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(5, 11, 20, 0.95)', backdropFilter: 'blur(20px)', touchAction: 'none' }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Ambient glow behind image */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '60vw',
          height: '60vh',
          background: 'radial-gradient(ellipse at center, var(--color-accent-glow) 0%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.3,
        }}
      />

      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-12 h-12 flex items-center justify-center
          rounded-full transition-all duration-300 hover:scale-110 z-10"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff',
          backdropFilter: 'blur(10px)',
        }}
        aria-label="关闭"
      >
        <X className="w-5 h-5" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        className="absolute left-4 sm:left-8 w-12 h-12 flex items-center justify-center
          rounded-full transition-all duration-300 hover:scale-110 z-10"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff',
          backdropFilter: 'blur(10px)',
        }}
        aria-label="上一张"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onNext() }}
        className="absolute right-4 sm:right-8 w-12 h-12 flex items-center justify-center
          rounded-full transition-all duration-300 hover:scale-110 z-10"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff',
          backdropFilter: 'blur(10px)',
        }}
        aria-label="下一张"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div
        className="photo-viewer-image max-w-[90vw] max-h-[85vh] flex flex-col items-center relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative rounded-xl overflow-hidden"
          style={{
            boxShadow: '0 0 80px rgba(0, 212, 255, 0.1), 0 25px 50px rgba(0, 0, 0, 0.5)',
          }}
        >
          <img
            src={photo.url}
            alt={photo.caption || '乐队照片'}
            className="max-w-full max-h-[75vh] object-contain"
            style={{
              display: 'block',
            }}
          />
          {/* Subtle gradient overlay at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(5, 11, 20, 0.6), transparent)',
            }}
          />
        </div>

        <div className="mt-5 flex flex-col items-center gap-1">
          {photo.caption && (
            <p className="text-white/80 text-sm text-center tracking-wider font-medium">
              {photo.caption}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <div
              className="h-0.5 rounded-full"
              style={{
                width: '40px',
                backgroundColor: 'var(--color-accent)',
                opacity: 0.5,
              }}
            />
            <p className="text-white/40 text-xs font-scifi tracking-widest">
              {currentIndex + 1} / {photos.length}
            </p>
            <div
              className="h-0.5 rounded-full"
              style={{
                width: '40px',
                backgroundColor: 'var(--color-accent)',
                opacity: 0.5,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
