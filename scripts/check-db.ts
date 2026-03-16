import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  console.log('--- USERS ---')
  console.table(users.map(u => ({ id: u.id, email: u.email, role: u.role })))

  const rates = await prisma.rate.findMany()
  console.log('\n--- RATES ---')
  console.table(rates.map(r => ({ id: r.id, nombre: r.nombre, userId: r.userId, isPublic: r.isPublic })))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
