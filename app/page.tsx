'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useState, useEffect, useRef, useCallback } from 'react'
import ThemeToggle from '@/components/theme/ThemeToggle'
import WidgetPreview from '@/components/WidgetPreview'

const Radar = dynamic(() => import('@/components/Radar'), { ssr: false })

const FEATURES = [
  {
    title: 'Signal Verification',
    code: 'PHANTOM',
    desc: 'Every signal an AI agent submits is cross-checked against live Bitget Skill Hub data. Hallucinated or unverifiable signals are rejected before they reach execution.',
  },
  {
    title: 'Market Context Validation',
    code: 'ORACLE',
    desc: 'Trades are validated against real macro conditions — DXY, ETF flows, whale activity, funding rates. A trade that ignores market context gets scored down immediately.',
  },
  {
    title: 'Risk Challenge Engine',
    code: 'GAUNTLET',
    desc: 'VEIL becomes adversarial. It fires 5 attacks at every trade — macro event proximity, leverage stress, crowding risk, stop-loss adequacy, and R/R ratio. Trades must survive.',
  },
  {
    title: 'Execution Quality Prediction',
    code: 'PRISM',
    desc: 'Before execution, VEIL predicts expected slippage, spread quality, and liquidity score. Poor execution conditions are flagged and scored accordingly.',
  },
  {
    title: 'Agent Reliability Score',
    code: 'CHRONICLE',
    desc: "Every agent builds a behavioral track record. Overconfident agents, stop-loss violators, and inconsistent performers are penalized on every future trade.",
  },
]

const STATS = [
  { num: '14,203', label: 'Trades Audited' },
  { num: '3,935', label: 'Trades Blocked' },
  { num: '87%', label: 'Bad-Trade Prevention' },
  { num: '5', label: 'Skills Cross-Validated' },
]

const GAUNTLET = [
  { id: 'C1', name: 'Macro Event Proximity', desc: 'CPI, Fed minutes, options expiry within 12h?' },
  { id: 'C2', name: 'Leverage Stress Test', desc: 'Can the position survive 3 consecutive ATR moves?' },
  { id: 'C3', name: 'Crowding Risk', desc: 'Is the market long/short crowded in this direction?' },
  { id: 'C4', name: 'Stop-Loss Adequacy', desc: 'Is the stop inside ATR noise range?' },
  { id: 'C5', name: 'Risk/Reward Ratio', desc: 'Does the trade clear a minimum 1.5:1 R/R?' },
]

/* Reveal-on-scroll wrapper */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect() } },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} style={{
      opacity: shown ? 1 : 0,
      transform: shown ? 'translateY(0)' : 'translateY(22px)',
      transition: `opacity 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
    }}>{children}</div>
  )
}

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const widgetRef = useRef<HTMLDivElement>(null)

  // Tilt: 0deg when the widget is centered in the viewport, approaching
  // 45deg as it drifts above or below center.
  const handleScroll = useCallback(() => {
    const el = widgetRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const viewportCenter = window.innerHeight / 2
    const elCenter = rect.top + rect.height / 2
    const distance = elCenter - viewportCenter
    const maxDistance = window.innerHeight / 2 + rect.height / 2
    const progress = Math.max(-1, Math.min(1, distance / maxDistance))
    const tilt = progress * 45
    el.style.transform = `rotateX(${tilt}deg)`
    el.style.boxShadow = Math.abs(progress) < 0.18
      ? '0 30px 90px var(--brand-glow)'
      : 'var(--shadow-ambient)'
  }, [])

  useEffect(() => {
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [handleScroll])

  const linkHover = (on: boolean) => (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.color = on ? 'var(--home-text)' : 'var(--home-text-2)'
    const u = e.currentTarget.querySelector('.nav-underline') as HTMLElement | null
    if (u) u.style.transform = on ? 'scaleX(1)' : 'scaleX(0)'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--home-bg)',
      fontFamily: 'var(--font-body)',
      color: 'var(--home-text)',
      overflowX: 'hidden',
      transition: 'background 300ms cubic-bezier(0.4,0,0.2,1), color 300ms',
    }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        height: '72px',
        background: 'color-mix(in srgb, var(--home-bg) 85%, transparent)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--home-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '10px', height: '10px', background: 'var(--brand)', transform: 'rotate(45deg)', boxShadow: '0 0 12px var(--brand-glow)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: 800, color: 'var(--home-text)', letterSpacing: '-0.01em' }}>VEIL</span>
        </Link>

        <div style={{ display: 'flex', gap: '34px', alignItems: 'center' }}>
          {[
            { label: 'Features', target: 'features' },
            { label: 'Architecture', target: 'architecture' },
            { label: 'Challenge Engine', target: 'challenge' },
          ].map(({ label, target }) => (
            <span key={label}
              onClick={() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })}
              onMouseEnter={linkHover(true)}
              onMouseLeave={linkHover(false)}
              style={{ position: 'relative', fontSize: '14px', fontWeight: 500, color: 'var(--home-text-2)', cursor: 'pointer', transition: 'color 0.2s ease', paddingBottom: '3px' }}
            >
              {label}
              <span className="nav-underline" style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: '2px', background: 'var(--brand)', transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.2s ease' }} />
            </span>
          ))}
          <a href="https://github.com/0xkinno/veil" target="_blank" rel="noopener noreferrer"
            onMouseEnter={linkHover(true)} onMouseLeave={linkHover(false)}
            style={{ position: 'relative', fontSize: '14px', fontWeight: 500, color: 'var(--home-text-2)', textDecoration: 'none', transition: 'color 0.2s ease', paddingBottom: '3px' }}
          >
            Docs
            <span className="nav-underline" style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: '2px', background: 'var(--brand)', transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.2s ease' }} />
          </a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeToggle variant="home" />
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'var(--brand)', color: '#04121C', border: 'none', borderRadius: '10px',
              padding: '10px 22px', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              boxShadow: '0 0 0 1px var(--brand-glow), 0 4px 16px var(--brand-glow)',
              transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--brand-glow), 0 8px 26px var(--brand-glow)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--brand-glow), 0 4px 16px var(--brand-glow)' }}
            >Launch VEIL</button>
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* ambient bloom */}
        <div style={{
          position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)',
          width: '920px', height: '520px', pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(ellipse at center, var(--brand-glow) 0%, rgba(47,209,255,0.06) 45%, transparent 75%)',
          filter: 'blur(80px)', opacity: 'var(--home-glow-op)',
          animation: 'ambientDrift 8s ease-in-out infinite',
        }} />
        {/* diagonal light streaks (Warrant lustre) */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.5,
          background: 'linear-gradient(115deg, transparent 30%, rgba(47,209,255,0.06) 46%, rgba(47,209,255,0.12) 50%, rgba(47,209,255,0.06) 54%, transparent 70%)',
          maskImage: 'radial-gradient(ellipse 70% 80% at 70% 40%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 80% at 70% 40%, black, transparent)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1180px', margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '48px', alignItems: 'center' }}>
          {/* left — copy */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'var(--home-elevated)', border: '1px solid var(--home-border)',
              borderRadius: '999px', padding: '6px 16px', marginBottom: '28px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand)', boxShadow: '0 0 8px var(--brand-glow)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--home-text-2)' }}>
                Trading Infrastructure · Audit Layer · Bitget S1
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(46px, 5.4vw, 76px)', lineHeight: 1.04, letterSpacing: '-0.025em',
            }}>
              <span style={{ color: 'var(--home-text)' }}>Every trade </span>
              <span className="glow-text" style={{ color: 'var(--home-text)' }}>audited.</span>
              <br />
              <span style={{ color: 'var(--home-text-mute)' }}>Every decision</span>
              <br />
              <span style={{ color: 'var(--home-text-mute)' }}>on the record.</span>
            </h1>

            <p style={{ fontSize: '17px', color: 'var(--home-text-2)', maxWidth: '500px', lineHeight: 1.65, marginTop: '24px' }}>
              VEIL intercepts every AI trading decision before execution — challenging signal integrity,
              stress-testing against adversarial risk, and writing a verifiable audit trail. Every trade accountable.
            </p>

            <div style={{ display: 'flex', gap: '14px', marginTop: '36px', flexWrap: 'wrap' }}>
              <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'var(--brand)', color: '#04121C', border: 'none', borderRadius: '10px',
                  padding: '15px 28px', fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600,
                  cursor: 'pointer', boxShadow: '0 8px 24px var(--brand-glow)', transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 34px var(--brand-glow)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px var(--brand-glow)' }}
                >Open Audit Dashboard →</button>
              </Link>
              <a href="https://github.com/0xkinno/veil" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'transparent', color: 'var(--home-text)', border: '1px solid var(--home-border)', borderRadius: '10px',
                  padding: '15px 28px', fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 500, cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.background = 'var(--home-elevated)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--home-border)'; e.currentTarget.style.background = 'transparent' }}
                >GitHub Repository</button>
              </a>
            </div>
          </div>

          {/* right — radar */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Radar size={340} auditing />
              <div style={{ textAlign: 'center', marginTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1.5px', color: 'var(--home-text-mute)' }}>
                LIVE SIGNAL SWEEP · 5 SKILLS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '0 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 70}>
              <div style={{
                position: 'relative', background: 'var(--home-elevated)', border: '1px solid var(--home-border)',
                borderRadius: '14px', padding: '24px', transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-ambient)'; e.currentTarget.style.borderColor = 'var(--brand-glow)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--home-border)' }}
              >
                <div style={{ position: 'absolute', top: 0, left: 24, width: '3px', height: '24px', background: 'var(--brand)', borderRadius: '0 0 3px 3px', boxShadow: '0 0 10px var(--brand-glow)' }} />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '32px', fontWeight: 700, color: 'var(--home-text)' }}>{s.num}</div>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--home-text-mute)', marginTop: '6px' }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── TILT WIDGET ── */}
      <section style={{ padding: '120px 48px 40px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: '12px' }}>The product</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--home-text)' }}>
            Mission Control, live.
          </div>
          <p style={{ fontSize: '15px', color: 'var(--home-text-2)', maxWidth: '540px', margin: '14px auto 0', lineHeight: 1.6 }}>
            Every agent decision, every layer score, every verdict — in one operational view.
          </p>
        </div>

        <div className="tilt-stage" style={{ maxWidth: '1040px', margin: '40px auto 0' }}>
          <div ref={widgetRef} className="tilt-widget" style={{
            position: 'relative', background: 'var(--card-bg)', border: '1px solid var(--border-solid)',
            borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-ambient)',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, var(--brand), transparent)', opacity: 0.6, zIndex: 2 }} />
            <WidgetPreview />
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '120px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: '12px' }}>Features</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--home-text)' }}>
                Built to catch what agents miss.
              </div>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {FEATURES.map((f, i) => (
                <div key={i} onClick={() => setActiveFeature(i)} style={{
                  padding: '13px 16px', borderRadius: '10px', cursor: 'pointer',
                  borderLeft: `3px solid ${activeFeature === i ? 'var(--brand)' : 'transparent'}`,
                  background: activeFeature === i ? 'var(--home-elevated)' : 'transparent',
                  transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: activeFeature === i ? 'var(--brand)' : 'var(--home-text-mute)', fontWeight: 600, marginBottom: '3px' }}>{f.code}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: activeFeature === i ? 'var(--home-text)' : 'var(--home-text-2)' }}>{f.title}</div>
                </div>
              ))}
            </div>
            <div style={{
              background: 'var(--home-elevated)', border: '1px solid var(--home-border)', borderLeft: '3px solid var(--brand)',
              borderRadius: '14px', padding: '32px', minHeight: '200px',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brand)', fontWeight: 600, marginBottom: '10px', letterSpacing: '0.05em' }}>
                LAYER {String(activeFeature + 1).padStart(2, '0')} — {FEATURES[activeFeature].code}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '23px', fontWeight: 700, color: 'var(--home-text)', marginBottom: '16px', letterSpacing: '-0.01em' }}>
                {FEATURES[activeFeature].title}
              </div>
              <div style={{ fontSize: '15px', color: 'var(--home-text-2)', lineHeight: 1.75 }}>
                {FEATURES[activeFeature].desc}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE ── */}
      <section id="architecture" style={{ padding: '120px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: '12px' }}>Architecture</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--home-text)', marginBottom: '12px' }}>Five layers. One verdict.</div>
              <div style={{ fontSize: '15px', color: 'var(--home-text-2)' }}>Every trade passes through all five layers before execution is permitted.</div>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
            {FEATURES.map((f, i) => (
              <Reveal key={i} delay={i * 80}>
                <div style={{
                  background: 'var(--home-elevated)', border: '1px solid var(--home-border)',
                  borderTop: `2px solid ${i === 2 ? 'var(--warn)' : 'var(--brand)'}`,
                  borderRadius: '16px', padding: '24px 18px', height: '100%',
                  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-ambient)'; e.currentTarget.style.borderColor = 'var(--brand-glow)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--home-border)' }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--home-text-mute)', marginBottom: '8px' }}>LAYER {String(i + 1).padStart(2, '0')}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: i === 2 ? 'var(--warn)' : 'var(--brand)', marginBottom: '8px' }}>{f.code}</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--home-text)', marginBottom: '8px' }}>{f.title}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--home-text-2)', lineHeight: 1.6 }}>{f.desc.slice(0, 84)}…</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHALLENGE ENGINE ── */}
      <section id="challenge" style={{ padding: '120px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          <Reveal>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--warn)', marginBottom: '12px' }}>Challenge Engine — GAUNTLET</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--home-text)', marginBottom: '16px' }}>Every trade is prosecuted.</div>
            <div style={{ fontSize: '15px', color: 'var(--home-text-2)', lineHeight: 1.75, maxWidth: '620px', margin: '0 auto 48px' }}>
              GAUNTLET fires five adversarial attacks at every trade before execution. A trade that cannot defend itself does not execute.
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '40px' }}>
            {GAUNTLET.map((c, i) => (
              <Reveal key={c.id} delay={i * 70}>
                <div style={{
                  background: 'var(--home-elevated)', border: '1px solid var(--home-border)',
                  borderTop: '2px solid var(--warn)', borderRadius: '14px', padding: '18px 14px', textAlign: 'left', height: '100%',
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--warn)', fontWeight: 600, marginBottom: '7px' }}>{c.id}</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--home-text)', marginBottom: '7px' }}>{c.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--home-text-2)', lineHeight: 1.55 }}>{c.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Link href="/dashboard/challenge" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'var(--warn-dim)', color: 'var(--warn)', border: '1px solid var(--warn-glow)', borderRadius: '10px',
              padding: '14px 28px', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >View Live Challenge Engine →</button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: '32px 48px', borderTop: '1px solid var(--home-border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', background: 'var(--brand)', transform: 'rotate(45deg)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--home-text)' }}>VEIL</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--home-text-mute)', fontFamily: 'var(--font-mono)' }}>
          Built for Bitget AI Hackathon S1 · Track 2: Trading Infrastructure · Solo Build
        </div>
        <a href="https://github.com/0xkinno/veil" target="_blank" rel="noopener noreferrer"
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--brand)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--home-text-2)')}
          style={{ fontSize: '12px', color: 'var(--home-text-2)', textDecoration: 'none', transition: 'color 0.2s' }}
        >GitHub →</a>
      </footer>
    </div>
  )
}
