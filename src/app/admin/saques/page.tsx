export const dynamic = "force-dynamic";

import React from "react";
import { getPayouts } from "./actions";
import PayoutsClient from "./PayoutsClient";

export const metadata = {
  title: "Gestão de Saques | Painel Admin SeguiFacil",
  description: "Gerencie saques de afiliados.",
};

export default async function AdminPayoutsPage() {
  const payouts = await getPayouts();

  return (
    <div className="bg-surface/50 min-h-screen">
      <PayoutsClient initialPayouts={payouts} />
    </div>
  );
}
