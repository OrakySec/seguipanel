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
 * Remove um usuário (Hard delete)
 */
export async function deleteUser(id: number) {
  try {
    // Verificamos se existem pedidos ou logs vinculados
    const orderCount = await prisma.order.count({ where: { userId: id } });
    
    if (orderCount > 0) {
      return { success: false, error: "Não é possível excluir: usuário possui pedidos vinculados." };
    }

    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Falha ao excluir usuário." };
  }
}
