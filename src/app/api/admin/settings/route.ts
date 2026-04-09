import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromCookies } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // 1. Verificar autenticação de Admin
    const session = await getSessionFromCookies();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();

    // 2. Bloquear sobrescrita de chaves críticas de infraestrutura
    const PROTECTED_KEYS = ["JWT_SECRET", "DATABASE_URL", "CRON_SECRET", "PUSHINPAY_WEBHOOK_SECRET", "REDIS_URL"];
    for (const key of Object.keys(body)) {
      if (PROTECTED_KEYS.includes(key)) {
        return NextResponse.json(
          { error: `Chave '${key}' não pode ser alterada via painel` },
          { status: 403 }
        );
      }
    }

    // 3. Traduzir o objeto body em múltiplas operações de update/upsert
    const updates = Object.entries(body).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    });

    // 4. Executar todas as transações de uma vez
    await prisma.$transaction(updates);

    return NextResponse.json({ success: true, message: "Configurações atualizadas com sucesso" });
  } catch (error: any) {
    console.error("Erro ao salvar settings:", error);
    return NextResponse.json(
      { error: "Erro interno ao salvar configurações" },
      { status: 500 }
    );
  }
}
