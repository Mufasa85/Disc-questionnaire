import { motion } from 'framer-motion'
import type { Profile } from '../../types'
import { PROFILES, dominant } from '../../utils/profiles'

export function ProfileResult({ scores }: { scores: Record<Profile, number> }) {
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1
  const top = dominant(scores)
  return <section aria-label="Votre profil DISC" className="mt-8 border-t border-line pt-8 text-left">
    <h2 className="text-xl font-bold text-navy">{top.length > 1 ? 'Profils dominants' : 'Profil dominant'} : {top.map((t) => PROFILES[t].name).join(' et ')}</h2>
    <div className="mt-5 space-y-3">
      {(Object.keys(PROFILES) as Profile[]).map((k, i) => { const pct = Math.round((scores[k] / total) * 100), isTop = top.includes(k)
        return <div key={k}><div className="mb-1 flex justify-between text-sm"><span className="font-medium text-navy">{k} · {PROFILES[k].name}</span><span>{scores[k]} / {total} ({pct}%)</span></div>
          <div className="h-3 overflow-hidden rounded-full bg-line" role="img" aria-label={`${PROFILES[k].name} : ${pct}%`}>
            <motion.div className={`h-full rounded-full ${isTop ? 'bg-accent' : 'bg-brand'}`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }} /></div></div> })}
    </div>
    <div className="mt-6 space-y-3">{top.map((t) => <div key={t} className="rounded-2xl bg-surface p-4"><p className="font-semibold text-navy">{PROFILES[t].summary}</p><p className="mt-1 text-sm text-ink/80">{PROFILES[t].traits}</p></div>)}</div>
  </section>
}
