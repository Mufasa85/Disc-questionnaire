import { Router } from 'express'
import prisma from '../prisma.js'
import { authRequired } from '../auth.js'

const router = Router()

/** Champs retournes par defaut dans la liste */
const LIST_SELECT = {
  id: true,
  createdAt: true,
  nom: true,
  postNom: true,
  prenom: true,
  sexe: true,
  telephone: true,
  email: true,
  dominantProfile: true,
  code: true,
  durationSeconds: true,
}

/**
 * GET /api/submissions
 * Liste paginee avec recherche/filtres. Auth requise.
 */
router.get('/submissions', authRequired, async (req, res) => {
  try {
    const { q, profile, from, to, limit = '50', offset = '0' } = req.query

    const where = {}
    if (q && String(q).trim()) {
      const term = String(q).trim()
      where.OR = [
        { nom: { contains: term, mode: 'insensitive' } },
        { postNom: { contains: term, mode: 'insensitive' } },
        { prenom: { contains: term, mode: 'insensitive' } },
        { email: { contains: term, mode: 'insensitive' } },
        { telephone: { contains: term, mode: 'insensitive' } },
      ]
    }
    if (profile && ['D', 'I', 'S', 'C'].includes(String(profile))) {
      where.dominantProfile = String(profile)
    }
    if (from || to) {
      where.createdAt = {}
      if (from) where.createdAt.gte = new Date(String(from))
      if (to) where.createdAt.lte = new Date(String(to))
    }

    const take = Math.min(parseInt(String(limit)) || 50, 200)
    const skip = Math.max(parseInt(String(offset)) || 0, 0)

    const [data, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        select: LIST_SELECT,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      prisma.submission.count({ where }),
    ])

    res.json({ data, total, limit: take, offset: skip })
  } catch (err) {
    console.error('[submissions/list]', err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

/**
 * GET /api/submissions/:id
 * Detail complet d'une soumission. Auth requise.
 */
router.get('/submissions/:id', authRequired, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'ID invalide' })
    const row = await prisma.submission.findUnique({ where: { id } })
    if (!row) return res.status(404).json({ error: 'Introuvable' })
    res.json(row)
  } catch (err) {
    console.error('[submissions/get]', err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

/**
 * DELETE /api/submissions/:id
 * Supprime une soumission. Auth requise.
 */
router.delete('/submissions/:id', authRequired, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'ID invalide' })
    await prisma.submission.delete({ where: { id } })
    res.json({ ok: true })
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Introuvable' })
    console.error('[submissions/delete]', err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

/**
 * GET /api/stats
 * Statistiques globales. Auth requise.
 */
router.get('/stats', authRequired, async (_req, res) => {
  try {
    const [total, byProfile, byCode, allDurations, last7] = await Promise.all([
      prisma.submission.count(),
      prisma.submission.groupBy({
        by: ['dominantProfile'],
        _count: { _all: true },
        orderBy: { _count: { dominantProfile: 'desc' } },
      }),
      prisma.submission.groupBy({
        by: ['code'],
        _count: { _all: true },
        orderBy: { _count: { code: 'desc' } },
        take: 10,
      }),
      prisma.submission.findMany({
        where: { durationSeconds: { not: null } },
        select: { durationSeconds: true },
      }),
      prisma.submission.findMany({
        where: {
          createdAt: { gte: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
        },
        select: { createdAt: true },
      }),
    ])

    // Calcule la duree moyenne
    const durations = allDurations.map((d) => d.durationSeconds).filter((d) => d != null)
    const avgDuration = durations.length
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : null

    // Groupe par jour (7 derniers jours)
    const byDay = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const key = d.toISOString().slice(0, 10)
      byDay[key] = 0
    }
    last7.forEach((s) => {
      const key = s.createdAt.toISOString().slice(0, 10)
      if (byDay[key] !== undefined) byDay[key]++
    })

    res.json({
      total,
      byProfile: byProfile.map((p) => ({ profile: p.dominantProfile, n: p._count._all })),
      topCodes: byCode.map((c) => ({ code: c.code, n: c._count._all })),
      avgDurationSeconds: avgDuration,
      last7days: Object.entries(byDay).map(([day, n]) => ({ day, n })),
    })
  } catch (err) {
    console.error('[stats]', err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
