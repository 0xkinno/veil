// ─────────────────────────────────────────────────────────────
// VEIL Audit Engine — 5 Layer Processing
// PHANTOM · ORACLE · GAUNTLET · PRISM · CHRONICLE
// ─────────────────────────────────────────────────────────────

export type LayerCode = 'PHANTOM' | 'ORACLE' | 'GAUNTLET' | 'PRISM' | 'CHRONICLE'
export type Verdict = 'APPROVED' | 'BLOCKED' | 'PENDING'
export type Direction = 'LONG' | 'SHORT'
export type AgentId = 'momentum' | 'aggressive' | 'news'

export interface LayerResult {
  code: LayerCode
  name: string
  score: number
  status: 'pass' | 'warn' | 'fail'
  detail: string
  skill: string
}

export interface GauntletChallenge {
  id: string
  type: string
  title: string
  attack: string
  agentResponse: string
  survived: boolean
}

export interface SignalEvidence {
  skill: string
  name: string
  value: string
  direction: 'bull' | 'bear' | 'neutral'
  verified: boolean
}

export interface AuditRecord {
  id: string
  timestamp: string
  agentId: AgentId
  agentName: string
  codename: string
  asset: string
  direction: Direction
  size: string
  leverage: string
  entryPrice: number
  exitPrice?: number
  pnl?: number
  signalScore: number
  challengeScore: number
  finalScore: number
  verdict: Verdict
  layers: LayerResult[]
  challenges: GauntletChallenge[]
  signals: SignalEvidence[]
  forensicSummary: string
  slippage: number
  executionQuality: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  layersPassed: number
}

// ── Layer weights: L1 20% L2 20% L3 25% L4 15% L5 20%
const WEIGHTS = { PHANTOM: 0.20, ORACLE: 0.20, GAUNTLET: 0.25, PRISM: 0.15, CHRONICLE: 0.20 }

export const LAYER_META: Record<LayerCode, { name: string; skill: string; icon: string }> = {
  PHANTOM:   { name: 'Signal Verification',          skill: 'technical-analysis', icon: 'shield-check' },
  ORACLE:    { name: 'Market Context Validation',     skill: 'macro-analyst',      icon: 'world' },
  GAUNTLET:  { name: 'Risk Challenge Engine',         skill: 'sentiment-analyst',  icon: 'sword' },
  PRISM:     { name: 'Execution Quality Prediction',  skill: 'market-intel',       icon: 'activity' },
  CHRONICLE: { name: 'Agent Reliability Score',       skill: 'news-briefing',      icon: 'fingerprint' },
}

function scoreStatus(s: number): 'pass' | 'warn' | 'fail' {
  return s >= 70 ? 'pass' : s >= 50 ? 'warn' : 'fail'
}

function calcFinal(layers: LayerResult[]): number {
  return Math.round(
    layers.reduce((sum, l) => sum + l.score * WEIGHTS[l.code], 0)
  )
}

function verdict(score: number, layers: LayerResult[]): Verdict {
  const passed = layers.filter(l => l.status === 'pass').length
  return score >= 65 && passed >= 3 ? 'APPROVED' : 'BLOCKED'
}

// ── Gauntlet challenges pool
const CHALLENGE_POOL: Omit<GauntletChallenge, 'survived'>[] = [
  {
    id: 'GNT-001',
    type: 'MACRO RISK',
    title: 'CPI Release Proximity',
    attack: 'CPI data releases in 4h. Historical BTC volatility spikes ±18% around CPI prints. Current position sizing does not account for event-window risk.',
    agentResponse: 'Position sized at minimum exposure. Stop-loss set at -2% from entry. Event risk acknowledged and factored into confidence weighting.',
  },
  {
    id: 'GNT-002',
    type: 'LIQUIDITY RISK',
    title: 'Whale Wallet Movement',
    attack: 'On-chain monitoring flagged $340M BTC transfer from exchange cold wallet 6h ago. Potential distribution pattern. Smart money may be exiting.',
    agentResponse: 'Transfer traced to internal custody rebalance, not distribution. Exchange net inflows remain negative — consistent with accumulation.',
  },
  {
    id: 'GNT-003',
    type: 'LEVERAGE RISK',
    title: 'Over-leverage Detection',
    attack: 'Requested leverage creates a liquidation threshold within 4.8% of entry. Given 30-day realized volatility of 6.2%, probability of liquidation exceeds 34%.',
    agentResponse: 'Leverage reduced to 5x from initial 10x recommendation. Stop-loss placed at -2% to prevent liquidation cascade.',
  },
  {
    id: 'GNT-004',
    type: 'SENTIMENT DIVERGENCE',
    title: 'Cross-Exchange Funding Divergence',
    attack: 'Funding rates on Binance (+0.024%) and OKX (+0.019%) diverge significantly from Bitget (-0.012%). Possible arbitrage distortion creating false directional signal.',
    agentResponse: 'Bitget funding rate is primary signal. Cross-exchange divergence within 1.8σ of historical norm. No arbitrage distortion confirmed.',
  },
  {
    id: 'GNT-005',
    type: 'COUNTER-TREND',
    title: 'ETF Flow Contradiction',
    attack: 'Spot BTC ETF recorded $420M net inflow today — strongly bullish institutional signal. A short thesis directly contradicts institutional demand. Risk of squeeze elevated.',
    agentResponse: 'Short is 4h tactical trade targeting local exhaustion. ETF inflow is multi-day signal. Timeframe mismatch acknowledged.',
  },
  {
    id: 'GNT-006',
    type: 'SIGNAL INTEGRITY',
    title: 'Insufficient Signal Cross-Validation',
    attack: 'Only 2 of 5 Bitget Skill Hub signals verified for this trade claim. VEIL requires minimum 3 independently corroborated signals before approval.',
    agentResponse: 'Unable to provide additional verification. Signal count below threshold.',
  },
  {
    id: 'GNT-007',
    type: 'EXECUTION RISK',
    title: 'Order Book Depth Warning',
    attack: 'Current order book depth at ±0.5% from mid-price shows insufficient liquidity for the requested size. Expected slippage 0.18% — exceeds acceptable threshold of 0.08%.',
    agentResponse: 'Order size reduced by 40% to remain within liquidity constraints. TWAP execution recommended.',
  },
]

function buildChallenges(score: number): GauntletChallenge[] {
  const pool = [...CHALLENGE_POOL].sort(() => Math.random() - 0.5).slice(0, 3)
  return pool.map(c => ({ ...c, survived: score >= 62 && c.id !== 'GNT-006' }))
}

function buildLayers(
  phantom: number, oracle: number, gauntlet: number, prism: number, chronicle: number
): LayerResult[] {
  return [
    {
      code: 'PHANTOM',
      name: LAYER_META.PHANTOM.name,
      skill: LAYER_META.PHANTOM.skill,
      score: phantom,
      status: scoreStatus(phantom),
      detail: phantom >= 70
        ? 'All signals cross-validated against technical-analysis Skill Hub. RSI, MACD, and Bollinger Band signals confirmed.'
        : 'One or more technical signals could not be independently verified. Conflicting indicator readings detected.',
    },
    {
      code: 'ORACLE',
      name: LAYER_META.ORACLE.name,
      skill: LAYER_META.ORACLE.skill,
      score: oracle,
      status: scoreStatus(oracle),
      detail: oracle >= 70
        ? 'Macro context supports directional bias. BTC/DXY correlation negative, Fed posture neutral-dovish.'
        : 'Macro environment partially contradicts trade thesis. DXY strengthening creating BTC headwind.',
    },
    {
      code: 'GAUNTLET',
      name: LAYER_META.GAUNTLET.name,
      skill: LAYER_META.GAUNTLET.skill,
      score: gauntlet,
      status: scoreStatus(gauntlet),
      detail: gauntlet >= 70
        ? 'Trade survived all adversarial risk challenges. Position sizing and stop placement validated.'
        : 'One or more adversarial challenges failed. Risk parameters require adjustment before execution.',
    },
    {
      code: 'PRISM',
      name: LAYER_META.PRISM.name,
      skill: LAYER_META.PRISM.skill,
      score: prism,
      status: scoreStatus(prism),
      detail: prism >= 70
        ? 'Execution quality predicted within acceptable bounds. Slippage estimate: 0.03-0.05%. Liquidity adequate.'
        : 'Liquidity depth insufficient for requested size. Expected slippage exceeds threshold.',
    },
    {
      code: 'CHRONICLE',
      name: LAYER_META.CHRONICLE.name,
      skill: LAYER_META.CHRONICLE.skill,
      score: chronicle,
      status: scoreStatus(chronicle),
      detail: chronicle >= 70
        ? 'Agent historical accuracy on this signal type is above baseline. Confidence calibration verified.'
        : 'Agent shows lower historical accuracy on this asset/direction pair. Confidence score adjusted downward.',
    },
  ]
}

// ── Agent definitions
export const AGENTS = {
  momentum: {
    id: 'momentum' as AgentId,
    name: 'Momentum Agent',
    codename: 'ATLAS-7',
    status: 'active' as const,
    trustScore: 82,
    accuracy: 68.4,
    riskDiscipline: 91,
    totalDecisions: 4847,
    approvalRate: 73.2,
    pnlCorrelation: 0.84,
    strengths: [
      'Consistent stop-loss discipline across volatile sessions',
      'Low leverage in high-VIX environments — proven risk awareness',
      'Strong BTC technical signal calibration across RSI and MACD',
    ],
    weaknesses: [
      'Overconfident in sustained BTC bull momentum phases',
      'Consistently underweights macro risk events (CPI, FOMC, NFP)',
      'Funding rate signal occasionally 4–6 hours stale on altcoins',
    ],
  },
  aggressive: {
    id: 'aggressive' as AgentId,
    name: 'Aggressive Agent',
    codename: 'APEX-3',
    status: 'flagged' as const,
    trustScore: 54,
    accuracy: 51.2,
    riskDiscipline: 43,
    totalDecisions: 6201,
    approvalRate: 41.8,
    pnlCorrelation: 0.31,
    strengths: [
      'High alpha capture during low-liquidity breakout windows',
      'Fast reaction to on-chain whale accumulation signals',
      'Aggressive position sizing in confirmed high-momentum trends',
    ],
    weaknesses: [
      'Severely overlevers in uncertain or ranging macro environments',
      'Ignores news sentiment as a position entry filter entirely',
      'Poor mean-reversion detection — trend-follows into exhaustion',
    ],
  },
  news: {
    id: 'news' as AgentId,
    name: 'News Agent',
    codename: 'HERALD-2',
    status: 'active' as const,
    trustScore: 76,
    accuracy: 71.2,
    riskDiscipline: 79,
    totalDecisions: 3155,
    approvalRate: 68.4,
    pnlCorrelation: 0.79,
    strengths: [
      'Exceptional narrative-to-signal synthesis speed and precision',
      'Precise sentiment polarity scoring on macro releases and events',
      'Consistent hedging behavior around known event risk windows',
    ],
    weaknesses: [
      'Slow to adjust when narrative and on-chain data diverge sharply',
      'Occasionally misclassifies coordinated FUD as bearish fundamentals',
      'Lower accuracy on altcoin sentiment signals versus BTC and ETH',
    ],
  },
}

// ── Generate one audit record
function makeId(n: number): string {
  return `VEIL-20250606-${String(n).padStart(5, '0')}`
}

interface AuditParams {
  n: number
  agentId: AgentId
  asset: string
  direction: Direction
  size: string
  leverage: string
  entryPrice: number
  phantom: number
  oracle: number
  gauntlet: number
  prism: number
  chronicle: number
  minutesAgo: number
  signals: SignalEvidence[]
  forensicSummary: string
}

export function buildAuditRecord(p: AuditParams): AuditRecord {
  const agent = AGENTS[p.agentId]
  const layers = buildLayers(p.phantom, p.oracle, p.gauntlet, p.prism, p.chronicle)
  const finalScore = calcFinal(layers)
  const v = verdict(finalScore, layers)
  const layersPassed = layers.filter(l => l.status === 'pass').length
  const signalScore = Math.round((p.phantom + p.oracle) / 2)
  const challengeScore = Math.round((p.gauntlet + p.prism) / 2)
  const now = new Date()
  now.setMinutes(now.getMinutes() - p.minutesAgo)

  const exitPrice = v === 'APPROVED'
    ? p.direction === 'LONG'
      ? p.entryPrice * (1 + (Math.random() * 0.025 + 0.005))
      : p.entryPrice * (1 - (Math.random() * 0.02 + 0.003))
    : undefined

  const pnl = exitPrice
    ? p.direction === 'LONG'
      ? (exitPrice - p.entryPrice) * parseFloat(p.size)
      : (p.entryPrice - exitPrice) * parseFloat(p.size)
    : undefined

  return {
    id: makeId(p.n),
    timestamp: now.toISOString(),
    agentId: p.agentId,
    agentName: agent.name,
    codename: agent.codename,
    asset: p.asset,
    direction: p.direction,
    size: p.size,
    leverage: p.leverage,
    entryPrice: p.entryPrice,
    exitPrice,
    pnl,
    signalScore,
    challengeScore,
    finalScore,
    verdict: v,
    layers,
    challenges: buildChallenges(finalScore),
    signals: p.signals,
    forensicSummary: p.forensicSummary,
    slippage: v === 'APPROVED' ? 0.03 + Math.random() * 0.04 : 0.12 + Math.random() * 0.08,
    executionQuality: finalScore >= 80 ? 'Excellent' : finalScore >= 68 ? 'Good' : finalScore >= 55 ? 'Fair' : 'Poor',
    layersPassed,
  }
}

// ── Seed 120 historical records
export function seedAuditHistory(): AuditRecord[] {
  const records: AuditRecord[] = []
  const assets = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'BTC/USDT']
  const agentIds: AgentId[] = ['momentum', 'aggressive', 'news']
  const dirs: Direction[] = ['LONG', 'SHORT']

  const CORE: AuditParams[] = [
    {
      n: 847, agentId: 'momentum', asset: 'BTC/USDT', direction: 'LONG',
      size: '0.25', leverage: '5x', entryPrice: 67420.50,
      phantom: 88, oracle: 74, gauntlet: 68, prism: 82, chronicle: 79,
      minutesAgo: 8,
      signals: [
        { skill: 'technical-analysis', name: 'RSI Divergence', value: '28.4 (oversold)', direction: 'bull', verified: true },
        { skill: 'market-intel', name: 'ETF Net Inflow', value: '+$420M (7d)', direction: 'bull', verified: true },
        { skill: 'sentiment-analyst', name: 'Funding Rate', value: '-0.012%', direction: 'bull', verified: true },
        { skill: 'news-briefing', name: 'News Sentiment', value: '+0.71 score', direction: 'bull', verified: true },
        { skill: 'macro-analyst', name: 'BTC vs DXY', value: 'Negative corr. holding', direction: 'bull', verified: true },
      ],
      forensicSummary: 'Approved: RSI divergence + ETF inflow confirmed. All 5 GAUNTLET challenges survived.',
    },
    {
      n: 846, agentId: 'aggressive', asset: 'ETH/USDT', direction: 'LONG',
      size: '4.2', leverage: '20x', entryPrice: 3841.20,
      phantom: 65, oracle: 42, gauntlet: 18, prism: 31, chronicle: 54,
      minutesAgo: 22,
      signals: [
        { skill: 'technical-analysis', name: 'MACD Crossover', value: 'Bullish (1h)', direction: 'bull', verified: true },
        { skill: 'market-intel', name: 'Whale Accumulation', value: '+12,400 ETH (24h)', direction: 'bull', verified: true },
        { skill: 'sentiment-analyst', name: 'Funding Rate', value: '+0.031% (elevated)', direction: 'bear', verified: false },
        { skill: 'news-briefing', name: 'News Sentiment', value: '+0.22 (weak)', direction: 'neutral', verified: true },
        { skill: 'macro-analyst', name: 'Macro Regime', value: 'Risk-off signal', direction: 'bear', verified: true },
      ],
      forensicSummary: 'Blocked: 20x leverage + CPI proximity. GAUNTLET score 18/100 — critical failure.',
    },
    {
      n: 845, agentId: 'news', asset: 'BTC/USDT', direction: 'SHORT',
      size: '0.15', leverage: '3x', entryPrice: 67650.00,
      phantom: 91, oracle: 79, gauntlet: 76, prism: 88, chronicle: 72,
      minutesAgo: 41,
      signals: [
        { skill: 'news-briefing', name: 'News Sentiment', value: '-0.64 (bearish)', direction: 'bear', verified: true },
        { skill: 'sentiment-analyst', name: 'Fear & Greed', value: '31 (Fear)', direction: 'bear', verified: true },
        { skill: 'sentiment-analyst', name: 'Funding Rate', value: '+0.018% (longs over)', direction: 'bear', verified: true },
        { skill: 'macro-analyst', name: 'DXY Strength', value: '+0.4% 24h', direction: 'bear', verified: true },
        { skill: 'technical-analysis', name: 'RSI', value: '71.2 (overbought)', direction: 'bear', verified: true },
      ],
      forensicSummary: 'Approved: Bearish narrative confirmed by 5 independent signals. Conservative 3x leverage.',
    },
    {
      n: 844, agentId: 'momentum', asset: 'SOL/USDT', direction: 'LONG',
      size: '45', leverage: '8x', entryPrice: 168.40,
      phantom: 74, oracle: 56, gauntlet: 44, prism: 61, chronicle: 68,
      minutesAgo: 63,
      signals: [
        { skill: 'technical-analysis', name: 'RSI', value: '43.2 (neutral-oversold)', direction: 'bull', verified: true },
        { skill: 'market-intel', name: 'DeFi TVL', value: '+$240M (7d)', direction: 'bull', verified: true },
        { skill: 'sentiment-analyst', name: 'Funding Rate', value: '+0.004% (neutral)', direction: 'neutral', verified: true },
        { skill: 'macro-analyst', name: 'Macro Regime', value: 'Risk-neutral', direction: 'neutral', verified: true },
        { skill: 'news-briefing', name: 'News Sentiment', value: '+0.31 (mild bullish)', direction: 'bull', verified: true },
      ],
      forensicSummary: 'Blocked: GAUNTLET raised unresolved leverage concern on SOL liquidity depth at 8x.',
    },
    {
      n: 843, agentId: 'news', asset: 'ETH/USDT', direction: 'LONG',
      size: '2.1', leverage: '4x', entryPrice: 3821.40,
      phantom: 82, oracle: 71, gauntlet: 64, prism: 77, chronicle: 74,
      minutesAgo: 89,
      signals: [
        { skill: 'news-briefing', name: 'EF Announcement', value: '+0.88 (very bullish)', direction: 'bull', verified: true },
        { skill: 'market-intel', name: 'ETH ETF Inflow', value: '+$94M (24h)', direction: 'bull', verified: true },
        { skill: 'sentiment-analyst', name: 'Funding Rate', value: '-0.008% (favorable)', direction: 'bull', verified: true },
        { skill: 'macro-analyst', name: 'DXY', value: '+0.4% (headwind noted)', direction: 'bear', verified: true },
        { skill: 'technical-analysis', name: 'MACD', value: 'Bullish crossover', direction: 'bull', verified: true },
      ],
      forensicSummary: 'Approved: EF announcement catalyst. DXY headwind acknowledged but event-specific decoupling.',
    },
    {
      n: 842, agentId: 'aggressive', asset: 'DOGE/USDT', direction: 'LONG',
      size: '12000', leverage: '25x', entryPrice: 0.1842,
      phantom: 48, oracle: 31, gauntlet: 8, prism: 22, chronicle: 44,
      minutesAgo: 112,
      signals: [
        { skill: 'news-briefing', name: 'Social Volume', value: '+340% spike', direction: 'bull', verified: false },
        { skill: 'technical-analysis', name: 'Price Momentum', value: '+4.2% (1h)', direction: 'bull', verified: true },
        { skill: 'sentiment-analyst', name: 'Retail Sentiment', value: 'Extreme greed', direction: 'bear', verified: true },
        { skill: 'market-intel', name: 'On-chain Volume', value: 'Not verified', direction: 'neutral', verified: false },
        { skill: 'macro-analyst', name: 'Macro Correlation', value: 'No data', direction: 'neutral', verified: false },
      ],
      forensicSummary: 'Blocked: 25x leverage on meme coin. GAUNTLET score 8/100 — lowest on record. Signal integrity failed.',
    },
  ]

  // Add core records
  for (const p of CORE) {
    records.push(buildAuditRecord(p))
  }

  // Generate additional historical records
  const assetPrices: Record<string, number> = {
    'BTC/USDT': 67000, 'ETH/USDT': 3800, 'SOL/USDT': 165,
    'BNB/USDT': 590, 'AVAX/USDT': 34,
  }

  for (let i = 0; i < 114; i++) {
    const agentId = agentIds[i % 3]
    const asset = assets[i % assets.length]
    const direction = dirs[i % 2]
    const isApproved = agentId === 'aggressive' ? Math.random() > 0.58 : Math.random() > 0.28
    const baseScore = isApproved ? 68 + Math.floor(Math.random() * 22) : 22 + Math.floor(Math.random() * 30)
    const variance = () => Math.floor(Math.random() * 20) - 10

    records.push(buildAuditRecord({
      n: 841 - i,
      agentId,
      asset,
      direction,
      size: asset.startsWith('BTC') ? '0.2' : asset.startsWith('ETH') ? '1.5' : '30',
      leverage: isApproved ? `${Math.floor(Math.random() * 6) + 2}x` : `${Math.floor(Math.random() * 15) + 10}x`,
      entryPrice: assetPrices[asset] + (Math.random() - 0.5) * assetPrices[asset] * 0.04,
      phantom:   Math.min(100, Math.max(15, baseScore + variance())),
      oracle:    Math.min(100, Math.max(15, baseScore + variance())),
      gauntlet:  Math.min(100, Math.max(15, baseScore + variance())),
      prism:     Math.min(100, Math.max(15, baseScore + variance())),
      chronicle: Math.min(100, Math.max(15, baseScore + variance())),
      minutesAgo: (i + 2) * 7 + Math.floor(Math.random() * 5),
      signals: [],
      forensicSummary: isApproved
        ? `Approved: ${Math.floor(Math.random() * 2) + 3} signals verified. All critical layers passed.`
        : `Blocked: Layer failure on ${['GAUNTLET', 'ORACLE', 'PRISM'][i % 3]}. Risk parameters exceeded.`,
    }))
  }

  return records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export const AUDIT_RECORDS = seedAuditHistory()

export const LIVE_STATS = {
  decisionsToday: 847,
  approved: 612,
  blocked: 235,
  approvalRate: 72.3,
  avgAuditScore: 74.2,
  totalDecisions: 14203,
  tradesAudited: 2847,
  tradesBlocked: 1203,
  badTradePreventionRate: 87,
  skillsUsed: 5,
}

export const BTC_PRICE_DATA = [
  { time: '05/30', price: 64200 }, { time: '05/31', price: 63800 },
  { time: '06/01', price: 65100 }, { time: '06/02', price: 66400 },
  { time: '06/03', price: 65800 }, { time: '06/04', price: 67200 },
  { time: '06/05', price: 66900 }, { time: '06/06', price: 67650 },
]

export const TRUST_HISTORY: Record<AgentId, number[]> = {
  momentum:   [71,73,74,75,77,78,79,80,80,82,81,82],
  aggressive: [62,60,58,56,54,53,52,51,53,54,53,54],
  news:       [68,70,71,72,72,73,74,75,74,76,75,76],
}

export const FORENSIC_INSIGHTS = [
  { label: 'TOP REJECTION REASON', value: 'Macro risk event proximity', detail: '34% of all GAUNTLET blocks', color: 'bear' },
  { label: 'MOST ACCURATE AGENT', value: 'HERALD-2 — News Agent', detail: '71.2% win rate on approved trades', color: 'bull' },
  { label: 'HIGHEST RISK DECISION', value: 'BLOCKED · APEX-3 · DOGE 25x', detail: 'GAUNTLET score 8/100 — record low', color: 'warn' },
]