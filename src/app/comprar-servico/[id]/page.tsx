export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ServiceRedirectPage({ params }: Props) {
  const { id } = await params;
  const serviceId = parseInt(id);

  if (isNaN(serviceId)) {
    return notFound();
  }

  // Buscar o serviço e suas relações para montar a URL de checkout
  const service = await prisma.service.findUnique({
    where: { id: serviceId, status: 1 },
    include: {
      category: {
        include: {
          socialNetwork: true,
        },
      },
    },
  });

  if (!service) {
    return notFound();
  }

  const platformName = service.category.socialNetwork.name;
  const serviceName = service.name;
  const price = service.price.toString();
  const qty = service.quantity || "";

  const requiredField = service.category.requiredField || "Link do Perfil";

  // Redirecionar para a página de checkout com os parâmetros necessários
  const checkoutUrl = `/checkout?service=${serviceId}&name=${encodeURIComponent(serviceName)}&platform=${encodeURIComponent(platformName)}&price=${price}&qty=${encodeURIComponent(qty)}&requiredField=${encodeURIComponent(requiredField)}`;

  redirect(checkoutUrl);
}
