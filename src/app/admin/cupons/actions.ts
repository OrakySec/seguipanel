"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCoupons() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });
  return coupons.map((c: any) => ({
    ...c,
    value: Number(c.value),
  }));
}

export async function upsertCoupon(data: {
  id?: number;
  code: string;
  name: string;
  value: number;
  usageLimit: number;
  isActive: boolean;
  expiresAt: string | null;
}) {
  try {
    const payload = {
      code: data.code.toUpperCase().trim(),
      name: data.name.trim(),
      type: "percentage",
      value: data.value,
      usageLimit: data.usageLimit,
      isActive: data.isActive,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    };

    if (data.id) {
      await prisma.coupon.update({ where: { id: data.id }, data: payload });
    } else {
      await prisma.coupon.create({ data: payload });
    }

    revalidatePath("/admin/cupons");
    return { success: true };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { success: false, error: "Já existe um cupom com esse código." };
    }
    return { success: false, error: "Falha ao salvar cupom." };
  }
}

export async function toggleCouponStatus(id: number, current: boolean) {
  try {
    await prisma.coupon.update({ where: { id }, data: { isActive: !current } });
    revalidatePath("/admin/cupons");
    return { success: true };
  } catch {
    return { success: false, error: "Falha ao alterar status." };
  }
}

export async function deleteCoupon(id: number) {
  try {
    await prisma.coupon.delete({ where: { id } });
    revalidatePath("/admin/cupons");
    return { success: true };
  } catch {
    return { success: false, error: "Falha ao excluir cupom." };
  }
}
