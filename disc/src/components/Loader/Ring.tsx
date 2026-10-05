import { motion } from 'framer-motion'
export function Ring({ size = 96 }: { size?: number }) {
  return <div className="relative" style={{ width: size, height: size }} role="status" aria-label="Chargement">
    <motion.div className="absolute inset-0 rounded-full border-[6px] border-white/20 border-t-accent" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} />
    <motion.div className="absolute inset-3 rounded-full border-[6px] border-transparent border-b-white" animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }} />
  </div>
}
