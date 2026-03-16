import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new NextResponse("Missing data", { status: 400 });
    }

    const exist = await prisma.user.findUnique({
      where: { email },
    });

    if (exist) {
      return new NextResponse("User already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        termsAccepted: true,
        termsAcceptedAt: new Date(),
        // Users default to regular
        role: "regular",
      },
    });

    // Create initial consumption record for the previous month
    const now = new Date();
    let initialYear = now.getFullYear();
    let initialMonth = now.getMonth(); // getMonth() is 0-indexed, so this is previous month if current is 1-indexed

    if (initialMonth === 0) {
      initialMonth = 12;
      initialYear -= 1;
    }

    try {
      await prisma.consumption.create({
        data: {
          userId: user.id,
          year: initialYear,
          month: initialMonth,
          dias: 30,
          pp1: 3.45,
          pp2: 3.45,
          kp1: 10,
          kp2: 10,
          kp3: 10,
          exc: 0
        }
      });
    } catch (e) {
      console.error("Failed to create initial consumption:", e);
      // We don't fail the registration if this fails
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log("[REGISTER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
