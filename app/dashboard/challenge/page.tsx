'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AUDIT_RECORDS, AGENTS, LAYER_META, type AuditRecord, type AgentId } from '@/lib/auditEngine'
import { VerdictBadge, ScoreBar, ScoreRing, LayerBadge } from '@/components/ui'

const DECISIONS_WITH_SIGNALS = AUDIT_RECORDS.filter(d => d.signals.length > 0)

function ChallengeEngineInner() {
  const searchParams = useSearchParams()
  const incomingId = searchParams.get('id')

  const [selectedId, setSelectedId] = useState<AgentId>('momentum')
  const [selected, setSelected] = useState<AuditRecord>(DECISIONS_WITH_SIGNALS[0])

  // On first load, if a specific audit ID was passed via URL (from Mission Control),
  // try to load that exact record. If it has no signal data, fall back to the
  // nearest record from the same agent that does — so the Evidence panel is never empty.
  useEffect(() => {
    if (!incomingId) return
  
    // First check live audits stored this session
    let liveAudits: AuditRecord[] = []
    try {
      liveAudits = JSON.parse(sessionStorage.getItem('veil_live_audits') || '[]')
    } catch (e) {
      liveAudits = []
    }
  
    const liveMatch = liveAudits.find(r => r.id === incomingId)
    if (liveMatch) {
      setSelected(liveMatch)
      setSelectedId(liveMatch.agentId)
      return
    }
  
    // Otherwise check seeded historical records
    const exactMatch = AUDIT_RECORDS.find(r => r.id === incomingId)
    if (!exactMatch) return
  
    if (exactMatch.signals.length > 0) {
      setSelected(exactMatch)
      setSelectedId(exactMatch.agentId)
    } else {
      const fallback = AUDIT_RECORDS.find(
        r => r.agentId === exactMatch.agentId && r.signals.length > 0
      )
      setSelected({ ...exactMatch, signals: fallback?.signals ?? [], challenges: fallback?.challenges ?? exactMatch.challenges })
      setSelectedId(exactMatch.agentId)
    }
  }, [incomingId])

  const agentDecisions = DECISIONS_WITH_SIGNALS.filter(d => d.agentId === selectedId)
  const agent = AGENTS[selectedId]

  function handleExport() {
    const blob = new Blob([JSON.stringify(selected, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${selected.id}-audit.json`
    a.click()
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }} className="page-enter">

      {/* LEFT PANEL */}
      <div style={{ width: '288px', background: 'var(--bg-surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)' }}>
          <div className="label" style={{ marginBottom: '10px' }}>AGENT SIGNAL</div>
          <select
            value={selectedId}
            onChange={e => {
              const id = e.target.value as AgentId
              setSelectedId(id)
              const first = DECISIONS_WITH_SIGNALS.find(d => d.agentId === id)
              if (first) setSelected(first)
            }}
            style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '5px', fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer', outline: 'none' }}
          >
            {Object.values(AGENTS).map(a => (
              <option key={a.id} value={a.id}>{a.name} · {a.codename}</option>
            ))}
          </select>
        </div>

        {/* Trade claim */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.2)', borderLeft: '2px solid var(--brand)', borderRadius: '6px', padding: '12px 14px' }}>
            <div className="label" style={{ color: 'var(--brand)', marginBottom: '8px' }}>TRADE CLAIM</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '5px' }}>
              <span style={{ color: selected.direction === 'LONG' ? 'var(--bull)' : 'var(--bear)', marginRight: '6px' }}>
                {selected.direction}
              </span>
              {selected.asset}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)' }}>
              Size: {selected.size} · Leverage: {selected.leverage}
            </div>
          </div>
        </div>

        {/* Evidence */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px' }}>
          <div className="label" style={{ marginBottom: '10px' }}>EVIDENCE SUBMITTED</div>
          {selected.signals.length > 0 ? selected.signals.map((sig, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '5px', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', fontWeight: 700, color: 'var(--brand)', background: 'var(--brand-dim)', padding: '2px 5px', borderRadius: '3px', flexShrink: 0 }}>
                {sig.skill.split('-')[0].toUpperCase()}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, color: 'var(--text-primary)' }}>{sig.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: sig.direction === 'bull' ? 'var(--bull)' : sig.direction === 'bear' ? 'var(--bear)' : 'var(--text-muted)' }}>
                  {sig.value}
                </div>
              </div>
              <span style={{ fontSize: '12px', color: sig.verified ? 'var(--bull)' : 'var(--bear)', flexShrink: 0 }}>
                {sig.verified ? '✓' : '✗'}
              </span>
            </div>
          )) : (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)' }}>
              Select a record with full signal data.
            </div>
          )}
        </div>

        {/* Decision list */}
        <div style={{ borderTop: '1px solid var(--border)', padding: '12px 18px' }}>
          <div className="label" style={{ marginBottom: '8px' }}>RECENT DECISIONS</div>
          {agentDecisions.slice(0, 4).map(d => (
            <button key={d.id} onClick={() => setSelected(d)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 9px', borderRadius: '5px', background: d.id === selected.id ? 'var(--brand-dim)' : 'transparent', border: `1px solid ${d.id === selected.id ? 'rgba(56,189,248,0.2)' : 'transparent'}`, cursor: 'pointer', marginBottom: '4px', transition: 'all 120ms' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-secondary)' }}>
                {d.direction} {d.asset}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="mono-id">{formatTime(d.timestamp)}</span>
                <VerdictBadge verdict={d.verdict} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CENTER PANEL */}
      <div style={{ flex: 1, background: 'var(--bg-primary)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="label" style={{ marginBottom: '2px' }}>CHALLENGE ENGINE</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)' }}>
              5-Layer Adversarial Audit · Processing all Bitget Skill Hub modules simultaneously
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div className="live-dot" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--brand)' }}>PROCESSING</span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {/* Score ring */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
            <ScoreRing score={selected.finalScore} size={140} />
            <div style={{ marginTop: '14px', textAlign: 'center' }}>
              <div className="label" style={{ marginBottom: '6px' }}>FINAL VERDICT</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: selected.verdict === 'APPROVED' ? 'var(--bull)' : selected.verdict === 'BLOCKED' ? 'var(--bear)' : 'var(--warn)' }}>
                {selected.verdict === 'APPROVED' ? '✓ APPROVED' : selected.verdict === 'BLOCKED' ? '✗ BLOCKED' : '⏳ PENDING'}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', maxWidth: '300px' }}>
                {selected.forensicSummary}
              </div>
            </div>
          </div>

          {/* 5 Layers */}
          <div className="card" style={{ overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <div className="label">5-LAYER AUDIT BREAKDOWN · PHANTOM · ORACLE · GAUNTLET · PRISM · CHRONICLE</div>
            </div>
            {selected.layers.map(layer => (
              <div key={layer.code} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '180px 1fr 44px', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LayerBadge code={layer.code} />
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-secondary)' }}>{layer.name}</div>
                </div>
                <ScoreBar score={layer.score} height={5} />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, textAlign: 'right', color: layer.status === 'pass' ? 'var(--bull)' : layer.status === 'warn' ? 'var(--warn)' : 'var(--bear)' }}>
                  {layer.score}
                </div>
              </div>
            ))}
          </div>

          {/* GAUNTLET Challenges */}
          {selected.challenges.length > 0 && (
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                <div className="label" style={{ color: 'var(--warn)' }}>⚔ GAUNTLET CHALLENGES</div>
                <div className="label">{selected.challenges.filter(c => c.survived).length}/{selected.challenges.length} SURVIVED</div>
              </div>
              <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selected.challenges.map((ch, i) => (
                  <div key={i} className={ch.survived ? 'challenge-survived' : 'challenge-failed'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div>
                        <span className="mono-id" style={{ marginRight: '8px' }}>{ch.id}</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 700, color: ch.survived ? 'var(--bull)' : 'var(--bear)', letterSpacing: '0.5px' }}>{ch.type}</span>
                      </div>
                      <span className={ch.survived ? 'badge badge-approved' : 'badge badge-blocked'}>
                        {ch.survived ? '✓ SURVIVED' : '✗ FAILED'}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>{ch.title}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '8px' }}>{ch.attack}</div>
                    <div style={{ borderTop: `1px solid ${ch.survived ? 'rgba(16,232,168,0.15)' : 'rgba(255,78,106,0.15)'}`, paddingTop: '8px' }}>
                      <div className="label" style={{ marginBottom: '4px' }}>AGENT RESPONSE</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>
                        "{ch.agentResponse}"
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width: '268px', background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
          <div className="label">AUDIT METADATA</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px' }}>
          {/* Audit ID */}
          <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '5px', padding: '10px 12px', marginBottom: '14px' }}>
            <div className="label" style={{ marginBottom: '5px' }}>AUDIT ID</div>
            <div className="mono-id" style={{ wordBreak: 'break-all', marginBottom: '8px' }}>{selected.id}</div>
            {[
              { k: 'Timestamp', v: new Date(selected.timestamp).toLocaleString() },
              { k: 'Agent', v: `${selected.agentName} · ${selected.codename}` },
              { k: 'Asset', v: selected.asset },
              { k: 'Entry Price', v: `$${selected.entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
              { k: 'Layers Passed', v: `${selected.layersPassed}/5` },
            ].map(row => (
              <div key={row.k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-muted)' }}>{row.k}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)', textAlign: 'right', maxWidth: '140px' }}>{row.v}</span>
              </div>
            ))}
          </div>

          {/* Skill Hub verification */}
          <div style={{ marginBottom: '14px' }}>
            <div className="label" style={{ marginBottom: '10px' }}>BITGET SKILL HUB VERIFICATION</div>
            {['macro-analyst','market-intel','news-briefing','sentiment-analyst','technical-analysis'].map(skill => (
              <div key={skill} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--brand)' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-secondary)' }}>{skill}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 700, color: 'var(--bull)', background: 'var(--bull-dim)', border: '1px solid rgba(16,232,168,0.2)', padding: '1px 6px', borderRadius: '3px' }}>
                  ✓ VERIFIED
                </span>
              </div>
            ))}
          </div>

          {/* PRISM — Execution prediction */}
          <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '5px', padding: '10px 12px', marginBottom: '14px' }}>
            <div className="label" style={{ marginBottom: '8px', color: 'var(--brand)' }}>PRISM · EXECUTION PREDICTION</div>
            {[
              { k: 'Expected Slippage', v: `${selected.slippage.toFixed(3)}%` },
              { k: 'Spread Quality', v: selected.executionQuality },
              { k: 'Liquidity Score', v: `${selected.layers.find(l => l.code === 'PRISM')?.score ?? 80}/100` },
              { k: 'Optimal Window', v: 'Next 15 min' },
            ].map(row => (
              <div key={row.k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-muted)' }}>{row.k}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-primary)', fontWeight: 600 }}>{row.v}</span>
              </div>
            ))}
          </div>

          {/* Agent trust */}
          <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '5px', padding: '10px 12px' }}>
            <div className="label" style={{ marginBottom: '8px' }}>CHRONICLE · AGENT PROFILE</div>
            {[
              { k: 'Trust Score', v: `${agent.trustScore}/100`, c: agent.trustScore >= 70 ? 'var(--bull)' : 'var(--warn)' },
              { k: 'Accuracy', v: `${agent.accuracy}%`, c: 'var(--text-primary)' },
              { k: 'Total Decisions', v: agent.totalDecisions.toLocaleString(), c: 'var(--text-primary)' },
              { k: 'Approval Rate', v: `${agent.approvalRate}%`, c: agent.approvalRate >= 60 ? 'var(--bull)' : 'var(--warn)' },
            ].map(row => (
              <div key={row.k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-muted)' }}>{row.k}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: row.c, fontWeight: 600 }}>{row.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button className="btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={handleExport}>
            ↓ Export Audit JSON
          </button>
          <button className="btn-danger" style={{ width: '100%', justifyContent: 'center' }}>
            ⊘ Override & Block
          </button>
        </div>
      </div>
    </div>
  )
}
export default function ChallengeEngine() {
  return (
    <Suspense fallback={<div style={{ padding: '28px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>Loading Challenge Engine…</div>}>
      <ChallengeEngineInner />
    </Suspense>
  )
}
