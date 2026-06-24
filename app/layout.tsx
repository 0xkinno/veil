import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme/ThemeProvider'

export const metadata: Metadata = {
  title: 'VEIL — Verified Execution Intelligence Layer',
  description: 'The world\'s first AI trading audit protocol. Every AI trade challenged, verified, and approved.',
  icons: { icon: '/favicon.ico' },
}

// Runs before paint so the persisted theme is on <html> immediately —
// no flash of the wrong palette on reload.
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('veil-theme');
    if (t !== 'dark' && t !== 'light') t = 'dark';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
