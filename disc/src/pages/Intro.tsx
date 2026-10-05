import { motion } from 'framer-motion'
import { ChevronRight, ChevronLeft, User, ListChecks, Sparkles, Clock, Target } from 'lucide-react'
import { Card } from '../components/UI/Card'
import { Button } from '../components/UI/Button'
import { useDisc } from '../contexts/DiscContext'

const STEPS = [
  {
    icon: User,
    title: 'Vos informations',
    desc: 'Nom, prénom, contact (1 min)',
    accent: 'bg-brand text-white',
  },
  {
    icon: ListChecks,
    title: '25 questions',
    desc: 'Choisissez la proposition qui vous décrit le mieux',
    accent: 'bg-accent text-navy',
  },
  {
    icon: Sparkles,
    title: 'Votre profil DISC',
    desc: 'Résultats détaillés et conseils personnalisés',
    accent: 'bg-navy text-white',
  },
]

const PRINCIPLES = [
  { icon: Clock, text: 'Pas de bonne ou mauvaise réponse — restez spontané.' },
  { icon: Target, text: 'Choisissez ce qui vous correspond le mieux, pas ce qui "plaira".' },
  { icon: Sparkles, text: 'Vos réponses sont enregistrées automatiquement.' },
]

export default function Intro() {
  const { setStep } = useDisc()
  return (
    <div className="w-full space-y-5">
      <Card>
        <div className="text-center">
          <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-sm font-semibold text-navy">
            Comment ça marche ?
          </span>
          <h2 className="mt-4 text-3xl font-bold text-navy">Un questionnaire en 3 étapes</h2>
          <p className="mt-2 text-ink/70">
            Quelques minutes suffisent pour obtenir votre profil comportemental DISC.
          </p>
        </div>

        {/* Timeline */}
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, desc, accent }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="relative flex flex-col items-center rounded-2xl border border-line bg-surface p-5 text-center"
            >
              <span
                className={`grid size-12 place-items-center rounded-xl shadow-md ${accent}`}
              >
                <Icon size={22} />
              </span>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-line bg-white px-2 text-xs font-bold text-navy">
                {i + 1}
              </span>
              <h3 className="mt-3 font-bold text-navy">{title}</h3>
              <p className="mt-1 text-sm text-ink/70">{desc}</p>
            </motion.li>
          ))}
        </ol>

        {/* Principes */}
        <div className="mt-8 rounded-2xl bg-gradient-to-br from-navy/5 to-brand/5 p-5">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-navy">
            ✨ Pour un résultat fiable
          </h3>
          <ul className="space-y-2">
            {PRINCIPLES.map(({ icon: Icon, text }, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-ink/80">
                <Icon size={18} className="mt-0.5 shrink-0 text-brand" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mini-disclaimer */}
        <p className="mt-6 text-center text-xs text-ink/50">
          🔒 Vos données restent privées. Le modèle DISC est un outil de développement personnel.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => setStep('home')}>
            <ChevronLeft size={18} /> Retour
          </Button>
          <Button onClick={() => setStep('info')}>
            C'est parti <ChevronRight size={18} />
          </Button>
        </div>
      </Card>
    </div>
  )
}
