export const dynamic = "force-dynamic";

import React from "react";
import { getUsers } from "./actions";
import UsersClient from "./UsersClient";

export const metadata = {
  title: "Gestão de Usuários | Painel Admin SeguiFacil",
  description: "Gerencie permissões, perfis e status dos usuários do SeguiFacil.",
};

export default async function AdminUsersPage() {
  // Busca inicial de usuários no servidor (SSR)
  const users = await getUsers();

  return (
    <div className="bg-surface/50 min-h-screen">
      <UsersClient 
        initialUsers={users}
      />
    </div>
  );
}
