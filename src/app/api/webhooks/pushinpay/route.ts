import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSetting, getSettingBool } from "@/lib/settings";
import { apiResponse, apiError } from "@/lib/utils";
import { sendOrderConfirmedEmail } from "@/lib/email";

async function sendGA4Conversion(
  transactionId: string,
  amount: number,
  email: string
) {
  try {
    const measurementId = await getSetting("google_analytics_id");
    const apiSecret = await getSetting("ga4_api_secret");
    if (!measurementId || !apiSecret) return;

    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: "POST",
        body: JSON.stringify({
          client_id: email.replace(/[^a-z0-9]/gi, ""),
          events: [
            {
              name: "purchase",
              params: {
                transaction_id: transactionId,
                value: amount,
                currency: "BRL",
              },
            },
          ],
        }),
      }
    );
  } catch (e) {
    console.error("[WEBHOOK] GA4 error:", e);
  }
}

async function sendFacebookConversion(
  transactionId: string,
  amount: number,
  email: string
) {
  try {
    const pixelId = await getSetting("facebook_pixel_id");
    const accessToken = await getSetting("facebook_access_token");
    const testCode = await getSetting("facebook_test_event_code");
    if (!pixelId || !accessToken) return;

    // Hash do email (SHA-256)
    const encoder = new TextEncoder();
    const data = encoder.encode(email.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashHex = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const body: Record<string, unknown> = {
      data: [
        {
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          event_id: transactionId,
          user_data: { em: [hashHex] },
          custom_data: { value: amount, currency: "BRL" },
          action_source: "website",
        },
      ],
    };
    if (testCode) body.test_event_code = testCode;

    await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
  } catch (e) {
    console.error("[WEBHOOK] Facebook CAPI error:", e);
  }
}

async function createOrder(transactionId: number) {
  const transaction = await prisma.transactionLog.findUnique({
    where: { id: transactionId },
  });
  if (!transaction) return null;

  const details = transaction.orderDetails as Record<string, unknown>;
  const serviceId = details.serviceId as number;
  const link = details.link as string;
  const quantity = details.quantity as string | undefined;

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { apiProvider: true },
  });
  if (!service) return null;

  // Criar pedido
  const order = await prisma.order.create({
    data: {
      userId: transaction.userId,
      serviceId: service.id,
      categoryId: service.categoryId,
      type: service.addType === "API" ? "api" : "direct",
      serviceType: service.type,
      apiProviderId: service.apiProviderId ?? undefined,
      apiServiceId: service.apiServiceId ?? undefined,
      link,
      quantity: quantity ?? String(service.quantity),
      charge: transaction.amount,
      status: "pending",
    },
  });

  // Vincular order à transação
  await prisma.transactionLog.update({
    where: { id: transactionId },
    data: { orderId: order.id },
  });

  // Atualizar totais do usuário
  await prisma.user.update({
    where: { id: transaction.userId },
    data: {
      totalOrders: { increment: 1 },
      totalSpent: { increment: transaction.amount },
    },
  });

  return order;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Ler payload (JSON ou URL-encoded, como faz o PHP original)
    const contentType = req.headers.get("content-type") ?? "";
    let payload: Record<string, unknown> = {};

    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else {
      const text = await req.text();
      const params = new URLSearchParams(text);
      params.forEach((v, k) => {
        payload[k] = v;
      });
    }

    // 2. Extrair id e status da PushinPay
    const ppId = String(payload?.id ?? payload?.data?.id ?? "");
    const ppStatus = String(payload?.status ?? payload?.data?.status ?? "");
    const isPaid =
      ppStatus === "paid" ||
      ppStatus === "PAID" ||
      ppStatus === "approved" ||
      ppStatus === "completed";

    if (!ppId) {
      return apiError("Payload inválido — sem ID", 400);
    }

    // 3. Buscar transação pelo transaction_id da gateway
    const transaction = await prisma.transactionLog.findUnique({
      where: { transactionId: ppId },
    });

    if (!transaction) {
      // Retorna 200 para a PushinPay não retentar infinitamente
      return apiResponse({ received: true });
    }

    // 4. Já processado? Ignora (idempotência)
    if (transaction.status === 1) {
      return apiResponse({ received: true, note: "already_processed" });
    }

    if (!isPaid) {
      return apiResponse({ received: true, note: "not_paid" });
    }

    // 5. Marcar como pago
    await prisma.transactionLog.update({
      where: { id: transaction.id },
      data: { status: 1 },
    });

    // 6. Criar pedido
    const order = await createOrder(transaction.id);

    // 7. Conversões de marketing + e-mail (em paralelo, não bloqueia a resposta)
    const details = transaction.orderDetails as Record<string, unknown>;
    const email = (details.email as string) ?? "";

    if (order && email) {
      const service = await prisma.service.findUnique({
        where:  { id: order.serviceId },
        select: { name: true },
      });
      sendOrderConfirmedEmail(email, order, service?.name ?? "Serviço").catch(
        (e) => console.error("[WEBHOOK] Email error:", e)
      );
    }

    Promise.all([
      sendGA4Conversion(ppId, transaction.amount, email),
      sendFacebookConversion(ppId, transaction.amount, email),
    ]).catch((e) => console.error("[WEBHOOK] Conversion error:", e));

    return apiResponse({
      received: true,
      orderId: order?.id ?? null,
    });
  } catch (err) {
    console.error("[WEBHOOK PUSHINPAY]", err);
    // Retorna 200 mesmo em erro para não bloquear retentativas desnecessárias
    return apiResponse({ received: true, error: true });
  }
}
