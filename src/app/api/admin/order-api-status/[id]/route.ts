import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError } from "@/lib/utils";
import { getSessionFromCookies } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const orderId = Number(id);
  if (isNaN(orderId)) return apiError("ID inválido", 400);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      service: { select: { name: true } },
      user: { select: { email: true } },
    },
  });

  if (!order) return apiError("Pedido não encontrado", 404);
  if (!order.apiProviderId || !order.apiOrderId || order.apiOrderId === 0) {
    return apiResponse({ order, providerResponse: null, message: "Pedido ainda não enviado ao fornecedor" });
  }

  const provider = await prisma.apiProvider.findUnique({ where: { id: order.apiProviderId } });
  if (!provider) return apiResponse({ order, providerResponse: null, message: "Fornecedor não encontrado" });

  try {
    const body = new URLSearchParams({
      key: provider.apiKey,
      action: "status",
      order: String(order.apiOrderId),
    });
    const res = await fetch(provider.url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: AbortSignal.timeout(15000),
    });
    const providerResponse = await res.json();
    return apiResponse({ order, providerResponse, providerName: provider.name });
  } catch (err) {
    return apiResponse({ order, providerResponse: null, message: `Erro ao consultar fornecedor: ${String(err)}` });
  }
}
