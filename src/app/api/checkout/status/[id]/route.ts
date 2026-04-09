import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSetting } from "@/lib/settings";
import { processConfirmedPayment } from "@/lib/payment-processor";
import { apiResponse, apiError } from "@/lib/utils";

// Polling de status — usa o transactionId UUID da PushinPay (imprevisível, @unique)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || id.length < 8) return apiError("Token inválido");

  const transaction = await prisma.transactionLog.findUnique({
    where: { transactionId: id },
    select: { status: true, orderId: true },
  });

  if (!transaction) return apiError("Transação não encontrada", 404);

  // Já pago no banco
  if (transaction.status === 1) {
    return apiResponse({ status: 1, orderId: transaction.orderId });
  }

  // Fallback: consulta a PushinPay diretamente para verificar status do pagamento
  let _debug: Record<string, unknown> = {};

  try {
    const apiToken = await getSetting("api_token_pushinpay");
    const baseUrl  = await getSetting("pushinpay_base_url", "https://api.pushinpay.com.br");

    _debug.hasToken = !!apiToken;
    _debug.baseUrl = baseUrl;

    if (apiToken) {
      // Tentar múltiplos endpoints — PushinPay doc é ambígua
      const candidates = [
        `${baseUrl}/api/pix/cashIn/${id}`,
        `${baseUrl}/api/transaction/${id}`,
        `${baseUrl}/api/pix/${id}`,
      ];
      _debug.candidates = candidates;

      for (const ppUrl of candidates) {
        const ppRes = await fetch(ppUrl, {
          headers: { Authorization: `Bearer ${apiToken}`, Accept: "application/json" },
        });

        if (!_debug.attempts) _debug.attempts = [];
        const attempt: Record<string, unknown> = { url: ppUrl, httpStatus: ppRes.status };

        if (ppRes.ok) {
          const ppData = await ppRes.json();
          attempt.data = ppData;

          const ppStatus = String(ppData?.data?.status ?? ppData?.status ?? "");
          attempt.extractedStatus = ppStatus;

          const isPaid =
            ppStatus === "paid"     ||
            ppStatus === "PAID"     ||
            ppStatus === "approved" ||
            ppStatus === "completed";

          attempt.isPaid = isPaid;
          (_debug.attempts as Record<string, unknown>[]).push(attempt);

          if (isPaid) {
            _debug.confirmedVia = ppUrl;
            const result = await processConfirmedPayment(id);
            if (result && !result.alreadyProcessed) {
              console.log("[STATUS POLL] Pagamento confirmado via polling, url:", ppUrl);
            }
            return apiResponse({ status: 1, orderId: result?.orderId ?? null });
          }

          // Got a valid response, no need to try other endpoints
          break;
        } else {
          const errText = await ppRes.text().catch(() => "");
          attempt.errorBody = errText;
          (_debug.attempts as Record<string, unknown>[]).push(attempt);
        }
      }
    }
  } catch (e) {
    _debug.error = String(e);
    console.error("[STATUS POLL] Erro ao consultar PushinPay:", e);
  }

  return apiResponse({
    status: transaction.status,
    orderId: transaction.orderId,
    ...(process.env.NODE_ENV !== "production" && { _debug }),
  });
}
