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
    
    // 2. Traduzir o objeto body em múltiplas operações de update/upsert
    // O body é um Record<string, string> { site_name: "Novo Nome", ... }
    
    const updates = Object.entries(body).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    });

    // 3. Executar todas as transações de uma vez
    await prisma.$transaction(updates);

    return NextResponse.json({ success: true, message: "Configurações atualizadas com sucesso" });
  } catch (error: any) {
    console.error("Erro ao salvar settings:", error);
    return NextResponse.json(
      { error: "Erro interno ao salvar configurações", details: error.message },
      { status: 500 }
    );
  }
}
