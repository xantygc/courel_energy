import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  const connectionString = `${process.env.DATABASE_URL}`
  const pool = new Pool({ connectionString })
  // @ts-ignore
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const prisma = prismaClientSingleton()

async function main() {
  const email = 'santiago.gonzalez.courel@gmail.com'
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (user) {
    console.log('User found:', {
      id: user.id,
      email: user.email,
      hasPasswordHash: !!user.passwordHash,
      role: user.role,
    })
  } else {
    console.log('User NOT found')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
