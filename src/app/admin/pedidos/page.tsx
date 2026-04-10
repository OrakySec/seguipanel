export const dynamic = "force-dynamic";

import React from "react";
import { prisma } from "@/lib/prisma";
import { Package, Filter } from "lucide-react";
import OrdersClient from "./OrdersClient";
import SearchBar from "./SearchBar";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const term = q?.trim() ?? "";

  const numId = term !== "" ? parseInt(term) : NaN;
  const where = term
    ? !isNaN(numId)
      ? { id: numId }
      : { user: { email: { contains: term, mode: "insensitive" as const } } }
    : {};

  const orders = await prisma.order.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    where,
    include: {
      service: { select: { name: true, category: { select: { socialNetwork: { select: { name: true } } } } } },
      user: { select: { email: true, whatsapp: true } }
    }
  });

  const serialized = orders.map((o: any) => ({
    ...o,
    charge: Number(o.charge),
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    lastStatusCheckAt: o.lastStatusCheckAt ? o.lastStatusCheckAt.toISOString() : null,
  }));

  return (
    <div className="space-y-10 animate-fade-in-up">
      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground mb-1">
            Gestão de Pedidos
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted">
            Acompanhamento de entregas em tempo real
          </p>
        </div>
        <div className="flex gap-3">
            <SearchBar />
            <button className="h-12 px-6 bg-card border border-border rounded-2xl text-muted hover:text-foreground transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-sm">
               <Filter size={16} /> Filtros
            </button>
        </div>
      </header>

      {/* Tabela de Pedidos */}
      <div className="bg-card rounded-[2.5rem] border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface/50 border-b border-border">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">ID / Data</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Cliente</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Serviço / Link</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Valor</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <OrdersClient initialOrders={serialized} />
            </tbody>
          </table>
        </div>
        
        {/* Paginação */}
        <div className="px-10 py-8 bg-surface/30 border-t border-border flex items-center justify-between">
           <p className="text-[10px] font-black text-muted uppercase tracking-widest opacity-60">
             {term ? `${orders.length} resultado${orders.length !== 1 ? "s" : ""} para "${term}"` : `Exibindo ${orders.length} resultados recentes`}
           </p>
           <div className="flex gap-3">
              <button disabled className="h-11 px-6 rounded-2xl border border-border text-[10px] font-black uppercase tracking-widest text-muted opacity-50 cursor-not-allowed">Anterior</button>
              <button className="h-11 px-6 rounded-2xl bg-card border border-border text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-surface transition-all shadow-sm">Próximo</button>
           </div>
        </div>
      </div>
    </div>
  );
}
