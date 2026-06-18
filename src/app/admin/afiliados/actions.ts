"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminOrSupporter } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getAffiliates() {
  await requireAdminOrSupporter();

  const affiliates = await prisma.user.findMany({
    where: { role: "AFFILIATE" },
    select: {
      id: true,
      email: true,
      firstName: true,
      whatsapp: true,
      affiliateCode: true,
      commissionRate: true,
      balance: true,
      pixKey: true,
      status: true,
      createdAt: true,
      _count: {
        select: {
          referredOrders: { where: { commissionPaid: true } },
          affiliateClicks: true,
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch global rate to show if specific is null
  const globalRateSetting = await prisma.setting.findUnique({ where: { key: "affiliate_commission_rate" } });
  const globalRate = globalRateSetting?.value || "10";

  return affiliates.map(a => ({
    ...a,
    globalRate,
  }));
}

export async function updateAffiliate(id: number, data: { commissionRate: number | null, status: number }) {
  await requireAdminOrSupporter();

  try {
    await prisma.user.update({
      where: { id },
      data: {
        commissionRate: data.commissionRate,
        status: data.status,
      },
    });

    revalidatePath("/admin/afiliados");
    return { success: true };
  } catch (err: any) {
    console.error("[UPDATE_AFFILIATE]", err);
    return { success: false, error: err.message || "Erro ao atualizar afiliado." };
  }
}
