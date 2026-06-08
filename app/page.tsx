'use client'

import Link from 'next/link'
import { useState } from 'react'

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

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #040D1A 0%, #071E42 35%, #0A2A5A 65%, #071E42 100%)',
      fontFamily: 'var(--font-body)',
      color: '#E0F2FE',
      overflowX: 'hidden',
    }}>

      {/* Grid texture */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)',
        backgroundSize: '52px 52px',
      }} />

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '56px',
        background: 'rgba(4,13,26,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(56,189,248,0.1)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '9px', height: '9px', background: '#38BDF8', transform: 'rotate(45deg)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: '#E8F4FF', letterSpacing: '-0.3px' }}>VEIL</span>
        </div>
        <div style={{ display: 'flex', gap: '36px' }}>
          {[
            { label: 'Features', target: 'features' },
            { label: 'Architecture', target: 'architecture' },
            { label: 'Challenge Engine', target: 'challenge' },
          ].map(({ label, target }) => (
            <span key={label}
              onClick={() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })}
              style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(224,242,254,0.55)', cursor: 'pointer', transition: 'color 150ms' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#38BDF8')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(224,242,254,0.55)')}
            >{label}</span>
          ))}
          <a href="https://github.com/0xkinno/veil" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(224,242,254,0.55)', textDecoration: 'none', transition: 'color 150ms' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#38BDF8')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(224,242,254,0.55)')}
          >Docs</a>
        </div>
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <button style={{
            background: '#0284C7', color: 'white', border: 'none', borderRadius: '5px',
            height: '36px', padding: '0 18px', fontFamily: 'var(--font-body)',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            boxShadow: '0 0 20px rgba(2,132,199,0.35)',
          }}>⬡ Launch VEIL</button>
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '100px 48px 60px', position: 'relative', zIndex: 1, textAlign: 'center',
      }}>

        {/* Eyebrow */}
        <div style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: '13px', fontWeight: 700,
          fontStyle: 'italic',
          letterSpacing: '2px',
          color: '#38BDF8',
          marginBottom: '32px',
          opacity: 0.9,
        }}>
          Trading Infrastructure &nbsp;·&nbsp; Audit Layer &nbsp;·&nbsp; Bitget AI Hackathon S1
        </div>

        {/* 3D boxed VEIL */}
        <div style={{
          position: 'relative',
          marginBottom: '24px',
          display: 'inline-block',
        }}>
          {/* 3D shadow layers */}
          <div style={{
            position: 'absolute',
            top: '8px', left: '8px',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(96px, 14vw, 160px)',
            fontWeight: 800,
            color: 'rgba(2,132,199,0.25)',
            letterSpacing: '-6px',
            lineHeight: 1,
            userSelect: 'none',
          }}>VEIL</div>
          <div style={{
            position: 'absolute',
            top: '4px', left: '4px',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(96px, 14vw, 160px)',
            fontWeight: 800,
            color: 'rgba(2,132,199,0.4)',
            letterSpacing: '-6px',
            lineHeight: 1,
            userSelect: 'none',
          }}>VEIL</div>
          {/* Main text */}
          <div style={{
            position: 'relative',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(96px, 14vw, 160px)',
            fontWeight: 800,
            letterSpacing: '-6px',
            lineHeight: 1,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #B8D8F0 40%, #38BDF8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>VEIL</div>
        </div>

        {/* Full form */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(12px, 1.6vw, 17px)',
          fontWeight: 600,
          color: '#38BDF8',
          letterSpacing: '5px',
          textTransform: 'uppercase',
          marginBottom: '28px',
          opacity: 0.9,
        }}>
          Verified Execution Intelligence Layer
        </div>

        {/* Tagline */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '17px', fontStyle: 'italic', fontWeight: 300,
          color: 'rgba(224,242,254,0.62)',
          maxWidth: '540px', lineHeight: 1.85, marginBottom: '44px',
        }}>
          VEIL intercepts every AI trading decision before execution —
          challenging signal integrity, stress-testing against adversarial risk,
          and generating a verifiable audit trail. Every trade accountable.
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '64px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'linear-gradient(135deg, #0284C7, #0369A1)',
              color: 'white', border: 'none', borderRadius: '6px',
              height: '50px', padding: '0 30px', fontFamily: 'var(--font-body)',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 24px rgba(2,132,199,0.45)',
            }}>⬡ Open Audit Dashboard →</button>
          </Link>
          <a href="https://github.com/0xkinno/veil" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'rgba(255,255,255,0.05)', color: '#E0F2FE',
              border: '1px solid rgba(224,242,254,0.15)', borderRadius: '6px',
              height: '50px', padding: '0 30px', fontFamily: 'var(--font-body)',
              fontSize: '14px', fontWeight: 500, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>⌥ GitHub Repository</button>
          </a>
          <a href="https://github.com/0xkinno/veil#readme" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'rgba(255,255,255,0.05)', color: '#E0F2FE',
              border: '1px solid rgba(224,242,254,0.15)', borderRadius: '6px',
              height: '50px', padding: '0 30px', fontFamily: 'var(--font-body)',
              fontSize: '14px', fontWeight: 500, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>◎ README & Docs</button>
          </a>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(56,189,248,0.1)',
          borderRadius: '12px', overflow: 'hidden',
          backdropFilter: 'blur(8px)',
        }}>
          {[
            { num: '14,203', label: 'Trades Audited' },
            { num: '3,935', label: 'Trades Blocked' },
            { num: '87%', label: 'Bad Trade Prevention' },
            { num: '5', label: 'Skills Cross-Validated' },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '22px 40px', textAlign: 'center',
              borderRight: i < 3 ? '1px solid rgba(56,189,248,0.08)' : 'none',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 800, color: '#E8F4FF' }}>{s.num}</div>
              <div style={{ fontSize: '11px', color: 'rgba(224,242,254,0.38)', marginTop: '4px', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div style={{ marginTop: '56px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(224,242,254,0.25)' }}>
            SCROLL TO EXPLORE
          </div>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(56,189,248,0.4), transparent)' }} />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '80px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#38BDF8', marginBottom: '12px', textAlign: 'center' }}>FEATURES</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 700, color: '#E8F4FF', marginBottom: '48px', textAlign: 'center' }}>
            Built to catch what agents miss.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px', alignItems: 'start' }}>
            {/* Tab list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {FEATURES.map((f, i) => (
                <div key={i}
                  onClick={() => setActiveFeature(i)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    borderLeft: `3px solid ${activeFeature === i ? '#38BDF8' : 'transparent'}`,
                    background: activeFeature === i ? 'rgba(56,189,248,0.08)' : 'transparent',
                    transition: 'all 150ms',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: activeFeature === i ? '#38BDF8' : '#4A7099', fontWeight: 700, marginBottom: '3px' }}>{f.code}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: activeFeature === i ? '#E8F4FF' : '#8BA3B8' }}>{f.title}</div>
                </div>
              ))}
            </div>
            {/* Content */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(56,189,248,0.12)',
              borderLeft: '3px solid #38BDF8',
              borderRadius: '10px',
              padding: '32px',
              minHeight: '180px',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#38BDF8', fontWeight: 700, marginBottom: '8px' }}>
                LAYER {String(activeFeature + 1).padStart(2, '0')} — {FEATURES[activeFeature].code}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: '#E8F4FF', marginBottom: '16px' }}>
                {FEATURES[activeFeature].title}
              </div>
              <div style={{ fontSize: '15px', color: 'rgba(224,242,254,0.65)', lineHeight: 1.8 }}>
                {FEATURES[activeFeature].desc}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE ── */}
      <section id="architecture" style={{ padding: '80px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#38BDF8', marginBottom: '12px', textAlign: 'center' }}>ARCHITECTURE</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 700, color: '#E8F4FF', marginBottom: '12px', textAlign: 'center' }}>Five layers. One verdict.</div>
          <div style={{ fontSize: '15px', color: 'rgba(224,242,254,0.5)', marginBottom: '48px', textAlign: 'center' }}>Every trade passes through all five layers before execution is permitted.</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(56,189,248,0.1)',
                borderTop: `3px solid ${i === 2 ? '#F59E0B' : '#38BDF8'}`,
                borderRadius: '10px', padding: '20px 16px',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(224,242,254,0.3)', marginBottom: '6px' }}>LAYER {String(i + 1).padStart(2, '0')}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 800, color: i === 2 ? '#F59E0B' : '#38BDF8', marginBottom: '6px' }}>{f.code}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#B8D0E8', marginBottom: '8px' }}>{f.title}</div>
                <div style={{ fontSize: '11px', color: 'rgba(224,242,254,0.45)', lineHeight: 1.6 }}>{f.desc.slice(0, 80)}...</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHALLENGE ENGINE ── */}
      <section id="challenge" style={{ padding: '80px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#F59E0B', marginBottom: '12px' }}>CHALLENGE ENGINE — GAUNTLET</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 700, color: '#E8F4FF', marginBottom: '16px' }}>Every trade is prosecuted.</div>
          <div style={{ fontSize: '15px', color: 'rgba(224,242,254,0.5)', lineHeight: 1.8, marginBottom: '48px', maxWidth: '620px', margin: '0 auto 48px' }}>
            GAUNTLET fires 5 adversarial attacks at every trade before execution. A trade that cannot defend itself does not execute.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '40px' }}>
            {[
              { id: 'C1', name: 'Macro Event Proximity', desc: 'CPI, Fed minutes, options expiry within 12h?' },
              { id: 'C2', name: 'Leverage Stress Test', desc: 'Can the position survive 3 consecutive ATR moves?' },
              { id: 'C3', name: 'Crowding Risk', desc: 'Is the market long/short crowded in this direction?' },
              { id: 'C4', name: 'Stop-Loss Adequacy', desc: 'Is the stop inside ATR noise range?' },
              { id: 'C5', name: 'Risk/Reward Ratio', desc: 'Does the trade have a minimum 1.5:1 R/R?' },
            ].map(c => (
              <div key={c.id} style={{
                background: 'rgba(245,158,11,0.05)',
                border: '1px solid rgba(245,158,11,0.15)',
                borderTop: '3px solid #F59E0B',
                borderRadius: '8px', padding: '16px 12px', textAlign: 'left',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#F59E0B', fontWeight: 700, marginBottom: '6px' }}>{c.id}</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#E8F4FF', marginBottom: '6px' }}>{c.name}</div>
                <div style={{ fontSize: '10px', color: 'rgba(224,242,254,0.45)', lineHeight: 1.5 }}>{c.desc}</div>
              </div>
            ))}
          </div>
          <Link href="/dashboard/challenge" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'rgba(245,158,11,0.1)', color: '#F59E0B',
              border: '1px solid rgba(245,158,11,0.3)', borderRadius: '6px',
              height: '48px', padding: '0 28px', fontFamily: 'var(--font-body)',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            }}>View Live Challenge Engine →</button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: '32px 48px',
        borderTop: '1px solid rgba(56,189,248,0.08)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '7px', height: '7px', background: '#38BDF8', transform: 'rotate(45deg)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: '#E0F2FE' }}>VEIL</span>
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(224,242,254,0.25)', fontFamily: 'var(--font-mono)' }}>
          Built for Bitget AI Hackathon S1 · Track 2: Trading Infrastructure · Solo Build
        </div>
        <a href="https://github.com/0xkinno/veil" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: '12px', color: 'rgba(224,242,254,0.4)', textDecoration: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#38BDF8')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(224,242,254,0.4)')}
        >GitHub →</a>
      </footer>
    </div>
  )
}