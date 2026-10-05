import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '../components/UI/Card'
import { Button } from '../components/UI/Button'
import { ProgressBar } from '../components/Progress/ProgressBar'
import { useDisc } from '../contexts/DiscContext'
import { useBeforeUnload } from '../hooks/useBeforeUnload'

export default function Questionnaire() {
  const { questions, current, setCurrent, answers, setAnswer, setStep } = useDisc()
  useBeforeUnload(true)
  useEffect(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [current])
  const q = questions[current]
  if (!q) return <div className="h-64 w-full animate-pulse rounded-3xl bg-line" aria-busy />
  const total = questions.length, answered = answers[q.id], last = current === total - 1
  const pct = ((current + (answered ? 1 : 0)) / total) * 100
  return <div className="w-full space-y-5">
    <div className="space-y-2"><div className="flex justify-between text-sm font-medium text-navy"><span>Question {current + 1} / {total}</span><span>{Math.round(pct)}%</span></div>
      <ProgressBar value={pct} label="Progression du questionnaire" /></div>
    <AnimatePresence mode="wait">
      <Card key={q.id}>
        <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-sm font-semibold text-navy">Question {q.id}</span>
        <h2 id="q" className="mb-6 text-xl font-bold text-navy">Quelle proposition vous décrit le mieux ?</h2>
        <div role="radiogroup" aria-labelledby="q" className="grid gap-3">
          {q.options.map((o) => { const on = answered === o.id
            return <motion.label key={o.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 px-4 py-4 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-accent ${on ? 'border-brand bg-brand/5' : 'border-line hover:border-brand/50'}`}>
              <input type="radio" name={`q${q.id}`} className="sr-only" checked={on} onChange={() => setAnswer(q.id, o.id)} />
              <span className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${on ? 'bg-accent text-navy' : 'bg-line text-ink/60'}`}>{o.id.toUpperCase()}</span>
              <span className="font-medium">{o.label}</span></motion.label> })}
        </div>
      </Card>
    </AnimatePresence>
    <div className="flex justify-between gap-3">
      <Button variant="ghost" onClick={() => current === 0 ? setStep('info') : setCurrent(current - 1)}><ChevronLeft size={18} />Précédent</Button>
      <Button disabled={!answered} onClick={() => last ? setStep('summary') : setCurrent(current + 1)}>{last ? 'Voir le résumé' : 'Suivant'}<ChevronRight size={18} /></Button>
    </div></div>
}
