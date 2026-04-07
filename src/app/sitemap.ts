import type { MetadataRoute } from "next";
import { getActiveSocialNetworks } from "@/lib/catalog";

const BASE_URL = "https://seguifacil.online";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const platforms = await getActiveSocialNetworks().catch(() => []);

  const platformPages: MetadataRoute.Sitemap = platforms
    .filter((p) => p.urlSlug != null)
    .map((p) => ({
      url: `${BASE_URL}/comprar-seguidores-${p.urlSlug as string}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
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
  ];
}
