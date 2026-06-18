"use server";

import { prisma } from "@/lib/prisma";
import { getSessionFromCookies } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getPayouts() {
  const session = await getSessionFromCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPPORTER")) throw new Error("Não autorizado");

  const payouts = await prisma.payout.findMany({
    include: {
      affiliate: {
        select: {
          firstName: true,
          email: true,
          whatsapp: true,
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return payouts;
}

export async function approvePayout(id: number) {
  const session = await getSessionFromCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPPORTER")) throw new Error("Não autorizado");

  try {
    const payout = await prisma.payout.findUnique({ where: { id } });
    if (!payout) throw new Error("Saque não encontrado.");
    if (payout.status !== "pending") throw new Error("Saque não está pendente.");

    await prisma.payout.update({
      where: { id },
      data: { status: "completed" },
    });

    revalidatePath("/admin/saques");
    return { success: true };
  } catch (err: any) {
    console.error("[APPROVE_PAYOUT]", err);
    return { success: false, error: err.message || "Erro ao aprovar saque." };
  }
}

export async function rejectPayout(id: number) {
  const session = await getSessionFromCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPPORTER")) throw new Error("Não autorizado");

  try {
    const payout = await prisma.payout.findUnique({ where: { id } });
    if (!payout) throw new Error("Saque não encontrado.");
    if (payout.status !== "pending") throw new Error("Saque não está pendente.");

    // Transaction to reject payout and refund balance
    await prisma.$transaction([
      prisma.payout.update({
        where: { id },
        data: { status: "rejected" },
      }),
      prisma.user.update({
        where: { id: payout.affiliateId },
        data: { balance: { increment: payout.amount } }
      })
    ]);

    revalidatePath("/admin/saques");
    return { success: true };
  } catch (err: any) {
    console.error("[REJECT_PAYOUT]", err);
    return { success: false, error: err.message || "Erro ao rejeitar saque." };
  }
}
