import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import prisma from './prisma.js'
import { seedAdmin } from './seed.js'
import publicRoutes from './routes/public.js'
import authRoutes from './routes/auth.js'
import submissionRoutes from './routes/submissions.js'

const app = express()
const PORT = process.env.PORT || 4000

// === CORS ===
const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((o) => o.trim())

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || origins.includes(origin)) return cb(null, true)
    cb(new Error('CORS refuse pour ' + origin))
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

// === Routes ===
app.use('/api', publicRoutes)       // POST /api/submissions (public)
app.use('/api', authRoutes)         // /api/auth/login, /api/auth/me
app.use('/api', submissionRoutes)   // GET/DELETE /api/submissions, /api/stats

// === 404 ===
app.use((req, res) => res.status(404).json({ error: 'Route introuvable' }))

// === Erreur globale ===
app.use((err, _req, res, _next) => {
  console.error('[error]', err.message)
  res.status(500).json({ error: err.message || 'Erreur serveur' })
})

// === Demarrage ===
async function start() {
  try {
    // Connexion BDD
    await prisma.$connect()
    console.log('[db] Connecte a PostgreSQL')

    // Seed admin
    await seedAdmin()

    app.listen(PORT, () => {
      console.log(`[server] API demarree sur http://localhost:${PORT}`)
      console.log(`[server] CORS origines : ${origins.join(', ')}`)
    })
  } catch (err) {
    console.error('[fatal] Demarrage impossible :', err)
    process.exit(1)
  }
}

start()
