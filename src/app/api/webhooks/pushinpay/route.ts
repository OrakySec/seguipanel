import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSetting } from "@/lib/settings";
import { apiResponse, apiError } from "@/lib/utils";
import { processConfirmedPayment } from "@/lib/payment-processor";

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

export async function POST(req: NextRequest) {
  try {
    // 0. Log de todos os headers para debug
    const allHeaders: Record<string, string> = {};
    req.headers.forEach((v, k) => { allHeaders[k] = v; });
    console.log("[WEBHOOK] headers:", JSON.stringify(allHeaders));

    // Verificar token se configurado no admin
    const token = req.headers.get("x-pushinpay-token");
    const webhookSecret = await getSetting("pushinpay_webhook_secret");
    console.log("[WEBHOOK] token recebido:", token ?? "(nenhum header)");
    console.log("[WEBHOOK] secret configurado:", webhookSecret ? "sim" : "não");

    // Só bloqueia se secret está configurado no admin E o token não bate
    // Se PushinPay não envia o header (token=null), aceita mesmo assim
    if (webhookSecret && token !== webhookSecret) {
      console.log("[WEBHOOK] BLOQUEADO — secret configurado mas token não bate");
      return apiError("Unauthorized", 401);
    }

    // 1. Ler payload (JSON ou URL-encoded)
    const contentType = req.headers.get("content-type") ?? "";
    let payload: Record<string, unknown> = {};

    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else {
      const text = await req.text();
      const params = new URLSearchParams(text);
      params.forEach((v, k) => { payload[k] = v; });
    }

    console.log("[WEBHOOK] payload completo:", JSON.stringify(payload));

    // 2. Extrair id e status
    const nested = payload.data as Record<string, unknown> | undefined;
    const ppId     = String(payload.id ?? nested?.id ?? "");
    const ppStatus = String(payload.status ?? nested?.status ?? "");
    const isPaid =
      ppStatus === "paid"      ||
      ppStatus === "PAID"      ||
      ppStatus === "approved"  ||
      ppStatus === "completed";

    console.log("[WEBHOOK] ppId:", ppId, "| ppStatus:", ppStatus, "| isPaid:", isPaid);

    if (!ppId) {
      return apiError("Payload inválido — sem ID", 400);
    }

    if (!isPaid) {
      return apiResponse({ received: true, note: "not_paid", status: ppStatus });
    }

    // 3. Processar pagamento (idempotente)
    const result = await processConfirmedPayment(ppId);

    if (!result) {
      console.log("[WEBHOOK] Transação não encontrada para ppId:", ppId);
      return apiResponse({ received: true, note: "transaction_not_found" });
    }

    if (result.alreadyProcessed) {
      return apiResponse({ received: true, note: "already_processed" });
    }

    // 4. Conversões de marketing (não bloqueiam)
    const transaction = await prisma.transactionLog.findUnique({
      where: { transactionId: ppId },
      select: { amount: true, orderDetails: true },
    });
    if (transaction) {
      const email = ((transaction.orderDetails as Record<string, unknown>).email as string) ?? "";
      Promise.all([
        sendGA4Conversion(ppId, transaction.amount, email),
        sendFacebookConversion(ppId, transaction.amount, email),
      ]).catch((e) => console.error("[WEBHOOK] Conversion error:", e));
    }

    return apiResponse({ received: true, orderId: result.orderId });
  } catch (err) {
    console.error("[WEBHOOK PUSHINPAY] Erro não tratado:", err);
    // Retorna 500 para PushinPay retentar (até 3 tentativas)
    return new Response(
      JSON.stringify({ received: false, error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
