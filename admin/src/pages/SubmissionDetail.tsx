import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Calendar, User, Trash2, Loader2 } from '../components/Icons'
import { api, PROFILE_META, type Submission } from '../lib/api'

function ProfileRadar({ scores }: { scores: Record<string, number> }) {
  const size = 260
  const cx = size / 2
  const cy = size / 2
  const radius = size / 2 - 50
  const max = 25
  const keys: Array<'D' | 'I' | 'S' | 'C'> = ['D', 'I', 'S', 'C']
  const points = keys.map((k, i) => {
    const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2
    const value = Math.min((scores[k] || 0) / max, 1)
    const r = radius * value
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    return { x, y, angle, key: k, value: scores[k] || 0 }
  })
  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-xs">
      {[0.25, 0.5, 0.75, 1].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={radius * r} fill="none" stroke="#E5E7EB" strokeWidth="1" strokeDasharray={r === 1 ? undefined : '2 4'} />
      ))}
      {keys.map((k, i) => {
        const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2
        return <line key={k} x1={cx} y1={cy} x2={cx + radius * Math.cos(angle)} y2={cy + radius * Math.sin(angle)} stroke="#E5E7EB" strokeWidth="1" />
      })}
      <polygon fill="rgba(0, 87, 184, 0.15)" stroke="#0057B8" strokeWidth="2.5" strokeLinejoin="round" points={polygonPoints} />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill={PROFILE_META[p.key].color} stroke="white" strokeWidth="2" />
      ))}
      {points.map((p) => {
        const lx = cx + (radius + 25) * Math.cos(p.angle)
        const ly = cy + (radius + 25) * Math.sin(p.angle)
        return (
          <g key={p.key}>
            <text x={lx} y={ly - 4} textAnchor="middle" style={{ fontSize: 22 }}>{PROFILE_META[p.key].emoji}</text>
            <text x={lx} y={ly + 14} textAnchor="middle" style={{ fontSize: 11, fontWeight: 600, fill: '#0F2D5C' }}>
              {p.key} - {p.value}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function formatDate(s: string): string {
  return new Date(s).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })
}

function formatDuration(s: number | null): string {
  if (!s) return '—'
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}m ${sec}s`
}

export function SubmissionDetail() {
  const { id } = useParams()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.getSubmission(parseInt(id))
      .then(setSubmission)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const onDelete = async () => {
    if (!submission) return
    const name = [submission.nom, submission.postNom, submission.prenom].filter(Boolean).join(' ')
    if (!confirm('Supprimer definitivement la soumission de ' + name + ' ?')) return
    try {
      await api.deleteSubmission(submission.id)
      location.href = '/submissions'
    } catch (err) {
      alert('Erreur : ' + (err instanceof Error ? err.message : ''))
    }
  }

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 size={32} className="animate-spin text-brand" /></div>
  }
  if (error || !submission) {
    return (
      <div className="rounded-2xl border border-danger/30 bg-danger/10 p-6 text-danger">
        {error || 'Soumission introuvable'}
        <Link to="/submissions" className="mt-2 block text-sm underline">Retour a la liste</Link>
      </div>
    )
  }

  const meta = PROFILE_META[submission.dominantProfile]
  const fullName = [submission.nom, submission.postNom, submission.prenom].filter(Boolean).join(' ')
  const total = Object.values(submission.scores).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/submissions" className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-brand">
            <ArrowLeft size={16} /> Retour a la liste
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-navy">{fullName}</h1>
          <p className="mt-1 text-sm text-ink/60">Soumission #{submission.id} - {formatDate(submission.createdAt)}</p>
        </div>
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-medium text-danger hover:border-danger"
        >
          <Trash2 size={16} /> Supprimer
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm lg:col-span-1">
          <h2 className="mb-4 text-lg font-bold text-navy">Informations</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="flex items-center gap-2 text-ink/60"><User size={14} /> Sexe</dt>
              <dd className="font-medium text-navy">{submission.sexe || '—'}</dd>
            </div>
            {submission.dateNaissance && (
              <div>
                <dt className="flex items-center gap-2 text-ink/60"><Calendar size={14} /> Date de naissance</dt>
                <dd className="font-medium text-navy">
                  {new Date(submission.dateNaissance).toLocaleDateString('fr-FR')}
                </dd>
              </div>
            )}
            {submission.email && (
              <div>
                <dt className="flex items-center gap-2 text-ink/60"><Mail size={14} /> Email</dt>
                <dd className="break-all font-medium text-navy">{submission.email}</dd>
              </div>
            )}
            {submission.telephone && (
              <div>
                <dt className="flex items-center gap-2 text-ink/60"><Phone size={14} /> Telephone</dt>
                <dd className="font-medium text-navy">{submission.telephone}</dd>
              </div>
            )}
            <div>
              <dt className="text-ink/60">Duree du questionnaire</dt>
              <dd className="font-medium text-navy">{formatDuration(submission.durationSeconds)}</dd>
            </div>
            {submission.ip && (
              <div>
                <dt className="text-ink/60">IP</dt>
                <dd className="font-mono text-xs text-ink/80">{submission.ip}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <span
              className="grid size-12 place-items-center rounded-2xl text-lg font-bold text-white shadow-md"
              style={{ backgroundColor: meta.color }}
            >
              {submission.code}
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-ink/60">Profil dominant</p>
              <h2 className="text-xl font-bold text-navy">{meta.emoji} {meta.name}</h2>
            </div>
          </div>
          <ProfileRadar scores={submission.scores} />
          <div className="mt-6 grid grid-cols-4 gap-3">
            {(Object.keys(submission.scores) as Array<'D' | 'I' | 'S' | 'C'>).map((k) => {
              const v = submission.scores[k] || 0
              const pct = total > 0 ? Math.round((v / total) * 100) : 0
              return (
                <div key={k} className="rounded-xl border border-line p-3 text-center">
                  <p className="text-xs text-ink/60">{PROFILE_META[k].emoji} {k}</p>
                  <p className="mt-1 text-2xl font-bold text-navy">{v}</p>
                  <p className="text-xs text-ink/50">{pct}%</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-navy">Reponses aux questions</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(submission.answers)
            .sort((a, b) => Number(a[0]) - Number(b[0]))
            .map(([qid, opt]) => (
              <div key={qid} className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm">
                <span className="font-mono text-xs text-ink/50">Q{qid}</span>
                <span className="font-bold text-brand">{String(opt).toUpperCase()}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
