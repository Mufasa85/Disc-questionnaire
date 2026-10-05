import { motion } from 'framer-motion'
import { Award, AlertTriangle, MessageCircle, Sparkles, TrendingUp } from '../../components/Icons'
import type { Profile } from '../../types'
import { PROFILES, dominant } from '../../utils/profiles'
import { DiscRadarChart } from './DiscRadarChart'

export function ProfileResult({ scores }: { scores: Record<Profile, number> }) {
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1
  const top = dominant(scores)
  const topProfile = top[0]
  const ranked = (Object.keys(scores) as Profile[])
    .map((k) => ({ k, v: scores[k] }))
    .sort((a, b) => b.v - a.v)
  const code = ranked[0].k + ranked[1].k

  return (
    <section aria-label="Votre profil DISC" className="mt-8 border-t border-line pt-8 text-left">
      <div className="mb-6 flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
        <div className="grid size-20 place-items-center rounded-2xl bg-gradient-to-br from-brand to-navy text-3xl font-bold text-white shadow-lg">
          {code}
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">
            {top.length > 1 ? 'Profils dominants' : 'Profil dominant'}
          </p>
          <h2 className="text-2xl font-bold text-navy">
            {top.map((t) => PROFILES[t].name).join(' + ')}
          </h2>
          <p className="mt-1 text-sm text-ink/70">
            Code DISC : <span className="font-mono font-bold text-navy">{code}</span>
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl bg-gradient-to-br from-surface to-white p-4">
        <DiscRadarChart scores={scores} />
      </div>

      <div className="space-y-3">
        {(Object.keys(PROFILES) as Profile[]).map((k, i) => {
          const pct = Math.round((scores[k] / total) * 100)
          const isTop = top.includes(k)
          return (
            <div key={k}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium text-navy">
                  {PROFILES[k].emoji} {k} - {PROFILES[k].name}
                </span>
                <span className="tabular-nums text-ink/60">
                  {scores[k]} / {total} ({pct}%)
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-line" role="img" aria-label={PROFILES[k].name + ' : ' + pct + '%'}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: PROFILES[k].color }}
                  initial={{ width: 0 }}
                  animate={{ width: ((scores[k] / 25) * 100) + '%' }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                />
                {isTop && scores[k] > 0 && <span className="sr-only">Profil dominant</span>}
              </div>
            </div>
          )
        })}
      </div>

      {topProfile && (
        <div className="mt-6 space-y-3">
          <div className="rounded-2xl border-2 border-accent/30 bg-gradient-to-br from-accent/10 to-white p-5">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={18} className="text-accent" />
              <h3 className="font-bold text-navy">À propos de votre profil</h3>
            </div>
            <p className="text-sm font-semibold text-navy">{PROFILES[topProfile].summary}</p>
            <p className="mt-1 text-sm text-ink/80">{PROFILES[topProfile].traits}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Award size={16} className="text-emerald-600" />
                <h4 className="text-sm font-bold text-emerald-900">Vos forces</h4>
              </div>
              <ul className="space-y-1 text-sm text-emerald-900">
                {PROFILES[topProfile].strengths.map((s) => (
                  <li key={s} className="flex items-start gap-1.5">
                    <span className="text-emerald-500">+</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-amber-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-600" />
                <h4 className="text-sm font-bold text-amber-900">À surveiller</h4>
              </div>
              <ul className="space-y-1 text-sm text-amber-900">
                {PROFILES[topProfile].watchOuts.map((s) => (
                  <li key={s} className="flex items-start gap-1.5">
                    <span className="text-amber-500">!</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl bg-brand/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <MessageCircle size={16} className="text-brand" />
              <h4 className="text-sm font-bold text-navy">Comment vous communiquez</h4>
            </div>
            <p className="text-sm text-ink/80">{PROFILES[topProfile].communicates}</p>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-navy shadow-sm transition-colors hover:border-brand hover:text-brand"
          onClick={() => {
            const text = 'Mon profil DISC : ' + code + ' - ' + top.map((t) => PROFILES[t].name).join(' + ')
            if (navigator.share) {
              navigator.share({ title: 'Mon profil DISC', text })
            } else if (navigator.clipboard) {
              navigator.clipboard.writeText(text)
            }
          }}
        >
          <TrendingUp size={16} /> Partager mon profil
        </button>
      </div>
    </section>
  )
}
