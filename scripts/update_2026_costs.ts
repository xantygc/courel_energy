import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
// @ts-ignore
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const year = 2026
  const financingRate = 0.019121

  await prisma.annualRegulatedCost.upsert({
    where: { year },
    update: { financiacionBonoSocialDia: financingRate },
    create: {
      year,
      financiacionBonoSocialDia: financingRate,
      peajeP1: 9.2539,
      peajeP2: 2.8201,
      peajeP3: 0.2994,
      potBoeP1: 26.93055,
      potBoeP2: 0.697588,
      impuestoElectrico: 5.1127,
      iva: 21.00,
      alquilerContadorDia: 0.02663,
    },
  })

  console.log(`Updated 2026 costs with daily financing rate: ${financingRate}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
