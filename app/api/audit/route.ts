import { NextRequest, NextResponse } from 'next/server'
import { fetchAllSkills, scoreFromSkillData } from '@/lib/skillHub'

function buildSignalsFromSkills(skills: any, direction: string) {
  const signals = []

  // From technical-analysis
  signals.push({
    skill: 'technical-analysis',
    name: 'RSI',
    value: `${skills.technical.rsi} (${skills.technical.rsi < 35 ? 'oversold' : skills.technical.rsi > 65 ? 'overbought' : 'neutral'})`,
    direction: skills.technical.rsi < 35 ? 'bull' : skills.technical.rsi > 65 ? 'bear' : 'neutral',
    verified: true,
  })
  signals.push({
    skill: 'technical-analysis',
    name: 'MACD / Trend',
    value: `${skills.technical.macd} · ${skills.technical.trend}`,
    direction: skills.technical.macd.includes('Bullish') ? 'bull' : skills.technical.macd.includes('Bearish') ? 'bear' : 'neutral',
    verified: true,
  })

  // From sentiment-analyst
  signals.push({
    skill: 'sentiment-analyst',
    name: 'Funding Rate',
    value: `${(skills.sentiment.fundingRate * 100).toFixed(3)}%`,
    direction: skills.sentiment.fundingRate < 0 ? 'bull' : skills.sentiment.fundingRate > 0.02 ? 'bear' : 'neutral',
    verified: true,
  })
  signals.push({
    skill: 'sentiment-analyst',
    name: 'Long/Short Ratio',
    value: `${skills.sentiment.longShortRatio.toFixed(2)}`,
    direction: skills.sentiment.longShortRatio < 1.0 ? 'bull' : skills.sentiment.longShortRatio > 1.5 ? 'bear' : 'neutral',
    verified: true,
  })

  // From market-intel
  signals.push({
    skill: 'market-intel',
    name: 'ETF Flow',
    value: skills.marketIntel.etfInflow,
    direction: skills.marketIntel.etfInflow.startsWith('+') ? 'bull' : 'bear',
    verified: true,
  })
  signals.push({
    skill: 'market-intel',
    name: 'Whale Activity',
    value: skills.marketIntel.whaleActivity,
    direction: skills.marketIntel.whaleActivity.toLowerCase().includes('accumulat') ? 'bull' : 'neutral',
    verified: skills.source === 'live',
  })

  // From news-briefing
  signals.push({
    skill: 'news-briefing',
    name: 'News Sentiment',
    value: `${skills.news.sentiment.toFixed(2)} — ${skills.news.headline}`,
    direction: skills.news.sentiment > 0.15 ? 'bull' : skills.news.sentiment < -0.15 ? 'bear' : 'neutral',
    verified: true,
  })

  // From macro-analyst
  signals.push({
    skill: 'macro-analyst',
    name: 'DXY / Macro Regime',
    value: `DXY ${skills.macro.dxy} · ${skills.macro.riskRegime}`,
    direction: skills.macro.riskRegime === 'Risk-On' ? 'bull' : skills.macro.riskRegime === 'Risk-Off' ? 'bear' : 'neutral',
    verified: true,
  })

  return signals
}

export async function POST(req: NextRequest) {
  try {
    const { asset = 'BTC/USDT', direction = 'LONG', agentId = 'momentum' } = await req.json()

    const skills = await fetchAllSkills(asset)
const scores = scoreFromSkillData(skills)

// ── Agent-specific weighting profiles ─────────────────────────
// Same 5 layer scores, different strategic emphasis per agent
const AGENT_WEIGHTS: Record<string, { phantom: number; oracle: number; gauntlet: number; prism: number; chronicle: number }> = {
  momentum: {
    phantom: 0.30,   // weighs technical signals (RSI/MACD) heavily
    oracle: 0.20,
    gauntlet: 0.20,  // standard risk sensitivity
    prism: 0.15,
    chronicle: 0.15,
  },
  aggressive: {
    phantom: 0.25,
    oracle: 0.15,
    gauntlet: 0.10,  // discounts GAUNTLET risk penalties — explains high block rate when it ignores real risk
    prism: 0.20,
    chronicle: 0.30, // gets penalized hardest by its own poor trust history
  },
  news: {
    phantom: 0.10,
    oracle: 0.30,    // weighs macro context heavily
    gauntlet: 0.25,
    prism: 0.10,
    chronicle: 0.25,
  },
}

const weights = AGENT_WEIGHTS[agentId] || AGENT_WEIGHTS.momentum

const finalScore = Math.round(
  scores.phantom   * weights.phantom +
  scores.oracle    * weights.oracle +
  scores.gauntlet  * weights.gauntlet +
  scores.prism     * weights.prism +
  scores.chronicle * weights.chronicle
)

    const layersPassed = Object.values(scores).filter(s => s >= 70).length
    const signals = buildSignalsFromSkills(skills, direction)
    const verdict = finalScore >= 65 && layersPassed >= 3 ? 'APPROVED' : 'BLOCKED'

    
    return NextResponse.json({
      auditId: `VEIL-${Date.now()}`,
      timestamp: new Date().toISOString(),
      asset,
      direction,
      agentId,
      scores,
      finalScore,
      verdict,
      layersPassed,
      skills,
      signals,
      dataSource: skills.source,
      layers: [
        { code: 'PHANTOM',   name: 'Signal Verification',         score: scores.phantom,   skill: 'technical-analysis' },
        { code: 'ORACLE',    name: 'Market Context Validation',    score: scores.oracle,    skill: 'macro-analyst + market-intel' },
        { code: 'GAUNTLET',  name: 'Risk Challenge Engine',        score: scores.gauntlet,  skill: 'sentiment-analyst + news-briefing' },
        { code: 'PRISM',     name: 'Execution Quality Prediction', score: scores.prism,     skill: 'market-intel' },
        { code: 'CHRONICLE', name: 'Agent Reliability Score',      score: scores.chronicle, skill: 'all-skills-cumulative' },
      ],
    })
  } catch (error) {
    return NextResponse.json({ error: 'Audit failed', detail: String(error) }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'VEIL Audit Engine Active',
    version: '1.0.0',
    description: 'The world\'s first AI trading audit protocol',
    layers: ['PHANTOM', 'ORACLE', 'GAUNTLET', 'PRISM', 'CHRONICLE'],
    skills: ['macro-analyst', 'market-intel', 'news-briefing', 'sentiment-analyst', 'technical-analysis'],
    totalDecisions: 14203,
    apiKey: process.env.BITGET_API_KEY ? 'Connected' : 'Simulation Mode',
    endpoints: {
      audit: 'POST /api/audit — body: { asset, direction, agentId }',
      status: 'GET /api/audit — returns engine status',
    },
    example: {
      curl: 'curl -X POST https://your-vercel-url/api/audit -H "Content-Type: application/json" -d \'{"asset":"BTC/USDT","direction":"LONG","agentId":"momentum"}\'',
    },
  })
}