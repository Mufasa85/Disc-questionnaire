/**
 * Client API pour le dashboard admin.
 * Gere automatiquement le token JWT (localStorage) et la deconnexion sur 401.
 */

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000'
const TOKEN_KEY = 'disc-admin-token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStore.get()
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (res.status === 401) {
    tokenStore.clear()
    // Redirige vers /login si on est pas deja dessus
    if (!location.pathname.startsWith('/login')) {
      location.href = '/login'
    }
    throw new ApiError('Non authentifie', 401)
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur inconnue' }))
    throw new ApiError(err.error || `HTTP ${res.status}`, res.status)
  }
  return res.json() as Promise<T>
}

// === Auth ===
export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; admin: Admin }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<{ admin: JwtPayload }>('/api/auth/me'),

  // === Submissions ===
  listSubmissions: (params: ListParams = {}) => {
    const qs = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') qs.set(k, String(v))
    })
    const q = qs.toString()
    return request<{ data: Submission[]; total: number; limit: number; offset: number }>(
      `/api/submissions${q ? '?' + q : ''}`
    )
  },

  getSubmission: (id: number) => request<Submission>(`/api/submissions/${id}`),

  deleteSubmission: (id: number) =>
    request<{ ok: true }>(`/api/submissions/${id}`, { method: 'DELETE' }),

  stats: () => request<Stats>('/api/stats'),
}

// === Types ===
export interface Admin { id: number; email: string; name: string }
export interface JwtPayload { sub: number; email: string; name: string }

export interface Submission {
  id: number
  createdAt: string
  nom: string
  postNom: string | null
  prenom: string | null
  sexe: string | null
  dateNaissance: string | null
  telephone: string | null
  email: string | null
  dominantProfile: 'D' | 'I' | 'S' | 'C'
  code: string
  answers: Record<string, string>
  scores: Record<'D' | 'I' | 'S' | 'C', number>
  durationSeconds: number | null
  ip: string | null
  userAgent: string | null
}

export interface Stats {
  total: number
  byProfile: { profile: string; n: number }[]
  topCodes: { code: string; n: number }[]
  avgDurationSeconds: number | null
  last7days: { day: string; n: number }[]
}

export interface ListParams {
  q?: string
  profile?: 'D' | 'I' | 'S' | 'C' | ''
  from?: string
  to?: string
  limit?: number
  offset?: number
}

export const PROFILE_META: Record<string, { name: string; color: string; emoji: string }> = {
  D: { name: 'Dominance', color: '#EF4444', emoji: '🎯' },
  I: { name: 'Influence', color: '#F59E0B', emoji: '✨' },
  S: { name: 'Stabilite', color: '#10B981', emoji: '🤝' },
  C: { name: 'Conformite', color: '#3B82F6', emoji: '🔍' },
}
