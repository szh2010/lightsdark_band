import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Info, Images, Play, Sparkles, Sun, Moon } from 'lucide-react'
import { siteConfig } from '@/data/site'
import { songs } from '@/data/songs'
import { useThemeStore } from '@/store/themeStore'

function pickSong() {
  return songs[Math.floor(Math.random() * songs.length)]
}

export default function HomePage() {
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const [song, setSong] = useState(() => pickSong())
  const [activeIdx, setActiveIdx] = useState(2)
  const [visible] = useState(true)
  const [transitioning, setTransitioning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const starCanvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const activeIdxRef = useRef(2)

  const lyrics = song.lyrics
  const isNight = theme === 'dark'

  activeIdxRef.current = activeIdx

  const getVisibleLyrics = useCallback(() => {
    const idx = activeIdxRef.current
    const start = Math.max(0, idx - 2)
    const end = Math.min(lyrics.length, idx + 3)
    const slice = lyrics.slice(start, end)

    while (slice.length < 5 && start > 0) {
      const prevIdx = Math.max(0, start - (5 - slice.length))
      const extra = lyrics.slice(prevIdx, start)
      slice.unshift(...extra)
    }
    while (slice.length < 5 && end < lyrics.length) {
      const extra = lyrics.slice(end, Math.min(lyrics.length, end + (5 - slice.length)))
      slice.push(...extra)
    }

    return { lines: slice.slice(0, 5), visibleActiveIdx: Math.min(idx, 2) }
  }, [lyrics])

  // Star field animation for night mode
  useEffect(() => {
    if (!isNight) return

    const canvas = starCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars: { x: number; y: number; r: number; speed: number; opacity: number; phase: number }[] = []
    for (let i = 0; i < 180; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.3,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.6 + 0.3,
        phase: Math.random() * Math.PI * 2,
      })
    }

    let frame = 0
    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      for (const star of stars) {
        const twinkle = Math.sin(frame * 0.03 + star.phase) * 0.4 + 0.6
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`
        ctx.fill()

        star.y += star.speed
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [isNight])

  // Lyrics carousel timer
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => {
        const next = prev + 1
        if (next >= song.lyrics.length) {
          clearInterval(timerRef.current!)
          setTransitioning(true)
          setTimeout(() => {
            setActiveIdx(2)
            const newSong = pickSong()
            setSong(newSong)
            setTransitioning(false)
          }, 800)
          return prev
        }
        return next
      })
    }, 2400)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [song])

  const handleSongReload = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setTransitioning(true)
    setTimeout(() => {
      setActiveIdx(2)
      const newSong = pickSong()
      setSong(newSong)
      setTransitioning(false)
    }, 600)
  }

  const { lines, visibleActiveIdx } = getVisibleLyrics()

  return (
    <div className="home-locked flex flex-col items-center justify-center overflow-hidden">
      {isNight && (
        <canvas ref={starCanvasRef} className="star-field" />
      )}

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{
          backgroundImage: isNight ? `url(${siteConfig.nightBackgroundImage})` : 'none',
          opacity: isNight ? 0.2 : 0,
        }}
      />
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{ backgroundColor: isNight ? 'rgba(5, 11, 20, 0.55)' : 'var(--color-bg)' }}
      />

      {/* Top-right controls */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <button
          onClick={handleSongReload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
            border transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          换一首
        </button>
        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-full
            border transition-all duration-500 hover:scale-110"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
          aria-label={isNight ? '切换到白天模式' : '切换到黑夜模式'}
        >
          {isNight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl px-6">
        <div
          className={`mb-8 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h1
            className="font-display font-bold text-center tracking-widest leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--color-text)' }}
          >
            {siteConfig.bandName}
          </h1>
          <p
            className="font-scifi text-center tracking-[0.3em] mt-3 uppercase"
            style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)', color: 'var(--color-accent)' }}
          >
            {siteConfig.bandNameEn}
          </p>
        </div>

        <div
          className={`mb-6 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p
            className="font-scifi text-center tracking-[0.5em] uppercase"
            style={{ fontSize: '0.65rem', color: 'var(--color-accent)', opacity: 0.6 }}
          >
            NOW PLAYING
          </p>
        </div>

        {/* Navigation cards */}
        <div
          className={`grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg mt-8 transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {[
            { to: '/about', icon: Info, label: '乐队信息' },
            { to: '/gallery', icon: Images, label: '照片展示' },
            { to: '/videos', icon: Play, label: '表演视频' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="home-nav-card flex flex-col items-center gap-2 py-4 rounded-xl
                border transition-all duration-300 hover:-translate-y-1 group"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <item.icon
                className="w-5 h-5 transition-all duration-300 group-hover:scale-110"
                style={{ color: 'var(--color-accent)' }}
              />
              <span
                className="text-xs font-medium transition-colors duration-300 group-hover:text-[var(--color-accent)]"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        <div
          className={`mt-12 transition-all duration-700 delay-700 ${visible ? 'opacity-100' : 'opacity-0'}`}
        >
          <p
            className="text-center tracking-widest font-scifi"
            style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}
          >
            {siteConfig.slogan}
          </p>
        </div>
      </div>

      {/* Bottom-left dynamic lyrics */}
      <div
        className={`absolute bottom-6 left-4 sm:bottom-8 sm:left-6 lg:bottom-10 lg:left-10 z-10 transition-all duration-1000 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{
          maxWidth: 'min(45vw, 560px)',
          width: '100%',
        }}
      >
        {/* Song info badge */}
        <div
          className={`lyrics-song-badge ${!transitioning ? 'visible' : ''}`}
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          <span className="badge-dot" />
          {song.title} · {song.artist}
        </div>

        {/* Lyrics lines */}
        <div
          className="flex flex-col gap-0.5 sm:gap-1"
          style={{ opacity: transitioning ? 0.25 : 1, transition: 'opacity 0.4s ease' }}
        >
          {lines.map((line, i) => {
            const isActive = i === visibleActiveIdx
            const isDim = Math.abs(i - visibleActiveIdx) === 1
            return (
              <p
                key={`${song.id}-${activeIdx}-${i}`}
                className={`lyrics-stroke ${isActive ? 'active' : isDim ? 'dim' : ''}`}
                style={{
                  fontSize: isActive
                    ? 'clamp(1.1rem, 3vw, 2rem)'
                    : 'clamp(0.75rem, 1.8vw, 1.15rem)',
                }}
              >
                {line}
              </p>
            )
          })}
        </div>
      </div>
    </div>
  )
}