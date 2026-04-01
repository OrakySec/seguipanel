import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError } from "@/lib/utils";

// Polling de status — chamado pelo frontend a cada 3s
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const transactionId = Number(id);

  if (isNaN(transactionId)) return apiError("ID inválido");

  const transaction = await prisma.transactionLog.findUnique({
    where: { id: transactionId },
    select: { status: true, orderId: true },
  });

  if (!transaction) return apiError("Transação não encontrada", 404);

  return apiResponse({
    status: transaction.status, // 0 = pendente, 1 = pago
    orderId: transaction.orderId,
  });
}
