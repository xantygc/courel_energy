import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify ownership
  const existing = await prisma.consumption.findUnique({
    where: { id },
  });

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.consumption.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  // Verify ownership
  const existing = await prisma.consumption.findUnique({
    where: { id },
  });

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.consumption.update({
    where: { id },
    data: {
      year: body.year ? +body.year : undefined,
      month: body.month ? +body.month : undefined,
      dias: body.dias ? +body.dias : undefined,
      pp1: body.pp1 ? +body.pp1 : undefined,
      pp2: body.pp2 ? +body.pp2 : undefined,
      kp1: body.kp1 ? +body.kp1 : undefined,
      kp2: body.kp2 ? +body.kp2 : undefined,
      kp3: body.kp3 ? +body.kp3 : undefined,
      exc: body.exc ? +body.exc : undefined,
    },
  });

  return NextResponse.json(updated);
}
