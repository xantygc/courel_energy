import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // A user can see public rates AND their own private rates
    const rates = await prisma.rate.findMany({
      where: {
        OR: [
          { isPublic: true },
          { userId: (session.user as any).id },
        ],
      },
      orderBy: { createdAt: "asc" }
    });

    return NextResponse.json(rates);
  } catch (error) {
    console.log("[RATES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const userId = (session.user as any).id;
    const role = (session.user as any).role;
    
    // Only admins can create public rates
    const isPublic = body.isPublic && role === "admin" ? true : false;

    const rate = await prisma.rate.create({
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
        userId: userId,
      },
    });

    return NextResponse.json(rate);
  } catch (error) {
    console.log("[RATES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
