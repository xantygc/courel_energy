import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  console.log("[PRISMA] Creating new PrismaClient singleton");
  const connectionString = `${process.env.DATABASE_URL}`
  const pool = new Pool({ 
    connectionString,
    connectionTimeoutMillis: 10000, // 10s
    idleTimeoutMillis: 30000,
    max: 20
  })
  pool.on('error', (err) => console.error('[PRISMA] Unexpected error on idle client', err));
  // @ts-ignore
  const adapter = new PrismaPg(pool as any)
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
