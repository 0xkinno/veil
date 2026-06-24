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
          DEFAULT: '#2FD1FF',
          dark: '#0090D4',
          light: '#BDEEFF',
        },
        bull: '#34E5A0',
        bear: '#FF5C72',
        warn: '#F0AE4D',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
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
        card: '14px',
        btn: '9px',
        sm: '5px',
      },
      spacing: {
        '18': '72px',
        sidebar: '220px',
        topbar: '64px',
      },
      animation: {
        'fade-in': 'fadeIn 220ms cubic-bezier(0.4,0,0.2,1)',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
