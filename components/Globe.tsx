'use client'

import { useEffect, useRef, useCallback } from 'react'

const TOKENS = [
  { symbol: '$BTC', color: '#F7931A', border: '#FFB84D' },
  { symbol: '$ETH', color: '#3C7FBF', border: '#6BAED6' },
  { symbol: '$BNB', color: '#F0B90B', border: '#FFD94D' },
  { symbol: '$SOL', color: '#9945FF', border: '#C084FC' },
  { symbol: '$SUI', color: '#4DA2FF', border: '#93C5FD' },
  { symbol: '$BGB', color: '#0284C7', border: '#38BDF8' },
]

const ORBIT_RADIUS = 115 // single orbit line
const SPEED = -0.006    // negative = anticlockwise

export default function Globe({ size = 280 }: { size?: number }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const frameRef   = useRef<number>(0)
  const rotRef     = useRef(0)
  const anglesRef  = useRef(
    TOKENS.map((_, i) => (i / TOKENS.length) * Math.PI * 2)
  )
  const pulsesRef  = useRef<{ x: number; y: number; age: number; type: 'bull' | 'bear' }[]>([])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cx = size / 2
    const cy = size / 2
    const R  = size * 0.32

    ctx.clearRect(0, 0, size, size)

    // Globe base
    const g = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.3, R * 0.05, cx, cy, R)
    g.addColorStop(0,   '#1A6DB5')
    g.addColorStop(0.5, '#0F4C8A')
    g.addColorStop(1,   '#071E42')
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, Math.PI * 2)
    ctx.fillStyle = g
    ctx.fill()

    // Latitude lines
    ctx.strokeStyle = 'rgba(100,180,255,0.15)'
    ctx.lineWidth = 0.6
    for (let lat = -60; lat <= 60; lat += 30) {
      const yr = R * Math.cos((lat * Math.PI) / 180)
      const y  = cy + R * Math.sin((lat * Math.PI) / 180)
      ctx.beginPath()
      ctx.ellipse(cx, y, yr, yr * 0.15, 0, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Longitude lines
    for (let lon = 0; lon < 360; lon += 30) {
      const a = ((lon + rotRef.current * 25) * Math.PI) / 180
      ctx.beginPath()
      ctx.ellipse(cx, cy, R * Math.abs(Math.cos(a)), R, 0, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Land dots
    const dots = [
      [0.2,-0.3],[-.1,-.1],[0.4,0.2],[-.3,0.4],[0.1,0.5],
      [-.4,-.2],[0.5,-.1],[-.2,0.1],[0.3,0.4],[-.5,0.3],
      [0.0,-.4],[0.55,0.1],[-.35,0.0],[0.25,-.42],[-.15,0.32],
    ]
    dots.forEach(([dx, dy]) => {
      const px = cx + (dx||0) * R + Math.sin(rotRef.current + (dx||0) * 4) * R * 0.03
      const py = cy + (dy||0) * R
      if ((px-cx)**2 + (py-cy)**2 < R*R*0.88) {
        ctx.beginPath()
        ctx.arc(px, py, 2, 0, Math.PI*2)
        ctx.fillStyle = 'rgba(120,180,230,0.45)'
        ctx.fill()
      }
    })

    // Sheen
    const sheen = ctx.createRadialGradient(cx - R*0.35, cy - R*0.35, 0, cx, cy, R)
    sheen.addColorStop(0,   'rgba(150,220,255,0.18)')
    sheen.addColorStop(0.6, 'rgba(100,180,255,0.05)')
    sheen.addColorStop(1,   'transparent')
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, Math.PI*2)
    ctx.fillStyle = sheen
    ctx.fill()

    // Edge glow — subtle only
    const edge = ctx.createRadialGradient(cx, cy, R * 0.82, cx, cy, R + 3)
    edge.addColorStop(0,   'transparent')
    edge.addColorStop(1,   'rgba(56,189,248,0.2)')
    ctx.beginPath()
    ctx.arc(cx, cy, R + 2, 0, Math.PI * 2)
    ctx.fillStyle = edge
    ctx.fill()

    // Audit pulses
    pulsesRef.current = pulsesRef.current.filter(p => p.age < 45)
    pulsesRef.current.forEach(pulse => {
      const progress = pulse.age / 45
      const pr = progress * 26
      const opacity = (1 - progress) * 0.6
      ctx.beginPath()
      ctx.arc(pulse.x, pulse.y, pr, 0, Math.PI * 2)
      ctx.strokeStyle = pulse.type === 'bull'
        ? `rgba(5,150,105,${opacity})`
        : `rgba(220,38,38,${opacity})`
      ctx.lineWidth = 1.5
      ctx.stroke()
      pulse.age++
    })

    // Single orbit ellipse guide line
    ctx.beginPath()
    ctx.ellipse(cx, cy, ORBIT_RADIUS, ORBIT_RADIUS * 0.45, 0, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(56,189,248,0.12)'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 6])
    ctx.stroke()
    ctx.setLineDash([])

    // Tokens — all on single orbit, anticlockwise, no heavy glow
    TOKENS.forEach((token, i) => {
      anglesRef.current[i] += SPEED

      const a  = anglesRef.current[i]
      const tx = cx + ORBIT_RADIUS * Math.cos(a)
      const ty = cy + ORBIT_RADIUS * Math.sin(a) * 0.45

      // Depth — tokens "behind" globe are hidden
      const depth = Math.sin(a)
      if (depth < -0.3) return // hide when behind

      const chipW = 62
      const chipH = 30

      // No heavy shadow — just clean chip
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur  = 0

      // Token background
      ctx.beginPath()
      ctx.roundRect(tx - chipW/2, ty - chipH/2, chipW, chipH, 4)
      ctx.fillStyle = token.color
      ctx.fill()

      // Token border — thin
      ctx.strokeStyle = token.border
      ctx.lineWidth = 1
      ctx.stroke()

      // Token text — cashtag
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '700 11px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(token.symbol, tx, ty)
    })

    rotRef.current += 0.003
    frameRef.current = requestAnimationFrame(draw)
  }, [size])

  useEffect(() => {
    frameRef.current = requestAnimationFrame(draw)
    const interval = setInterval(() => {
      const cx = size / 2
      const cy = size / 2
      const R  = size * 0.32
      const angle = Math.random() * Math.PI * 2
      const dist  = Math.random() * R * 0.7
      pulsesRef.current.push({
        x: cx + dist * Math.cos(angle),
        y: cy + dist * Math.sin(angle) * 0.55,
        age: 0,
        type: Math.random() > 0.35 ? 'bull' : 'bear',
      })
    }, 2400)
    return () => {
      cancelAnimationFrame(frameRef.current)
      clearInterval(interval)
    }
  }, [draw, size])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ display: 'block' }}
    />
  )
}