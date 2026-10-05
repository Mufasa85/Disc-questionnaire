import raw from '../data/questions.json'
import type { Question, Submission, Profile, PersonalInfo, Answers } from '../types'
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Remplacer par fetch('/api/questions') ultérieurement
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

// Remplacer par fetch POST ultérieurement
export async function submitQuestionnaire(info: PersonalInfo, answers: Answers, questions: Question[]): Promise<Submission> {
  await delay(500)
  return { info, answers, scores: computeScores(questions, answers), date: new Date().toISOString() }
}
