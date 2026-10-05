import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Answers, PersonalInfo, Question, Step, Submission } from '../types'
import { getQuestions } from '../services/api'

const KEY = 'disc-state-v1'
interface Saved { step: Step; info: PersonalInfo | null; answers: Answers; current: number }
interface Ctx extends Saved {
  questions: Question[]
  result: Submission | null; setResult: (r: Submission) => void
  setStep: (s: Step) => void; setInfo: (i: PersonalInfo) => void
  setAnswer: (qid: number, oid: string) => void; setCurrent: (n: number) => void; reset: () => void
}
const DiscContext = createContext<Ctx | null>(null)

function load(): Saved {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? '')
    const step: Step = ['info', 'quiz', 'summary'].includes(s.step) ? s.step : 'splash'
    return { ...s, step: 'splash', resume: step } as Saved
  } catch { return { step: 'splash', info: null, answers: {}, current: 0 } }
}

export function DiscProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Saved>(load)
  const [questions, setQuestions] = useState<Question[]>([])
  const [result, setResult] = useState<Submission | null>(null)
  useEffect(() => { getQuestions().then(setQuestions) }, [])
  useEffect(() => {
    if (state.step === 'success') localStorage.removeItem(KEY)
    else if (state.step !== 'splash') localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])
  const patch = (p: Partial<Saved>) => setState((s) => ({ ...s, ...p }))
  const value: Ctx = {
    ...state, questions, result, setResult,
    setStep: (step) => patch({ step }), setInfo: (info) => patch({ info }),
    setAnswer: (q, o) => setState((s) => ({ ...s, answers: { ...s.answers, [q]: o } })),
    setCurrent: (current) => patch({ current }),
    reset: () => { localStorage.removeItem(KEY); setResult(null); setState({ step: 'home', info: null, answers: {}, current: 0 }) },
  }
  return <DiscContext.Provider value={value}>{children}</DiscContext.Provider>
}
export const useDisc = () => { const c = useContext(DiscContext); if (!c) throw new Error('DiscProvider manquant'); return c }
