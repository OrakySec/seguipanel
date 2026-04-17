import type { MetadataRoute } from "next";
import { getActiveSocialNetworks } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://seguifacil.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [platforms, blogPosts] = await Promise.all([
    getActiveSocialNetworks().catch(() => []),
    prisma.blog.findMany({
      where: { status: 1, publishedAt: { lte: new Date() } },
      select: { urlSlug: true, updatedAt: true },
    }).catch(() => []),
  ]);

  const platformPages: MetadataRoute.Sitemap = platforms
    .filter((p) => p.urlSlug != null)
    .map((p) => ({
      url: `${BASE_URL}/comprar-seguidores-${p.urlSlug as string}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));

  const blogPostPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${BASE_URL}/blog/${p.urlSlug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/servicos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cadastro`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...platformPages,
    ...blogPostPages,
  ];
}
