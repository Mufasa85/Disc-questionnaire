import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { motion } from 'framer-motion'
import { CheckCircle, Home } from 'lucide-react'
import { Card } from '../components/UI/Card'
import { Button } from '../components/UI/Button'
import { useDisc } from '../contexts/DiscContext'
import { ProfileResult } from '../components/Success/ProfileResult'

export default function Success() {
  const { reset, result } = useDisc()
  const [recycle, setRecycle] = useState(true)
  useEffect(() => { const t = setTimeout(() => setRecycle(false), 8000); return () => clearTimeout(t) }, [])
  return <>
    <Confetti className="!fixed" width={window.innerWidth} height={window.innerHeight} recycle={recycle} numberOfPieces={220} colors={['#0057B8', '#FFD200', '#FFFFFF']} />
    <Card className="mt-8 text-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1, x: [0, -6, 6, -4, 4, 0] }} transition={{ duration: 0.6, delay: 0.1 }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.25, 1] }} transition={{ delay: 0.3, duration: 0.6 }} className="mx-auto mb-6 grid size-24 place-items-center rounded-full bg-ok/10 text-ok"><CheckCircle size={64} /></motion.div>
      <h1 className="text-3xl font-bold text-navy">Questionnaire envoyé avec succès</h1>
      <p className="mt-3 text-lg">Merci pour votre participation.</p>
      <p className="text-ink/70">Vos réponses ont été enregistrées avec succès.</p>
      {result && <ProfileResult scores={result.scores} />}
      <Button className="mt-8" onClick={reset}><Home size={18} />Retour à l'accueil</Button>
    </Card></>
}
