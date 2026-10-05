import type { ReactNode } from 'react'
export function Shell({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh">
    <header className="border-b border-line bg-white/80 backdrop-blur"><div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3"><span className="font-semibold text-navy">Questionnaire DISC</span></div></header>
    <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-8 sm:py-12">{children}</main>
  </div>
}
