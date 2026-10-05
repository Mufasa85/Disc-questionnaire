import bcrypt from 'bcryptjs'
import prisma from './prisma.js'

/**
 * Cree le compte admin par defaut si aucun admin n'existe.
 * Configure via ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME dans .env
 */
export async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@disc.local'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const name = process.env.ADMIN_NAME || 'Administrateur'

  const existing = await prisma.admin.findUnique({ where: { email } })
  if (existing) {
    console.log(`[seed] Admin "${email}" existe deja`)
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.admin.create({
    data: { email, name, passwordHash },
  })
  console.log(`[seed] Admin cree : ${email} / ${password}`)
  console.log(`[seed] *** Changez le mot de passe en production ! ***`)
}
