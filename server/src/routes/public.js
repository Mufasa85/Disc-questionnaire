import { Router } from 'express'
import prisma from '../prisma.js'

const router = Router()

/**
 * POST /api/submissions
 * Enregistre un questionnaire DISC complet. Public (utilise par le frontend du quiz).
 */
router.post('/submissions', async (req, res) => {
  try {
    const body = req.body || {}
    const { info, answers, scores, durationSeconds } = body

    // Validation minimale
    if (!info || typeof info !== 'object') {
      return res.status(400).json({ error: 'Champ "info" manquant' })
    }
    if (!info.nom || typeof info.nom !== 'string' || info.nom.trim().length < 2) {
      return res.status(400).json({ error: 'Le nom est requis (min. 2 caracteres)' })
    }
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Champ "answers" manquant' })
    }
    if (!scores || typeof scores !== 'object') {
      return res.status(400).json({ error: 'Champ "scores" manquant' })
    }

    // Calcul du profil dominant et du code
    const ranked = Object.entries(scores)
      .filter(([, v]) => typeof v === 'number')
      .sort((a, b) => b[1] - a[1])
    if (ranked.length < 2) {
      return res.status(400).json({ error: 'Scores invalides' })
    }
    const dominantProfile = String(ranked[0][0]).toUpperCase()
    const code = (String(ranked[0][0]) + String(ranked[1][0])).toUpperCase()

    // Parse de la date de naissance
    let dateNaissance = null
    if (info.dateNaissance) {
      const d = new Date(info.dateNaissance)
      if (!Number.isNaN(d.getTime()) && d < new Date()) {
        dateNaissance = d
      }
    }

    const submission = await prisma.submission.create({
      data: {
        nom: info.nom.trim(),
        postNom: info.postNom?.trim() || null,
        prenom: info.prenom?.trim() || null,
        sexe: info.sexe || null,
        dateNaissance,
        telephone: info.telephone?.trim() || null,
        email: info.email?.trim().toLowerCase() || null,
        dominantProfile,
        code,
        answers,
        scores,
        durationSeconds: durationSeconds || null,
        ip: req.ip,
        userAgent: req.headers['user-agent'] || null,
      },
      select: {
        id: true,
        code: true,
        dominantProfile: true,
        createdAt: true,
      },
    })

    console.log(`[submission] #${submission.id} - ${info.nom} - ${dominantProfile} (${code})`)
    res.status(201).json(submission)
  } catch (err) {
    console.error('[submission]', err)
    res.status(500).json({ error: 'Erreur serveur', details: err.message })
  }
})

export default router
