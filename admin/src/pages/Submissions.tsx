import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Trash2, Eye, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { api, PROFILE_META, type Submission } from '../lib/api'

const PAGE_SIZE = 20

function formatDate(s: string) {
  const d = new Date(s)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatTime(s: string) {
  const d = new Date(s)
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function formatDuration(s: number | null) {
  if (!s) return '—'
  const m = Math.floor(s / 60)
  const sec = s % 60
  return m > 0 ? m + 'm ' + sec + 's' : sec + 's'
}

export function Submissions() {
  const [data, setData] = useState<Submission[]>([])
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [profile, setProfile] = useState<string>('')
  const [searchInput, setSearchInput] = useState('')

  const load = async (params: { q?: string; profile?: string; offset?: number } = {}) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.listSubmissions({
        q: params.q !== undefined ? params.q : q,
        profile: (params.profile !== undefined ? params.profile : profile) as any,
        limit: PAGE_SIZE,
        offset: params.offset !== undefined ? params.offset : offset,
      })
      setData(res.data)
      setTotal(res.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setOffset(0)
    load({ q: searchInput, profile, offset: 0 })
    setQ(searchInput)
  }

  const onFilterProfile = (p: string) => {
    const newProfile = p === profile ? '' : p
    setProfile(newProfile)
    setOffset(0)
    load({ q, profile: newProfile, offset: 0 })
  }

  const onPage = (newOffset: number) => {
    setOffset(newOffset)
    load({ offset: newOffset })
  }

  const onDelete = async (id: number, name: string) => {
    if (!confirm('Supprimer definitivement la soumission de ' + name + ' ?')) return
    try {
      await api.deleteSubmission(id)
      load({ offset })
    } catch (err) {
      alert('Erreur : ' + (err instanceof Error ? err.message : ''))
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy">Soumissions</h1>
        <p className="mt-1 text-sm text-ink/600">
          {total} soumission{total > 1 ? 's' : ''} au total
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={onSearch} className="flex flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Rechercher par nom, email, telephone..."
              className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
            />
          </div>
        </form>
        <div className="flex gap-2">
          {(['D', 'I', 'S', 'C'] as const).map((p) => (
            <button
              key={p}
              onClick={() => onFilterProfile(p)}
              className={
                'rounded-xl border px-3 py-2 text-sm font-semibold transition ' +
                (profile === p
                  ? 'border-brand bg-brand text-white'
                  : 'border-line bg-white text-ink/70 hover:border-brand')
              }
            >
              {PROFILE_META[p].emoji} {p}
            </button>
          ))}
          {profile && (
            <button
              onClick={() => onFilterProfile(profile)}
              className="rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink/60 hover:border-danger hover:text-danger"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-danger/30 bg-danger/10 p-6 text-danger">{error}</div>
      ) : loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 size={32} className="animate-spin text-brand" />
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-16 text-center">
          <p className="text-ink/60">Aucune soumission trouvee</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-line bg-surface text-left text-xs font-semibold uppercase tracking-wider text-ink/60">
              <tr>
                <th className="px-4 py-3">Personne</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Profil</th>
                <th className="px-4 py-3">Duree</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.map((s) => {
                const meta = PROFILE_META[s.dominantProfile]
                const fullName = [s.nom, s.postNom, s.prenom].filter(Boolean).join(' ')
                return (
                  <tr key={s.id} className="hover:bg-surface/50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-navy">{fullName}</p>
                      {s.sexe && <p className="text-xs text-ink/50">{s.sexe}</p>}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {s.email && <p className="text-ink/80">{s.email}</p>}
                      {s.telephone && <p className="text-ink/50">{s.telephone}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold text-white"
                        style={{ backgroundColor: meta.color }}
                      >
                        {meta.emoji} {s.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink/70 tabular-nums">
                      {formatDuration(s.durationSeconds)}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink/70">
                      <p>{formatDate(s.createdAt)}</p>
                      <p className="text-xs text-ink/40">{formatTime(s.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          to={'/submissions/' + s.id}
                          className="rounded-lg p-2 text-brand hover:bg-brand/10"
                          title="Voir le detail"
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          onClick={() => onDelete(s.id, fullName)}
                          className="rounded-lg p-2 text-ink/40 hover:bg-danger/10 hover:text-danger"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-ink/60">
            Page {currentPage} sur {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPage(Math.max(0, offset - PAGE_SIZE))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 rounded-xl border border-line bg-white px-3 py-2 text-sm disabled:opacity-40"
            >
              <ChevronLeft size={16} /> Precedent
            </button>
            <button
              onClick={() => onPage(offset + PAGE_SIZE)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 rounded-xl border border-line bg-white px-3 py-2 text-sm disabled:opacity-40"
            >
              Suivant <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
