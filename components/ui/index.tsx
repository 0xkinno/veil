import { Verdict } from '@/lib/auditEngine'

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const cls = verdict === 'APPROVED' ? 'badge badge-approved' : verdict === 'BLOCKED' ? 'badge badge-blocked' : 'badge badge-pending'
  const icon = verdict === 'APPROVED' ? '✓' : verdict === 'BLOCKED' ? '✗' : '⏳'
  return <span className={cls}>{icon} {verdict}</span>
}

export function ScoreBar({ score, height = 4 }: { score: number; height?: number }) {
  const color = score >= 70 ? 'var(--bull)' : score >= 50 ? 'var(--warn)' : 'var(--bear)'
  return (
    <div className="score-bar" style={{ height }}>
      <div className="score-bar-fill" style={{ width: `${score}%`, background: color }} />
    </div>
  )
}

export function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const r = (size - 18) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 70 ? 'var(--bull)' : score >= 50 ? 'var(--warn)' : 'var(--bear)'
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={9} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={9}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 800ms ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: `${size * 0.24}px`, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', marginTop: '2px' }}>SCORE</span>
      </div>
    </div>
  )
}

export function MetricCard({ label, value, sub, color, accent }: {
  label: string; value: string | number; sub?: string; color?: string; accent?: string
}) {
  return (
    <div className="card" style={{ padding: '16px 20px', flex: 1, borderTop: `2px solid ${accent || 'var(--brand)'}` }}>
      <div className="label" style={{ marginBottom: '8px' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: color || 'var(--text-primary)', lineHeight: 1.2 }}>
        {value}
      </div>
      {sub && <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{sub}</div>}
    </div>
  )
}

export function LayerBadge({ code }: { code: string }) {
  const color = code === 'GAUNTLET' ? 'var(--warn)' : 'var(--brand)'
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
      color, background: code === 'GAUNTLET' ? 'var(--warn-dim)' : 'var(--brand-dim)',
      border: `1px solid ${code === 'GAUNTLET' ? 'rgba(251,191,36,0.2)' : 'rgba(56,189,248,0.2)'}`,
      padding: '1px 6px', borderRadius: '3px', letterSpacing: '0.5px',
    }}>
      {code}
    </span>
  )
}