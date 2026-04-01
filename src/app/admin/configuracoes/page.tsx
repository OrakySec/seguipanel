import React from "react";
import { prisma } from "@/lib/prisma";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  // Buscar todas as configurações atuais
  const settings = await prisma.setting.findMany({
    orderBy: { key: "asc" }
  });

  // Converter para objeto para facilitar o uso no form
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="p-8 space-y-8">
      <header>
        <h2 className="text-2xl font-jakarta font-extrabold text-foreground mb-1">
          Configurações do Sistema
        </h2>
        <p className="text-muted text-sm font-medium">
          Gerencie as 111 chaves de controle da sua plataforma SMM.
        </p>
      </header>

      <SettingsForm initialSettings={settingsMap} />
    </div>
  );
}
