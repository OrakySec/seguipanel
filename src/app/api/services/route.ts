import { apiResponse, apiError } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

// GET /api/services — lista pública de serviços agrupados por rede social
export async function GET() {
  try {
    const socialNetworks = await prisma.socialNetwork.findMany({
      where: { status: 1 },
      orderBy: { sortOrder: "asc" },
      include: {
        categories: {
          where: { status: 1 },
          orderBy: { sortOrder: "asc" },
          include: {
            services: {
              where: { status: 1 },
              orderBy: { id: "asc" },
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                originalPrice: true,
                discount: true,
                quantity: true,
                minOrder: true,
                maxOrder: true,
                type: true,
                addType: true,
              },
            },
          },
        },
      },
    });

    return apiResponse(socialNetworks);
  } catch (err) {
    console.error("[SERVICES GET]", err);
    return apiError("Erro ao buscar serviços", 500);
  }
}
