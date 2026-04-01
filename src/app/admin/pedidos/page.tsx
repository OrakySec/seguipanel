import React from "react";
import { prisma } from "@/lib/prisma";
import { formatBRL, formatDate } from "@/lib/utils";
import { 
  Package, 
  Search, 
  Filter, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  TrendingUp,
  User
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  // Buscar pedidos reais ordenados pelos mais recentes
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
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "processing": return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "canceled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const statusMap: Record<string, string> = {
    pending: "Pendente",
    processing: "Em Processamento",
    inprogress: "Em Andamento",
    completed: "Concluído",
    partial: "Parcial",
    canceled: "Cancelado",
    refunded: "Reembolsado"
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-jakarta font-extrabold text-foreground mb-1">
            Gestão de Pedidos
          </h2>
          <p className="text-muted text-sm font-medium">
            Acompanhe e gerencie as entregas em tempo real.
          </p>
        </div>
        <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input 
                type="text" 
                placeholder="Buscar pedido #ID..."
                className="pl-10 pr-4 h-11 bg-white border border-brand/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-60 shadow-sm"
              />
            </div>
            <button className="h-11 px-4 bg-white border border-brand/10 rounded-xl text-muted hover:text-primary transition-colors flex items-center gap-2 font-bold text-sm shadow-sm">
               <Filter size={16} /> Filtros
            </button>
        </div>
      </header>

      {/* Tabela de Pedidos */}
      <div className="bg-white rounded-[32px] border border-brand/10 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface/50 border-b border-brand/10">
                <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-muted">ID / Data</th>
                <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-muted">Cliente</th>
                <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-muted">Serviço / Link</th>
                <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-muted">Valor</th>
                <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-muted">Status</th>
                <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-muted text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand/10">
              {orders.length > 0 ? orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface/30 transition-colors group">
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-foreground mb-0.5">#{order.id}</p>
                    <p className="text-[10px] font-medium text-muted">{formatDate(order.createdAt)}</p>
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-muted group-hover:bg-primary-light group-hover:text-primary transition-colors">
                           <User size={16} />
                        </div>
                        <div className="min-w-0">
                           <p className="text-sm font-bold truncate text-foreground">{order.user.email}</p>
                           <p className="text-[10px] font-medium text-muted truncate">{order.user.whatsapp || "Sem WhatsApp"}</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-foreground mb-1 leading-tight">{order.service.name}</p>
                    <div className="flex items-center gap-1.5 overflow-hidden">
                       <span className="text-[10px] font-extrabold text-primary uppercase bg-primary-light px-1.5 py-0.5 rounded leading-none shrink-0 border border-primary/10">
                          {order.service.category.socialNetwork.name}
                       </span>
                       <p className="text-[10px] font-medium text-muted truncate">{order.link}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <p className="text-sm font-bold text-foreground">{formatBRL(Number(order.charge))}</p>
                    <p className="text-[10px] font-medium text-muted uppercase">BRL Pix</p>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tight border ${getStatusStyle(order.status)}`}>
                      {statusMap[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link 
                      href={`/admin/pedidos/${order.id}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-brand/10 text-muted hover:text-primary hover:bg-primary-light transition-all shadow-sm"
                      title="Ver Detalhes"
                    >
                      <ArrowUpRight size={16} />
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center text-muted/30">
                          <Package size={32} />
                       </div>
                       <p className="text-sm text-muted font-bold italic">Nenhum pedido realizado ainda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginação Mock */}
        <div className="px-8 py-6 bg-surface/30 border-t border-brand/10 flex items-center justify-between">
           <p className="text-xs font-bold text-muted uppercase tracking-tight">Mostrando {orders.length} pedidos recentes</p>
           <div className="flex gap-2">
              <button disabled className="h-9 px-4 rounded-xl border border-brand/10 text-xs font-bold text-muted opacity-50">Anterior</button>
              <button className="h-9 px-4 rounded-xl border border-brand/10 text-xs font-bold text-primary hover:bg-white transition-colors">Próximo</button>
           </div>
        </div>
      </div>
    </div>
  );
}

function ArrowUpRight({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  );
}
