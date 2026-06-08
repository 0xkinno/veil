// ─────────────────────────────────────────────
// VEIL — Verified Execution Intelligence Layer
// Mock Data — /lib/mockData.ts
// ─────────────────────────────────────────────

export type Verdict = 'APPROVED' | 'BLOCKED' | 'PENDING'
export type Direction = 'LONG' | 'SHORT'
export type AgentId = 'momentum' | 'aggressive' | 'news'
export type LayerCode = 'SV' | 'MCV' | 'RCE' | 'EQP' | 'ARS'

export interface LayerScore {
  code: LayerCode
  name: string
  fullName: string
  score: number
  status: 'pass' | 'warn' | 'fail'
  detail: string
}

export interface Challenge {
  type: string
  title: string
  body: string
  agentResponse: string
  survived: boolean
}

export interface Signal {
  icon: string
  name: string
  value: string
  source: string
  verified: boolean
}

export interface AuditDecision {
  id: string
  timestamp: string
  agentId: AgentId
  agentName: string
  asset: string
  direction: Direction
  size: string
  leverage: string
  signalScore: number
  challengeScore: number
  finalScore: number
  verdict: Verdict
  layers: LayerScore[]
  challenges: Challenge[]
  signals: Signal[]
  forensicSummary: string
  entryPrice: number
  exitPrice?: number
  pnl?: number
  slippage?: number
  executionQuality?: string
}

export interface Agent {
  id: AgentId
  name: string
  codename: string
  status: 'active' | 'flagged' | 'inactive'
  trustScore: number
  accuracy: number
  riskDiscipline: number
  totalDecisions: number
  approvalRate: number
  pnlCorrelation: number
  strengths: string[]
  weaknesses: string[]
  lastDecision?: AuditDecision
}

// ─── LAYER DEFINITIONS ───────────────────────
export const LAYER_META: Record<LayerCode, { name: string; fullName: string; icon: string }> = {
  SV:  { name: 'Signal Verification',         fullName: 'LAYER 01 · SIGNAL VERIFICATION',         icon: 'shield-check' },
  MCV: { name: 'Market Context Validation',   fullName: 'LAYER 02 · MARKET CONTEXT VALIDATION',   icon: 'world' },
  RCE: { name: 'Risk Challenge Engine',       fullName: 'LAYER 03 · RISK CHALLENGE ENGINE',       icon: 'sword' },
  EQP: { name: 'Execution Quality Prediction',fullName: 'LAYER 04 · EXECUTION QUALITY PREDICTION',icon: 'activity' },
  ARS: { name: 'Agent Reliability Score',     fullName: 'LAYER 05 · AGENT RELIABILITY SCORE',     icon: 'fingerprint' },
}

// ─── AGENTS ──────────────────────────────────
export const AGENTS: Record<AgentId, Agent> = {
  momentum: {
    id: 'momentum',
    name: 'Momentum Agent',
    codename: 'ATLAS-7',
    status: 'active',
    trustScore: 82,
    accuracy: 68.4,
    riskDiscipline: 91,
    totalDecisions: 4847,
    approvalRate: 73.2,
    pnlCorrelation: 0.84,
    strengths: [
      'Consistent stop-loss discipline across volatile sessions',
      'Low leverage utilization in high-VIX environments',
      'Strong BTC technical signal calibration (RSI + MACD)',
    ],
    weaknesses: [
      'Overconfident during BTC bull market momentum phases',
      'Underweights macro risk events (CPI, FOMC, NFP)',
      'Funding rate signal occasionally 4–6h stale',
    ],
  },
  aggressive: {
    id: 'aggressive',
    name: 'Aggressive Agent',
    codename: 'APEX-3',
    status: 'flagged',
    trustScore: 54,
    accuracy: 51.2,
    riskDiscipline: 43,
    totalDecisions: 6201,
    approvalRate: 41.8,
    pnlCorrelation: 0.31,
    strengths: [
      'High alpha capture during low-liquidity breakouts',
      'Fast reaction to on-chain whale accumulation signals',
      'Aggressive position sizing in confirmed trends',
    ],
    weaknesses: [
      'Severely overlevers in uncertain macro environments',
      'Ignores news sentiment as a position filter',
      'Poor mean-reversion detection — trend-follows into exhaustion',
    ],
  },
  news: {
    id: 'news',
    name: 'News Agent',
    codename: 'HERALD-2',
    status: 'active',
    trustScore: 76,
    accuracy: 71.2,
    riskDiscipline: 79,
    totalDecisions: 3155,
    approvalRate: 68.4,
    pnlCorrelation: 0.79,
    strengths: [
      'Exceptional narrative-to-signal synthesis speed',
      'Precise sentiment polarity scoring on macro releases',
      'Consistent hedging behavior around known event windows',
    ],
    weaknesses: [
      'Slow to adjust when narrative and on-chain data diverge',
      'Occasionally misclassifies FUD as bearish fundamentals',
      'Lower accuracy on altcoin sentiment vs BTC/ETH',
    ],
  },
}

// ─── AUDIT DECISIONS ─────────────────────────
function makeId(n: number): string {
  return `VEIL-20250606-${String(n).padStart(5, '0')}`
}

function makeLayers(sv: number, mcv: number, rce: number, eqp: number, ars: number): LayerScore[] {
  const score = (s: number): 'pass' | 'warn' | 'fail' => s >= 70 ? 'pass' : s >= 50 ? 'warn' : 'fail'
  return [
    { code: 'SV',  name: 'Signal Verification',          fullName: LAYER_META.SV.fullName,  score: sv,  status: score(sv),  detail: sv  >= 70 ? 'All signal sources verified against Bitget Skill Hub' : 'One or more signals could not be cross-referenced' },
    { code: 'MCV', name: 'Market Context Validation',    fullName: LAYER_META.MCV.fullName, score: mcv, status: score(mcv), detail: mcv >= 70 ? 'Macro & sentiment context supports directional bias' : 'Macro conditions partially contradict the trade thesis' },
    { code: 'RCE', name: 'Risk Challenge Engine',        fullName: LAYER_META.RCE.fullName, score: rce, status: score(rce), detail: rce >= 70 ? 'Trade survived all adversarial risk challenges' : 'One or more adversarial challenges not fully answered' },
    { code: 'EQP', name: 'Execution Quality Prediction', fullName: LAYER_META.EQP.fullName, score: eqp, status: score(eqp), detail: eqp >= 70 ? 'Predicted slippage and spread within acceptable bounds' : 'Liquidity conditions may cause adverse execution' },
    { code: 'ARS', name: 'Agent Reliability Score',      fullName: LAYER_META.ARS.fullName, score: ars, status: score(ars), detail: ars >= 70 ? 'Agent historical accuracy supports this signal type' : 'Agent has lower confidence on this asset/direction pair' },
  ]
}

export const AUDIT_DECISIONS: AuditDecision[] = [
  {
    id: makeId(847),
    timestamp: '2025-06-06T14:32:18Z',
    agentId: 'momentum',
    agentName: 'Momentum Agent',
    asset: 'BTC/USDT',
    direction: 'LONG',
    size: '0.25 BTC',
    leverage: '5x',
    signalScore: 87,
    challengeScore: 74,
    finalScore: 79,
    verdict: 'APPROVED',
    entryPrice: 67420.50,
    exitPrice: 68904.20,
    pnl: 371.93,
    slippage: 0.04,
    executionQuality: 'Good',
    layers: makeLayers(88, 74, 61, 82, 79),
    forensicSummary: 'Approved: Strong RSI divergence + ETF inflow confirmation. Macro risk challenge survived with low-size position.',
    signals: [
      { icon: 'chart-line', name: 'RSI Divergence', value: '28.4 (oversold)', source: 'technical-analysis', verified: true },
      { icon: 'trending-up', name: 'ETF Net Inflow', value: '+$420M (7d)', source: 'market-intel', verified: true },
      { icon: 'currency-dollar', name: 'Funding Rate', value: '-0.012% (favorable)', source: 'sentiment-analyst', verified: true },
      { icon: 'news', name: 'News Sentiment', value: '+0.71 score', source: 'news-briefing', verified: true },
      { icon: 'world', name: 'BTC vs DXY', value: 'Negative correlation holding', source: 'macro-analyst', verified: true },
    ],
    challenges: [
      {
        type: 'MACRO RISK',
        title: 'CPI Release Window',
        body: 'CPI release in 4 hours. Historical BTC volatility spikes 18% around CPI events. Position sizing may be inappropriate for event risk.',
        agentResponse: 'Position sized at 0.25 BTC (low exposure, 5x leverage). Stop-loss set at 2% below entry. Acceptable event risk given size.',
        survived: true,
      },
      {
        type: 'LIQUIDITY RISK',
        title: 'Whale Wallet Movement',
        body: 'On-chain monitoring flagged $340M BTC transfer from exchange cold wallet 6 hours ago. Potential distribution pattern emerging.',
        agentResponse: 'Transfer tracked as internal custody move, not distribution. Exchange inflows remain negative — net accumulative.',
        survived: true,
      },
      {
        type: 'SENTIMENT DIVERGENCE',
        title: 'Funding Rate Overheating Check',
        body: 'Funding rates on competing exchanges (Binance, OKX) showing +0.02% vs Bitget -0.012%. Possible arbitrage distortion signal.',
        agentResponse: 'Bitget funding rate is primary signal source. Cross-exchange divergence noted but within 1-sigma historical norm.',
        survived: false,
      },
    ],
  },
  {
    id: makeId(846),
    timestamp: '2025-06-06T14:28:44Z',
    agentId: 'aggressive',
    agentName: 'Aggressive Agent',
    asset: 'ETH/USDT',
    direction: 'LONG',
    size: '4.2 ETH',
    leverage: '20x',
    signalScore: 61,
    challengeScore: 28,
    finalScore: 38,
    verdict: 'BLOCKED',
    entryPrice: 3841.20,
    exitPrice: undefined,
    pnl: undefined,
    slippage: 0.18,
    executionQuality: 'Poor',
    layers: makeLayers(65, 42, 18, 31, 54),
    forensicSummary: 'Blocked: 20x leverage unacceptable under current macro conditions. CPI risk challenge failed. Execution quality prediction: high slippage risk.',
    signals: [
      { icon: 'chart-bar', name: 'MACD Crossover', value: 'Bullish (1h)', source: 'technical-analysis', verified: true },
      { icon: 'trending-up', name: 'Whale Accumulation', value: '+12,400 ETH (24h)', source: 'market-intel', verified: true },
      { icon: 'currency-dollar', name: 'Funding Rate', value: '+0.031% (elevated)', source: 'sentiment-analyst', verified: false },
      { icon: 'news', name: 'News Sentiment', value: '+0.22 score (weak)', source: 'news-briefing', verified: true },
    ],
    challenges: [
      {
        type: 'LEVERAGE RISK',
        title: 'Critical Over-leverage Detection',
        body: '20x leverage on ETH with pending CPI release constitutes a liquidation risk > 40% within the next 8 hours based on historical volatility modeling.',
        agentResponse: 'Trade thesis is high-conviction. Leverage justified by strong accumulation signal.',
        survived: false,
      },
      {
        type: 'MACRO RISK',
        title: 'CPI + ETF Outflow Confluence',
        body: 'ETH ETF recorded $82M net outflow yesterday. Combined with CPI risk, asymmetric downside > 5% is probable. 20x leverage means liquidation at -4.8%.',
        agentResponse: 'ETF outflows are lagging indicators. On-chain accumulation is real-time and more reliable.',
        survived: false,
      },
      {
        type: 'EXECUTION RISK',
        title: 'Liquidity Depth Warning',
        body: 'ETH/USDT order book depth at 3,840–3,850 shows insufficient liquidity for 4.2 ETH at 20x. Expected slippage: 0.18%, significantly above threshold.',
        agentResponse: 'No response — agent did not acknowledge execution quality challenge.',
        survived: false,
      },
    ],
  },
  {
    id: makeId(845),
    timestamp: '2025-06-06T14:19:03Z',
    agentId: 'news',
    agentName: 'News Agent',
    asset: 'BTC/USDT',
    direction: 'SHORT',
    size: '0.15 BTC',
    leverage: '3x',
    signalScore: 84,
    challengeScore: 78,
    finalScore: 81,
    verdict: 'APPROVED',
    entryPrice: 67650.00,
    exitPrice: 66920.50,
    pnl: 109.43,
    slippage: 0.03,
    executionQuality: 'Excellent',
    layers: makeLayers(91, 79, 76, 88, 72),
    forensicSummary: 'Approved: Bearish news narrative confirmed by sentiment decline. All 5 challenges survived. Conservative position sizing.',
    signals: [
      { icon: 'news', name: 'News Sentiment', value: '-0.64 score (bearish)', source: 'news-briefing', verified: true },
      { icon: 'trending-down', name: 'Fear & Greed Index', value: '31 (Fear)', source: 'sentiment-analyst', verified: true },
      { icon: 'currency-dollar', name: 'Funding Rate', value: '+0.018% (longs overextended)', source: 'sentiment-analyst', verified: true },
      { icon: 'world', name: 'DXY Strength', value: '+0.4% 24h (BTC headwind)', source: 'macro-analyst', verified: true },
    ],
    challenges: [
      {
        type: 'COUNTER-TREND RISK',
        title: 'ETF Inflow Contradiction',
        body: 'Spot BTC ETF recorded +$180M inflow today, contradicting bearish news thesis. Institutional demand remains positive.',
        agentResponse: 'ETF inflow is a 1-3 day lagging signal. News sentiment is real-time. Short duration trade (4h target) avoids ETF inflow effect.',
        survived: true,
      },
      {
        type: 'MACRO RISK',
        title: 'Fed Speaker Event',
        body: 'Fed Governor scheduled to speak in 2 hours. Historical BTC reaction to Fed dovish surprise: +3-6%. Short position at risk.',
        agentResponse: 'Fed speaker is a known hawkish voice. News sentiment already factors in hawkish tone expectation. Risk acknowledged and sized accordingly.',
        survived: true,
      },
    ],
  },
  {
    id: makeId(844),
    timestamp: '2025-06-06T14:07:31Z',
    agentId: 'momentum',
    agentName: 'Momentum Agent',
    asset: 'SOL/USDT',
    direction: 'LONG',
    size: '45 SOL',
    leverage: '8x',
    signalScore: 72,
    challengeScore: 51,
    finalScore: 59,
    verdict: 'PENDING',
    entryPrice: 168.40,
    slippage: 0.09,
    layers: makeLayers(74, 56, 44, 61, 68),
    forensicSummary: 'Pending: Risk Challenge Engine raised unresolved leverage concern. Awaiting agent response on SOL liquidity depth.',
    signals: [
      { icon: 'chart-line', name: 'RSI', value: '43.2 (neutral-oversold)', source: 'technical-analysis', verified: true },
      { icon: 'activity', name: 'DeFi TVL', value: '+$240M (7d increase)', source: 'market-intel', verified: true },
      { icon: 'currency-dollar', name: 'Funding Rate', value: '+0.004% (neutral)', source: 'sentiment-analyst', verified: true },
    ],
    challenges: [
      {
        type: 'LEVERAGE RISK',
        title: 'SOL Liquidity Depth vs 8x',
        body: '8x leverage on 45 SOL exposes a $60,480 notional position to SOL liquidity risk. Order book depth at ±0.5% is thinner than BTC/ETH pairs.',
        agentResponse: 'Awaiting agent response...',
        survived: false,
      },
    ],
  },
  {
    id: makeId(843),
    timestamp: '2025-06-06T13:58:22Z',
    agentId: 'aggressive',
    agentName: 'Aggressive Agent',
    asset: 'BTC/USDT',
    direction: 'SHORT',
    size: '0.8 BTC',
    leverage: '15x',
    signalScore: 58,
    challengeScore: 31,
    finalScore: 41,
    verdict: 'BLOCKED',
    entryPrice: 67180.00,
    layers: makeLayers(62, 38, 22, 44, 54),
    forensicSummary: 'Blocked: Counter-trend short at 15x during positive ETF inflow window. Market context challenge failed decisively.',
    signals: [
      { icon: 'trending-down', name: 'MACD Bearish Cross', value: 'Detected (15m chart)', source: 'technical-analysis', verified: true },
      { icon: 'news', name: 'News Sentiment', value: '+0.15 (slightly bullish)', source: 'news-briefing', verified: true },
    ],
    challenges: [
      {
        type: 'COUNTER-TREND RISK', title: 'ETF Inflow vs Short Thesis',
        body: 'BTC ETF logged +$420M inflow today. Short thesis directly contradicts institutional demand signal. 15x leverage amplifies loss if thesis fails.',
        agentResponse: 'MACD cross on 15m is a strong intraday signal.',
        survived: false,
      },
    ],
  },
  {
    id: makeId(842),
    timestamp: '2025-06-06T13:41:09Z',
    agentId: 'news',
    agentName: 'News Agent',
    asset: 'ETH/USDT',
    direction: 'LONG',
    size: '2.1 ETH',
    leverage: '4x',
    signalScore: 79,
    challengeScore: 71,
    finalScore: 74,
    verdict: 'APPROVED',
    entryPrice: 3821.40,
    exitPrice: 3904.80,
    pnl: 175.14,
    slippage: 0.05,
    executionQuality: 'Good',
    layers: makeLayers(82, 71, 64, 77, 74),
    forensicSummary: 'Approved: Positive ETH sentiment following Ethereum Foundation announcement. Conservative leverage, strong execution quality.',
    signals: [
      { icon: 'news', name: 'EF Announcement Sentiment', value: '+0.88 (very bullish)', source: 'news-briefing', verified: true },
      { icon: 'trending-up', name: 'ETH ETF Inflow', value: '+$94M (24h)', source: 'market-intel', verified: true },
      { icon: 'currency-dollar', name: 'Funding Rate', value: '-0.008% (favorable)', source: 'sentiment-analyst', verified: true },
    ],
    challenges: [
      {
        type: 'MACRO RISK', title: 'DXY Strength Countercheck',
        body: 'DXY up 0.4% today. ETH historically reacts negatively to DXY strengthening. Long thesis may face macro headwind.',
        agentResponse: 'Ethereum Foundation announcement is asset-specific catalyst. DXY macro correlation temporarily decoupled for event-driven moves.',
        survived: true,
      },
    ],
  },
  {
    id: makeId(841),
    timestamp: '2025-06-06T13:22:55Z',
    agentId: 'momentum',
    agentName: 'Momentum Agent',
    asset: 'BTC/USDT',
    direction: 'LONG',
    size: '0.3 BTC',
    leverage: '6x',
    signalScore: 81,
    challengeScore: 76,
    finalScore: 78,
    verdict: 'APPROVED',
    entryPrice: 66980.00,
    exitPrice: 67420.50,
    pnl: 132.15,
    slippage: 0.04,
    executionQuality: 'Good',
    layers: makeLayers(84, 77, 68, 80, 78),
    forensicSummary: 'Approved: Trend continuation after healthy retracement. All 5 layers passed or warned, no critical failures.',
    signals: [
      { icon: 'chart-line', name: 'RSI', value: '38.2 → 52.1 (recovering)', source: 'technical-analysis', verified: true },
      { icon: 'trending-up', name: 'ETF Net Inflow', value: '+$310M (7d)', source: 'market-intel', verified: true },
      { icon: 'currency-dollar', name: 'Funding Rate', value: '-0.006% (favorable)', source: 'sentiment-analyst', verified: true },
      { icon: 'world', name: 'Macro Regime', value: 'Risk-on (BTC/Gold positive)', source: 'macro-analyst', verified: true },
    ],
    challenges: [
      {
        type: 'VOLUME RISK', title: 'Volume Confirmation Check',
        body: 'Recovery move showing lower-than-average volume. RSI recovery without volume confirmation has 34% false positive rate historically.',
        agentResponse: 'Volume 18% below 20-day average. Position sized conservatively at 0.3 BTC to account for lower conviction entry.',
        survived: true,
      },
    ],
  },
  {
    id: makeId(840),
    timestamp: '2025-06-06T13:04:17Z',
    agentId: 'aggressive',
    agentName: 'Aggressive Agent',
    asset: 'DOGE/USDT',
    direction: 'LONG',
    size: '12,000 DOGE',
    leverage: '25x',
    signalScore: 44,
    challengeScore: 12,
    finalScore: 24,
    verdict: 'BLOCKED',
    entryPrice: 0.1842,
    layers: makeLayers(48, 31, 8, 22, 44),
    forensicSummary: 'Blocked: 25x leverage on meme coin. No credible fundamental signal. Risk Challenge Engine returned lowest score on record (8/100).',
    signals: [
      { icon: 'trending-up', name: 'Social Volume Spike', value: '+340% (Elon tweet)', source: 'news-briefing', verified: false },
      { icon: 'chart-bar', name: 'Price Momentum', value: '+4.2% (1h)', source: 'technical-analysis', verified: true },
    ],
    challenges: [
      {
        type: 'SIGNAL INTEGRITY', title: 'No Fundamental Signal Source',
        body: 'Social media spike is not a verifiable trading signal. VEIL requires at least 3 cross-validated signals from Skill Hub. Only 1 verified signal found.',
        agentResponse: 'This is a momentum play. Social signal is valid.',
        survived: false,
      },
    ],
  },
  // Additional entries for the feed
  ...Array.from({ length: 12 }, (_, i) => {
    const agents: AgentId[] = ['momentum', 'news', 'aggressive', 'momentum', 'news', 'momentum', 'news', 'aggressive', 'momentum', 'news', 'momentum', 'aggressive']
    const verdicts: Verdict[] = ['APPROVED', 'APPROVED', 'BLOCKED', 'APPROVED', 'APPROVED', 'BLOCKED', 'APPROVED', 'BLOCKED', 'APPROVED', 'APPROVED', 'APPROVED', 'BLOCKED']
    const assets = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BTC/USDT', 'ETH/USDT', 'BTC/USDT', 'BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BTC/USDT', 'ETH/USDT', 'AVAX/USDT']
    const dirs: Direction[] = ['LONG', 'SHORT', 'LONG', 'LONG', 'SHORT', 'SHORT', 'LONG', 'LONG', 'LONG', 'SHORT', 'LONG', 'LONG']
    const agentId = agents[i]
    const verdict = verdicts[i]
    const score = verdict === 'APPROVED' ? 65 + Math.floor(Math.random() * 25) : 25 + Math.floor(Math.random() * 25)
    const hour = 12 - Math.floor(i / 2)
    const min = (i * 7 + 3) % 60
    return {
      id: makeId(839 - i),
      timestamp: `2025-06-06T${String(hour).padStart(2,'0')}:${String(min).padStart(2,'0')}:${String((i*13)%60).padStart(2,'0')}Z`,
      agentId,
      agentName: AGENTS[agentId].name,
      asset: assets[i],
      direction: dirs[i],
      size: dirs[i] === 'LONG' ? '0.2 BTC' : '1.5 ETH',
      leverage: verdict === 'BLOCKED' ? '15x' : '5x',
      signalScore: score + 5,
      challengeScore: score - 5,
      finalScore: score,
      verdict,
      entryPrice: assets[i].startsWith('BTC') ? 66800 + i * 120 : assets[i].startsWith('ETH') ? 3800 + i * 20 : 160 + i,
      exitPrice: verdict === 'APPROVED' ? (assets[i].startsWith('BTC') ? 67200 + i * 80 : 3850 + i * 15) : undefined,
      pnl: verdict === 'APPROVED' ? 80 + i * 18 : undefined,
      slippage: verdict === 'APPROVED' ? 0.03 + i * 0.005 : 0.12,
      executionQuality: verdict === 'APPROVED' ? 'Good' : 'Poor',
      layers: makeLayers(score + 8, score + 2, score - 12, score + 5, score + 3),
      forensicSummary: verdict === 'APPROVED'
        ? `Approved: Signal integrity confirmed across ${3 + (i % 2)} sources. Risk challenges survived.`
        : `Blocked: Layer ${(i % 3) + 2} failure — challenge not resolved by agent.`,
      signals: [],
      challenges: [],
    } as AuditDecision
  })
]

// ─── LIVE STATS ───────────────────────────────
export const LIVE_STATS = {
  decisionsToday: 847,
  approved: 612,
  blocked: 235,
  approvalRate: 72.3,
  avgAuditScore: 74.2,
  apiCallsToday: 847,
  totalDecisions: 14203,
  badTradePreventionRate: 87,
  signalsCrossValidated: 5,
  tradesAudited: 2847,
  tradesBlocked: 1203,
}

// ─── BTC PRICE DATA ───────────────────────────
export const BTC_PRICE_DATA = [
  { time: '06:00', price: 65420, volume: 1240 },
  { time: '06:30', price: 65680, volume: 980 },
  { time: '07:00', price: 65320, volume: 1520 },
  { time: '07:30', price: 65840, volume: 2100 },
  { time: '08:00', price: 66240, volume: 3400 },
  { time: '08:30', price: 66580, volume: 2800 },
  { time: '09:00', price: 66120, volume: 1900 },
  { time: '09:30', price: 66740, volume: 2400 },
  { time: '10:00', price: 67080, volume: 3100 },
  { time: '10:30', price: 66840, volume: 1800 },
  { time: '11:00', price: 67240, volume: 2200 },
  { time: '11:30', price: 67580, volume: 2900 },
  { time: '12:00', price: 67180, volume: 2100 },
  { time: '12:30', price: 67420, volume: 1700 },
  { time: '13:00', price: 66980, volume: 2400 },
  { time: '13:30', price: 67340, volume: 3200 },
  { time: '14:00', price: 67650, volume: 2800 },
  { time: '14:30', price: 67420, volume: 2100 },
]

// ─── AGENT TRUST SCORE HISTORY ────────────────
export const TRUST_HISTORY = {
  momentum: [71, 73, 74, 76, 75, 77, 79, 78, 80, 81, 80, 82],
  aggressive: [62, 60, 58, 55, 53, 54, 52, 51, 53, 54, 53, 54],
  news: [68, 70, 71, 72, 73, 72, 74, 75, 74, 76, 75, 76],
  dates: ['May 26', 'May 27', 'May 28', 'May 29', 'May 30', 'May 31', 'Jun 1', 'Jun 2', 'Jun 3', 'Jun 4', 'Jun 5', 'Jun 6'],
}

// ─── INSIGHT CARDS ────────────────────────────
export const FORENSIC_INSIGHTS = [
  { label: 'Top Rejection Reason', value: 'Macro risk event proximity', detail: '34% of all blocks', color: 'bear' as const },
  { label: 'Most Accurate Agent', value: 'News Agent — HERALD-2', detail: '71.2% win rate on approved trades', color: 'bull' as const },
  { label: 'Highest Risk Decision', value: 'BLOCKED · Aggressive Agent', detail: 'DOGE LONG 25x · Score 24', color: 'warn' as const },
]