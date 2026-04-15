"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

const STATUSES = [
  { value: "pending",    label: "Pendente",     bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-200",   activeBg: "bg-amber-500",   activeText: "text-white" },
  { value: "processing", label: "Processando",  bg: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-200",    activeBg: "bg-blue-500",    activeText: "text-white" },
  { value: "inprogress", label: "Em Andamento", bg: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-200",    activeBg: "bg-blue-500",    activeText: "text-white" },
  { value: "completed",  label: "Concluído",    bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", activeBg: "bg-emerald-500", activeText: "text-white" },
  { value: "partial",    label: "Parcial",      bg: "bg-orange-50",  text: "text-orange-600",  border: "border-orange-200",  activeBg: "bg-orange-500",  activeText: "text-white" },
  { value: "canceled",   label: "Cancelado",    bg: "bg-red-50",     text: "text-red-600",     border: "border-red-200",     activeBg: "bg-red-500",     activeText: "text-white" },
  { value: "refunded",   label: "Reembolsado",  bg: "bg-zinc-100",   text: "text-zinc-500",    border: "border-zinc-200",    activeBg: "bg-zinc-500",    activeText: "text-white" },
];

function navigate(q: string, status: string) {
  const url = new URL("/admin/pedidos", window.location.origin);
  if (q) url.searchParams.set("q", q);
  if (status) url.searchParams.set("status", status);
  window.location.href = url.toString();
}

export default function SearchBar({ activeStatus }: { activeStatus?: string }) {
  const searchParams = useSearchParams();
  const currentQ = searchParams.get("q") ?? "";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const val = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value.trim();
    navigate(val, activeStatus ?? "");
  }

  function handlePill(value: string) {
    // Toggle: clicando no pill ativo remove o filtro
    const next = activeStatus === value ? "" : value;
    navigate(currentQ, next);
  }

  return (
    <div className="flex flex-col gap-3 items-end">
      {/* Pills de status */}
      <div className="flex flex-wrap gap-2 justify-end">
        {STATUSES.map((s) => {
          const isActive = activeStatus === s.value;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => handlePill(s.value)}
              className={`h-8 px-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                isActive
                  ? `${s.activeBg} ${s.activeText} border-transparent shadow-sm`
                  : `${s.bg} ${s.text} ${s.border} hover:opacity-80`
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Barra de busca */}
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            name="q"
            type="text"
            defaultValue={currentQ}
            placeholder="Buscar por #ID ou e-mail..."
            className="pl-12 pr-4 h-12 bg-card border border-border rounded-2xl text-sm focus:ring-4 focus:ring-primary/5 outline-none transition-all w-72 font-bold"
          />
        </div>
      </form>
    </div>
  );
}
