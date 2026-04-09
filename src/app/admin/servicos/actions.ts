"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Busca serviços com filtros
 */
export async function getServices(filters?: {
  socialNetworkId?: number;
  categoryId?: number;
  status?: number;
  search?: string;
}) {
  const where: any = {};

  if (filters?.socialNetworkId) {
    where.category = { socialNetworkId: filters.socialNetworkId };
  }

  if (filters?.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters?.status !== undefined) {
    where.status = filters.status;
  }

  if (filters?.search) {
    where.name = { contains: filters.search, mode: "insensitive" };
  }

  const services = await prisma.service.findMany({
    where,
    include: {
      category: {
        include: {
          socialNetwork: true
        }
      },
      apiProvider: true
    },
    orderBy: [
      { category: { socialNetwork: { sortOrder: 'asc' } } },
      { category: { sortOrder: 'asc' } },
      { id: 'asc' }
    ]
  });

  // Converte Decimal para Number/String para serialização do Next.js
  return services.map((s: any) => ({
    ...s,
    price: Number(s.price),
    originalPrice: s.originalPrice ? Number(s.originalPrice) : null,
    apiProvider: s.apiProvider ? {
      ...s.apiProvider,
      balance: s.apiProvider.balance ? Number(s.apiProvider.balance) : null,
    } : null
  }));
}

/**
 * Salva ou Atualiza um serviço
 */
export async function upsertService(data: any) {
  const { id, ...rest } = data;

  // Sempre recalcula originalPrice a partir de price + discount.
  // Fórmula: preço * (1 + desconto/100)  ex: R$105 + 87% = R$196,35
  const price    = Number(rest.price);
  const discount = Number(rest.discount ?? 0);
  rest.originalPrice =
    discount > 0
      ? price * (1 + discount / 100)
      : null;

  try {
    if (id) {
      await prisma.service.update({
        where: { id: Number(id) },
        data: rest,
      });
    } else {
      await prisma.service.create({
        data: rest,
      });
    }

    revalidatePath("/admin/servicos");
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar serviço:", error);
    return { success: false, error: "Falha ao salvar o serviço." };
  }
}

/**
 * Alterna o status do serviço (Ativo/Inativo)
 */
export async function toggleServiceStatus(id: number, currentStatus: number) {
  try {
    await prisma.service.update({
      where: { id },
      data: { status: currentStatus === 1 ? 0 : 1 },
    });
    revalidatePath("/admin/servicos");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Falha ao mudar status." };
  }
}

/**
 * Remove um serviço (Hard delete)
 */
export async function deleteService(id: number) {
  try {
    // Verificamos se existem pedidos vinculados antes de deletar
    const orderCount = await prisma.order.count({ where: { serviceId: id } });
    
    if (orderCount > 0) {
      // Se houver pedidos, apenas desativamos
      await prisma.service.update({
        where: { id },
        data: { status: 0 }
      });
      revalidatePath("/admin/servicos");
      return { success: true, message: "Serviço desativado (possui pedidos vinculados)." };
    }

    await prisma.service.delete({ where: { id } });
    revalidatePath("/admin/servicos");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Falha ao excluir serviço." };
  }
}

/**
 * Ajuste de preços em massa (por porcentagem)
 */
export async function bulkPriceAdjustment(
  percentage: number,
  filters: { socialNetworkId?: number; categoryId?: number },
  serviceIds?: number[]
) {
  try {
    const where: any = {};
    // Se vieram IDs selecionados, usa apenas eles — ignora filtro de rede
    if (serviceIds && serviceIds.length > 0) {
      where.id = { in: serviceIds };
    } else {
      if (filters.socialNetworkId) where.category = { socialNetworkId: filters.socialNetworkId };
      if (filters.categoryId) where.categoryId = filters.categoryId;
    }

    const services = await prisma.service.findMany({ where });
    
    for (const service of services) {
      const newPrice = Number(service.price) * (1 + percentage / 100);
      await prisma.service.update({
        where: { id: service.id },
        data: { price: newPrice }
      });
    }

    revalidatePath("/admin/servicos");
    return { success: true, count: services.length };
  } catch (error) {
    return { success: false, error: "Falha ao ajustar preços." };
  }
}

/**
 * Ajuste em Massa de Integração API
 */
export async function bulkApiIdAdjustment(
  serviceIds: number[],
  apiProviderId: number | null,
  apiServiceId: string
) {
  try {
    if (!serviceIds || serviceIds.length === 0) {
      return { success: false, error: "Nenhum serviço selecionado." };
    }

    await prisma.service.updateMany({
      where: { id: { in: serviceIds } },
      data: {
        addType: 'API',
        apiProviderId: apiProviderId || null,
        apiServiceId: apiServiceId || ""
      }
    });

    revalidatePath("/admin/servicos");
    return { success: true, count: serviceIds.length };
  } catch (error) {
    console.error("Erro no ajuste em massa API", error);
    return { success: false, error: "Falha ao ajustar integração API." };
  }
}

/**
 * Busca Redes Sociais e Categorias para o formulário
 */
export async function getFormData() {
  const socialNetworks = await prisma.socialNetwork.findMany({
    where: { status: 1 },
    include: { categories: true },
    orderBy: { sortOrder: 'asc' }
  });

  const apiProviders = await prisma.apiProvider.findMany({
    where: { status: 1 }
  });

  return { 
    socialNetworks, 
    apiProviders: apiProviders.map((p: any) => ({
        ...p,
        balance: p.balance ? Number(p.balance) : null
    }))
  };
}
