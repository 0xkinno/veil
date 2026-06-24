'use client'

/*
 * A compact, self-contained preview of VEIL's Mission Control.
 * Pure presentation — static showcase data, no logic, no fetching.
 * Lives inside the homepage tilt-stage to show, at a glance, what VEIL does.
 */

const FEED = [
  { agent: 'Momentum',   dir: 'LONG',  asset: 'BTC/USDT', score: 78, verdict: 'APPROVED' },
  { agent: 'Aggressive', dir: 'SHORT', asset: 'ETH/USDT', score: 42, verdict: 'BLOCKED'  },
  { agent: 'News',       dir: 'LONG',  asset: 'SOL/USDT', score: 81, verdict: 'APPROVED' },
  { agent: 'Momentum',   dir: 'SHORT', asset: 'BTC/USDT', score: 39, verdict: 'BLOCKED'  },
  { agent: 'News',       dir: 'SHORT', asset: 'BNB/USDT', score: 72, verdict: 'APPROVED' },
]

const LAYERS = [
  { code: 'PHANTOM',   score: 88 },
  { code: 'ORACLE',    score: 74 },
  { code: 'GAUNTLET',  score: 68 },
  { code: 'PRISM',     score: 82 },
  { code: 'CHRONICLE', score: 79 },
]

function scoreColor(s: number) {
  return s >= 70 ? 'var(--bull)' : s >= 50 ? 'var(--warn)' : 'var(--bear)'
}

export default function WidgetPreview() {
  return (
    <div style={{
      background: 'var(--card-bg)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-body)',
      display: 'grid',
      gridTemplateColumns: '150px 1fr',
      minHeight: '440px',
    }}>
      {/* mini sidebar */}
      <div style={{
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
        padding: '16px 0',
        display: 'flex', flexDirection: 'column', gap: '2px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px 16px' }}>
          <div style={{ width: '8px', height: '8px', background: 'var(--brand)', transform: 'rotate(45deg)', boxShadow: '0 0 8px var(--brand-glow)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--sidebar-text)', letterSpacing: '-0.3px' }}>VEIL</span>
        </div>
        {[
          { l: 'Mission Control', active: true },
          { l: 'Agent Registry', active: false },
          { l: 'Challenge Engine', active: false },
          { l: 'Execution Forensics', active: false },
          { l: 'Audit Timeline', active: false },
        ].map(item => (
          <div key={item.l} style={{
            fontSize: '10.5px',
            fontWeight: item.active ? 600 : 500,
            color: item.active ? 'var(--sidebar-active-text)' : 'var(--sidebar-muted)',
            background: item.active ? 'var(--sidebar-active-bg)' : 'transparent',
            borderLeft: `2px solid ${item.active ? 'var(--sidebar-active-text)' : 'transparent'}`,
            padding: '8px 16px',
          }}>{item.l}</div>
        ))}
        <div style={{ marginTop: 'auto', padding: '12px 16px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div className="live-dot" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--bull)' }}>SKILL HUB ONLINE</span>
        </div>
      </div>

      {/* mini main */}
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>Mission Control</span>
              <span className="glow-live" style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--brand)' }}>● LIVE</span>
            </div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>3 agents active · 5 Skill Hub signals processing</div>
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '10px',
            color: '#04121C', background: 'var(--brand)', borderRadius: '6px', padding: '5px 10px',
            boxShadow: '0 0 14px var(--brand-glow)',
          }}>↻ Run Audit</div>
        </div>

        {/* metric row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
          {[
            { l: 'DECISIONS', v: '847', c: 'var(--text-primary)' },
            { l: 'APPROVED', v: '72.3%', c: 'var(--bull)' },
            { l: 'BLOCKED', v: '27.7%', c: 'var(--bear)' },
            { l: 'AVG SCORE', v: '74.2', c: 'var(--text-primary)' },
          ].map((m, i) => (
            <div key={m.l} style={{
              background: 'var(--card-bg-2)', border: '1px solid var(--border)',
              borderTop: `2px solid ${i === 1 ? 'var(--bull)' : i === 2 ? 'var(--bear)' : 'var(--brand)'}`,
              borderRadius: '8px', padding: '8px 9px',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '0.6px', color: 'var(--text-muted)' }}>{m.l}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 600, color: m.c, marginTop: '2px' }}>{m.v}</div>
            </div>
          ))}
        </div>

        {/* two-up: layer scores + live feed */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', flex: 1 }}>
          {/* 5-layer breakdown */}
          <div style={{ background: 'var(--card-bg-2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '11px 12px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '9px' }}>5-LAYER AUDIT · BTC/USDT</div>
            {LAYERS.map(l => (
              <div key={l.code} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: l.code === 'GAUNTLET' ? 'var(--warn)' : 'var(--brand)' }}>{l.code}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, color: scoreColor(l.score) }}>{l.score}</span>
                </div>
                <div style={{ height: '3px', background: 'var(--border-solid)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${l.score}%`, height: '100%', background: scoreColor(l.score), borderRadius: '2px' }} />
                </div>
              </div>
            ))}
          </div>

          {/* live feed */}
          <div style={{ background: 'var(--card-bg-2)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 11px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '1px', color: 'var(--text-muted)' }}>LIVE AUDIT FEED</span>
              <span className="glow-live" style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', color: 'var(--brand)' }}>● LIVE</span>
            </div>
            {FEED.map((f, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 11px', borderBottom: i < FEED.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>{f.agent}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700, color: f.dir === 'LONG' ? 'var(--bull)' : 'var(--bear)' }}>{f.dir}</span>
                  <span style={{ fontSize: '8px', fontWeight: 600, color: 'var(--text-primary)' }}>{f.asset}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, color: scoreColor(f.score) }}>{f.score}</span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '6.5px', fontWeight: 600, padding: '1px 4px', borderRadius: '3px',
                    color: f.verdict === 'APPROVED' ? 'var(--bull)' : 'var(--bear)',
                    background: f.verdict === 'APPROVED' ? 'var(--bull-dim)' : 'var(--bear-dim)',
                    border: `1px solid ${f.verdict === 'APPROVED' ? 'var(--bull-glow)' : 'var(--bear-glow)'}`,
                  }}>{f.verdict === 'APPROVED' ? '✓' : '✗'} {f.verdict}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
