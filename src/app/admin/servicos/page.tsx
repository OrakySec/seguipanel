import React from "react";
import { getServices, getFormData } from "./actions";
import ServicesClient from "./ServicesClient";

export const metadata = {
  title: "Gestão de Serviços | Painel Admin SeguiFacil",
  description: "Gerencie o catálogo de serviços, preços e categorias do SeguiFacil.",
};

export default async function AdminServicesPage() {
  // Busca inicial de dados no servidor (SSR)
  const [services, formData] = await Promise.all([
    getServices(),
    getFormData()
  ]);

  return (
    <div className="bg-surface/50 min-h-screen">
      <ServicesClient 
        initialServices={services}
        socialNetworks={formData.socialNetworks}
        apiProviders={formData.apiProviders}
      />
    </div>
  );
}
