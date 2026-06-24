import type { AuditRecord } from '@/lib/auditEngine'

const KEY = 'veil_live_audits'

export function getLiveAudits(): AuditRecord[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function addLiveAudit(record: AuditRecord) {
  if (typeof window === 'undefined') return
  try {
    const existing = getLiveAudits()
    const updated = [record, ...existing].slice(0, 100)
    sessionStorage.setItem(KEY, JSON.stringify(updated))
  } catch (e) {
    console.error('Failed to persist live audit', e)
  }
}

// Merges live audits (newest first) on top of the seeded historical records
export function mergeWithSeeded(seeded: AuditRecord[]): AuditRecord[] {
  const live = getLiveAudits()
  return [...live, ...seeded]
}

export function mergeWithSeededForAgent(seeded: AuditRecord[], agentId: string): AuditRecord[] {
  const live = getLiveAudits().filter(r => r.agentId === agentId)
  const seededForAgent = seeded.filter(r => r.agentId === agentId)
  return [...live, ...seededForAgent]
}