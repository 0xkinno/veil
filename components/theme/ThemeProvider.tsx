'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'dark' | 'light'
type Ctx = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void }

const ThemeContext = createContext<Ctx>({ theme: 'dark', toggle: () => {}, setTheme: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default dark; the inline script in layout has already applied the
  // persisted value to <html> before paint, so we read it back on mount.
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    // localStorage is the source of truth. React hydration re-renders
    // <html> from server markup (data-theme="dark"), which can clobber
    // what the pre-paint script set — so we re-read and re-assert here.
    let stored: Theme | null = null
    try {
      const v = localStorage.getItem('veil-theme')
      if (v === 'dark' || v === 'light') stored = v
    } catch {}
    const next = stored ?? 'dark'
    setThemeState(next)
    document.documentElement.setAttribute('data-theme', next)
  }, [])

  const apply = useCallback((t: Theme) => {
    setThemeState(t)
    document.documentElement.setAttribute('data-theme', t)
    try { localStorage.setItem('veil-theme', t) } catch {}
  }, [])

  const toggle = useCallback(() => {
    apply(theme === 'dark' ? 'light' : 'dark')
  }, [theme, apply])

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme: apply }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
