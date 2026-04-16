import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSetting, getSettingBool } from "@/lib/settings";
import { sendEvolutionGroupMessage } from "@/lib/evolution";

const SPEED_ACTIVE_STATUSES = ["pending", "processing", "inprogress", "active"];

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

  const active = await getSettingBool("speed_active");
  if (!active) {
    return NextResponse.json({ error: "Agilidade desativada." }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, user: { email } },
    include: { user: true, service: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
  }

  const lockHours    = Number(await getSetting("speed_lock_hours", "24"));
  const intervalDays = Number(await getSetting("speed_interval_days", "7"));
  const maxDays      = Number(await getSetting("speed_max_days", "30"));
  const now          = Date.now();

  const hoursSinceCreation  = (now - new Date(order.createdAt).getTime()) / 3_600_000;
  const daysSinceCreation   = hoursSinceCreation / 24;
  const daysSinceLastSpeed  = order.speedRequestedAt
    ? (now - new Date(order.speedRequestedAt).getTime()) / 86_400_000
    : Infinity;

  if (!SPEED_ACTIVE_STATUSES.includes(order.status)) {
    return NextResponse.json({ error: "Pedido não elegível para agilidade." }, { status: 400 });
  }
  if (order.type !== "api" || !order.apiOrderId || order.apiOrderId === 0) {
    return NextResponse.json({ error: "Pedido não elegível para agilidade." }, { status: 400 });
  }
  if (hoursSinceCreation < lockHours) {
    const remaining = Math.ceil(lockHours - hoursSinceCreation);
    return NextResponse.json({ error: `Aguarde ${remaining}h após o pedido para solicitar agilidade.` }, { status: 400 });
  }
  if (daysSinceCreation > maxDays) {
    return NextResponse.json({ error: `Prazo de agilidade expirou (${maxDays} dias).` }, { status: 400 });
  }
  if (daysSinceLastSpeed < intervalDays) {
    const remaining = Math.ceil(intervalDays - daysSinceLastSpeed);
    return NextResponse.json({ error: `Aguarde ${remaining} dia(s) para solicitar novamente.` }, { status: 400 });
  }

  // Envia mensagem ao grupo do fornecedor (mesmo grupo da reposição)
  const groupJid = await getSetting("refill_group_jid");
  const template = await getSetting(
    "speed_message_template",
    "⚡ *AGILIDADE SOLICITADA*\n\nOrder ID: {{orderId}}\nServiço: {{servico}}\nLink: {{link}}"
  );

  if (groupJid) {
    const text = template
      .replace(/\{\{orderId\}\}/g, String(order.apiOrderId))
      .replace(/\{\{servico\}\}/g, order.service.name)
      .replace(/\{\{link\}\}/g, order.link || "");

    sendEvolutionGroupMessage(groupJid, text).catch((e) =>
      console.error("[Speed] Erro ao enviar mensagem:", e)
    );
  }

  // Marca como solicitado
  await prisma.order.update({
    where: { id: orderId },
    data: { speedRequestedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
