import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 flex items-center justify-center rounded-full
        transition-all duration-500 hover:scale-110"
      style={{ color: 'var(--color-text-muted)' }}
      aria-label={theme === 'dark' ? '切换到白天模式' : '切换到黑夜模式'}
      title={theme === 'dark' ? '白天模式' : '黑夜模式'}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  )
}
