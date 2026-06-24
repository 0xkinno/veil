'use client'

import { useState } from 'react'
import { AUDIT_RECORDS, LIVE_STATS } from '@/lib/auditEngine'
import { mergeWithSeeded } from '@/lib/liveAudits'
import { VerdictBadge } from '@/components/ui'

export default function AuditTimeline() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const records = mergeWithSeeded(AUDIT_RECORDS).slice(0, 120)

  function toggle(id: string) {
    setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), totalDecisions: LIVE_STATS.totalDecisions, records }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'veil-full-audit-log.json'
    a.click()
  }

  function formatFull(iso: string) {
    return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  }

  const dotColor = (v: string) => v === 'APPROVED' ? 'var(--bull)' : v === 'BLOCKED' ? 'var(--bear)' : 'var(--warn)'

  return (
    <div style={{ padding: '28px', minHeight: '100vh' }} className="page-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px' }}>Audit Timeline</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)' }}>
            Verifiable decision history · {LIVE_STATS.totalDecisions.toLocaleString()} total events · Showing last {records.length}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '5px' }}>
            <div className="live-dot" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--brand)' }}>LIVE FEED</span>
          </div>
          <button className="btn-outline" onClick={handleExport}>↓ Export Full Audit Log (JSON)</button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="card" style={{ display: 'flex', marginBottom: '24px', overflow: 'hidden' }}>
        {[
          { l: 'TOTAL AUDITED', v: LIVE_STATS.tradesAudited.toLocaleString(), c: 'var(--brand)' },
          { l: 'APPROVED', v: LIVE_STATS.approved.toLocaleString(), c: 'var(--bull)' },
          { l: 'BLOCKED', v: LIVE_STATS.tradesBlocked.toLocaleString(), c: 'var(--bear)' },
          { l: 'PREVENTION RATE', v: `${LIVE_STATS.badTradePreventionRate}%`, c: 'var(--text-primary)' },
        ].map((s, i, arr) => (
          <div key={s.l} style={{ flex: 1, padding: '16px 22px', borderRight: i < arr.length-1 ? '1px solid var(--border)' : 'none' }}>
            <div className="label" style={{ marginBottom: '6px' }}>{s.l}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: '28px' }}>
        <div style={{ position: 'absolute', left: '9px', top: 0, bottom: 0, width: '1px', background: 'var(--border)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {records.map(d => {
            const isExp = expanded.has(d.id)
            return (
              <div key={d.id} style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-23px', top: '16px', width: '10px', height: '10px', borderRadius: '50%', background: dotColor(d.verdict), border: '2px solid var(--bg-primary)' }} />
                <div style={{ position: 'absolute', left: '-13px', top: '20px', width: '13px', height: '1px', background: 'var(--border)' }} />
                <div className="card" style={{ overflow: 'hidden', borderColor: isExp ? 'var(--border2)' : 'var(--border)', transition: 'border-color 120ms' }}>
                  <button onClick={() => toggle(d.id)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0, flexWrap: 'wrap' }}>
                      <span className="mono-id">{d.id}</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{d.agentName}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: d.direction === 'LONG' ? 'var(--bull)' : 'var(--bear)' }}>{d.direction}</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{d.asset}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: d.finalScore >= 70 ? 'var(--bull)' : d.finalScore >= 50 ? 'var(--warn)' : 'var(--bear)' }}>
                        {d.finalScore}
                      </span>
                      <VerdictBadge verdict={d.verdict} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      <span className="mono-id">{formatFull(d.timestamp)}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{isExp ? '▲' : '▼'}</span>
                    </div>
                  </button>
                  {isExp && (
                    <div style={{ borderTop: '1px solid var(--border)', padding: '14px 16px', background: 'var(--bg-primary)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px', marginBottom: '10px' }}>
                        {(d.layers ?? []).map(layer => (
                          <div key={layer.code} style={{ background: 'var(--bg-surface)', border: `1px solid var(--border)`, borderLeft: `2px solid ${layer.status === 'pass' ? 'var(--bull)' : layer.status === 'warn' ? 'var(--warn)' : 'var(--bear)'}`, borderRadius: '5px', padding: '8px 10px' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700, color: layer.code === 'GAUNTLET' ? 'var(--warn)' : 'var(--brand)', marginBottom: '3px' }}>{layer.code}</div>
                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '5px' }}>{layer.name}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ flex: 1, height: '3px', background: 'var(--border)', borderRadius: '1.5px', marginRight: '8px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${layer.score}%`, background: layer.status === 'pass' ? 'var(--bull)' : layer.status === 'warn' ? 'var(--warn)' : 'var(--bear)' }} />
                              </div>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: layer.status === 'pass' ? 'var(--bull)' : layer.status === 'warn' ? 'var(--warn)' : 'var(--bear)' }}>{layer.score}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>{d.forensicSummary}</div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}