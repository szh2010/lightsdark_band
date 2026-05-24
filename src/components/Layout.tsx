import { Outlet } from 'react-router-dom'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import { useThemeStore } from '@/store/themeStore'

function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(scrollPercent)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (progress <= 0) return null

  return (
    <div
      className="scroll-progress"
      style={{ width: `${progress}%` }}
    />
  )
}

function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const posRef = useRef({ x: -500, y: -500 })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    posRef.current = { x: e.clientX, y: e.clientY }
  }, [])

  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return

    const updatePosition = () => {
      glow.style.left = `${posRef.current.x}px`
      glow.style.top = `${posRef.current.y}px`
      rafRef.current = requestAnimationFrame(updatePosition)
    }

    window.addEventListener('mousemove', handleMouseMove)
    rafRef.current = requestAnimationFrame(updatePosition)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [handleMouseMove])

  return <div ref={glowRef} className="cursor-glow" />
}

export default function Layout() {
  const theme = useThemeStore((s) => s.theme)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    if (isHome) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isHome])

  // Page transition effect
  useEffect(() => {
    const main = mainRef.current
    if (!main) return
    main.classList.add('page-transition-enter')
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        main.classList.remove('page-transition-enter')
        main.classList.add('page-transition-enter-active')
        setTimeout(() => {
          main.classList.remove('page-transition-enter-active')
        }, 500)
      })
    })
  }, [location.pathname])

  return (
    <div
      className="min-h-screen transition-colors duration-700 relative"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      <ScrollProgress />
      <CursorGlow />

      {/* Decorative ambient glow - top-right */}
      <div
        className="fixed top-[-15%] right-[-5%] w-[600px] h-[600px] rounded-full pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'var(--color-accent)',
          filter: 'blur(180px)',
          opacity: 0.05,
        }}
      />
      {/* Decorative ambient glow - bottom-left */}
      <div
        className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'var(--color-accent-secondary)',
          filter: 'blur(150px)',
          opacity: 0.03,
        }}
      />

      {!isHome && <Navbar />}
      <main ref={mainRef} className={isHome ? '' : 'pt-16'}>
        <Outlet />
      </main>
      {!isHome && (
        <footer
          className="border-t py-6 mt-12"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p
              className="text-sm font-scifi tracking-widest uppercase"
              style={{ color: 'var(--color-text-muted)' }}
            >
              &copy; {new Date().getFullYear()} Lightsdark Band
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}
            >
              暗夜星空乐队官方网站
            </p>
          </div>
        </footer>
      )}
    </div>
  )
}
