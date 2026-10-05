import { useEffect, useState } from 'react'

/**
 * Hook qui chronometre le temps passe sur le quiz.
 * - Demarre au premier appel
 * - Se met en pause si l'onglet est inactif (visibilitychange)
 * - Retourne le temps ecoule en secondes + un format lisible
 */
export function useQuizTimer(active = true) {
  const [elapsed, setElapsed] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!active) return

    const start = Date.now() - elapsed * 1000
    const id = setInterval(() => {
      if (!paused) setElapsed(Math.floor((Date.now() - start) / 1000))
    }, 1000)

    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibility)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, paused])

  const format = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return { elapsed, formatted: format(elapsed) }
}
