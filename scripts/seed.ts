import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcrypt'

const prismaClientSingleton = () => {
  const connectionString = `${process.env.DATABASE_URL}`
  const pool = new Pool({ connectionString })
  // @ts-ignore
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const prisma = prismaClientSingleton()

async function main() {
  const adminId = '1de70a79-da56-462c-82f5-a2017ca0ed9f'
  const email = 'admin@courelenergy.com'
  const passwordHash = await bcrypt.hash('admin123', 10)

  // Upsert the Admin user
  const adminUser = await prisma.user.upsert({
    where: { id: adminId },
    update: {
      email,
      passwordHash,
      role: 'admin',
    },
    create: {
      id: adminId,
      email,
      passwordHash,
      role: 'admin',
    },
  })

  console.log('Admin user initialized:', adminUser.email)

  const tarifas = [
    { com: 'Octopus Energy', nom: 'Octopus 3', pp1: 35.405, pp2: 9.855, ep1: 19.4, ep2: 11.5, ep3: 7.7, exc: 4.0, em: 0, ekwp: 0 },
    { com: 'Holaluz', nom: 'Tarifa Verde 3P', pp1: 35.5, pp2: 6.2, ep1: 15.9, ep2: 12.5, ep3: 9.2, exc: 7.0, em: 0, ekwp: 0 },
    { com: 'Holaluz', nom: 'Tarifa Clásica', pp1: 29.93, pp2: 29.93, ep1: 14.1, ep2: 14.1, ep3: 14.1, exc: 7.0, em: 0, ekwp: 0 },
    { com: 'Holaluz', nom: 'Tarifa 3', pp1: 29.93, pp2: 29.93, ep1: 20.6, ep2: 13.4, ep3: 10.8, exc: 7.0, em: 0, ekwp: 0 },
    { com: 'Repsol', nom: 'Mis 10h con Descuento', pp1: 29.9, pp2: 29.9, ep1: 16.99, ep2: 16.99, ep3: 8.495, exc: 6.0, em: 0, ekwp: 0 },
    { com: 'Repsol', nom: 'Ahorro Plus', pp1: 29.9, pp2: 29.9, ep1: 11.99, ep2: 11.99, ep3: 11.99, exc: 6.0, em: 0, ekwp: 0 },
    { com: 'Iberdrola', nom: 'One Luz 3P', pp1: 38.04, pp2: 6.79, ep1: 18.5, ep2: 14.2, ep3: 10.1, exc: 5.0, em: 0, ekwp: 0 },
    { com: 'Endesa', nom: 'Tempo Fijo 3P', pp1: 37.59, pp2: 6.49, ep1: 17.8, ep2: 13.5, ep3: 9.5, exc: 5.5, em: 0, ekwp: 0 },
    { com: 'Naturgy', nom: 'Gas + Luz 3.0', pp1: 36.0, pp2: 7.2, ep1: 19.2, ep2: 15.1, ep3: 11.0, exc: 4.8, em: 0, ekwp: 0 },
    { com: 'Repsol Elec.', nom: 'Precio Fijo 3P', pp1: 39.0, pp2: 6.5, ep1: 16.9, ep2: 13.0, ep3: 9.8, exc: 6.0, em: 0, ekwp: 0 },
  ]

  for (const t of tarifas) {
    // Check if the rate already exists for this admin
    const existing = await prisma.rate.findFirst({
      where: {
        userId: adminId,
        comercializadora: t.com,
        nombre: t.nom,
      }
    })

    if (!existing) {
      await prisma.rate.create({
        data: {
          userId: adminId,
          comercializadora: t.com,
          nombre: t.nom,
          potP1Punta: t.pp1,
          potP2Valle: t.pp2,
          energiaP1Punta: t.ep1,
          energiaP2Llana: t.ep2,
          energiaP3Valle: t.ep3,
          excedentes: t.exc,
          cuotaMensual: t.em,
          extraKwp: t.ekwp,
          isPublic: true,
        }
      })
      console.log(`Created rate: ${t.com} - ${t.nom}`)
    } else {
      console.log(`Rate already exists: ${t.com} - ${t.nom}`)
    }
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
