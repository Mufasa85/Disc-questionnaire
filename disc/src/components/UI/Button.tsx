import { motion, type HTMLMotionProps } from 'framer-motion'
import clsx from 'clsx'
type V = 'primary' | 'accent' | 'ghost'
const styles: Record<V, string> = {
  primary: 'bg-brand text-white hover:bg-navy shadow-md shadow-brand/20',
  accent: 'bg-accent text-navy hover:brightness-95 shadow-md shadow-accent/40 font-semibold',
  ghost: 'bg-white text-navy border border-line hover:border-brand',
}
export function Button({ variant = 'primary', className, ...p }: HTMLMotionProps<'button'> & { variant?: V }) {
  return <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} {...p}
    className={clsx('inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none', styles[variant], className)} />
}
