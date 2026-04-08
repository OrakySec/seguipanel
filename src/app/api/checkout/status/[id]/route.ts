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

  // Fallback: consulta a PushinPay diretamente
  try {
    const apiToken = await getSetting("api_token_pushinpay");
    const baseUrl  = await getSetting("pushinpay_base_url", "https://api.pushinpay.com.br");

    if (apiToken) {
      const ppRes = await fetch(`${baseUrl}/api/transaction/${id}`, {
        headers: { Authorization: `Bearer ${apiToken}`, Accept: "application/json" },
      });

      if (ppRes.ok) {
        const ppData   = await ppRes.json();
        const ppStatus = String(ppData?.data?.status ?? ppData?.status ?? "");
        const isPaid   =
          ppStatus === "paid"     ||
          ppStatus === "PAID"     ||
          ppStatus === "approved" ||
          ppStatus === "completed";

        if (isPaid) {
          // Usa a mesma função do webhook — cria pedido, incrementa cupom, envia notificações
          const result = await processConfirmedPayment(id);
          if (result && !result.alreadyProcessed) {
            console.log("[STATUS POLL] Pagamento confirmado via polling, transactionId:", id);
          }
          return apiResponse({ status: 1, orderId: result?.orderId ?? null });
        }
      }
    }
  } catch (e) {
    console.error("[STATUS POLL] Erro ao consultar PushinPay:", e);
  }

  return apiResponse({ status: transaction.status, orderId: transaction.orderId });
}
