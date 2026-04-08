import { prisma } from "@/lib/prisma";
import { sendOrderConfirmedEmail } from "@/lib/email";
import { sendEvolutionFlow } from "@/lib/evolution";

/**
 * Processa um pagamento confirmado: marca a transação como paga, cria o pedido,
 * incrementa o cupom e dispara notificações. Idempotente — seguro chamar múltiplas vezes.
 *
 * @returns { orderId, alreadyProcessed } ou null se a transação não existir
 */
export async function processConfirmedPayment(pushinpayTransactionId: string): Promise<{
  orderId: number | null;
  alreadyProcessed: boolean;
} | null> {
  const transaction = await prisma.transactionLog.findUnique({
    where: { transactionId: pushinpayTransactionId.toLowerCase() },
  });

  if (!transaction) return null;

  // Idempotência — já foi processado
  if (transaction.status === 1) {
    return { orderId: transaction.orderId, alreadyProcessed: true };
  }

  // Marcar como pago (status=1)
  await prisma.transactionLog.update({
    where: { id: transaction.id },
    data: { status: 1 },
  });

  // Criar pedido
  const details = transaction.orderDetails as Record<string, unknown>;
  const serviceId = details.serviceId as number;
  const link      = details.link as string;
  const quantity  = details.quantity as string | undefined;
  const email     = (details.email as string) ?? "";
  const couponCode = details.couponCode as string | undefined;

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { apiProvider: true },
  });

  if (!service) {
    console.error("[PAYMENT] Serviço não encontrado para transação", transaction.id);
    return { orderId: null, alreadyProcessed: false };
  }

  const order = await prisma.order.create({
    data: {
      userId:       transaction.userId,
      serviceId:    service.id,
      categoryId:   service.categoryId,
      type:         service.addType === "API" ? "api" : "direct",
      serviceType:  service.type,
      apiProviderId: service.apiProviderId ?? undefined,
      apiServiceId:  service.apiServiceId  ?? undefined,
      link,
      quantity: quantity ?? String(service.quantity),
      charge:   transaction.amount,
      status:   "pending",
    },
  });

  // Vincular order à transação
  await prisma.transactionLog.update({
    where: { id: transaction.id },
    data:  { orderId: order.id },
  });

  // Atualizar totais do usuário
  await prisma.user.update({
    where: { id: transaction.userId },
    data: {
      totalOrders: { increment: 1 },
      totalSpent:  { increment: transaction.amount },
    },
  });

  // Incrementar cupom se houver
  if (couponCode) {
    await prisma.coupon.updateMany({
      where: { code: couponCode, isActive: true },
      data:  { usedCount: { increment: 1 } },
    });
  }

  // Notificações (não bloqueiam)
  const serviceName = service.name ?? "Serviço";

  if (email) {
    sendOrderConfirmedEmail(email, order, serviceName).catch(
      (e) => console.error("[PAYMENT] Email error:", e)
    );
  }

  const phone = (details.whatsapp as string | undefined)?.replace(/\D/g, "");
  if (phone) {
    const userName = await prisma.user
      .findUnique({ where: { id: transaction.userId }, select: { firstName: true } })
      .then((u) => u?.firstName ?? "Cliente");

    sendEvolutionFlow(phone, "evolution_msg_order_confirmed", {
      nome:    userName,
      orderId: String(order.id),
      valor:   `R$ ${transaction.amount.toFixed(2)}`,
      servico: serviceName,
    }).catch((e) => console.error("[PAYMENT] Evolution error:", e));
  }

  return { orderId: order.id, alreadyProcessed: false };
}
