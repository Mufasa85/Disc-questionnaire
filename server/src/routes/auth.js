import { Router } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../prisma.js'
import { signToken, authRequired } from '../auth.js'

const router = Router()

/** POST /api/auth/login */
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' })
    }
    const admin = await prisma.admin.findUnique({ where: { email: String(email).toLowerCase().trim() } })
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      return res.status(401).json({ error: 'Identifiants invalides' })
    }
    // Met a jour lastLoginAt
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    })
    const token = signToken(admin)
    res.json({
      token,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    })
  } catch (err) {
    console.error('[auth/login]', err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

/** GET /api/auth/me */
router.get('/auth/me', authRequired, (req, res) => {
  res.json({ admin: req.admin })
})

export default router
