import { useEffect, useState } from 'react'
import { Users, Clock, Trophy, TrendingUp } from '../components/Icons'
import { api, PROFILE_META, type Stats } from '../lib/api'

function formatDuration(s: number | null): string {
  if (!s) return '—'
  const m = Math.floor(s / 60)
  const sec = s % 60
  return m > 0 ? `${m} min ${sec}s` : `${sec}s`
}

interface BarItem { label: string; value: number; color: string }
function BarChart({ data, max }: { data: BarItem[]; max: number }) {
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-navy">{d.label}</span>
            <span className="tabular-nums text-ink/60">{d.value}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(d.value / max) * 100}%`, backgroundColor: d.color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function LineChart({ data }: { data: { day: string; n: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.n))
  const width = 100
  const height = 40
  const stepX = width / Math.max(1, data.length - 1)
  const points = data
    .map((d, i) => `${i * stepX},${height - (d.n / max) * height}`)
    .join(' ')
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-32 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0057B8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0057B8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="url(#grad)"
        stroke="#0057B8"
        strokeWidth="1.5"
        points={`0,${height} ${points} ${width},${height}`}
      />
    </svg>
  )
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.stats()
      .then(setStats)
      .catch((err: Error) => setError(err.message))
  }, [])

  if (error) {
    return (
      <div className="rounded-2xl border border-danger/30 bg-danger/10 p-6 text-danger">
        <p className="font-semibold">Impossible de charger les statistiques</p>
        <p className="mt-1 text-sm opacity-80">{error}</p>
        <p className="mt-2 text-xs">Verifiez que le serveur backend est lance sur :4000</p>
      </div>
    )
  }

  if (!stats) {
    return <div className="h-64 animate-pulse rounded-3xl bg-white" />
  }

  const profileData: BarItem[] = (['D', 'I', 'S', 'C'] as const).map((k) => {
    const row = stats.byProfile.find((p) => p.profile === k)
    return {
      label: `${PROFILE_META[k].emoji} ${k} - ${PROFILE_META[k].name}`,
      value: row ? row.n : 0,
      color: PROFILE_META[k].color,
    }
  })
  const maxProfile = Math.max(1, ...profileData.map((p) => p.value))

  const topCodeData: BarItem[] = stats.topCodes.map((c) => ({
    label: c.code,
    value: c.n,
    color: PROFILE_META[c.code[0]]?.color || '#0057B8',
  }))
  const maxCode = Math.max(1, ...topCodeData.map((c) => c.value))

  const last7total = stats.last7days.reduce((a, b) => a + b.n, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy">Tableau de bord</h1>
        <p className="mt-1 text-sm text-ink/60">Vue d'ensemble des soumissions DISC</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-ink/60">Total</p>
            <Users size={18} className="text-brand" />
          </div>
          <p className="mt-2 text-3xl font-bold text-navy">{stats.total}</p>
          <p className="text-xs text-ink/50">soumissions</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-ink/60">Duree moyenne</p>
            <Clock size={18} className="text-brand" />
          </div>
          <p className="mt-2 text-3xl font-bold text-navy">{formatDuration(stats.avgDurationSeconds)}</p>
          <p className="text-xs text-ink/50">par questionnaire</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-ink/60">Profil dominant</p>
            <Trophy size={18} className="text-accent" />
          </div>
          <p className="mt-2 text-3xl font-bold text-navy">{stats.byProfile[0]?.profile || '—'}</p>
          <p className="text-xs text-ink/50">{stats.byProfile[0]?.n || 0} personnes</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-ink/60">7 derniers jours</p>
            <TrendingUp size={18} className="text-emerald-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-navy">{last7total}</p>
          <p className="text-xs text-ink/50">nouvelles soumissions</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-bold text-navy">Repartition par profil</h2>
          <p className="mb-4 text-sm text-ink/60">Profil dominant identifie</p>
          {stats.total === 0 ? (
            <p className="py-8 text-center text-ink/40">Aucune donnee</p>
          ) : (
            <BarChart data={profileData} max={maxProfile} />
          )}
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-bold text-navy">Top codes DISC</h2>
          <p className="mb-4 text-sm text-ink/60">Combinaisons dominant + secondaire</p>
          {stats.topCodes.length === 0 ? (
            <p className="py-8 text-center text-ink/40">Aucune donnee</p>
          ) : (
            <BarChart data={topCodeData} max={maxCode} />
          )}
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-1 text-lg font-bold text-navy">Activite des 7 derniers jours</h2>
          <p className="mb-4 text-sm text-ink/60">Nombre de soumissions par jour</p>
          <LineChart data={stats.last7days} />
          <div className="mt-2 flex justify-between text-xs text-ink/50">
            {stats.last7days.map((d) => (
              <span key={d.day}>{d.day.slice(5)}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
