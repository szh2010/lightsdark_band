import { useState, useEffect, useRef, useCallback } from 'react'
import type { Photo } from '@/data/photos'
import PhotoViewer from './PhotoViewer'

interface PhotoGridProps {
  photos: Photo[]
}

function useIntersectionObserver(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

function LazyPhoto({ photo, index, onClick }: { photo: Photo; index: number; onClick: () => void }) {
  const { ref, isVisible } = useIntersectionObserver(0.05)
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      ref={ref}
      className="gallery-item"
      onClick={onClick}
      style={{
        animationDelay: `${index * 0.08}s`,
        animation: isVisible ? `revealIn 0.7s ease ${index * 0.08}s forwards` : 'none',
      }}
    >
      <div className="overflow-hidden rounded-xl" style={{ minHeight: '100px' }}>
        {isVisible && (
          <img
            src={photo.url}
            alt={photo.caption || '乐队照片'}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`w-full transition-all duration-700 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
            style={{
              borderRadius: '0.75rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            }}
          />
        )}
        {!loaded && isVisible && (
          <div
            className="w-full rounded-xl animate-pulse"
            style={{
              aspectRatio: '4/3',
              backgroundColor: 'var(--color-surface)',
            }}
          />
        )}
      </div>
      {photo.caption && (
        <div className="gallery-caption">{photo.caption}</div>
      )}
    </div>
  )
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const [displayCount, setDisplayCount] = useState(9)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const openViewer = (index: number) => setViewerIndex(index)
  const closeViewer = () => setViewerIndex(null)

  const goToPrev = () => {
    if (viewerIndex === null) return
    setViewerIndex(viewerIndex === 0 ? photos.length - 1 : viewerIndex - 1)
  }

  const goToNext = () => {
    if (viewerIndex === null) return
    setViewerIndex(viewerIndex === photos.length - 1 ? 0 : viewerIndex + 1)
  }

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && displayCount < photos.length) {
        setDisplayCount((prev) => Math.min(prev + 6, photos.length))
      }
    },
    [displayCount, photos.length]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0 })
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }
    return () => observer.disconnect()
  }, [handleObserver])

  const visiblePhotos = photos.slice(0, displayCount)

  return (
    <>
      <div className="gallery-masonry">
        {visiblePhotos.map((photo, index) => (
          <LazyPhoto
            key={photo.url}
            photo={photo}
            index={index}
            onClick={() => openViewer(index)}
          />
        ))}
      </div>

      {displayCount < photos.length && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          <div
            className="w-8 h-8 rounded-full animate-pulse"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '2px solid var(--color-border)',
            }}
          />
        </div>
      )}

      {viewerIndex !== null && (
        <PhotoViewer
          photos={photos}
          currentIndex={viewerIndex}
          onClose={closeViewer}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
    </>
  )
}
