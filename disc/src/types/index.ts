export type Profile = 'D' | 'I' | 'S' | 'C'
export type Step = 'splash' | 'home' | 'intro' | 'info' | 'quiz' | 'summary' | 'submitting' | 'success'
export interface Option { id: string; label: string; profile: Profile }
export interface Question { id: number; options: Option[] }
export interface PersonalInfo {
  nom: string; postNom: string; prenom: string; sexe: 'Homme' | 'Femme'
  dateNaissance: string; telephone?: string; email?: string
}
export type Answers = Record<number, string>
export interface Submission {
  info: PersonalInfo
  answers: Answers
  scores: Record<Profile, number>
  date: string
  /** ID serveur (si persiste) */
  id?: number
  /** Code DISC calcule (ex: "DI") */
  code?: string
  /** Profil dominant (D, I, S ou C) */
  dominantProfile?: Profile
}
