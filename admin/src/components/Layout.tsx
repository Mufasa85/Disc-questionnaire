import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, ListChecks, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const NAV = [
  { to: '/', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/submissions', label: 'Soumissions', icon: ListChecks },
]

export function Layout() {
  const { admin, logout } = useAuth()
  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[260px_1fr]">
      {/* === Sidebar === */}
      <aside className="border-b border-line bg-white lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 border-b border-line px-6 py-5">
          <div>
            <p className="text-sm font-bold text-navy">Admin DISC</p>
            <p className="text-xs text-ink/60">{admin?.name}</p>
          </div>
        </div>
        <nav className="p-4">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-ink/70 hover:bg-surface hover:text-navy'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 hidden lg:block">
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink/70 hover:border-danger hover:text-danger"
          >
            <LogOut size={16} />
            Deconnexion
          </button>
        </div>
      </aside>

      {/* === Main === */}
      <main className="bg-surface p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  )
}
