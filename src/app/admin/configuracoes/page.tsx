import React from "react";
import { getSettings, getApiProviders } from "./actions";
import SettingsClient from "@/components/admin/settings/SettingsClient";

export const metadata = {
  title: "Configurações Gerais | Painel Admin SeguiFacil",
  description: "Gerencie a identidade, provedores e marketing do SeguiFacil.",
};

export default async function AdminSettingsPage() {
  // Busca inicial de configurações e provedores no servidor (SSR)
  const [settings, providers] = await Promise.all([
    getSettings(),
    getApiProviders()
  ]);

  return (
    <div className="bg-surface/50 min-h-screen">
      <SettingsClient 
        initialSettings={settings}
        initialProviders={providers}
      />
    </div>
  );
}
