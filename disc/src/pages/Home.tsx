import { motion } from 'framer-motion'
import { ClipboardList, ChevronRight, History, Shield, Zap, Users } from '../components/Icons'
import { Button } from '../components/UI/Button'
import { useDisc } from '../contexts/DiscContext'

const FEATURES = [
  { icon: Zap, label: 'Rapide', desc: '3 à 5 minutes' },
  { icon: Users, label: '25 questions', desc: '4 choix chacune' },
  { icon: Shield, label: 'Confidentiel', desc: 'Aucune donnée partagée' },
]

export default function Home() {
  const { setStep, info, answers } = useDisc()
  // Détection d'une progression existante
  const answeredCount = Object.keys(answers).length
  const hasProgress = !!info && answeredCount > 0
  const hasInfo = !!info

  const resumeStep = answeredCount > 0 ? 'quiz' : 'info'

  return (
    <section className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-navy to-brand px-6 py-16 text-center text-white sm:py-20">
      <div aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full bg-accent/20 blur-2xl" />
      <div aria-hidden className="absolute -bottom-20 -left-20 size-72 rounded-full bg-brand/40 blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto max-w-xl space-y-6"
      >
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-accent text-navy shadow-lg shadow-accent/30">
          <ClipboardList size={32} />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Questionnaire DISC</h1>
        <p className="text-lg text-white/80">
          Découvrez votre profil comportemental en répondant à quelques questions.
        </p>

        {/* Badges caractéristiques */}
        <div className="flex flex-wrap justify-center gap-2">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-sm backdrop-blur"
            >
              <Icon size={14} className="text-accent" />
              <span className="font-semibold">{label}</span>
              <span className="text-white/60">· {desc}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 pt-2">
          <Button
            variant="accent"
            onClick={() => setStep('intro')}
            className="px-8 py-4 text-base"
          >
            {hasProgress ? 'Recommencer un nouveau questionnaire' : 'Commencer le questionnaire'}
            <ChevronRight size={18} />
          </Button>

          {hasProgress && (
            <Button
              variant="ghost"
              onClick={() => setStep(resumeStep)}
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <History size={16} />
              Reprendre où j'en étais ({answeredCount} réponse{answeredCount > 1 ? 's' : ''})
            </Button>
          )}

          {hasInfo && !hasProgress && (
            <Button
              variant="ghost"
              onClick={() => setStep('info')}
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <History size={16} />
              Reprendre mes informations
            </Button>
          )}
        </div>
      </motion.div>
    </section>
  )
}
