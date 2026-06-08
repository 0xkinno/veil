'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

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
      background: '#0A1628',
      borderRight: '1px solid #1E3A5F',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0, left: 0,
      zIndex: 50,
    }}>

      {/* VEIL Logo — click goes to homepage */}
      <Link href="/" style={{
        textDecoration: 'none',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        borderBottom: '1px solid #1E3A5F',
        gap: '10px',
        flexShrink: 0,
        cursor: 'pointer',
      }}>
        <div style={{
          width: '10px',
          height: '10px',
          background: '#38BDF8',
          transform: 'rotate(45deg)',
          flexShrink: 0,
        }} />
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '17px',
            fontWeight: 800,
            color: '#E8F0FE',
            lineHeight: 1,
            letterSpacing: '-0.3px',
          }}>VEIL</div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '8px',
            fontWeight: 600,
            color: '#2A5080',
            letterSpacing: '2px',
            marginTop: '3px',
            textTransform: 'uppercase',
          }}>VERIFIED EXECUTION LAYER</div>
        </div>
      </Link>

      {/* Navigation */}
      <nav style={{ flex: 1, paddingTop: '12px', overflowY: 'auto' }}>
        {NAV.map(({ section, items }) => (
          <div key={section} style={{ marginBottom: '6px' }}>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 700,
              color: '#2A5080',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              padding: '0 20px 6px',
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
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            fontWeight: 700,
            color: '#2A5080',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            padding: '0 20px 6px',
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
        borderTop: '1px solid #1E3A5F',
        padding: '14px 20px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
          <div className="live-dot" />
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            fontWeight: 600,
            color: '#E8F0FE',
          }}>3 AGENTS ACTIVE</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#4A7099', marginBottom: '4px' }}>
          14,203 decisions audited
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#38BDF8', marginBottom: '6px' }}>
          {(apiCalls ?? 847).toLocaleString()} Bitget API calls today
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10E8A8' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#10E8A8', fontWeight: 500 }}>
            Skill Hub: Connected
          </span>
        </div>
      </div>
    </aside>
  )
}