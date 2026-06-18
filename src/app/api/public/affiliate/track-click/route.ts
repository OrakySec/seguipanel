import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { ref } = await req.json();

    if (!ref || typeof ref !== "string") {
      return NextResponse.json({ error: "Invalid ref" }, { status: 400 });
    }

    // Procura o usuário afiliado
    const affiliate = await prisma.user.findUnique({
      where: { affiliateCode: ref },
    });

    if (!affiliate || (affiliate.role !== "AFFILIATE" && affiliate.role !== "ADMIN")) {
      return NextResponse.json({ error: "Affiliate not found" }, { status: 404 });
    }

    const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();

    // Registra o clique
    await prisma.affiliateClick.create({
      data: {
        affiliateId: affiliate.id,
        ip,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[AFFILIATE CLICK]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
