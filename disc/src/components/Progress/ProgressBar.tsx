import { motion } from 'framer-motion'
export function ProgressBar({ value, label }: { value: number; label?: string }) {
  return <div role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? 'Progression'}
    className="h-2.5 w-full overflow-hidden rounded-full bg-line">
    <motion.div className="h-full rounded-full bg-gradient-to-r from-brand to-accent" initial={false} animate={{ width: `${value}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
  </div>
}
