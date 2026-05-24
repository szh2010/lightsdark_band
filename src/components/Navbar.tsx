import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Music } from 'lucide-react'
import { siteConfig } from '@/data/site'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-700"
      style={{
        backgroundColor: 'var(--color-nav-bg)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <Music
              className="w-7 h-7 transition-all duration-300 group-hover:scale-110"
              style={{ color: 'var(--color-accent)' }}
            />
            <span
              className="text-xl font-display font-bold tracking-wide"
              style={{ color: 'var(--color-text)' }}
            >
              {siteConfig.bandName}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {siteConfig.navItems
              .filter((item) => item.path !== '/')
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group/link"
                  style={{
                    color: isActive(item.path)
                      ? 'var(--color-accent)'
                      : 'var(--color-text-muted)',
                  }}
                >
                  {item.label}
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full
                      transition-all duration-300 group-hover/link:w-4/5"
                    style={{
                      width: isActive(item.path) ? '60%' : '0%',
                      backgroundColor: 'var(--color-accent)',
                    }}
                  />
                </Link>
              ))}
            <div
              className="ml-2 pl-2"
              style={{ borderLeft: '1px solid var(--color-border)' }}
            >
              <ThemeToggle />
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="切换菜单"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden border-t backdrop-blur-xl"
          style={{
            backgroundColor: 'var(--color-nav-bg)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="px-4 py-3 space-y-1">
            {siteConfig.navItems
              .filter((item) => item.path !== '/')
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300"
                  style={{
                    color: isActive(item.path)
                      ? 'var(--color-accent)'
                      : 'var(--color-text-muted)',
                    backgroundColor: isActive(item.path)
                      ? 'var(--color-accent-bg)'
                      : 'transparent',
                  }}
                >
                  {item.label}
                </Link>
              ))}
          </div>
        </div>
      )}
    </nav>
  )
}
