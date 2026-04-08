"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

/**
 * Busca usuários com filtros
 */
export async function getUsers(filters?: {
  role?: string;
  status?: number;
  search?: string;
}) {
  const where: any = {};

  if (filters?.role && filters.role !== "all") {
    where.role = filters.role;
  }

  if (filters?.status !== undefined) {
    where.status = filters.status;
  }

  if (filters?.search) {
    where.OR = [
      { email: { contains: filters.search, mode: "insensitive" } },
      { firstName: { contains: filters.search, mode: "insensitive" } },
      { lastName: { contains: filters.search, mode: "insensitive" } },
      { whatsapp: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      status: true,
      whatsapp: true,
      totalOrders: true,
      totalSpent: true,
      historyIp: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  return users.map((u: any) => ({
    ...u,
    totalSpent: Number(u.totalSpent)
  }));
}

/**
 * Atualiza os dados de um usuário
 */
export async function updateUser(id: number, data: any) {
  try {
    const { password, ...rest } = data;
    
    // Se houver uma nova senha, fazemos o hash
    if (password && password.trim() !== "") {
      const hash = await bcrypt.hash(password, 12);
      await prisma.user.update({
        where: { id },
        data: { ...rest, password: hash },
      });
    } else {
      await prisma.user.update({
        where: { id },
        data: rest,
      });
    }

    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return { success: false, error: "Falha ao atualizar o usuário." };
  }
}

/**
 * Alterna o status do usuário (Ativo/Inativo)
 */
export async function toggleUserStatus(id: number, currentStatus: number) {
  try {
    await prisma.user.update({
      where: { id },
      data: { status: currentStatus === 1 ? 0 : 1 },
    });
    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Falha ao mudar status do usuário." };
  }
}

/**
 * Remove um usuário e todos os dados relacionados (Hard delete)
 */
export async function deleteUser(id: number) {
  try {
    // Desvincula transaction_logs dos orders antes de deletar
    await prisma.transactionLog.updateMany({
      where: { userId: id },
      data: { orderId: null },
    });

    // Deleta transaction_logs do usuário
    await prisma.transactionLog.deleteMany({ where: { userId: id } });

    // Deleta orders do usuário
    await prisma.order.deleteMany({ where: { userId: id } });

    // Deleta user_logs
    await prisma.userLog.deleteMany({ where: { userId: id } });

    // Deleta o usuário
    await prisma.user.delete({ where: { id } });

    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return { success: false, error: "Falha ao excluir usuário." };
  }
}

/**
 * Deleta um pedido e seus transaction_logs
 */
export async function deleteOrder(id: number) {
  try {
    await prisma.transactionLog.updateMany({
      where: { orderId: id },
      data: { orderId: null },
    });
    await prisma.order.delete({ where: { id } });
    revalidatePath("/admin/pedidos");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir pedido:", error);
    return { success: false, error: "Falha ao excluir pedido." };
  }
}

/**
 * Deleta um transaction log (extrato)
 */
export async function deleteTransactionLog(id: number) {
  try {
    await prisma.transactionLog.update({
      where: { id },
      data: { orderId: null },
    });
    await prisma.transactionLog.delete({ where: { id } });
    revalidatePath("/admin/financeiro");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir transação:", error);
    return { success: false, error: "Falha ao excluir transação." };
  }
}
