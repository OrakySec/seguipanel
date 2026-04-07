"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Busca todas as redes sociais com suas categorias incluídas
 */
export async function getSocialNetworksWithCategories() {
  return await prisma.socialNetwork.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      categories: {
        orderBy: { sortOrder: "asc" },
        include: {
          _count: { select: { services: true } }
        }
      }
    }
  });
}

/**
 * Cria ou atualiza uma rede social
 */
export async function upsertSocialNetwork(id: number | null, data: any) {
  try {
    if (id) {
      await prisma.socialNetwork.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          image: data.icon,
          sortOrder: Number(data.sortOrder ?? 0),
          status: Number(data.status ?? 1)
        }
      });
    } else {
      await prisma.socialNetwork.create({
        data: {
          name: data.name,
          description: data.description,
          image: data.icon,
          sortOrder: Number(data.sortOrder ?? 0),
          status: Number(data.status ?? 1)
        }
      });
    }
    revalidatePath("/admin/categorias");
    revalidatePath("/admin/servicos"); // Para atualizar as opções lá também
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar rede social:", error);
    return { success: false, error: "Falha ao salvar a rede social." };
  }
}

/**
 * Exclui uma rede social
 */
export async function deleteSocialNetwork(id: number) {
  try {
    // Verifica se há categorias vinculadas
    const categoryCount = await prisma.category.count({ where: { socialNetworkId: id } });
    if (categoryCount > 0) {
      return { success: false, error: "Não é possível excluir: remova as categorias desta rede primeiro." };
    }

    await prisma.socialNetwork.delete({ where: { id } });
    revalidatePath("/admin/categorias");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao excluir a rede social." };
  }
}

/**
 * Cria ou atualiza uma categoria dentro de uma rede
 */
export async function upsertCategory(id: number | null, socialNetworkId: number, data: any) {
  try {
    if (id) {
      await prisma.category.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          sortOrder: Number(data.sortOrder ?? 0),
          status: Number(data.status ?? 1)
        }
      });
    } else {
      await prisma.category.create({
        data: {
          socialNetworkId,
          name: data.name,
          description: data.description,
          sortOrder: Number(data.sortOrder ?? 0),
          status: Number(data.status ?? 1)
        }
      });
    }
    revalidatePath("/admin/categorias");
    revalidatePath("/admin/servicos");
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar categoria:", error);
    return { success: false, error: "Falha ao salvar a categoria." };
  }
}

/**
 * Exclui uma categoria
 */
export async function deleteCategory(id: number) {
  try {
    // Verifica se há serviços vinculados
    const serviceCount = await prisma.service.count({ where: { categoryId: id } });
    if (serviceCount > 0) {
      return { success: false, error: "Não é possível excluir: existem serviços vinculados a esta categoria." };
    }

    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categorias");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao excluir a categoria." };
  }
}
