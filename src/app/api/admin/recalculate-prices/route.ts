import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Rota one-time para recalcular originalPrice de todos os serviços
// originalPrice = price / (1 - discount/100)
export async function POST() {
  try {
    const services = await prisma.service.findMany({
      select: { id: true, price: true, discount: true },
    });

    const results: { id: number; price: number; discount: number; originalPrice: number | null }[] = [];

    for (const s of services) {
      const price = Number(s.price);
      const disc  = Number(s.discount);
      const originalPrice =
        disc > 0 && disc < 100 ? price / (1 - disc / 100) : null;

      await prisma.service.update({
        where: { id: s.id },
        data: { originalPrice },
      });

      results.push({ id: s.id, price, discount: disc, originalPrice });
    }

    return NextResponse.json({ ok: true, updated: results.length, results });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
