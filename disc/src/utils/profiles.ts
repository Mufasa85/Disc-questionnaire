import type { Profile } from '../types'

export interface ProfileDetails {
  name: string
  letter: string
  color: string        // couleur de barre (HEX)
  colorClass: string   // classes Tailwind pour le fond
  emoji: string
  summary: string
  traits: string
  strengths: string[]
  watchOuts: string[]
  communicates: string
}

export const PROFILES: Record<Profile, ProfileDetails> = {
  D: {
    name: 'Dominance',
    letter: 'D',
    color: '#EF4444',
    colorClass: 'bg-red-500',
    emoji: '',
    summary: 'Orienté résultats, direct et déterminé.',
    traits: 'Prend les décisions rapidement, aime relever des défis et avance avec assurance.',
    strengths: ['Décisif', 'Orienté résultats', 'Leader naturel', 'Accepté le challenge'],
    watchOuts: ['Peut être impatient', "Écoute parfois peu", 'Tendance à imposer'],
    communicates: 'Directement, sans détour. Préfère les conclusions aux détails.',
  },
  I: {
    name: 'Influence',
    letter: 'I',
    color: '#F59E0B',
    colorClass: 'bg-amber-500',
    emoji: '',
    summary: 'Communicatif, enthousiaste et sociable.',
    traits: 'Crée facilement le contact, motive son entourage et apporte de l’énergie au groupe.',
    strengths: ['Enthousiaste', 'Persuasif', 'Créatif', 'Bon relationnel'],
    watchOuts: ['Manque parfois de suivi', "Difficulté avec la routine", 'Aime parler'],
    communicates: 'Avec énergie et stories. Préfère l’oral à l’écrit, aime échanger.',
  },
  S: {
    name: 'Stabilité',
    letter: 'S',
    color: '#10B981',
    colorClass: 'bg-emerald-500',
    emoji: '',
    summary: 'Calme, loyal et à l’écoute.',
    traits: 'Apporte de la constance, soutient l’équipe et privilégie l’harmonie.',
    strengths: ['Patient', 'Fiable', 'Bon médiateur', 'Loyal'],
    watchOuts: ['Résistance au changement', 'Évite les conflits', 'A du mal à dire non'],
    communicates: 'Calmement, en privilégiant l’écoute. Apprécie la stabilité et les routines.',
  },
  C: {
    name: 'Conformité',
    letter: 'C',
    color: '#3B82F6',
    colorClass: 'bg-blue-500',
    emoji: '',
    summary: 'Précis, analytique et rigoureux.',
    traits: 'Soigne les détails, respecte les règles et s’appuie sur les faits.',
    strengths: ['Rigoureux', 'Analytique', 'Organisé', 'Fiable'],
    watchOuts: ['Perfectionnisme', 'Trop prudent', 'Hésite à décider'],
    communicates: 'Avec précision et données. Préfère les faits aux opinions.',
  },
}

export const dominant = (scores: Record<Profile, number>): Profile[] => {
  const max = Math.max(...Object.values(scores))
  return (Object.keys(scores) as Profile[]).filter((k) => scores[k] === max)
}

/**
 * Calcule les scores progressifs en fonction des réponses fournies
 * (utilisé pour l'affichage en temps réel pendant le quiz).
 */
export const computeLiveScores = (
  questions: { id: number; options: { id: string; profile: Profile }[] }[],
  answers: Record<number, string>
): Record<Profile, number> => {
  const scores: Record<Profile, number> = { D: 0, I: 0, S: 0, C: 0 }
  questions.forEach((q) => {
    const opt = q.options.find((o) => o.id === answers[q.id])
    if (opt) scores[opt.profile]++
  })
  return scores
}
