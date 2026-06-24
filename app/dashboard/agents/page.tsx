'use client'

import { mergeWithSeededForAgent } from '@/lib/liveAudits'
import { useState } from 'react'
import { AGENTS, AUDIT_RECORDS, TRUST_HISTORY, type AgentId } from '@/lib/auditEngine'
import { VerdictBadge, ScoreBar, MetricCard } from '@/components/ui'

export default function AgentRegistry() {
  const [activeId, setActiveId] = useState<AgentId>('momentum')
  const agent = AGENTS[activeId]
  const decisions = mergeWithSeededForAgent(AUDIT_RECORDS, activeId).slice(0, 15)
  const trustData = TRUST_HISTORY[activeId]
  const dates = ['May 26','May 28','May 30','Jun 1','Jun 2','Jun 3','Jun 4','Jun 5','Jun 5','Jun 5','Jun 6','Jun 6']

  const W = 680, H = 200, pad = { t: 16, r: 24, b: 36, l: 48 }
  const iW = W - pad.l - pad.r
  const iH = H - pad.t - pad.b
  const minV = 35, maxV = 100
  const toX = (i: number) => pad.l + (i / (trustData.length - 1)) * iW
  const toY = (v: number) => pad.t + iH - ((v - minV) / (maxV - minV)) * iH
  const trustPath = trustData.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ')
  const approvalRates = activeId === 'momentum'
    ? [65,66,67,68,69,70,71,72,71,72,73,73]
    : activeId === 'aggressive'
    ? [45,44,43,42,41,40,42,41,40,41,42,42]
    : [62,63,64,65,65,66,67,67,68,68,68,68]
  const approvalPath = approvalRates.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ')

  function formatTime(iso: string) {
    return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
  }

  return (
    <div style={{ padding: '28px', minHeight: '100vh' }} className="page-enter">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px' }}>
            Agent Registry
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)' }}>
            3 agents tracked · 14,203 total decisions · Behavioral DNA analysis
          </p>
        </div>
        <button className="btn-outline" onClick={() => {
  const report = {
    exportedAt: new Date().toISOString(),
    agent: AGENTS[activeId],
    decisions: AUDIT_RECORDS.filter(d => d.agentId === activeId),
    trustHistory: TRUST_HISTORY[activeId],
    summary: {
      totalDecisions: AGENTS[activeId].totalDecisions,
      approvalRate: AGENTS[activeId].approvalRate,
      trustScore: AGENTS[activeId].trustScore,
      pnlCorrelation: AGENTS[activeId].pnlCorrelation,
    }
  }
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `veil-agent-${activeId}-report.json`
  a.click()
}}>↓ Export Agent Report</button>
      </div>

      {/* Agent tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', marginBottom: '24px' }}>
        {Object.values(AGENTS).map(a => (
          <button
            key={a.id}
            onClick={() => setActiveId(a.id)}
            style={{
              padding: '10px 22px',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 600,
              color: activeId === a.id ? 'var(--brand)' : 'var(--text-muted)',
          
              marginBottom: '-2px',
              background: 'none',
              border: 'none',
              borderBottom: `3px solid ${activeId === a.id ? 'var(--brand)' : 'transparent'}`,
              cursor: 'pointer',
              transition: 'all 120ms',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: a.status === 'flagged' ? 'var(--warn)' : 'var(--bull)',
              flexShrink: 0,
            }} />
            {a.name}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)' }}>
              {a.codename}
            </span>
          </button>
        ))}
      </div>

      {/* Metrics */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
        <MetricCard label="TRUST SCORE" value={`${agent.trustScore}/100`} color={agent.trustScore >= 70 ? 'var(--bull)' : 'var(--warn)'} accent={agent.trustScore >= 70 ? 'var(--bull)' : 'var(--warn)'} sub="Behavioral confidence index" />
        <MetricCard label="TOTAL DECISIONS" value={agent.totalDecisions.toLocaleString()} sub="All-time audit records" />
        <MetricCard label="APPROVAL RATE" value={`${agent.approvalRate}%`} color={agent.approvalRate >= 60 ? 'var(--bull)' : 'var(--warn)'} accent={agent.approvalRate >= 60 ? 'var(--bull)' : 'var(--warn)'} sub="VEIL-approved decisions" />
        <MetricCard label="P&L CORRELATION" value={`+${agent.pnlCorrelation}`} color="var(--brand)" accent="var(--brand)" sub="Score-to-outcome accuracy" />
      </div>

      {/* ── CHART ── */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: '18px' }}>

        {/* Chart header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.2px',
          }}>
            Trust Score & Approval Rate — 12 Day History
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <svg width="28" height="10">
                <line x1="0" y1="5" x2="28" y2="5" stroke="var(--brand)" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="14" cy="5" r="3" fill="var(--brand)"/>
              </svg>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Trust Score</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <svg width="28" height="10">
                <line x1="0" y1="5" x2="28" y2="5" stroke="var(--bull)" strokeWidth="2" strokeDasharray="5 3" strokeLinecap="round"/>
                <circle cx="14" cy="5" r="2.5" fill="var(--bull)"/>
              </svg>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Approval Rate</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: `${H}px`, overflow: 'visible' }}>
          <defs>
            <linearGradient id="trustGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2FD1FF" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#2FD1FF" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="approvalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34E5A0" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#34E5A0" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Y-axis horizontal grid lines + labels */}
          {[40, 50, 60, 70, 80, 90].map(v => (
            <g key={v}>
              <line
                x1={pad.l} x2={W - pad.r}
                y1={toY(v)} y2={toY(v)}
                stroke={v % 20 === 0 ? 'var(--border2)' : 'var(--border)'}
                strokeWidth={v % 20 === 0 ? 1 : 0.7}
                strokeDasharray={v % 20 === 0 ? 'none' : '3 4'}
              />
              <text
                x={pad.l - 8} y={toY(v) + 4}
                fontSize={12} fontWeight="700"
                fill="var(--text-secondary)"
                textAnchor="end"
                fontFamily="JetBrains Mono, monospace"
              >{v}</text>
            </g>
          ))}

          {/* X-axis date labels */}
          {dates.map((d, i) => i % 2 === 0 && (
            <text
              key={`${d}-${i}`}
              x={toX(i)} y={H - 6}
              fontSize={11} fontWeight="700"
              fill="var(--text-secondary)"
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
            >{d}</text>
          ))}

          {/* Y axis line */}
          <line
            x1={pad.l} y1={pad.t}
            x2={pad.l} y2={H - pad.b}
            stroke="var(--text-muted)"
            strokeWidth={2}
            strokeLinecap="round"
          />

          {/* X axis line */}
          <line
            x1={pad.l} y1={H - pad.b}
            x2={W - pad.r} y2={H - pad.b}
            stroke="var(--text-muted)"
            strokeWidth={2}
            strokeLinecap="round"
          />

          {/* Trust Score gradient fill */}
          <path
            d={`${trustPath} L${toX(trustData.length - 1)},${H - pad.b} L${toX(0)},${H - pad.b} Z`}
            fill="url(#trustGrad)"
          />

          {/* Approval Rate gradient fill */}
          <path
            d={`${approvalPath} L${toX(approvalRates.length - 1)},${H - pad.b} L${toX(0)},${H - pad.b} Z`}
            fill="url(#approvalGrad)"
          />

          {/* Approval Rate line */}
          <path
            d={approvalPath}
            fill="none"
            stroke="var(--bull)"
            strokeWidth={2.5}
            strokeDasharray="6 3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Approval Rate dots */}
          {approvalRates.map((v, i) => (
            <circle
              key={i}
              cx={toX(i)} cy={toY(v)}
              r={3.5}
              fill="var(--bull)"
              stroke="var(--card-bg)"
              strokeWidth={1.5}
            />
          ))}

          {/* Trust Score line */}
          <path
            d={trustPath}
            fill="none"
            stroke="var(--brand)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Trust Score dots */}
          {trustData.map((v, i) => (
            <circle
              key={i}
              cx={toX(i)} cy={toY(v)}
              r={4}
              fill="var(--brand)"
              stroke="var(--card-bg)"
              strokeWidth={2}
            />
          ))}
        </svg>
      </div>

      {/* Behavioral analysis */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, color: 'var(--bull)', marginBottom: '14px' }}>
            ✓ Behavioral Strengths
          </div>
          {agent.strengths.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', padding: '9px 0', borderBottom: i < agent.strengths.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ color: 'var(--bull)', fontSize: '14px', flexShrink: 0 }}>✓</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s}</span>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, color: 'var(--warn)', marginBottom: '14px' }}>
            ⚠ Known Biases & Weaknesses
          </div>
          {agent.weaknesses.map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', padding: '9px 0', borderBottom: i < agent.weaknesses.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ color: 'var(--warn)', fontSize: '14px', flexShrink: 0 }}>⚠</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{w}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Decision history */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)' }}>
          <div className="label">DECISION HISTORY — {agent.name.toUpperCase()} · {agent.codename}</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="veil-table">
            <thead>
              <tr>
                {['Time','Asset','Dir','PHM','ORC','GNT','PRS','CHR','Final','Verdict','Forensic Summary'].map(c => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {decisions.map(d => (
                <tr key={d.id} style={{ cursor: 'pointer' }}>
                  <td><span className="mono-id">{formatTime(d.timestamp)}</span></td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.asset}</td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: d.direction === 'LONG' ? 'var(--bull)' : 'var(--bear)' }}>
                      {d.direction}
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
                      {d.finalScore}
                    </span>
                  </td>
                  <td><VerdictBadge verdict={d.verdict} /></td>
                  <td style={{ fontStyle: 'italic', color: 'var(--text-muted)', maxWidth: '200px', fontSize: '11px' }}>
                    {d.forensicSummary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}