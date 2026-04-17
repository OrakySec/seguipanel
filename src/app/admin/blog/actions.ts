"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

export async function getBlogs() {
  return prisma.blog.findMany({ orderBy: { createdAt: "desc" } });
}

export async function upsertBlog(data: {
  id?: number;
  title: string;
  urlSlug?: string;
  category?: string;
  image?: string;
  content: string;
  metaDescription?: string;
  metaKeywords?: string;
  status: number;
  publishedAt?: string | null;
}) {
  const slug = (data.urlSlug?.trim() || slugify(data.title));
  const payload = {
    title: data.title.trim(),
    urlSlug: slug,
    category: data.category?.trim() || null,
    image: data.image?.trim() || null,
    content: data.content,
    metaDescription: data.metaDescription?.trim() || null,
    metaKeywords: data.metaKeywords?.trim() || null,
    status: data.status,
    publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
  };

  try {
    if (data.id) {
      await prisma.blog.update({ where: { id: data.id }, data: payload });
    } else {
      await prisma.blog.create({ data: payload });
    }
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true };
  } catch (error: any) {
    if (error?.code === "P2002") return { success: false, error: "Já existe um post com esse slug." };
    return { success: false, error: "Falha ao salvar post." };
  }
}

export async function deleteBlog(id: number) {
  try {
    await prisma.blog.delete({ where: { id } });
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true };
  } catch {
    return { success: false, error: "Falha ao excluir post." };
  }
}
