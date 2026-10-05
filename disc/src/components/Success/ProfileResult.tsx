import { motion } from 'framer-motion'
import { Award, AlertTriangle, MessageCircle, Sparkles, TrendingUp } from 'lucide-react'
import type { Profile } from '../../types'
import { PROFILES, dominant } from '../../utils/profiles'

/**
 * Radar chart SVG dessiné a la main (pas de dependance externe).
 * 4 axes : D, I, S, C.
 */
function RadarChart({ scores }: { scores: Record<Profile, number> }) {
  const size = 280
  const cx = size / 2
  const cy = size / 2
  const radius = size / 2 - 50
  const max = 25

  const keys: Profile[] = ['D', 'I', 'S', 'C']
  const points = keys.map((k, i) => {
    const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2
    const value = Math.min(scores[k] / max, 1)
    const r = radius * value
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    return { x, y, angle, key: k, value: scores[k] }
  })
  const polygonPoints = points.map((p) => p.x + ',' + p.y).join(' ')

  const rings = [0.25, 0.5, 0.75, 1].map((ratio) => (
    <circle
      key={ratio}
      cx={cx}
      cy={cy}
      r={radius * ratio}
      fill="none"
      stroke="#E5E7EB"
      strokeWidth={1}
      strokeDasharray={ratio === 1 ? undefined : '2 4'}
    />
  ))

  const axes = keys.map((k, i) => {
    const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2
    const x2 = cx + radius * Math.cos(angle)
    const y2 = cy + radius * Math.sin(angle)
    return <line key={k} x1={cx} y1={cy} x2={x2} y2={y2} stroke="#E5E7EB" strokeWidth={1} />
  })

  const labels = points.map((p) => {
    const labelRadius = radius + 30
    const x = cx + labelRadius * Math.cos(p.angle)
    const y = cy + labelRadius * Math.sin(p.angle)
    const profile = PROFILES[p.key]
    return (
      <g key={p.key}>
        <text x={x} y={y - 6} textAnchor="middle" style={{ fontSize: 24 }}>{profile.emoji}</text>
        <text x={x} y={y + 14} textAnchor="middle" className="fill-navy" style={{ fontSize: 11, fontWeight: 600 }}>
          {p.key} - {p.value}
        </text>
      </g>
    )
  })

  return (
    <div className="mx-auto w-full max-w-sm">
      <svg viewBox={'0 0 ' + size + ' ' + size} className="w-full" role="img" aria-label="Graphique radar du profil DISC">
        {rings}
        {axes}
        <motion.polygon
          fill="rgba(0, 87, 184, 0.15)"
          stroke="#0057B8"
          strokeWidth={2.5}
          strokeLinejoin="round"
          points={polygonPoints}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ transformOrigin: cx + 'px ' + cy + 'px' }}
        />
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={5}
            fill={PROFILES[p.key].color}
            stroke="white"
            strokeWidth={2}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
          />
        ))}
        {labels}
      </svg>
    </div>
  )
}

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
        <RadarChart scores={scores} />
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
