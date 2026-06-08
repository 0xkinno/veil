import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VEIL — Verified Execution Intelligence Layer',
  description: 'The world\'s first AI trading audit protocol. Every AI trade challenged, verified, and approved.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}