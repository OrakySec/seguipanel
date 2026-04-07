export const dynamic = "force-dynamic";

import React from "react";
import { getSocialNetworksWithCategories } from "./actions";
import CategoriesClient from "@/components/admin/categories/CategoriesClient";

export const metadata = {
  title: "Gestão de Categorias | Painel Admin SeguiFacil",
  description: "Organize as redes sociais e as categorias de serviços do seu painel.",
};

export default async function AdminCategoriesPage() {
  // Busca inicial de redes e categorias no servidor (SSR)
  const socialNetworks = await getSocialNetworksWithCategories();

  return (
    <div className="bg-surface/50 min-h-screen">
      <CategoriesClient 
        initialSocialNetworks={socialNetworks}
      />
    </div>
  );
}
