import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  // Ler service ID override do body (opcional)
  let overrideServiceId: string | undefined;
  try {
    const body = await req.json();
    if (typeof body?.apiServiceId === "string" && body.apiServiceId.trim()) {
      overrideServiceId = body.apiServiceId.trim();
    }
  } catch { /* body vazio ou ausente é ok */ }

  // Buscar pedido — só aceita pedidos ainda não enviados
  let order = await prisma.order.findFirst({
    where: { id: orderId, type: "api", apiOrderId: 0, status: "pending" },
  });
  if (!order) {
    return NextResponse.json(
      { error: "Pedido não encontrado, já foi enviado ou não é do tipo API." },
      { status: 404 }
    );
  }

  // Persistir o service ID editado antes de enviar
  if (overrideServiceId && overrideServiceId !== order.apiServiceId) {
    await prisma.order.update({
      where: { id: orderId },
      data: { apiServiceId: overrideServiceId },
    });
    order = { ...order, apiServiceId: overrideServiceId };
  }

  if (!order.apiProviderId || !order.apiServiceId) {
    return NextResponse.json(
      { error: "Pedido sem provider ou service ID configurado." },
      { status: 400 }
    );
  }

  const provider = await prisma.apiProvider.findFirst({
    where: { id: order.apiProviderId, status: 1 },
  });
  if (!provider) {
    return NextResponse.json(
      { error: "Fornecedor não encontrado ou inativo." },
      { status: 404 }
    );
  }

  try {
    const body = new URLSearchParams({
      key:      provider.apiKey,
      action:   "add",
      service:  order.apiServiceId,
      link:     order.link ?? "",
      quantity: order.quantity ?? "100",
    });

    const res = await fetch(provider.url, {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:    body.toString(),
    });

    const data = await res.json() as { order?: number | string; error?: string };

    if (!data.order) {
      const msg = data.error ?? JSON.stringify(data);
      console.error(`[retry-supplier] Order #${orderId} erro do fornecedor:`, msg);
      return NextResponse.json(
        { error: `Fornecedor retornou erro: ${msg}` },
        { status: 502 }
      );
    }

    const apiOrderId = Number(data.order);
    await prisma.order.update({
      where: { id: orderId },
      data: { apiOrderId, status: "processing" },
    });

    return NextResponse.json({ success: true, apiOrderId });
  } catch (e) {
    console.error(`[retry-supplier] Order #${orderId} exceção:`, e);
    return NextResponse.json(
      { error: "Erro ao comunicar com o fornecedor." },
      { status: 502 }
    );
  }
}
