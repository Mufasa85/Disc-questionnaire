import { motion, type HTMLMotionProps } from 'framer-motion'
import clsx from 'clsx'
export function Card({ className, ...p }: HTMLMotionProps<'div'>) {
  return <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
    transition={{ duration: 0.25 }} {...p}
    className={clsx('w-full rounded-3xl border border-line bg-white p-6 shadow-[0_8px_30px_rgba(15,45,92,.07)] sm:p-10', className)} />
}
