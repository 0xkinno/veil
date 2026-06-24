'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AUDIT_RECORDS, BTC_PRICE_DATA, FORENSIC_INSIGHTS } from '@/lib/auditEngine'
import { mergeWithSeeded } from '@/lib/liveAudits'
import { VerdictBadge, MetricCard } from '@/components/ui'

export default function Forensics() {
  const [range, setRange] = useState('7D')
  const [tooltip, setTooltip] = useState<{ x: number; y: number; d: any } | null>(null)

  const hoursMap: Record<string, number> = { '24H': 24, '7D': 168, '30D': 720, 'All': 999999 }
  const cutoff = Date.now() - hoursMap[range] * 60 * 60 * 1000
  const decisions = mergeWithSeeded(AUDIT_RECORDS).filter(d => new Date(d.timestamp).getTime() > cutoff).slice(0, 20)

  const W = 880, H = 300, pad = { t: 16, r: 20, b: 36, l: 56 }
  const iW = W - pad.l - pad.r
  const iH = H - pad.t - pad.b
  const prices = BTC_PRICE_DATA.map(d => d.price)
  const minP = Math.min(...prices) - 500
  const maxP = Math.max(...prices) + 500
  const toX = (i: number) => pad.l + (i / (BTC_PRICE_DATA.length - 1)) * iW
  const toY = (v: number) => pad.t + iH - ((v - minP) / (maxP - minP)) * iH
  const pricePath = BTC_PRICE_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(d.price)}`).join(' ')

  const markers = [
    { d: decisions[0], xi: 7, dir: 'LONG' as const, verdict: 'APPROVED' as const },
    { d: decisions[1], xi: 5, dir: 'LONG' as const, verdict: 'BLOCKED' as const },
    { d: decisions[2], xi: 6, dir: 'SHORT' as const, verdict: 'APPROVED' as const },
    { d: decisions[3], xi: 4, dir: 'LONG' as const, verdict: 'BLOCKED' as const },
    { d: decisions[4], xi: 3, dir: 'SHORT' as const, verdict: 'APPROVED' as const },
  ].filter(m => m.d)

  function formatTime(iso: string) {
    return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
  }

  return (
    <div style={{ padding: '28px', minHeight: '100vh' }} className="page-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px' }}>Execution Forensics</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)' }}>Post-trade analysis · Why trades succeeded or failed · PRISM layer breakdown</p>
        </div>
        <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '5px', overflow: 'hidden' }}>
          {['24H','7D','30D','All'].map(r => (
            <button key={r} onClick={() => setRange(r)} style={{ padding: '6px 14px', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500, background: range === r ? 'var(--brand)' : 'transparent', color: range === r ? '#0A1628' : 'var(--text-muted)', border: 'none', cursor: 'pointer', transition: 'all 120ms' }}>{r}</button>
          ))}
        </div>
      </div>

      {/* Price chart */}
      <div className="card" style={{ padding: '18px', marginBottom: '18px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div className="label">BTC/USDT PRICE CHART (7 DAYS) · ANNOTATED AUDIT DECISIONS</div>
          <div style={{ display: 'flex', gap: '14px', fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>▲ Approved Long</span>
            <span style={{ color: 'var(--bear)' }}>▼ Blocked</span>
            <span style={{ color: 'var(--warn)' }}>● Short Entry</span>
          </div>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: `${H}px`, overflow: 'visible' }}>
          <defs>
            <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[64500,65500,66500,67500].map(v => (
            <g key={v}>
              <line x1={pad.l} x2={W-pad.r} y1={toY(v)} y2={toY(v)} stroke="var(--border)" strokeWidth={0.8} strokeDasharray="3 4" />
              <text x={pad.l-6} y={toY(v)+4} fontSize={8} fill="var(--text-muted)" textAnchor="end" fontFamily="JetBrains Mono">${(v/1000).toFixed(1)}k</text>
            </g>
          ))}
          {BTC_PRICE_DATA.map((d, i) => (
            <text key={d.time} x={toX(i)} y={H-4} fontSize={8} fill="var(--text-muted)" textAnchor="middle" fontFamily="JetBrains Mono">{d.time}</text>
          ))}
          <path d={`${pricePath} L${toX(BTC_PRICE_DATA.length-1)},${H-pad.b} L${toX(0)},${H-pad.b} Z`} fill="url(#pg)" />
          <path d={pricePath} fill="none" stroke="var(--brand)" strokeWidth={1.8} />
          {markers.map((m, i) => {
            const x = toX(m.xi)
            const y = toY(BTC_PRICE_DATA[m.xi]?.price ?? 67000)
            const color = m.verdict === 'APPROVED' ? 'var(--bull)' : 'var(--bear)'
            return (
              <g key={i} style={{ cursor: 'pointer' }}
                onMouseEnter={() => setTooltip({ x, y, d: m.d })}
                onMouseLeave={() => setTooltip(null)}
              >
                {m.dir === 'LONG' ? (
                  <polygon points={`${x},${y-14} ${x-7},${y} ${x+7},${y}`} fill={color} opacity={0.9} />
                ) : m.dir === 'SHORT' ? (
                  <polygon points={`${x},${y+14} ${x-7},${y} ${x+7},${y}`} fill={color} opacity={0.9} />
                ) : (
                  <circle cx={x} cy={y} r={6} fill="var(--warn)" opacity={0.9} />
                )}
              </g>
            )
          })}
          {tooltip && (
            <g>
              <rect x={Math.min(tooltip.x+10, W-180)} y={tooltip.y-62} width={170} height={72} rx={5} fill="var(--bg-surface)" stroke="var(--border)" />
              <text x={Math.min(tooltip.x+18, W-172)} y={tooltip.y-42} fontSize={11} fill="var(--text-primary)" fontFamily="Outfit" fontWeight="700">{tooltip.d.direction} {tooltip.d.asset}</text>
              <text x={Math.min(tooltip.x+18, W-172)} y={tooltip.y-26} fontSize={10} fill="var(--text-muted)" fontFamily="JetBrains Mono">Score: {tooltip.d.finalScore} · {tooltip.d.verdict}</text>
              <text x={Math.min(tooltip.x+18, W-172)} y={tooltip.y-10} fontSize={9} fill="var(--text-muted)" fontFamily="Space Grotesk">{tooltip.d.forensicSummary.slice(0, 42)}...</text>
            </g>
          )}
        </svg>
      </div>

      {/* Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '18px' }}>
        {FORENSIC_INSIGHTS.map((ins, i) => (
          <div key={i} className="card" style={{ padding: '16px', borderTop: `2px solid ${ins.color === 'bear' ? 'var(--bear)' : ins.color === 'warn' ? 'var(--warn)' : 'var(--bull)'}` }}>
            <div className="label" style={{ marginBottom: '7px' }}>{ins.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{ins.value}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)' }}>{ins.detail}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)' }}>
          <div className="label">FORENSIC DECISION LOG</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="veil-table">
            <thead>
              <tr>{['Date/Time','Agent','Asset','Dir','Entry','Exit','P&L','Score','Verdict','Forensic Summary'].map(c => <th key={c}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {decisions.map(d => (
                <Link key={d.id} href={`/dashboard/challenge?id=${d.id}`} legacyBehavior>
                  <tr style={{ cursor: 'pointer' }}>
                    <td><span className="mono-id">{formatTime(d.timestamp)}</span></td>
                    <td style={{ fontSize: '12px' }}>{d.agentName}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.asset}</td>
                    <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: d.direction === 'LONG' ? 'var(--bull)' : 'var(--bear)' }}>{d.direction}</span></td>
                    <td><span className="mono-data">${d.entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></td>
                    <td><span className="mono-data">{d.exitPrice ? `$${d.exitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}</span></td>
                    <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: d.pnl && d.pnl > 0 ? 'var(--bull)' : d.pnl ? 'var(--bear)' : 'var(--text-muted)' }}>{d.pnl ? `+$${d.pnl.toFixed(2)}` : '—'}</span></td>
                    <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: d.finalScore >= 70 ? 'var(--bull)' : d.finalScore >= 50 ? 'var(--warn)' : 'var(--bear)' }}>{d.finalScore}</span></td>
                    <td><VerdictBadge verdict={d.verdict} /></td>
                    <td style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '11px', maxWidth: '200px' }}>{d.forensicSummary}</td>
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