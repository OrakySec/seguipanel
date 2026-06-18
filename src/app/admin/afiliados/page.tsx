export const dynamic = "force-dynamic";

import React from "react";
import { getAffiliates } from "./actions";
import AffiliatesClient from "./AffiliatesClient";

export const metadata = {
  title: "Gestão de Afiliados | Painel Admin SeguiFacil",
  description: "Gerencie afiliados, comissões e métricas.",
};

export default async function AdminAffiliatesPage() {
  const affiliates = await getAffiliates();

  return (
    <div className="bg-surface/50 min-h-screen">
      <AffiliatesClient initialAffiliates={affiliates} />
    </div>
  );
}
