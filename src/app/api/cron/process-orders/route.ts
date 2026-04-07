import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSetting } from "@/lib/settings";
import { apiResponse, apiError } from "@/lib/utils";

export async function POST(req: NextRequest) {
  /* ─── Auth ─── */
  const cronSecret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
    return apiError("Unauthorized", 401);
  }

  /* ─── Buscar pedidos pendentes não despachados ─── */
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
    return apiResponse({ processed: 0, skipped: 0, errors: [], total: 0, at: new Date().toISOString() });
  }

  /* ─── Buscar providers em lote ─── */
  const providerIds = [...new Set(orders.map((o) => o.apiProviderId!))] as number[];
  const providers = await prisma.apiProvider.findMany({
    where: { id: { in: providerIds }, status: 1 },
  });
  const providerMap = new Map(providers.map((p) => [p.id, p]));

  const results = { processed: 0, skipped: 0, errors: [] as string[] };

  for (const order of orders) {
    const provider = providerMap.get(order.apiProviderId!);
    if (!provider) {
      results.skipped++;
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
          data: {
            apiOrderId: Number(data.order),
            status:     "processing",
          },
        });
        results.processed++;
      } else {
        const msg = data.error ?? JSON.stringify(data);
        results.errors.push(`Order #${order.id}: ${msg}`);
        console.error(`[CRON:process-orders] Order #${order.id} error:`, msg);
      }
    } catch (err) {
      results.errors.push(`Order #${order.id}: ${String(err)}`);
      console.error(`[CRON:process-orders] Order #${order.id} exception:`, err);
    }
  }

  return apiResponse({
    ...results,
    total: orders.length,
    at: new Date().toISOString(),
  });
}
