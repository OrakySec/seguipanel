import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSetting } from "@/lib/settings";
import { sendEvolutionGroupMessage, sendEvolutionMessage } from "@/lib/evolution";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const orderId = parseInt(id);
  if (isNaN(orderId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  let body: { actionId?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const { actionId } = body;
  if (!actionId || typeof actionId !== "number") {
    return NextResponse.json({ error: "actionId obrigatório" }, { status: 400 });
  }

  // Buscar ação
  const action = await prisma.whatsAppAction.findUnique({ where: { id: actionId } });
  if (!action || !action.isActive) {
    return NextResponse.json({ error: "Ação não encontrada ou inativa" }, { status: 404 });
  }

  // Buscar pedido com detalhes necessários
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      service: { select: { name: true } },
      user:    { select: { whatsapp: true } },
    },
  });
  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }

  // Substituir variáveis do template
  const message = action.messageTemplate
    .replace(/\{\{orderId\}\}/g, String(order.apiOrderId ?? order.id))
    .replace(/\{\{servico\}\}/g, order.service?.name ?? "")
    .replace(/\{\{link\}\}/g,    order.link ?? "");

  try {
    if (action.type === "supplier") {
      // Envia para o grupo do fornecedor (usa o mesmo JID das reposições)
      const groupJid = await getSetting("refill_group_jid");
      if (!groupJid) {
        return NextResponse.json(
          { error: "Grupo do fornecedor não configurado (refill_group_jid)." },
          { status: 400 }
        );
      }
      await sendEvolutionGroupMessage(groupJid, message);
    } else {
      // Envia para o WhatsApp do cliente
      const phone = order.user?.whatsapp;
      if (!phone) {
        return NextResponse.json(
          { error: "Este cliente não possui WhatsApp cadastrado." },
          { status: 400 }
        );
      }
      await sendEvolutionMessage(phone, message);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[send-action] Erro ao enviar mensagem:", e);
    return NextResponse.json({ error: "Erro ao enviar mensagem via Evolution API." }, { status: 502 });
  }
}
