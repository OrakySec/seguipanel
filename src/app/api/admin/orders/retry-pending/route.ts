import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // Buscar todos os pedidos travados (mesma query do cron)
  const orders = await prisma.order.findMany({
    where: {
      type:          "api",
      apiOrderId:    0,
      status:        "pending",
      apiProviderId: { not: null },
      apiServiceId:  { not: null },
    },
  });

  if (orders.length === 0) {
    return NextResponse.json({ processed: 0, errors: 0, message: "Nenhum pedido pendente encontrado." });
  }

  // Batch-load providers (sem N+1)
  const providerIds = [...new Set(orders.map((o) => o.apiProviderId!))] as number[];
  const providers = await prisma.apiProvider.findMany({
    where: { id: { in: providerIds }, status: 1 },
  });
  const providerMap = new Map(providers.map((p) => [p.id, p]));

  let processed = 0;
  let errors = 0;

  for (const order of orders) {
    const provider = providerMap.get(order.apiProviderId!);
    if (!provider) {
      errors++;
      continue;
    }

    try {
      const body = new URLSearchParams({
        key:      provider.apiKey,
        action:   "add",
        service:  order.apiServiceId!,
        link:     order.link ?? "",
        quantity: order.quantity ?? "100",
      });

      const res = await fetch(provider.url, {
        method:  "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:    body.toString(),
      });

      const data = await res.json() as { order?: number | string; error?: string };

      if (data.order) {
        await prisma.order.update({
          where: { id: order.id },
          data: { apiOrderId: Number(data.order), status: "processing" },
        });
        processed++;
      } else {
        console.error(`[retry-pending] Order #${order.id} erro:`, data.error ?? JSON.stringify(data));
        errors++;
      }
    } catch (e) {
      console.error(`[retry-pending] Order #${order.id} exceção:`, e);
      errors++;
    }
  }

  return NextResponse.json({ processed, errors, total: orders.length });
}
