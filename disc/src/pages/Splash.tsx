import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Logo } from '../components/UI/Logo'
import { Ring } from '../components/Loader/Ring'
import { ProgressBar } from '../components/Progress/ProgressBar'
import { useDisc } from '../contexts/DiscContext'

export default function Splash() {
  const { setStep, info, answers } = useDisc()
  const [p, setP] = useState(0)
  useEffect(() => {
    const t0 = Date.now()
    const i = setInterval(() => setP(Math.min(100, ((Date.now() - t0) / 2000) * 100)), 40)
    const t = setTimeout(() => setStep(info ? (Object.keys(answers).length ? 'quiz' : 'info') : 'home'), 2000)
    return () => { clearInterval(i); clearTimeout(t) }
  }, [])
  return <motion.div exit={{ opacity: 0 }} className="fixed inset-0 grid place-items-center bg-gradient-to-br from-navy to-brand px-6 text-white">
    <div className="flex w-full max-w-xs flex-col items-center gap-8 text-center">
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><Logo size={88} /></motion.div>
      <Ring />
      <div className="w-full space-y-3"><ProgressBar value={p} />
        <p className="text-lg font-medium">Chargement du questionnaire...</p><p className="text-sm text-white/70">Veuillez patienter</p></div>
    </div></motion.div>
}
