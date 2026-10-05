import raw from '../data/questions.json'
import type { Question, Submission, Profile, PersonalInfo, Answers } from '../types'
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

// URL du backend. En dev : http://localhost:4000
// Peut etre surchargee via VITE_API_URL dans .env
const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000'

// Remplacer par fetch('/api/questions') ulterieurement
export async function getQuestions(): Promise<Question[]> {
  await delay(150)
  return (raw as { id: number; o: string[][] }[]).map((q) => ({
    id: q.id,
    options: q.o.map(([label, profile], i) => ({ id: 'abcd'[i], label, profile: profile as Profile })),
  }))
}

export function computeScores(questions: Question[], answers: Answers): Record<Profile, number> {
  const s: Record<Profile, number> = { D: 0, I: 0, S: 0, C: 0 }
  questions.forEach((q) => { const o = q.options.find((x) => x.id === answers[q.id]); if (o) s[o.profile]++ })
  return s
}

/**
 * Envoie le questionnaire au backend.
 * Si le backend n'est pas disponible, on retombe en mode local
 * (les resultats ne sont pas persists mais l'UX n'est pas cassee).
 */
export async function submitQuestionnaire(
  info: PersonalInfo,
  answers: Answers,
  questions: Question[],
  durationSeconds?: number
): Promise<Submission> {
  const scores = computeScores(questions, answers)
  const payload = { info, answers, scores, durationSeconds }

  try {
    const res = await fetch(`${API_URL}/api/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur inconnue' }))
      throw new Error(err.error || `HTTP ${res.status}`)
    }
    const result = await res.json()
    return {
      info,
      answers,
      scores,
      date: result.createdAt || new Date().toISOString(),
      id: result.id,
      code: result.code,
      dominantProfile: result.dominantProfile,
    }
  } catch (err) {
    console.warn('[api] Backend injoignable, mode local :', err)
    // Fallback : on garde les resultats en memoire pour ne pas casser l'UX
    return { info, answers, scores, date: new Date().toISOString() }
  }
}
