"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/afiliados/auth/logout", { method: "POST" });
    router.push("/afiliados");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 text-sm font-medium transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Sair
    </button>
  );
}
