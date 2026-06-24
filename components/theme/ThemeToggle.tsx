'use client'

import { useTheme } from './ThemeProvider'

export default function ThemeToggle({ variant = 'home' }: { variant?: 'home' | 'dash' }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      className={`theme-toggle ${variant === 'dash' ? 'theme-toggle-dash' : ''}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? (
        /* crescent moon */
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          style={{ transform: 'rotate(0deg)' }}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
            fill="currentColor" />
        </svg>
      ) : (
        /* sun outline */
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          style={{ transform: 'rotate(180deg)' }}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      )}
    </button>
  )
}
