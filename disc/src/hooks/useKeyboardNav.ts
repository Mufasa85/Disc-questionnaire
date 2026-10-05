import { useEffect } from 'react'

interface KeyboardNavOptions {
  /** Nombre d'options disponibles (touches 1-N) */
  optionCount: number
  /** Question courante (id) pour préfixer name= */
  questionId: number
  /** Sélectionne l'option à l'index donné */
  onSelect: (optionId: string) => void
  /** Passe à la question suivante (ou soumet) */
  onNext: () => void
  /** Passe à la question précédente */
  onPrev: () => void
  /** A une réponse (pour autoriser Next) */
  hasAnswer: boolean
  /** Est sur la première question (désactive Prev) */
  isFirst: boolean
  /** Est sur la dernière question */
  isLast: boolean
}

/**
 * Raccourcis clavier pour le questionnaire :
 * - 1..4 : sélectionne l'option
 * - Enter / → : question suivante (si réponse)
 * - ← : question précédente
 * - Espace : sélectionne l'option puis passe à la suivante
 * Les raccourcis sont désactivés si l'utilisateur est dans un input.
 */
export function useKeyboardNav(opts: KeyboardNavOptions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const tag = target.tagName
      // On n'intercepte pas si l'utilisateur tape dans un champ
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return
      if (target.isContentEditable) return

      // 1..N : sélection d'option
      if (/^[1-9]$/.test(e.key)) {
        const idx = parseInt(e.key, 10) - 1
        if (idx < opts.optionCount) {
          e.preventDefault()
          opts.onSelect(['a', 'b', 'c', 'd', 'e'][idx] || String(idx + 1))
        }
        return
      }

      // Enter ou → : suivant
      if ((e.key === 'Enter' || e.key === 'ArrowRight') && opts.hasAnswer) {
        e.preventDefault()
        opts.onNext()
        return
      }

      // ← : précédent
      if (e.key === 'ArrowLeft' && !opts.isFirst) {
        e.preventDefault()
        opts.onPrev()
        return
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [opts])
}
