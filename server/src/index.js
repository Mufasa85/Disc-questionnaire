import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import prisma from './prisma.js'

const app = express()
const PORT = process.env.PORT || 4000

// === CORS ===
const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((o) => o.trim())

app.use(cors({
  origin: (origin, cb) => {
    // Pas d'origine (curl, server-to-server) ou origine autorisée
    if (!origin || origins.includes(origin)) return cb(null, true)
    cb(new Error('CORS refusé pour ' + origin))
  },
}))

app.use(express.json({ limit: '1mb' }))

// === Health check ===
app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ ok: true, db: 'up', ts: new Date().toISOString() })
  } catch (err) {
    res.status(503).json({ ok: false, db: 'down', error: err.message })
  }
})

// === POST /api/submissions ===
// Enregistre un questionnaire DISC complet.
// Body attendu :
// {
//   info: { nom, postNom, prenom, sexe, dateNaissance, telephone, email },
//   answers: { "1": "a", "2": "b", ... },       // 25 reponses
//   scores: { D: 5, I: 10, S: 7, C: 3 },        // scores calcules
//   durationSeconds?: number
// }
app.post('/api/submissions', async (req, res) => {
  try {
    const body = req.body || {}
    const { info, answers, scores, durationSeconds } = body

    // === Validation minimale ===
    if (!info || typeof info !== 'object') {
      return res.status(400).json({ error: 'Champ "info" manquant' })
    }
    if (!info.nom || typeof info.nom !== 'string' || info.nom.trim().length < 2) {
      return res.status(400).json({ error: 'Le nom est requis (min. 2 caractères)' })
    }
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Champ "answers" manquant' })
    }
    if (!scores || typeof scores !== 'object') {
      return res.status(400).json({ error: 'Champ "scores" manquant' })
    }

    // === Calcul du profil dominant et du code ===
    // Tri décroissant par score, le 1er = dominant, 2e = secondaire
    const ranked = Object.entries(scores)
      .filter(([, v]) => typeof v === 'number')
      .sort((a, b) => b[1] - a[1])

    if (ranked.length < 2) {
      return res.status(400).json({ error: 'Scores invalides' })
    }

    const dominantProfile = String(ranked[0][0]).toUpperCase()
    const code = (String(ranked[0][0]) + String(ranked[1][0])).toUpperCase()

    // === Parse de la date de naissance (optionnelle) ===
    let dateNaissance = null
    if (info.dateNaissance) {
      const d = new Date(info.dateNaissance)
      if (!Number.isNaN(d.getTime()) && d < new Date()) {
        dateNaissance = d
      }
    }

    // === Insertion en base ===
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

    console.log(`[submission] #${submission.id} - ${info.nom} - profil ${dominantProfile} (${code})`)

    return res.status(201).json(submission)
  } catch (err) {
    console.error('[submission] Erreur :', err)
    return res.status(500).json({ error: 'Erreur serveur', details: err.message })
  }
})

// === 404 ===
app.use((req, res) => res.status(404).json({ error: 'Route introuvable' }))

// === Erreur globale ===
app.use((err, _req, res, _next) => {
  console.error('[error]', err)
  res.status(500).json({ error: err.message || 'Erreur serveur' })
})

// === Démarrage ===
app.listen(PORT, () => {
  console.log(`[server] API démarrée sur http://localhost:${PORT}`)
  console.log(`[server] CORS origines : ${origins.join(', ')}`)
  console.log(`[server] Base : ${process.env.DATABASE_URL?.split('@')[1] || 'non configurée'}`)
})
