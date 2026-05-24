import { useState, useEffect, useRef, useCallback } from 'react'
import PhotoViewer from '@/components/PhotoViewer'
import { photos } from '@/data/photos'

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

type AspectClass = 'wide' | 'tall' | 'square' | 'loading'

function GalleryCard({
  photo,
  index,
  onClick,
}: {
  photo: (typeof photos)[number]
  index: number
  onClick: () => void
}) {
  const [aspectClass, setAspectClass] = useState<AspectClass>('loading')
  const cardRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    if (img.complete) {
      computeAspect(img)
    } else {
      img.onload = () => computeAspect(img)
      img.onerror = () => setAspectClass('square')
    }
  }, [])

  const computeAspect = (img: HTMLImageElement) => {
    const ratio = img.naturalWidth / img.naturalHeight
    if (ratio > 1.4) {
      setAspectClass('wide')
    } else if (ratio < 0.75) {
      setAspectClass('tall')
    } else {
      setAspectClass('square')
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    card.style.setProperty('--mouse-x', `${x}%`)
    card.style.setProperty('--mouse-y', `${y}%`)
  }

  return (
    <div
      ref={cardRef}
      className={`gallery-card ${aspectClass}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      style={{ animationDelay: `${(index % 8) * 80}ms` }}
    >
      <img
        ref={imgRef}
        src={photo.url}
        alt={photo.caption || '乐队照片'}
        loading="lazy"
        decoding="async"
      />
      <div className="photo-index">{index + 1}</div>
      {photo.caption && (
        <div className="gallery-card-caption">
          <span>{photo.caption}</span>
        </div>
      )}
    </div>
  )
}

export default function GalleryPage() {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const headerRef = useScrollReveal()
  const gridRef = useScrollReveal()

  const openViewer = (index: number) => setViewerIndex(index)
  const closeViewer = () => setViewerIndex(null)

  const goToPrev = useCallback(() => {
    setViewerIndex((prev) => {
      if (prev === null) return null
      return prev === 0 ? photos.length - 1 : prev - 1
    })
  }, [])

  const goToNext = useCallback(() => {
    setViewerIndex((prev) => {
      if (prev === null) return null
      return prev === photos.length - 1 ? 0 : prev + 1
    })
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <div ref={headerRef} className="reveal pt-12 pb-8 text-center">
        <h1
          className="text-3xl sm:text-4xl font-display font-bold mb-3"
          style={{ color: 'var(--color-text)' }}
        >
          照片展示
        </h1>
        <p
          className="font-scifi text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: 'var(--color-accent)', opacity: 0.6 }}
        >
          Gallery
        </p>
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: 'var(--color-accent)' }}
          />
          共 {photos.length} 张照片 · 点击放大查看
        </div>
      </div>

      <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-10">
        <div ref={gridRef} className="gallery-grid reveal">
          {photos.map((photo, i) => (
            <GalleryCard
              key={photo.url}
              photo={photo}
              index={i}
              onClick={() => openViewer(i)}
            />
          ))}
        </div>
      </div>

      {viewerIndex !== null && (
        <PhotoViewer
          photos={photos}
          currentIndex={viewerIndex}
          onClose={closeViewer}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
    </div>
  )
}
