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
  const emailToSearch = 'santiago.gonzalez.courel@gmail.com';
  console.log(`Searching for: "${emailToSearch}"`);
  
  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: emailToSearch,
        mode: 'insensitive'
      }
    }
  });

  if (user) {
    console.log('User FOUND:');
    console.log('ID:', user.id);
    console.log('Email:', user.email);
    console.log('Password Hash set:', !!user.passwordHash);
  } else {
    console.log('User NOT found with insensitive search.');
    const allUsers = await prisma.user.findMany();
    console.log('All user emails in DB:');
    allUsers.forEach((u: any) => console.log(`- "${u.email}"`));
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
