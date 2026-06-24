'use client'

import { useEffect, useState } from 'react'

// Same token data that fed the Globe — symbol + value pairs.
const TOKENS = [
  { symbol: 'BTC', value: '67,420', angle: -45 },  // top-right
  { symbol: 'ETH', value: '3,512',  angle: 35 },   // right
  { symbol: 'SOL', value: '178.4',  angle: 145 },  // bottom-left
  { symbol: 'BNB', value: '604.2',  angle: -135 }, // top-left
]

const R_BADGE = 132 // radius at which badges float

function badgePos(angleDeg: number, r: number) {
  const a = (angleDeg * Math.PI) / 180
  return { x: 160 + r * Math.cos(a), y: 160 + r * Math.sin(a) }
}

export default function Radar({
  size = 300,
  auditing = false,
}: {
  size?: number
  auditing?: boolean
}) {
  // Stagger badge pulse so they breathe independently.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div
      className={`radar ${auditing ? 'auditing' : ''}`}
      style={{ position: 'relative', width: size, height: size }}
    >
      <svg viewBox="0 0 320 320" width={size} height={size}
        style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="veil-sweep" x1="160" y1="160" x2="305" y2="160"
            gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="veil-trail" cx="160" cy="160" r="145"
            gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.10" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* concentric rings */}
        <circle cx="160" cy="160" r="145" fill="none" stroke="var(--brand)" strokeWidth="0.5" opacity="0.12" />
        <circle cx="160" cy="160" r="110" fill="none" stroke="var(--brand)" strokeWidth="0.5" opacity="0.18" />
        <circle cx="160" cy="160" r="75"  fill="none" stroke="var(--brand)" strokeWidth="1"   opacity="0.28" />
        <circle cx="160" cy="160" r="40"  fill="none" stroke="var(--brand)" strokeWidth="1"   opacity="0.40" />

        {/* crosshairs */}
        <line x1="15"  y1="160" x2="305" y2="160" stroke="var(--brand)" strokeWidth="0.4" opacity="0.10" />
        <line x1="160" y1="15"  x2="160" y2="305" stroke="var(--brand)" strokeWidth="0.4" opacity="0.10" />

        {/* faint tick marks on the outermost ring */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180
          const x1 = 160 + 140 * Math.cos(a)
          const y1 = 160 + 140 * Math.sin(a)
          const x2 = 160 + 145 * Math.cos(a)
          const y2 = 160 + 145 * Math.sin(a)
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--brand)" strokeWidth="0.8" opacity="0.2" />
        })}

        {/* sweep group — rotates clockwise only while .auditing */}
        <g className="radar-sweep">
          {/* soft trailing wedge */}
          <path d="M160 160 L305 160 A145 145 0 0 0 270 56 Z" fill="url(#veil-trail)" />
          {/* leading arm */}
          <line x1="160" y1="160" x2="305" y2="160" stroke="url(#veil-sweep)" strokeWidth="1.6" />
        </g>

        {/* connector lines from badges to center */}
        {TOKENS.map(t => {
          const p = badgePos(t.angle, R_BADGE)
          return (
            <line key={`c-${t.symbol}`} x1="160" y1="160" x2={p.x} y2={p.y}
              stroke="var(--brand)" strokeWidth="0.6" opacity="0.15" />
          )
        })}

        {/* blips on rings */}
        <circle cx={badgePos(-45, 110).x} cy={badgePos(-45, 110).y} r="2.5" fill="var(--brand)" opacity="0.7" />
        <circle cx={badgePos(35, 75).x}   cy={badgePos(35, 75).y}   r="2"   fill="var(--bull)"  opacity="0.7" />
        <circle cx={badgePos(145, 110).x} cy={badgePos(145, 110).y} r="2"   fill="var(--brand)" opacity="0.6" />
        <circle cx={badgePos(-135, 75).x} cy={badgePos(-135, 75).y} r="2.5" fill="var(--warn)"  opacity="0.7" />

        {/* center pulse */}
        <circle className="radar-center" cx="160" cy="160" r="4" fill="var(--brand)" />
        <circle cx="160" cy="160" r="9" fill="none" stroke="var(--brand)" strokeWidth="1" opacity="0.4" />
      </svg>

      {/* floating token badges (HTML — crisp text, backdrop blur) */}
      {TOKENS.map((t, i) => {
        const scale = size / 320
        const p = badgePos(t.angle, R_BADGE)
        return (
          <div
            key={t.symbol}
            style={{
              position: 'absolute',
              left: p.x * scale,
              top: p.y * scale,
              transform: 'translate(-50%, -50%)',
              background: 'var(--card-bg)',
              border: '1px solid var(--border-solid)',
              borderRadius: '8px',
              padding: '5px 11px',
              backdropFilter: 'blur(8px)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              boxShadow: 'var(--shadow-card)',
              opacity: mounted ? 1 : 0,
              animation: mounted ? `subtlePulse 3s ease-in-out ${i * 0.7}s infinite` : undefined,
              transition: 'opacity 400ms ease',
            }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>{t.symbol}</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>${t.value}</span>
          </div>
        )
      })}
    </div>
  )
}
