import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { z } from "zod";

const payoutSchema = z.object({
  amount: z.number().min(10, "O valor mínimo para saque é R$ 10,00"),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== "AFFILIATE" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    const payouts = await prisma.payout.findMany({
      where: { affiliateId: session.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ payouts });
  } catch (err) {
    console.error("[AFFILIATE PAYOUT GET]", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== "AFFILIATE" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = payoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { amount } = parsed.data;

    // Verificar saldo
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { balance: true, pixKey: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    if (!user.pixKey) {
      return NextResponse.json({ error: "Você precisa configurar sua Chave PIX antes de sacar" }, { status: 400 });
    }

    if (Number(user.balance) < amount) {
      return NextResponse.json({ error: "Saldo insuficiente" }, { status: 400 });
    }

    // Criar o Payout e descontar o saldo em uma transação
    const [payout] = await prisma.$transaction([
      prisma.payout.create({
        data: {
          affiliateId: session.userId,
          amount,
          pixKey: user.pixKey,
          status: "pending",
        },
      }),
      prisma.user.update({
        where: { id: session.userId },
        data: { balance: { decrement: amount } },
      }),
    ]);

    return NextResponse.json({ success: true, payout });
  } catch (err) {
    console.error("[AFFILIATE PAYOUT POST]", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
