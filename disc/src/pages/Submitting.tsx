import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import { Ring } from '../components/Loader/Ring'
import { useDisc } from '../contexts/DiscContext'
import { submitQuestionnaire } from '../services/api'

const msgs = ['Analyse du profil DISC...', 'Préparation du rapport...', 'Enregistrement des réponses...']
export default function Submitting() {
  const { info, answers, questions, setStep, setResult, quizStartedAt } = useDisc()
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => Math.min(n + 1, 2)), 1300)
    const min = new Promise((r) => setTimeout(r, 3900))
    // Calcule la duree en secondes
    const durationSeconds = quizStartedAt
      ? Math.round((Date.now() - quizStartedAt) / 1000)
      : undefined
    Promise.all([submitQuestionnaire(info!, answers, questions, durationSeconds), min])
      .then(([r]) => { setResult(r); toast.success('Réponses enregistrées'); setStep('success') })
      .catch(() => { toast.error("Échec de l'envoi. Réessayez."); setStep('summary') })
    return () => clearInterval(t)
  }, [])
  return <div className="fixed inset-0 z-40 grid place-items-center bg-navy text-white"><div className="flex flex-col items-center gap-8"><Ring />
    <AnimatePresence mode="wait"><motion.p key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="text-xl font-medium" aria-live="polite">{msgs[i]}</motion.p></AnimatePresence></div></div>
}
