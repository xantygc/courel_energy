import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'

dotenv.config()

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
// @ts-ignore
const adapter = new PrismaPg(pool as any)
const prisma = new PrismaClient({ adapter })

async function testDeletion(targetUserId: string) {
  const adminEmail = "santiago.gonzalez.courel@gmail.com";
  
  try {
    console.log(`Attempting to delete user ${targetUserId}...`);

    const adminUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!adminUser) {
      throw new Error("Admin account not found");
    }

    console.log(`Admin found: ${adminUser.id}`);

    const result = await prisma.$transaction([
      prisma.rate.updateMany({
        where: { 
          userId: targetUserId,
          isPublic: true
        },
        data: {
          userId: adminUser.id
        }
      }),
      prisma.user.delete({
        where: { id: targetUserId }
      })
    ]);

    console.log("Deletion successful:", result);
  } catch (error) {
    console.error("Deletion failed:", error);
    if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

const testId = process.argv[2];
if (!testId) {
    console.log("Usage: npx tsx scripts/test-delete.ts <userId>");
    process.exit(1);
}
testDeletion(testId);
