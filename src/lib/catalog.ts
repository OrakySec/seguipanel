import { prisma } from "./prisma";

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

export async function getActiveSocialNetworks() {
  const networks = await prisma.socialNetwork.findMany({
    where: {
      status: 1,
      categories: {
        some: {
          status: 1,
          services: {
            some: {
              status: 1
            }
          }
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
    // Find the minimum price among all services in all categories for this network
    // (Though we already took the first one per category above)
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
}

export async function getActivityFeedServices() {
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
}

export async function getBestSellerServices() {
  const services = await prisma.service.findMany({
    where: {
      status: 1,
      isBestSeller: true
    },
    include: {
      category: {
        include: {
          socialNetwork: true
        }
      }
    },
    take: 8 // Limit to 8 best sellers on home
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
      // Default badges if none present? Or map from data?
      badges: s.description?.toLowerCase().includes("brasileiro") ? ["Brasileiros"] : ["Qualidade"],
      stars: 5, // Static for now as requested or calculated
      href: `/comprar-servico/${s.id}` // Link directly to service with ID
    };
  });
}
