import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Eye, EyeOff } from '../../components/Icons'
import type { Profile } from '../../types'
import { PROFILES, dominant, computeLiveScores } from '../../utils/profiles'
import type { Question, Answers } from '../../types'

interface Props {
  questions: Question[]
  answers: Answers
  /** Affiche / masque (l'utilisateur peut toggle) */
  visible: boolean
  onToggle: () => void
}

/**
 * Affiche les scores DISC en temps réel pendant le quiz.
 * Mise à jour automatique à chaque réponse.
 * Peut être masqué par l'utilisateur pour éviter le biais.
 */
export function LiveProfile({ questions, answers, visible, onToggle }: Props) {
  const scores = useMemo(() => computeLiveScores(questions, answers), [questions, answers])
  const total = useMemo(() => Object.values(scores).reduce((a, b) => a + b, 0), [scores])
  const top = useMemo(() => dominant(scores), [scores])

  if (total === 0) {
    return (
      <div className="rounded-2xl border border-line bg-white p-4">
        <div className="flex items-center gap-2 text-sm text-ink/60">
          <Activity size={16} className="text-brand" />
          <span>Vos scores apparaîtront ici au fur et à mesure.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative grid size-7 place-items-center rounded-full bg-brand/10 text-brand">
            <Activity size={14} />
            <span className="absolute -right-0.5 -top-0.5 size-2 animate-ping rounded-full bg-brand" />
            <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-brand" />
          </span>
          <h3 className="text-sm font-bold text-navy">Votre profil en direct</h3>
        </div>
        <button
          onClick={onToggle}
          className="rounded-md p-1.5 text-ink/50 hover:bg-line hover:text-navy"
          aria-label={visible ? 'Masquer' : 'Afficher'}
          title={visible ? 'Masquer les scores' : 'Afficher les scores'}
        >
          {visible ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
      </div>

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-2.5"
          >
            {(Object.keys(PROFILES) as Profile[]).map((k) => {
              const value = scores[k]
              const pct = Math.round((value / 25) * 100)
              const isTop = top.includes(k) && value > 0
              return (
                <div key={k}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className={`font-semibold ${isTop ? 'text-navy' : 'text-ink/70'}`}>
                      <span className="mr-1">{PROFILES[k].emoji}</span>
                      {k} · {PROFILES[k].name}
                    </span>
                    <span className="tabular-nums text-ink/60">
                      {value} <span className="text-ink/40">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-line">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: PROFILES[k].color }}
                      initial={false}
                      animate={{ width: `${pct}%` }}
                      transition={{ type: 'spring', stiffness: 150, damping: 25 }}
                    />
                  </div>
                </div>
              )
            })}

            {top.length > 0 && top[0] && scores[top[0]] > 0 && (
              <p className="mt-3 rounded-lg bg-accent/15 px-3 py-2 text-xs text-navy">
                <strong>Tendance actuelle :</strong> {top.map((t) => PROFILES[t].name).join(' + ')}
                <span className="ml-1 text-ink/60">
                  · continuez pour affiner
                </span>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
