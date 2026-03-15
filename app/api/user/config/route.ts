import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { bonoSocialDia: true, autoconsumoEstimado: true, role: true }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_CONFIG_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    
    const user = await prisma.user.update({
      where: { id: (session.user as any).id },
      data: {
        bonoSocialDia: body.bonoSocialDia,
        autoconsumoEstimado: body.autoconsumoEstimado
      },
      select: { bonoSocialDia: true, autoconsumoEstimado: true }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_CONFIG_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
