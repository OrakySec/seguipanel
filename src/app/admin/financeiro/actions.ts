"use server";

import { prisma } from "@/lib/prisma";

/**
 * Busca estatísticas financeiras agregadas
 */
export async function getFinanceStats() {
  const now = new Date();
  
  // Início e Fim do Dia de Hoje
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  // Início e Fim do Mês Atual
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  // Faturamento Hoje (Apenas Pago - status: 1, excluindo cancelados/parciais)
  const todaySales = await prisma.transactionLog.aggregate({
    where: {
      status: 1,
      createdAt: { gte: todayStart, lte: todayEnd },
      NOT: { order: { status: { in: ["canceled", "partial"] } } }
    },
    _sum: { amount: true }
  });

  // Faturamento Mês (Apenas Pago - status: 1, excluindo cancelados/parciais)
  const monthSales = await prisma.transactionLog.aggregate({
    where: {
      status: 1,
      createdAt: { gte: monthStart, lte: monthEnd },
      NOT: { order: { status: { in: ["canceled", "partial"] } } }
    },
    _sum: { amount: true }
  });

  // Faturamento Total (Apenas Pago - status: 1, excluindo cancelados/parciais)
  const totalSales = await prisma.transactionLog.aggregate({
    where: {
      status: 1,
      NOT: { order: { status: { in: ["canceled", "partial"] } } }
    },
    _sum: { amount: true }
  });

  // Pedidos Pendentes (status: 0)
  const pendingAmount = await prisma.transactionLog.aggregate({
    where: {
      status: 0
    },
    _sum: { amount: true }
  });

  return {
    today: Number(todaySales._sum.amount || 0),
    month: Number(monthSales._sum.amount || 0),
    total: Number(totalSales._sum.amount || 0),
    pending: Number(pendingAmount._sum.amount || 0)
  };
}

/**
 * Busca lista de transações com filtros
 */
export async function getTransactions(filters?: {
  status?: string;
  type?: string;
  search?: string;
}) {
  const where: any = {};

  if (filters?.status && filters.status !== "all") {
    where.status = filters.status === "COMPLETED" ? 1 : 0;
  }

  if (filters?.search) {
    where.OR = [
      { user: { email: { contains: filters.search, mode: "insensitive" } } },
      { transactionId: { contains: filters.search, mode: "insensitive" } }
    ];
  }

  const transactions = await prisma.transactionLog.findMany({
    where,
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return transactions.map((t: any) => ({
    ...t,
    refundAmount: t.refundAmount ? Number(t.refundAmount) : null
  }));
}
