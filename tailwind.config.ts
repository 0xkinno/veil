import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#00B4D8',
          dark: '#0077A8',
          light: '#E0F7FD',
        },
        surface: {
          bg: '#F7FAFC',
          primary: '#FFFFFF',
          secondary: '#EEF5FA',
        },
        text: {
          primary: '#0B1523',
          secondary: '#4A6580',
          tertiary: '#8BA3B8',
        },
        border: {
          default: '#DDE8F0',
          active: '#00B4D8',
        },
        bull: '#00C896',
        bear: '#F04E6A',
        warn: '#F5A623',
        ink: '#0B1523',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': '10px',
        xs: '12px',
        sm: '13px',
        base: '14px',
        md: '16px',
        lg: '20px',
        xl: '28px',
        '2xl': '32px',
        '3xl': '52px',
      },
      borderRadius: {
        card: '10px',
        btn: '6px',
        sm: '4px',
      },
      spacing: {
        '18': '72px',
        sidebar: '220px',
        topbar: '64px',
      },
      boxShadow: {
        none: 'none',
      },
      animation: {
        'fade-in': 'fadeIn 150ms ease-out',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'score-fill': 'scoreFill 1s ease-out forwards',
        'ticker': 'ticker 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.85)' },
        },
        scoreFill: {
          '0%': { strokeDashoffset: '339.3' },
          '100%': { strokeDashoffset: 'var(--dash-offset)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config