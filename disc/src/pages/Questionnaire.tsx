import { useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock, Keyboard } from '../components/Icons'
import { Card } from '../components/UI/Card'
import { Button } from '../components/UI/Button'
import { ProgressBar } from '../components/Progress/ProgressBar'
import { useDisc } from '../contexts/DiscContext'
import { useBeforeUnload } from '../hooks/useBeforeUnload'
import { useQuizTimer } from '../hooks/useQuizTimer'
import { useKeyboardNav } from '../hooks/useKeyboardNav'

/** Estimation : 12 secondes par question en moyenne */
const SECONDS_PER_QUESTION = 12

export default function Questionnaire() {
  const { questions, current, setCurrent, answers, setAnswer, setStep, startQuizTimer } = useDisc()
  useBeforeUnload(true)
  useEffect(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [current])
  // Démarre le chrono global dès qu'on entre dans le quiz
  useEffect(() => { startQuizTimer() }, [startQuizTimer])

  const q = questions[current]
  const total = questions.length
  const last = current === total - 1
  const answered = q ? answers[q.id] : undefined

  // ⏱️ Timer
  const { formatted: elapsed } = useQuizTimer(true)
  const answeredCount = Object.keys(answers).length
  const remainingCount = total - answeredCount
  const remainingSeconds = remainingCount * SECONDS_PER_QUESTION
  const estMin = Math.floor(remainingSeconds / 60)
  const estSec = remainingSeconds % 60
  const estRemaining = estMin > 0 ? `~${estMin} min` : `~${estSec}s`

  // Pourcentage : on avance seulement quand on a répondu
  const pct = useMemo(
    () => ((current + (answered ? 1 : 0)) / total) * 100,
    [current, answered, total]
  )

  // ⌨️ Raccourcis clavier
  useKeyboardNav({
    optionCount: q?.options.length ?? 0,
    questionId: q?.id ?? 0,
    hasAnswer: !!answered,
    isFirst: current === 0,
    isLast: last,
    onSelect: (optId) => q && setAnswer(q.id, optId),
    onNext: () => (last ? setStep('summary') : setCurrent(current + 1)),
    onPrev: () => (current === 0 ? setStep('info') : setCurrent(current - 1)),
  })

  if (!q) {
    return <div className="h-64 w-full animate-pulse rounded-3xl bg-line" aria-busy />
  }

  return (
    <div className="w-full space-y-5">
        {/* Barre de progression enrichie */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium text-navy">
            <span>
              Question {current + 1} / {total}
              <span className="ml-2 text-ink/60">
                · {remainingCount} restante{remainingCount > 1 ? 's' : ''}
              </span>
            </span>
            <div className="flex items-center gap-3 text-ink/70">
              <span className="inline-flex items-center gap-1" title="Temps écoulé">
                <Clock size={14} aria-hidden /> {elapsed}
              </span>
              <span aria-hidden>·</span>
              <span title="Estimation du temps restant">{estRemaining}</span>
              <span
                className="hidden sm:inline-flex items-center gap-1 rounded-full bg-line px-2 py-0.5 text-xs"
                title="Raccourcis : 1-4 pour choisir, Entrée/→ pour suivant, ← pour précédent"
              >
                <Keyboard size={12} aria-hidden /> 1-4 / ↵
              </span>
            </div>
          </div>
          <ProgressBar value={pct} label="Progression du questionnaire" />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <Card key={q.id}>
            <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-sm font-semibold text-navy">
              Question {q.id}
            </span>
            <h2 id="q" className="mb-6 text-xl font-bold text-navy">
              Quelle proposition vous décrit le mieux ?
            </h2>
            <div role="radiogroup" aria-labelledby="q" className="grid gap-3">
              {q.options.map((o, i) => {
                const on = answered === o.id
                const shortcut = i + 1
                return (
                  <motion.label
                    key={o.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`group relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 px-4 py-4 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-accent ${
                      on ? 'border-brand bg-brand/5' : 'border-line hover:border-brand/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      className="sr-only"
                      checked={on}
                      onChange={() => setAnswer(q.id, o.id)}
                    />
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${
                        on ? 'bg-accent text-navy' : 'bg-line text-ink/60'
                      }`}
                    >
                      {o.id.toUpperCase()}
                    </span>
                    <span className="flex-1 font-medium">{o.label}</span>
                    <kbd
                      className={`hidden sm:grid place-items-center rounded-md border px-2 py-0.5 text-xs font-mono ${
                        on
                          ? 'border-brand bg-white text-brand'
                          : 'border-line bg-white/60 text-ink/50 group-hover:border-brand/40'
                      }`}
                      aria-hidden
                    >
                      {shortcut}
                    </kbd>
                  </motion.label>
                )
              })}
            </div>
          </Card>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={() => (current === 0 ? setStep('info') : setCurrent(current - 1))}
          >
            <ChevronLeft size={18} />
            Précédent
          </Button>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-ink/60 sm:inline">
              <kbd className="rounded border border-line bg-white px-1.5 py-0.5 font-mono">Entrée</kbd>{' '}
              pour {last ? 'voir le résumé' : 'continuer'}
            </span>
            <Button
              disabled={!answered}
              onClick={() => (last ? setStep('summary') : setCurrent(current + 1))}
            >
              {last ? 'Voir le résumé' : 'Suivant'}
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
    </div>
  )
}
