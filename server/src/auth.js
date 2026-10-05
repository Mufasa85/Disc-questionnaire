import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
const EXPIRES_IN = '7d'

export function signToken(admin) {
  return jwt.sign(
    { sub: admin.id, email: admin.email, name: admin.name },
    SECRET,
    { expiresIn: EXPIRES_IN }
  )
}

export function authRequired(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Token manquant' })
  try {
    req.admin = jwt.verify(token, SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Token invalide ou expire' })
  }
}
