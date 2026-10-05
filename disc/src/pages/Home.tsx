import { motion } from 'framer-motion'
import { ClipboardList, ChevronRight } from 'lucide-react'
import { Button } from '../components/UI/Button'
import { useDisc } from '../contexts/DiscContext'

export default function Home() {
  const { setStep } = useDisc()
  return <section className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-navy to-brand px-6 py-16 text-center text-white sm:py-24">
    <div aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full bg-accent/20 blur-2xl" />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto max-w-xl space-y-6">
      <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-accent text-navy"><ClipboardList size={32} /></div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Questionnaire DISC</h1>
      <p className="text-lg text-white/80">Découvrez votre profil comportemental en répondant à quelques questions.</p>
      <Button variant="accent" onClick={() => setStep('info')} className="px-8 py-4 text-base">Commencer le questionnaire <ChevronRight size={18} /></Button>
    </motion.div></section>
}
