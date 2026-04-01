import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSetting } from "@/lib/settings";
import { apiResponse, apiError } from "@/lib/utils";
import { sendOrderCompletedEmail, sendOrderFailedEmail } from "@/lib/email";

const ACTIVE_STATUSES = ["pending", "processing", "inprogress", "active", "partial"];

type ProviderStatusEntry = {
  status?: string;
  remains?: number | string;
  start_count?: number | string;
  error?: string;
};

export async function POST(req: NextRequest) {
  /* ─── Auth ─── */
  const cronSecret = await getSetting("cron_secret");
  const auth = req.headers.get("authorization");
  if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
    return apiError("Unauthorized", 401);
  }

  /* ─── Buscar pedidos em andamento ─── */
  const orders = await prisma.order.findMany({
    where: {
      type:        "api",
      apiOrderId:  { gt: 0 },
      status:      { in: ACTIVE_STATUSES },
      apiProviderId: { not: null },
    },
    include: { apiProvider: true },
  });

  const results = { updated: 0, errors: [] as string[] };

  /* ─── Agrupar por provedor para fazer batch ─── */
  const byProvider = new Map<number, typeof orders>();
  for (const order of orders) {
    if (!order.apiProviderId) continue;
    const list = byProvider.get(order.apiProviderId) ?? [];
    list.push(order);
    byProvider.set(order.apiProviderId, list);
  }

  for (const [, providerOrders] of byProvider) {
    const provider = providerOrders[0].apiProvider;
    if (!provider) continue;

    const orderIds = providerOrders.map((o) => o.apiOrderId).join(",");

    try {
      const body = new URLSearchParams({
        key:    provider.apiKey,
        action: "status",
        orders: orderIds,
      });

      const res = await fetch(provider.url, {
        method:  "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:    body.toString(),
      });

      const data = await res.json() as Record<string, ProviderStatusEntry>;

      for (const order of providerOrders) {
        const entry = data[String(order.apiOrderId)];
        if (!entry || entry.error) continue;

        const newStatus  = (entry.status ?? order.status).toLowerCase();
        const prevStatus = order.status;

        await prisma.order.update({
          where: { id: order.id },
          data: {
            status:       newStatus,
            remains:      String(entry.remains ?? order.remains ?? "0"),
            startCounter: String(entry.start_count ?? order.startCounter ?? "0"),
          },
        });

        results.updated++;

        /* ─── E-mail quando status muda para terminal ─── */
        if (prevStatus !== newStatus) {
          const user = await prisma.user.findUnique({
            where:  { id: order.userId },
            select: { email: true },
          });

          if (user?.email) {
            if (newStatus === "completed") {
              sendOrderCompletedEmail(user.email, order).catch((e) =>
                console.error("[CRON:check-status] email completed:", e)
              );
            } else if (newStatus === "canceled") {
              sendOrderFailedEmail(user.email, order).catch((e) =>
                console.error("[CRON:check-status] email failed:", e)
              );
            }
          }
        }
      }
    } catch (err) {
      results.errors.push(`Provider #${provider.id}: ${String(err)}`);
      console.error(`[CRON:check-status] Provider #${provider.id}:`, err);
    }
  }

  return apiResponse({
    ...results,
    total: orders.length,
    at: new Date().toISOString(),
  });
}
