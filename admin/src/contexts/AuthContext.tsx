import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, tokenStore, type Admin } from '../lib/api'

interface AuthState {
  admin: Admin | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = tokenStore.get()
    if (!token) { setLoading(false); return }
    api.me()
      .then((res) => setAdmin(res.admin as unknown as Admin))
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password)
    tokenStore.set(res.token)
    setAdmin(res.admin)
  }

  const logout = () => {
    tokenStore.clear()
    setAdmin(null)
    location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const c = useContext(AuthContext)
  if (!c) throw new Error('AuthProvider manquant')
  return c
}
