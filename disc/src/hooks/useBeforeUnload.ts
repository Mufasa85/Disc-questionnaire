import { useEffect } from 'react'
export function useBeforeUnload(active: boolean) {
  useEffect(() => {
    if (!active) return
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', h)
    return () => window.removeEventListener('beforeunload', h)
  }, [active])
}
