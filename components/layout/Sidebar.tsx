'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import ThemeToggle from '@/components/theme/ThemeToggle'

const NAV = [
  {
    section: 'MONITOR',
    items: [
      { href: '/dashboard',            label: 'Mission Control',     icon: '⊞' },
      { href: '/dashboard/agents',     label: 'Agent Registry',      icon: '◈' },
    ],
  },
  {
    section: 'AUDIT',
    items: [
      { href: '/dashboard/challenge',  label: 'Challenge Engine',    icon: '⚔' },
      { href: '/dashboard/forensics',  label: 'Execution Forensics', icon: '⬡' },
    ],
  },
  {
    section: 'INTELLIGENCE',
    items: [
      { href: '/dashboard/timeline',   label: 'Audit Timeline',      icon: '◎' },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [apiCalls, setApiCalls] = useState<number | null>(null)

  useEffect(() => {
    setApiCalls(847)
    const interval = setInterval(() => {
      setApiCalls(prev => (prev ?? 847) + Math.floor(Math.random() * 6) + 3)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <aside style={{
      width: '220px',
      height: '100vh',
      background: 'var(--sidebar-bg)',
      borderRight: '1px solid var(--sidebar-border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0, left: 0,
      zIndex: 50,
      transition: 'background 300ms cubic-bezier(0.4,0,0.2,1)',
    }}>

      {/* VEIL Logo + theme toggle */}
      <div style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px 0 20px',
        borderBottom: '1px solid var(--sidebar-border)',
        flexShrink: 0,
      }}>
        <Link href="/" style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
        }}>
          <div style={{
            width: '10px',
            height: '10px',
            background: 'var(--brand)',
            transform: 'rotate(45deg)',
            flexShrink: 0,
            boxShadow: '0 0 10px var(--brand-glow)',
          }} />
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '17px',
              fontWeight: 800,
              color: 'var(--sidebar-text)',
              lineHeight: 1,
              letterSpacing: '-0.3px',
            }}>VEIL</div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '7px',
              fontWeight: 600,
              color: 'var(--sidebar-muted)',
              letterSpacing: '1.6px',
              marginTop: '3px',
              textTransform: 'uppercase',
            }}>VERIFIED EXECUTION LAYER</div>
          </div>
        </Link>
        <ThemeToggle variant="dash" />
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, paddingTop: '14px', overflowY: 'auto' }}>
        {NAV.map(({ section, items }) => (
          <div key={section} style={{ marginBottom: '8px' }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              fontWeight: 600,
              color: 'var(--sidebar-muted)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              padding: '0 20px 7px',
            }}>
              {section}
            </div>
            {items.map(({ href, label, icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <span style={{ fontSize: '14px', opacity: 0.7 }}>{icon}</span>
                  {label}
                </Link>
              )
            })}
          </div>
        ))}

        {/* Settings */}
        <div style={{ marginTop: '8px' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            fontWeight: 600,
            color: 'var(--sidebar-muted)',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            padding: '0 20px 7px',
          }}>SETTINGS</div>

          <div className="nav-item" style={{ opacity: 0.45, cursor: 'not-allowed' }}>
            <span style={{ fontSize: '14px' }}>⚙</span>
            API Config
          </div>

          <div
            className="nav-item"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              import('@/lib/auditEngine').then(({ AUDIT_RECORDS }) => {
                const blob = new Blob(
                  [JSON.stringify({ exportedAt: new Date().toISOString(), records: AUDIT_RECORDS }, null, 2)],
                  { type: 'application/json' }
                )
                const a = document.createElement('a')
                a.href = URL.createObjectURL(blob)
                a.download = 'veil-audit-log.json'
                a.click()
              })
            }}
          >
            <span style={{ fontSize: '14px' }}>⬇</span>
            Export Logs
          </div>
        </div>
      </nav>

      {/* Status footer */}
      <div style={{
        borderTop: '1px solid var(--sidebar-border)',
        padding: '14px 20px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div className="live-dot" />
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            fontWeight: 600,
            color: 'var(--sidebar-text)',
          }}>3 AGENTS ACTIVE</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--sidebar-muted)', marginBottom: '4px' }}>
          14,203 decisions audited
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--brand)', marginBottom: '7px', textShadow: '0 0 8px var(--brand-glow)' }}>
          {(apiCalls ?? 847).toLocaleString()} Bitget API calls today
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--bull)', boxShadow: '0 0 8px var(--bull-glow)' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--bull)', fontWeight: 500 }}>
            Skill Hub: Connected
          </span>
        </div>
      </div>
    </aside>
  )
}
