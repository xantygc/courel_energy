import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const consumptions = await prisma.consumption.findMany({
      where: { userId: session.user.id },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });

    return NextResponse.json(consumptions);
  } catch (error: any) {
    console.error("Error in GET /api/consumptions:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("POST /api/consumptions body:", body);
    const { year, month, dias, pp1, pp2, kp1, kp2, kp3, exc } = body;

    const consumption = await prisma.consumption.upsert({
      where: {
        userId_year_month: {
          userId: session.user.id,
          year: +year,
          month: +month,
        },
      },
      update: {
        dias: +dias,
        pp1: +pp1,
        pp2: +pp2,
        kp1: +kp1,
        kp2: +kp2,
        kp3: +kp3,
        exc: +exc,
      },
      create: {
        userId: session.user.id,
        year: +year,
        month: +month,
        dias: +dias,
        pp1: +pp1,
        pp2: +pp2,
        kp1: +kp1,
        kp2: +kp2,
        kp3: +kp3,
        exc: +exc,
      },
    });

    return NextResponse.json(consumption);
  } catch (error: any) {
    console.error("Error in POST /api/consumptions:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
