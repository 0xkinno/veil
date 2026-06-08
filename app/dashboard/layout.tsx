import Link from 'next/link'
import Sidebar from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* Sidebar — fixed, always visible */}
      <div style={{
        width: '220px',
        flexShrink: 0,
        position: 'fixed',
        top: 0, left: 0,
        height: '100vh',
        zIndex: 40,
      }}>
        <Sidebar />
      </div>

      {/* Main content */}
      <main style={{
        marginLeft: '220px',
        flex: 1,
        minHeight: '100vh',
        overflow: 'auto',
      }}>
        <div className="page-enter">{children}</div>
      </main>
    </div>
  )
}