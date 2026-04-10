"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function SearchBar() {
  const searchParams = useSearchParams();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const val = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value.trim();
    const url = val
      ? `/admin/pedidos?q=${encodeURIComponent(val)}`
      : "/admin/pedidos";
    window.location.href = url;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        <input
          name="q"
          type="text"
          defaultValue={searchParams.get("q") ?? ""}
          placeholder="Buscar por #ID ou e-mail..."
          className="pl-12 pr-4 h-12 bg-card border border-border rounded-2xl text-sm focus:ring-4 focus:ring-primary/5 outline-none transition-all w-72 font-bold"
        />
      </div>
    </form>
  );
}
