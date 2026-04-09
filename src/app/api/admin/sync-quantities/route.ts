import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromCookies } from "@/lib/auth";

// Extrai o primeiro número do nome do serviço
// Ex: "1000 Seguidores Brasileiros" → "1000"
// Ex: "50 Curtidas Instagram" → "50"
function extractQuantityFromName(name: string): string | null {
  const match = name.match(/^(\d[\d.,]*)/);
  if (!match) return null;
  return match[1].replace(/[.,]/g, "");
}

export async function POST() {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const services = await prisma.service.findMany({
    where: { quantity: null },
    select: { id: true, name: true },
  });

  let updated = 0;
  for (const s of services) {
    const qty = extractQuantityFromName(s.name);
    if (qty) {
      await prisma.service.update({ where: { id: s.id }, data: { quantity: qty } });
      updated++;
    }
  }

  return NextResponse.json({ ok: true, updated, total: services.length });
}
