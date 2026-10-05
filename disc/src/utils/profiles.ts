import type { Profile } from '../types'
export const PROFILES: Record<Profile, { name: string; summary: string; traits: string }> = {
  D: { name: 'Dominance', summary: 'Orienté résultats, direct et déterminé.', traits: 'Prend les décisions rapidement, aime relever des défis et avance avec assurance.' },
  I: { name: 'Influence', summary: 'Communicatif, enthousiaste et sociable.', traits: 'Crée facilement le contact, motive son entourage et apporte de l’énergie au groupe.' },
  S: { name: 'Stabilité', summary: 'Calme, loyal et à l’écoute.', traits: 'Apporte de la constance, soutient l’équipe et privilégie l’harmonie.' },
  C: { name: 'Conformité', summary: 'Précis, analytique et rigoureux.', traits: 'Soigne les détails, respecte les règles et s’appuie sur les faits.' },
}
export const dominant = (scores: Record<Profile, number>): Profile[] => {
  const max = Math.max(...Object.values(scores))
  return (Object.keys(scores) as Profile[]).filter((k) => scores[k] === max)
}
