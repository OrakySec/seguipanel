import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSetting } from "@/lib/settings";
import { apiResponse, apiError } from "@/lib/utils";
import { sendOrderCompletedEmail, sendOrderFailedEmail, sendOrderPartialEmail } from "@/lib/email";

const ACTIVE_STATUSES = ["pending", "processing", "inprogress", "active"];
const MAX_BATCH       = 100;
const COOLDOWN_MS     = 3 * 60 * 1000; // 3 minutos

type ProviderStatusEntry = {
  status?: string;
  remains?: number | string;
  start_count?: number | string;
  error?: string;
};

/** Normaliza qualquer variação de status do fornecedor SMM para os valores internos. */
function normalizeStatus(raw: string): string {
  const s = raw.toLowerCase().replace(/\s+/g, "");
  if (s === "inprogress" || s === "active")                        return "inprogress";
  if (s === "completed")                                           return "completed";
  if (s === "cancelled" || s === "canceled" || s === "failed")     return "canceled";
  if (s === "partial")                                             return "partial";
  if (s === "processing")                                          return "processing";
  return "pending";
}

export async function POST(req: NextRequest) {
  /* ─── Auth ─── */
  const cronSecret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
    return apiError("Unauthorized", 401);
  }

  const cooldownAt = new Date(Date.now() - COOLDOWN_MS);

  /* ─── Buscar pedidos em andamento (com cooldown) ─── */
  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { lastStatusCheckAt: null },
        { lastStatusCheckAt: { lt: cooldownAt } },
      ],
      type:          "api",
      apiOrderId:    { gt: 0 },
      status:        { in: ACTIVE_STATUSES },
      apiProviderId: { not: null },
    },
  });

  if (orders.length === 0) {
    return apiResponse({ updated: 0, errors: [], total: 0, at: new Date().toISOString() });
  }

  /* ─── Buscar providers em lote ─── */
  const providerIds = [...new Set(orders.map((o) => o.apiProviderId!))] as number[];
  const providers = await prisma.apiProvider.findMany({
    where: { id: { in: providerIds }, status: 1 },
  });
  const providerMap = new Map(providers.map((p) => [p.id, p]));

  const results = { updated: 0, errors: [] as string[] };

  /* ─── Agrupar por provedor ─── */
  const byProvider = new Map<number, typeof orders>();
  for (const order of orders) {
    if (!order.apiProviderId) continue;
    const list = byProvider.get(order.apiProviderId) ?? [];
    list.push(order);
    byProvider.set(order.apiProviderId, list);
  }

  for (const [providerId, providerOrders] of byProvider) {
    const provider = providerMap.get(providerId);
    if (!provider) continue;

    /* ─── Chunk por MAX_BATCH ─── */
    for (let i = 0; i < providerOrders.length; i += MAX_BATCH) {
      const chunk = providerOrders.slice(i, i + MAX_BATCH);

      try {
        const body = new URLSearchParams({
          key:    provider.apiKey,
          action: "status",
          orders: chunk.map((o) => o.apiOrderId).join(","),
        });

        const res = await fetch(provider.url, {
          method:  "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body:    body.toString(),
        });

        const data = await res.json() as Record<string, ProviderStatusEntry>;

        for (const order of chunk) {
          const entry = data[String(order.apiOrderId)];
          if (!entry || entry.error) continue;

          const newStatus  = entry.status ? normalizeStatus(entry.status) : order.status;
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

          /* ─── Ações em status terminal ─── */
          if (prevStatus !== newStatus) {
            const user = await prisma.user.findUnique({
              where:  { id: order.userId },
              select: { email: true },
            });

            if (newStatus === "completed" && user?.email) {
              sendOrderCompletedEmail(user.email, order).catch((e) =>
                console.error("[CRON:check-status] email completed:", e)
              );
            }

            if (newStatus === "canceled") {
              /* ─── Reembolso automático via PushinPay ─── */
              const txLog = await prisma.transactionLog.findFirst({
                where: { orderId: order.id },
              });

              if (txLog) {
                const apiToken = await getSetting("api_token_pushinpay");
                const baseUrl  = (await getSetting("pushinpay_base_url")) ?? "https://api.pushinpay.com.br";

                try {
                  const refundRes = await fetch(
                    `${baseUrl}/api/transactions/${txLog.transactionId}/refund`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${apiToken}`,
                        Accept:        "application/json",
                        "Content-Type": "application/json",
                      },
                    }
                  );
                  const refundData = await refundRes.json() as Record<string, unknown>;

                  await prisma.transactionLog.update({
                    where: { id: txLog.id },
                    data: {
                      refundStatus:   refundRes.ok ? 1 : 2,
                      refundResponse: JSON.stringify(refundData),
                    },
                  });
                } catch (err) {
                  console.error(`[CRON:check-status] Refund order #${order.id}:`, err);
                }
              }

              /* ─── E-mail de cancelamento ─── */
              if (user?.email) {
                sendOrderFailedEmail(user.email, order).catch((e) =>
                  console.error("[CRON:check-status] email canceled:", e)
                );
              }
            }

            if (newStatus === "partial") {
              const qty            = Number(order.quantity) || 0;
              const rem            = Number(entry.remains ?? 0);
              const delivered      = Math.max(0, qty - rem);
              const deliveredRatio = qty > 0 ? delivered / qty : 0;

              if (deliveredRatio <= 0.05) {
                /* ─── ≤ 5% entregue: reembolso total (igual ao cancelamento) ─── */
                const txLog = await prisma.transactionLog.findFirst({
                  where: { orderId: order.id },
                });

                if (txLog) {
                  const apiToken = await getSetting("api_token_pushinpay");
                  const baseUrl  = (await getSetting("pushinpay_base_url")) ?? "https://api.pushinpay.com.br";

                  try {
                    const refundRes = await fetch(
                      `${baseUrl}/api/transactions/${txLog.transactionId}/refund`,
                      {
                        method: "POST",
                        headers: {
                          Authorization:  `Bearer ${apiToken}`,
                          Accept:         "application/json",
                          "Content-Type": "application/json",
                        },
                      }
                    );
                    const refundData = await refundRes.json() as Record<string, unknown>;

                    await prisma.transactionLog.update({
                      where: { id: txLog.id },
                      data: {
                        refundStatus:   refundRes.ok ? 1 : 2,
                        refundDate:     refundRes.ok ? new Date() : undefined,
                        refundResponse: JSON.stringify(refundData),
                      },
                    });

                    console.log(`[CRON:check-status] Partial→full refund order #${order.id} (delivered ${(deliveredRatio * 100).toFixed(1)}% ≤ 5%)`);
                  } catch (err) {
                    console.error(`[CRON:check-status] Partial refund order #${order.id}:`, err);
                  }
                }

                if (user?.email) {
                  sendOrderFailedEmail(user.email, order).catch((e) =>
                    console.error("[CRON:check-status] email partial-refund:", e)
                  );
                }
              } else {
                /* ─── > 5% entregue: sem reembolso, apenas notificação ─── */
                console.log(`[CRON:check-status] Partial no-refund order #${order.id} (delivered ${(deliveredRatio * 100).toFixed(1)}% > 5%)`);

                if (user?.email) {
                  sendOrderPartialEmail(user.email, order).catch((e) =>
                    console.error("[CRON:check-status] email partial-no-refund:", e)
                  );
                }
              }
            }
          }
        }
      } catch (err) {
        results.errors.push(`Provider #${providerId}: ${String(err)}`);
        console.error(`[CRON:check-status] Provider #${providerId}:`, err);
      }

      /* ─── Marcar chunk como verificado (mesmo em caso de erro) ─── */
      await prisma.order.updateMany({
        where: { id: { in: chunk.map((o) => o.id) } },
        data:  { lastStatusCheckAt: new Date() },
      });
    }
  }

  return apiResponse({
    ...results,
    total: orders.length,
    at: new Date().toISOString(),
  });
}
