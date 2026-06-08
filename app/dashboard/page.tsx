'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { AUDIT_RECORDS, AGENTS, LIVE_STATS, type AuditRecord } from '@/lib/auditEngine'
import { VerdictBadge, ScoreBar, MetricCard } from '@/components/ui'

const Globe = dynamic(() => import('@/components/Globe'), { ssr: false })

function formatTime(iso: string, mounted: boolean) {
  if (!mounted) return '--:--:--'
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  })
}

export default function MissionControl() {
  const [feed] = useState<AuditRecord[]>(AUDIT_RECORDS.slice(0, 12))
  const [tick, setTick] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 45000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ padding: '28px', minHeight: '100vh' }} className="page-enter">

      {/* Topbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px' }}>
            Mission Control
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)' }}>
            Live agent oversight · 3 agents active · All 5 Skill Hub signals processing
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div className="live-dot" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--brand)' }}>LIVE</span>
          </div>
          <button className="btn-primary" onClick={() => setTick(t => t + 1)}>
            ↻ Run Audit Cycle
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '24px' }}>
        <MetricCard label="DECISIONS TODAY" value={LIVE_STATS.decisionsToday.toLocaleString()} accent="var(--brand)" />
        <MetricCard label="APPROVED" value={`${LIVE_STATS.approved} (${LIVE_STATS.approvalRate}%)`} color="var(--bull)" accent="var(--bull)" />
        <MetricCard label="BLOCKED" value={`${LIVE_STATS.blocked} (${(100 - LIVE_STATS.approvalRate).toFixed(1)}%)`} color="var(--bear)" accent="var(--bear)" />
        <MetricCard label="AVG AUDIT SCORE" value={LIVE_STATS.avgAuditScore} sub="Weighted 5-layer score" />
      </div>

      {/* 3-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>

        {/* Globe */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="label" style={{ marginBottom: '14px', alignSelf: 'flex-start' }}>GLOBAL AUDIT COMMAND</div>
          <Globe size={240} />
          <div style={{ marginTop: '14px', width: '100%' }}>
          {[
  { label: 'Trades Audited', value: LIVE_STATS.tradesAudited.toLocaleString(), color: 'var(--text-primary)' },
  { label: 'Trades Blocked', value: LIVE_STATS.tradesBlocked.toLocaleString(), color: 'var(--bear)' },
  { label: 'Prevention Rate', value: `${LIVE_STATS.badTradePreventionRate}%`, color: 'var(--bull)' },
].map(row => (
  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
    <span style={{
      fontFamily: 'var(--font-body)',
      fontSize: '12px',
      fontWeight: 600,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    }}>{row.label}</span>
    <span style={{
      fontFamily: 'var(--font-display)',
      fontSize: '20px',
      fontWeight: 800,
      color: row.color,
      letterSpacing: '-0.5px',
    }}>{row.value}</span>
  </div>
))}
          </div>
        </div>

        {/* Agent cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.values(AGENTS).map(agent => {
            const last = AUDIT_RECORDS.find(d => d.agentId === agent.id)
            return (
              <Link key={agent.id} href="/dashboard/agents" style={{ textDecoration: 'none' }}>
                <div
                  className="card"
                  style={{ padding: '14px 16px', cursor: 'pointer', transition: 'border-color 120ms' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {agent.name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>
                        {agent.codename}
                      </div>
                    </div>
                    <span className={agent.status === 'flagged' ? 'badge badge-flagged' : 'badge badge-active'}>
                      {agent.status === 'flagged' ? '⚠ FLAGGED' : '● ACTIVE'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '10px' }}>
                    {[
                      { l: 'TRUST',    v: `${agent.trustScore}/100`,      c: agent.trustScore >= 70 ? 'var(--bull)' : 'var(--warn)' },
                      { l: 'ACCURACY', v: `${agent.accuracy}%`,            c: 'var(--text-primary)' },
                      { l: 'RISK DISC',v: `${agent.riskDiscipline}/100`,   c: agent.riskDiscipline >= 70 ? 'var(--bull)' : 'var(--warn)' },
                    ].map(s => (
                      <div key={s.l}>
                        <div className="label" style={{ marginBottom: '3px' }}>{s.l}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: s.c }}>{s.v}</div>
                      </div>
                    ))}
                  </div>

                  {/* ── HYDRATION FIX: all dynamic values guarded by mounted ── */}
                  {last && (
                    <div style={{
                      background: 'var(--bg-primary)', border: '1px solid var(--border)',
                      borderRadius: '5px', padding: '7px 10px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                        {mounted ? `${last.direction} ${last.asset}` : '— —'}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="mono-id">{formatTime(last.timestamp, mounted)}</span>
                        <VerdictBadge verdict={last.verdict} />
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-muted)' }}>Approval Rate</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, color: agent.approvalRate >= 60 ? 'var(--bull)' : 'var(--warn)' }}>
                        {agent.approvalRate}%
                      </span>
                    </div>
                    <ScoreBar score={agent.approvalRate} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Mini live feed */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="label">LIVE AUDIT FEED</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div className="live-dot" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--brand)' }}>LIVE</span>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {feed.slice(0, 8).map(d => (
              <Link key={d.id} href="/dashboard/challenge" style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    padding: '10px 14px', borderBottom: '1px solid var(--border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    transition: 'background 120ms', cursor: 'pointer',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface2)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                        {d.agentName.split(' ')[0]}
                      </span>
                      {/* HYDRATION FIX */}
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: mounted ? (d.direction === 'LONG' ? 'var(--bull)' : 'var(--bear)') : 'var(--text-muted)' }}>
                        {mounted ? d.direction : '—'}
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {mounted ? d.asset : '—'}
                      </span>
                    </div>
                    <div className="mono-id" style={{ marginTop: '2px' }}>{formatTime(d.timestamp, mounted)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: d.finalScore >= 70 ? 'var(--bull)' : d.finalScore >= 50 ? 'var(--warn)' : 'var(--bear)' }}>
                      {mounted ? d.finalScore : '—'}
                    </span>
                    <VerdictBadge verdict={d.verdict} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Full audit table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
          <div style={{
  fontFamily: 'var(--font-display)',
  fontSize: '15px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '3px',
  letterSpacing: '-0.3px',
}}>Live Audit Decision Log</div>
<div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>
  Click any row to inspect in Challenge Engine
</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['PHANTOM', 'ORACLE', 'GAUNTLET', 'PRISM', 'CHRONICLE'].map(l => (
              <span key={l} style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px',
                color: l === 'GAUNTLET' ? 'var(--warn)' : 'var(--brand)',
                background: l === 'GAUNTLET' ? 'var(--warn-dim)' : 'var(--brand-dim)',
                padding: '3px 9px', borderRadius: '3px',
                border: `1px solid ${l === 'GAUNTLET' ? 'rgba(251,191,36,0.2)' : 'rgba(56,189,248,0.2)'}`,
              }}>{l}</span>
            ))}
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="veil-table">
            <thead>
              <tr>
                {['TIME', 'AUDIT ID', 'AGENT', 'ASSET', 'DIR', 'PHM', 'ORC', 'GNT', 'PRS', 'CHR', 'FINAL', 'VERDICT'].map(col => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {feed.map(d => (
                <Link key={d.id} href="/dashboard/challenge" legacyBehavior>
                  <tr style={{ cursor: 'pointer' }}>
                    <td><span className="mono-id">{formatTime(d.timestamp, mounted)}</span></td>
                    <td><span className="mono-id">{d.id}</span></td>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{d.agentName}</td>
                    {/* HYDRATION FIX — asset and direction guarded */}
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{mounted ? d.asset : '—'}</td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: mounted ? (d.direction === 'LONG' ? 'var(--bull)' : 'var(--bear)') : 'var(--text-muted)' }}>
                        {mounted ? d.direction : '—'}
                      </span>
                    </td>
                    {d.layers.map(l => (
                      <td key={l.code}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: l.status === 'pass' ? 'var(--bull)' : l.status === 'warn' ? 'var(--warn)' : 'var(--bear)' }}>
                          {l.score}
                        </span>
                      </td>
                    ))}
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: d.finalScore >= 70 ? 'var(--bull)' : d.finalScore >= 50 ? 'var(--warn)' : 'var(--bear)' }}>
                        {mounted ? d.finalScore : '—'}
                      </span>
                    </td>
                    <td><VerdictBadge verdict={d.verdict} /></td>
                  </tr>
                </Link>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}