import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSetting, getSettingBool } from "@/lib/settings";
import { sendEvolutionGroupMessage } from "@/lib/evolution";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const orderId = parseInt(id);
  const body = await req.json().catch(() => ({}));
  const email: string = body.email || "";

  if (!email || isNaN(orderId)) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const active = await getSettingBool("refill_active");
  if (!active) {
    return NextResponse.json({ error: "Reposições desativadas." }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, user: { email } },
    include: { user: true, service: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
  }

  // Elegibilidade
  const intervalDays = Number(await getSetting("refill_interval_days", "7"));
  const maxDays = Number(await getSetting("refill_max_days", "30"));
  const now = Date.now();
  const daysSinceCreation = (now - new Date(order.createdAt).getTime()) / 86400000;
  const daysSinceLastRefill = order.refillRequestedAt
    ? (now - new Date(order.refillRequestedAt).getTime()) / 86400000
    : Infinity;

  if (!["partial", "completed"].includes(order.status)) {
    return NextResponse.json({ error: "Pedido não elegível para reposição." }, { status: 400 });
  }
  if (order.type !== "api" || !order.apiOrderId || order.apiOrderId === 0) {
    return NextResponse.json({ error: "Pedido não elegível para reposição." }, { status: 400 });
  }
  if (daysSinceCreation > maxDays) {
    return NextResponse.json({ error: `Prazo de reposição expirou (${maxDays} dias).` }, { status: 400 });
  }
  if (daysSinceLastRefill < intervalDays) {
    const remaining = Math.ceil(intervalDays - daysSinceLastRefill);
    return NextResponse.json({ error: `Aguarde ${remaining} dia(s) para solicitar novamente.` }, { status: 400 });
  }

  // Envia mensagem ao grupo do fornecedor
  const groupJid = await getSetting("refill_group_jid");
  const template = await getSetting(
    "refill_message_template",
    "♻️ *REPOSIÇÃO SOLICITADA*\n\nOrder ID: {{orderId}}\nServiço: {{servico}}\nLink: {{link}}"
  );

  if (groupJid) {
    const text = template
      .replace(/\{\{orderId\}\}/g, String(order.apiOrderId))
      .replace(/\{\{servico\}\}/g, order.service.name)
      .replace(/\{\{link\}\}/g, order.link || "");

    sendEvolutionGroupMessage(groupJid, text).catch((e) =>
      console.error("[Refill] Erro ao enviar mensagem:", e)
    );
  }

  // Marca como solicitado
  await prisma.order.update({
    where: { id: orderId },
    data: { refillRequestedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
