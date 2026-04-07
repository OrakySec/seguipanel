export const dynamic = "force-dynamic";

import React from "react";
import { prisma } from "@/lib/prisma";
import { formatBRL, formatDate } from "@/lib/utils";
import { 
  Package, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  User,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      service: { select: { name: true, category: { select: { socialNetwork: { select: { name: true } } } } } },
      user: { select: { email: true, whatsapp: true } }
    }
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "processing": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "pending": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "canceled": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  const statusMap: Record<string, string> = {
    pending: "Pendente",
    processing: "Processando",
    inprogress: "Em Andamento",
    completed: "Concluído",
    partial: "Parcial",
    canceled: "Cancelado",
    refunded: "Reembolsado"
  };

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
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input 
                type="text" 
                placeholder="Buscar pedido #ID..."
                className="pl-12 pr-4 h-12 bg-card border border-border rounded-2xl text-sm focus:ring-4 focus:ring-primary/5 outline-none transition-all w-64 font-bold"
              />
            </div>
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
              {orders.length > 0 ? (orders as any[]).map((order: any) => (
                <tr key={order.id} className="hover:bg-surface/40 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-foreground mb-1 leading-tight group-hover:text-primary transition-colors">#{order.id}</p>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-tighter">{formatDate(order.createdAt)}</p>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-surface border border-border flex items-center justify-center text-muted group-hover:bg-primary-light group-hover:text-primary transition-all shadow-sm">
                           <User size={18} />
                        </div>
                        <div className="min-w-0">
                           <p className="text-sm font-black truncate text-foreground leading-tight">{order.user.email}</p>
                           <p className="text-[10px] font-bold text-muted truncate mt-1 uppercase tracking-tighter">{order.user.whatsapp || "Sem whats"}</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-foreground mb-1.5 leading-tight truncate max-w-[200px]">{order.service.name}</p>
                    <div className="flex items-center gap-2 overflow-hidden">
                       <span className="text-[9px] font-black text-primary uppercase bg-primary-light px-2 py-0.5 rounded-lg border border-primary/10 shrink-0">
                          {order.service.category.socialNetwork.name}
                       </span>
                       <p className="text-[10px] font-bold text-muted truncate opacity-60 tracking-tighter">{order.link}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <p className="text-sm font-black text-foreground leading-tight">{formatBRL(Number(order.charge))}</p>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-tighter mt-1">PIX Pago</p>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                      {statusMap[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link 
                      href={`/admin/pedidos/${order.id}`}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border text-muted hover:text-primary hover:bg-card transition-all shadow-sm group-hover:scale-105"
                    >
                      <ArrowUpRight size={18} />
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-24 text-center opacity-30">
                    <div className="flex flex-col items-center gap-4">
                       <Package size={48} className="text-muted" />
                       <p className="text-sm font-black uppercase tracking-widest">Nenhum pedido</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginação */}
        <div className="px-10 py-8 bg-surface/30 border-t border-border flex items-center justify-between">
           <p className="text-[10px] font-black text-muted uppercase tracking-widest opacity-60">Exibindo {orders.length} resultados recentes</p>
           <div className="flex gap-3">
              <button disabled className="h-11 px-6 rounded-2xl border border-border text-[10px] font-black uppercase tracking-widest text-muted opacity-50 cursor-not-allowed">Anterior</button>
              <button className="h-11 px-6 rounded-2xl bg-card border border-border text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-surface transition-all shadow-sm">Próximo</button>
           </div>
        </div>
      </div>
    </div>
  );
}
