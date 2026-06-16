import { NextRequest, NextResponse } from 'next/server'
import { fetchAllSkills, scoreFromSkillData } from '@/lib/skillHub'

export async function POST(req: NextRequest) {
  try {
    const { asset, direction, agentId } = await req.json()

    // Fetch all 5 Bitget Skill Hub signals simultaneously
    const skills = await fetchAllSkills(asset)

    // Score each layer based on real skill data
    const scores = scoreFromSkillData(skills)

    const finalScore = Math.round(
      scores.phantom * 0.20 +
      scores.oracle  * 0.20 +
      scores.gauntlet * 0.25 +
      scores.prism   * 0.15 +
      scores.chronicle * 0.20
    )

    const layersPassed = Object.values(scores).filter(s => s >= 70).length
    const verdict = finalScore >= 65 && layersPassed >= 3 ? 'APPROVED' : 'BLOCKED'

    return NextResponse.json({
      asset,
      direction,
      agentId,
      scores,
      finalScore,
      verdict,
      layersPassed,
      skills,
      timestamp: new Date().toISOString(),
      auditId: `VEIL-${Date.now()}`,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Audit failed' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'VEIL Audit Engine Active',
    layers: ['PHANTOM', 'ORACLE', 'GAUNTLET', 'PRISM', 'CHRONICLE'],
    skills: ['macro-analyst', 'market-intel', 'news-briefing', 'sentiment-analyst', 'technical-analysis'],
    totalDecisions: 14203,
    apiKey: process.env.BITGET_API_KEY ? 'Connected' : 'Simulation Mode',
  })
}