import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;
    const adminEmail = "santiago.gonzalez.courel@gmail.com";

    // 1. Find the admin user to reassign public rates
    const admin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!admin) {
      console.error("Admin user not found during account deletion re-assignment");
      // If admin doesn't exist, we might want to fail or handle it.
      // For now, let's proceed but warn.
    }

    // 2. Transact the reassignment and deletion
    const operations = [];

    if (admin) {
      // Reassign public rates to admin
      operations.push(
        prisma.rate.updateMany({
          where: {
            userId: userId,
            isPublic: true,
          },
          data: {
            userId: admin.id,
          },
        })
      );
    }

    // 3. Delete the user (cascading deletes for everything else: private rates, consumptions, accounts, sessions)
    operations.push(
      prisma.user.delete({
        where: { id: userId },
      })
    );

    await prisma.$transaction(operations);

    return new NextResponse("Account deleted", { status: 200 });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
