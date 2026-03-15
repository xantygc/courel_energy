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
  const users = await prisma.user.findMany()
  console.log('Total users:', users.length)
  for (const u of users) {
    const emailHex = Buffer.from(u.email || '').toString('hex');
    console.log(`- Email: "${u.email}" (hex: ${emailHex})`)
    console.log(`  ID: ${u.id}`)
    console.log(`  Role: ${u.role}`)
    if (u.email === 'santiago.gonzalez.courel@gmail.com') {
        console.log("  MATCHED exact string 'santiago.gonzalez.courel@gmail.com'");
        if (u.passwordHash) {
            const isMatch = await bcrypt.compare('Sa10ta10!', u.passwordHash);
            console.log("  Password 'Sa10ta10!' match check:", isMatch);
        } else {
            console.log("  NO password hash found!");
        }
    }
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
