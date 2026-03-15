import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ rateId: string }> }
) {
  try {
    const { rateId } = await params;
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const rate = await prisma.rate.findUnique({
      where: { id: rateId }
    });

    if (!rate) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Only owners or admins can delete
    if (rate.userId !== (session.user as any).id && (session.user as any).role !== "admin") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await prisma.rate.delete({
      where: { id: rateId }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[RATE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ rateId: string }> }
) {
  try {
    const { rateId } = await params;
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    
    const rate = await prisma.rate.findUnique({
      where: { id: rateId }
    });

    if (!rate) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Only owners or admins can edit
    if (rate.userId !== (session.user as any).id && (session.user as any).role !== "admin") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const isPublic = body.isPublic !== undefined ? 
      (body.isPublic && (session.user as any).role === "admin" ? true : false) : 
      rate.isPublic;

    const updatedRate = await prisma.rate.update({
      where: { id: rateId },
      data: {
        comercializadora: body.comercializadora,
        nombre: body.nombre,
        potP1Punta: body.potP1Punta,
        potP2Valle: body.potP2Valle,
        energiaP1Punta: body.energiaP1Punta,
        energiaP2Llana: body.energiaP2Llana,
        energiaP3Valle: body.energiaP3Valle,
        excedentes: body.excedentes,
        cuotaMensual: body.cuotaMensual || 0,
        extraKwp: body.extraKwp || 0,
        isPublic,
      }
    });

    return NextResponse.json(updatedRate);
  } catch (error) {
    console.log("[RATE_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
