import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError } from "@/lib/utils";

// Polling de status — usa o transactionId UUID da PushinPay (imprevisível, @unique)
// Evita IDOR por IDs inteiros sequenciais
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

  return apiResponse({
    status: transaction.status, // 0 = pendente, 1 = pago
    orderId: transaction.orderId,
  });
}
