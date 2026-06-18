import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== "AFFILIATE" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    const affiliateId = session.userId;

    const user = await prisma.user.findUnique({
      where: { id: affiliateId },
      select: { balance: true, affiliateCode: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const clicksCount = await prisma.affiliateClick.count({
      where: { affiliateId },
    });

    const ordersAgg = await prisma.order.aggregate({
      where: { affiliateId, commissionPaid: true },
      _count: { id: true },
      _sum: { commissionAmount: true },
    });

    const pendingOrdersAgg = await prisma.order.aggregate({
      where: { affiliateId, commissionPaid: false },
      _count: { id: true },
      _sum: { commissionAmount: true },
    });

    const payoutsAgg = await prisma.payout.aggregate({
      where: { affiliateId },
      _sum: { amount: true },
    });

    const recentOrders = await prisma.order.findMany({
      where: { affiliateId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        status: true,
        commissionAmount: true,
        commissionPaid: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      balance: user.balance,
      affiliateCode: user.affiliateCode,
      stats: {
        clicks: clicksCount,
        completedOrders: ordersAgg._count.id || 0,
        totalCommissions: Number(ordersAgg._sum.commissionAmount || 0),
        pendingOrders: pendingOrdersAgg._count.id || 0,
        pendingCommissions: Number(pendingOrdersAgg._sum.commissionAmount || 0),
        totalPayouts: Number(payoutsAgg._sum.amount || 0),
      },
      recentOrders,
    });
  } catch (err) {
    console.error("[AFFILIATE DASHBOARD]", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
