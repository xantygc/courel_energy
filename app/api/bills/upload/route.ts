import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const webhookUrl = process.env.BILL_READER_URL;
    const user = process.env.BILL_READER_USER;
    const pass = process.env.BILL_READER_PASS;

    if (!webhookUrl) {
      return NextResponse.json({ error: "Webhook URL not configured on server" }, { status: 500 });
    }

    const authHeader = Buffer.from(`${user}:${pass}`).toString("base64");
    
    const webhookFormData = new FormData();
    webhookFormData.append("file", file);

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Authorization": `Basic ${authHeader}` },
      body: webhookFormData,
      signal: AbortSignal.timeout(120000)
    });

    if (!res.ok) {
      throw new Error(`Webhook responded with status ${res.status}`);
    }

    let data = await res.json();
    if (Array.isArray(data)) data = data[0];
    const tourOutput = data.output || data;

    const mapped = {
        year: tourOutput.anio || tourOutput.year || new Date().getFullYear(),
        month: tourOutput.mes || tourOutput.month || (new Date().getMonth() + 1),
        dias: tourOutput.dias || 30,
        pp1: tourOutput.potencia?.punta || 3.45,
        pp2: tourOutput.potencia?.valle || 3.45,
        kp1: tourOutput.consumo?.punta || 0,
        kp2: tourOutput.consumo?.llano || 0,
        kp3: tourOutput.consumo?.valle || 0,
        exc: tourOutput.excedentes?.punta || tourOutput.exc || 0
    };

    const consumption = await prisma.consumption.upsert({
      where: {
        userId_year_month: {
          userId: session.user.id,
          year: +mapped.year,
          month: +mapped.month,
        },
      },
      update: {
        dias: +mapped.dias,
        pp1: +mapped.pp1,
        pp2: +mapped.pp2,
        kp1: +mapped.kp1,
        kp2: +mapped.kp2,
        kp3: +mapped.kp3,
        exc: +mapped.exc,
      },
      create: {
        userId: session.user.id,
        year: +mapped.year,
        month: +mapped.month,
        dias: +mapped.dias,
        pp1: +mapped.pp1,
        pp2: +mapped.pp2,
        kp1: +mapped.kp1,
        kp2: +mapped.kp2,
        kp3: +mapped.kp3,
        exc: +mapped.exc,
      },
    });

    return NextResponse.json(consumption);
  } catch (error: any) {
    console.error("Error in POST /api/bills/upload:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
