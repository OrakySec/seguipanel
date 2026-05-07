import { prisma } from "./prisma";
import { unstable_cache } from "next/cache";


export const SOCIAL_COLORS: Record<string, string> = {
  instagram: "#E1306C",
  tiktok:    "#010101",
  kwai:      "#FF6B00",
  youtube:   "#FF0000",
  facebook:  "#1877F2",
  default:   "#6b7280",
};

export const SOCIAL_METADATA: Record<string, { gradient: string }> = {
  instagram: {
    gradient: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
  },
  tiktok: {
    gradient: "linear-gradient(135deg, #010101 0%, #383838 100%)",
  },
  kwai: {
    gradient: "linear-gradient(135deg, #FF7000 0%, #FFAA00 100%)",
  },
  youtube: {
    gradient: "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)",
  },
  facebook: {
    gradient: "linear-gradient(135deg, #1877F2 0%, #145DBF 100%)",
  },
  default: {
    gradient: "linear-gradient(135deg, #6b7280 0%, #374151 100%)",
  },
};

export const getActiveSocialNetworks = unstable_cache(
  async () => {
    try {
      const networks = await prisma.socialNetwork.findMany({
        where: {
          status: 1,
          categories: {
            some: {
              status: 1,
              services: { some: { status: 1 } }
            }
          }
        },
        include: {
          categories: {
            where: { status: 1 },
            include: {
              services: {
                where: { status: 1 },
                orderBy: { price: 'asc' },
                take: 1
              }
            }
          }
        },
        orderBy: { sortOrder: 'asc' }
      });

      return networks.map(n => {
        const minPrice = n.categories.reduce((min, cat) => {
          const catMin = cat.services[0]?.price ? parseFloat(cat.services[0].price.toString()) : Infinity;
          return Math.min(min, catMin);
        }, Infinity);

        const metadata = SOCIAL_METADATA[n.urlSlug?.toLowerCase() || ""] || SOCIAL_METADATA.default;

        return {
          id: n.id,
          name: n.name,
          urlSlug: n.urlSlug,
          description: n.description,
          fromPrice: minPrice !== Infinity ? `R$${minPrice.toFixed(2).replace('.', ',')}` : "Sob consulta",
          gradient: metadata.gradient
        };
      });
    } catch (error) {
      console.error("Error fetching networks during build/render:", error);
      return []; // Return empty array to avoid breaking the build
    }
  },
  ["active_social_networks"],
  { revalidate: 3600, tags: ["catalog"] }
);

export const getActivityFeedServices = unstable_cache(
  async () => {
    try {
      const services = await prisma.service.findMany({
        where: { status: 1 },
        include: {
          category: {
            include: { socialNetwork: true },
          },
        },
        orderBy: { id: "asc" },
      });

      return services.map((s) => {
        const slug = s.category.socialNetwork.urlSlug?.toLowerCase() || "default";
        return {
          serviceName: s.name,
          platform:    s.category.socialNetwork.name,
          platformSlug: slug,
          platformColor: SOCIAL_COLORS[slug] ?? SOCIAL_COLORS.default,
          platformBg:    (SOCIAL_METADATA[slug] ?? SOCIAL_METADATA.default).gradient,
        };
      });
    } catch (error) {
      console.error("Error fetching feed services during build:", error);
      return [];
    }
  },
  ["activity_feed_services"],
  { revalidate: 3600, tags: ["catalog"] }
);

export const getBestSellerServices = unstable_cache(
  async () => {
    try {
      const services = await prisma.service.findMany({
        where: {
          status: 1,
          isBestSeller: true
        },
        include: {
          category: {
            include: { socialNetwork: true }
          }
        },
        take: 8
      });

      return services.map(s => {
        const slug = s.category.socialNetwork.urlSlug?.toLowerCase() || "";
        const metadata = SOCIAL_METADATA[slug] || SOCIAL_METADATA.default;

        return {
          id: s.id,
          name: s.name,
          description: s.description,
          price: `R$${parseFloat(s.price.toString()).toFixed(2).replace('.', ',')}`,
          platform: s.category.socialNetwork.name,
          platformSlug: slug,
          platformGradient: metadata.gradient,
          discount: s.discount,
          badges: s.description?.toLowerCase().includes("brasileiro") ? ["Brasileiros"] : ["Qualidade"],
          stars: 5,
          href: `/comprar-servico/${s.id}`
        };
      });
    } catch (error) {
      console.error("Error fetching best sellers during build:", error);
      return [];
    }
  },
  ["best_seller_services"],
  { revalidate: 3600, tags: ["catalog"] }
);
