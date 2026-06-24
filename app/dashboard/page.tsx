'use client'

import { addLiveAudit, getLiveAudits } from '@/lib/liveAudits'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { AUDIT_RECORDS, AGENTS, LIVE_STATS, type AuditRecord } from '@/lib/auditEngine'
import { VerdictBadge, ScoreBar, MetricCard } from '@/components/ui'

const Radar = dynamic(() => import('@/components/Radar'), { ssr: false })

function formatTime(iso: string, mounted: boolean) {
  if (!mounted) return '--:--:--'
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  })
}

const ASSETS = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT']

export default function MissionControl() {
  const [feed, setFeed] = useState<AuditRecord[]>(() => {
    const combined = [...getLiveAudits(), ...AUDIT_RECORDS.slice(0, 12)]
    const deduped = Array.from(new Map(combined.map(r => [r.id, r])).values())
    return deduped.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 12)
  })
  const [tick, setTick] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [running, setRunning] = useState(false)
  const [latestResult, setLatestResult] = useState<any>(null)

  // Top toolbar selections
  const [selectedAgent, setSelectedAgent] = useState('momentum')
  const [selectedAsset, setSelectedAsset] = useState('BTC/USDT')
  const [selectedDirection, setSelectedDirection] = useState('LONG')

  // Per-agent card selections
  const [agentAsset, setAgentAsset] = useState<Record<string, string>>({
    momentum: 'BTC/USDT', aggressive: 'BTC/USDT', news: 'BTC/USDT',
  })
  const [agentDirection, setAgentDirection] = useState<Record<string, string>>({
    momentum: 'LONG', aggressive: 'LONG', news: 'LONG',
  })
  const [agentLastResult, setAgentLastResult] = useState<Record<string, any>>({})

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 45000)
    return () => clearInterval(interval)
  }, [])

  async function runAuditFor(agentId: string, asset: string, direction: string) {
    setRunning(true)
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset, direction, agentId }),
      })
      const raw = await res.json()

      const agentMeta = AGENTS[agentId as keyof typeof AGENTS]
      const now = new Date()
      const generatedId = raw.id ?? `VEIL-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(Date.now()).slice(-6)}${String(Math.floor(Math.random()*999)).padStart(3,'0')}`

      const data = {
        ...raw,
        id: generatedId,
        agentId,
        asset: raw.asset ?? asset,
        direction: raw.direction ?? direction,
        agentName: raw.agentName ?? agentMeta?.name ?? 'Unknown Agent',
        codename: raw.codename ?? agentMeta?.codename ?? '',
        layers: raw.layers ?? [],
        challenges: raw.challenges ?? [],
        signals: raw.signals ?? [],
        timestamp: raw.timestamp ?? now.toISOString(),
        forensicSummary: raw.forensicSummary ?? `${raw.verdict === 'APPROVED' ? 'Approved' : 'Blocked'}: Live audit via Bitget Skill Hub. Final score ${raw.finalScore}/100.`,
        layersPassed: raw.layersPassed ?? (raw.layers ?? []).filter((l: any) => l.status === 'pass').length,
        entryPrice: raw.entryPrice ?? 67000,
        size: raw.size ?? '0.1',
        leverage: raw.leverage ?? '3x',
        slippage: raw.slippage ?? 0.05,
        executionQuality: raw.executionQuality ?? 'Good',
      }

      setLatestResult(data)
      setFeed(prev => {
        const updated = [data, ...prev]
        const deduped = Array.from(new Map(updated.map(r => [r.id, r])).values())
        return deduped.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 12)
      })
      addLiveAudit(data) // single source of truth — writes to sessionStorage once, no duplicate write
      setAgentLastResult(prev => ({ ...prev, [agentId]: data }))
    } catch (e) {
      console.error('Audit failed', e)
    }
    setRunning(false)
  }

  return (
    <div style={{ padding: '28px', minHeight: '100vh' }} className="page-enter">

      {/* Topbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Mission Control
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div className="live-dot" />
              <span className="glow-live" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--brand)' }}>LIVE</span>
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)' }}>
            Live agent oversight · 3 agents active · All 5 Skill Hub signals processing
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            value={selectedAgent}
            onChange={e => setSelectedAgent(e.target.value)}
            style={{ padding: '8px 10px', height: '38px', border: '1px solid var(--border)', borderRadius: '5px', fontSize: '12px', fontFamily: 'var(--font-body)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
          >
            <option value="momentum">Momentum Agent</option>
            <option value="aggressive">Aggressive Agent</option>
            <option value="news">News Agent</option>
          </select>

          <select
            value={selectedAsset}
            onChange={e => setSelectedAsset(e.target.value)}
            style={{ padding: '8px 10px', height: '38px', border: '1px solid var(--border)', borderRadius: '5px', fontSize: '12px', fontFamily: 'var(--font-body)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
          >
            {ASSETS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          <select
            value={selectedDirection}
            onChange={e => setSelectedDirection(e.target.value)}
            style={{ padding: '8px 10px', height: '38px', border: '1px solid var(--border)', borderRadius: '5px', fontSize: '12px', fontFamily: 'var(--font-body)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
          >
            <option value="LONG">LONG</option>
            <option value="SHORT">SHORT</option>
          </select>

          <button className="btn-primary" onClick={() => runAuditFor(selectedAgent, selectedAsset, selectedDirection)} disabled={running} style={{ height: '38px' }}>
            {running ? '⏳ Running...' : '↻ Run Audit Cycle'}
          </button>
        </div>
      </div>

      {/* Latest audit result banner */}
      {latestResult && (
        <div className="card" style={{
          padding: '14px 18px', marginBottom: '20px', border: '2px solid var(--brand)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px' }}>
              JUST AUDITED
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {latestResult.direction} {latestResult.asset}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 800,
              color: latestResult.finalScore >= 70 ? 'var(--bull)' : latestResult.finalScore >= 50 ? 'var(--warn)' : 'var(--bear)',
            }}>
              {latestResult.finalScore}/100
            </span>
          </div>
          {mounted && <VerdictBadge verdict={latestResult.verdict} />}
        </div>
      )}

      {/* Metrics */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '24px' }}>
        <MetricCard label="DECISIONS TODAY" value={LIVE_STATS.decisionsToday.toLocaleString()} accent="var(--brand)" />
        <MetricCard label="APPROVED" value={`${LIVE_STATS.approved} (${LIVE_STATS.approvalRate}%)`} color="var(--bull)" accent="var(--bull)" />
        <MetricCard label="BLOCKED" value={`${LIVE_STATS.blocked} (${(100 - LIVE_STATS.approvalRate).toFixed(1)}%)`} color="var(--bear)" accent="var(--bear)" />
        <MetricCard label="AVG AUDIT SCORE" value={LIVE_STATS.avgAuditScore} sub="Weighted 5-layer score" />
      </div>

      {/* 3-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>

        {/* Radar — sweeps clockwise only while an audit is in-flight */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '6px' }}>
            <div className="label">GLOBAL AUDIT COMMAND</div>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1px',
              color: running ? 'var(--brand)' : 'var(--text-muted)',
              textShadow: running ? '0 0 8px var(--brand-glow)' : 'none',
              transition: 'color 200ms',
            }}>
              {running ? '◉ SWEEPING' : '○ IDLE'}
            </span>
          </div>
          <Radar size={240} auditing={running} />
          <div style={{ marginTop: '8px', width: '100%' }}>
            {[
              { label: 'Trades Audited', value: LIVE_STATS.tradesAudited.toLocaleString(), color: 'var(--text-primary)' },
              { label: 'Trades Blocked', value: LIVE_STATS.tradesBlocked.toLocaleString(), color: 'var(--bear)' },
              { label: 'Prevention Rate', value: `${LIVE_STATS.badTradePreventionRate}%`, color: 'var(--bull)' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{row.label}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: row.color, letterSpacing: '-0.5px' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Agent cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.values(AGENTS).map(agent => {
            const displayLast = agentLastResult[agent.id] || AUDIT_RECORDS.find(d => d.agentId === agent.id)
            return (
              <div key={agent.id} className="card" style={{ padding: '14px 16px', transition: 'border-color 120ms' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
              >
                <Link href="/dashboard/agents" style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', cursor: 'pointer' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{agent.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>{agent.codename}</div>
                    </div>
                    <span className={agent.status === 'flagged' ? 'badge badge-flagged' : 'badge badge-active'}>
                      {agent.status === 'flagged' ? '⚠ FLAGGED' : '● ACTIVE'}
                    </span>
                  </div>
                </Link>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '10px' }}>
                  {[
                    { l: 'TRUST',     v: `${agent.trustScore}/100`,    c: agent.trustScore >= 70 ? 'var(--bull)' : 'var(--warn)' },
                    { l: 'ACCURACY',  v: `${agent.accuracy}%`,         c: 'var(--text-primary)' },
                    { l: 'RISK DISC', v: `${agent.riskDiscipline}/100`, c: agent.riskDiscipline >= 70 ? 'var(--bull)' : 'var(--warn)' },
                  ].map(s => (
                    <div key={s.l}>
                      <div className="label" style={{ marginBottom: '3px' }}>{s.l}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: s.c }}>{s.v}</div>
                    </div>
                  ))}
                </div>

                {displayLast && (
                  <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '5px', padding: '7px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                      {mounted ? `${displayLast.direction} ${displayLast.asset}` : '— —'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="mono-id">{formatTime(displayLast.timestamp, mounted)}</span>
                      {mounted && <VerdictBadge verdict={displayLast.verdict} />}
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-muted)' }}>Approval Rate</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, color: agent.approvalRate >= 60 ? 'var(--bull)' : 'var(--warn)' }}>
                      {agent.approvalRate}%
                    </span>
                  </div>
                  <ScoreBar score={agent.approvalRate} />
                </div>

                {/* Per-agent asset + direction selectors */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                  <select
                    value={agentAsset[agent.id]}
                    onChange={e => setAgentAsset(prev => ({ ...prev, [agent.id]: e.target.value }))}
                    style={{ padding: '6px 8px', border: '1px solid var(--border)', borderRadius: '5px', fontSize: '11px', fontFamily: 'var(--font-body)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                  >
                    {ASSETS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <select
                    value={agentDirection[agent.id]}
                    onChange={e => setAgentDirection(prev => ({ ...prev, [agent.id]: e.target.value }))}
                    style={{ padding: '6px 8px', border: '1px solid var(--border)', borderRadius: '5px', fontSize: '11px', fontFamily: 'var(--font-body)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                  >
                    <option value="LONG">LONG</option>
                    <option value="SHORT">SHORT</option>
                  </select>
                </div>

                <button
                  className="btn-outline"
                  style={{ width: '100%', fontSize: '11px', height: '32px', justifyContent: 'center' }}
                  disabled={running}
                  onClick={() => runAuditFor(agent.id, agentAsset[agent.id], agentDirection[agent.id])}
                >
                  ↻ Run Audit for {agent.name}
                </button>
              </div>
            )
          })}
        </div>

        {/* Mini live feed */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="label">LIVE AUDIT FEED</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div className="live-dot" />
              <span className="glow-live" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--brand)' }}>LIVE</span>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {feed.slice(0, 8).map(d => (
              <Link key={d.id} href={`/dashboard/challenge?id=${d.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 120ms', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface2)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                        {mounted ? (d.agentName ? d.agentName.split(' ')[0] : 'Agent') : '—'}
                      </span>
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
                    {mounted && <VerdictBadge verdict={d.verdict} />}
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
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px', letterSpacing: '-0.3px' }}>Live Audit Decision Log</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>Click any row to inspect in Challenge Engine</div>
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
                <Link key={d.id} href={`/dashboard/challenge?id=${d.id}`} legacyBehavior>
                  <tr style={{ cursor: 'pointer' }}>
                    <td><span className="mono-id">{formatTime(d.timestamp, mounted)}</span></td>
                    <td><span className="mono-id">{d.id}</span></td>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{d.agentName}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{mounted ? d.asset : '—'}</td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: mounted ? (d.direction === 'LONG' ? 'var(--bull)' : 'var(--bear)') : 'var(--text-muted)' }}>
                        {mounted ? d.direction : '—'}
                      </span>
                    </td>
                    {(d.layers ?? []).map(l => (
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
                    <td>{mounted && <VerdictBadge verdict={d.verdict} />}</td>
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