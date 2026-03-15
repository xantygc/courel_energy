import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get("year");
    const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();

    let costs = await prisma.annualRegulatedCost.findUnique({
      where: { year }
    });

    // If costs for the year don't exist yet, return the most recent one or create defaults
    if (!costs) {
      const mostRecent = await prisma.annualRegulatedCost.findFirst({
        orderBy: { year: 'desc' }
      });
      if (mostRecent) {
        return NextResponse.json(mostRecent);
      } else {
        // Create defaults if table is empty
        costs = await prisma.annualRegulatedCost.create({
          data: { year: new Date().getFullYear() }
        });
      }
    }

    return NextResponse.json(costs);
  } catch (error) {
    console.log("[COSTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || (session.user as any).role !== "admin") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const year = body.year || new Date().getFullYear();

    const costs = await prisma.annualRegulatedCost.upsert({
      where: { year },
      update: {
        peajeP1: body.peajeP1,
        peajeP2: body.peajeP2,
        peajeP3: body.peajeP3,
        potBoeP1: body.potBoeP1,
        potBoeP2: body.potBoeP2,
        impuestoElectrico: body.impuestoElectrico,
        iva: body.iva,
        alquilerContadorDia: body.alquilerContadorDia,
        financiacionBonoSocialDia: body.financiacionBonoSocialDia,
      },
      create: {
        year,
        peajeP1: body.peajeP1,
        peajeP2: body.peajeP2,
        peajeP3: body.peajeP3,
        potBoeP1: body.potBoeP1,
        potBoeP2: body.potBoeP2,
        impuestoElectrico: body.impuestoElectrico,
        iva: body.iva,
        alquilerContadorDia: body.alquilerContadorDia,
        financiacionBonoSocialDia: body.financiacionBonoSocialDia,
      }
    });

    return NextResponse.json(costs);
  } catch (error) {
    console.log("[COSTS_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
