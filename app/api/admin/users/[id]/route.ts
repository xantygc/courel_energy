import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user || (session.user as any).role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { role } = body;

    if (!role || !["regular", "admin"].includes(role)) {
      return new NextResponse("Invalid role", { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { role },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[ADMIN_USER_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user || (session.user as any).role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const adminEmail = "santiago.gonzalez.courel@gmail.com";
    const targetUserId = params.id;

    // We can't delete the designated admin
    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (targetUser?.email === adminEmail) {
      return new NextResponse("Cannot delete the main admin account", { status: 400 });
    }

    // Find admin user record
    const adminUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!adminUser) {
        return new NextResponse("Admin account not found in database", { status: 500 });
    }

    // Transaction: reassign public rates and delete user
    await prisma.$transaction([
      // Reassign public rates to admin
      prisma.rate.updateMany({
        where: { 
          userId: targetUserId,
          isPublic: true
        },
        data: {
          userId: adminUser.id
        }
      }),
      // Delete user (cascades to private rates and consumptions)
      prisma.user.delete({
        where: { id: targetUserId }
      })
    ]);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[ADMIN_USER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
