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
    console.log("Testing connection to", process.env.DATABASE_URL)
    const result = await prisma.$queryRaw`SELECT current_database(), current_user, version()`;
    console.log("Connection successful! Result:", result);
}

main()
  .catch((e) => {
    console.error("Connection failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
