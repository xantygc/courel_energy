import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import prisma from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    return NextResponse.json({
      message: "Esta ruta solo acepta métodos PUT y DELETE para gestión de usuarios.",
      hint: "Usa el botón de borrar en el Dashboard o una herramienta tipo Postman.",
      targetId: id,
    });
  } catch (error: any) {
    console.error("[ADMIN_USER_GET] Error:", error);
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const session = await auth();

    if (!session?.user || (session.user as any).role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { role } = body;

    if (!role || !["regular", "admin"].includes(role)) {
      return new NextResponse("Invalid role", { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const user = await prisma.user.update({ where: { id }, data: { role } });
    return NextResponse.json(user);
  } catch (error: any) {
    console.error("[ADMIN_USER_PUT] ERROR:", error);
    return NextResponse.json(
      { error: "Internal Error", message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const session = await auth();
    console.log("[DELETE_USER] Session:", !!session);

    if (!session?.user || (session.user as any).role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const adminEmail = "santiago.gonzalez.courel@gmail.com";
    console.log("[DELETE_USER] Target ID:", id);

    const targetUser = await prisma.user.findUnique({ where: { id } });
    console.log("[DELETE_USER] Target User found:", !!targetUser);

    if (!targetUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (targetUser.email === adminEmail) {
      return new NextResponse("Cannot delete the main admin account", { status: 400 });
    }

    const adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
    console.log("[DELETE_USER] Admin Record found:", !!adminUser);

    if (!adminUser) {
      return new NextResponse("Admin account not found in database", { status: 500 });
    }

    console.log("[DELETE_USER] Starting transaction...");
    await prisma.$transaction([
      prisma.rate.updateMany({
        where: { userId: id, isPublic: true },
        data: { userId: adminUser.id },
      }),
      prisma.user.delete({ where: { id } }),
    ]);
    console.log("[DELETE_USER] Transaction finished.");

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("[ADMIN_USER_DELETE] ERROR:", error);
    return NextResponse.json(
      { error: "Internal Error", message: error.message },
      { status: 500 }
    );
  }
}
