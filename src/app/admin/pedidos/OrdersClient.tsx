"use client";

import React, { useState } from "react";
import { Trash2, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";
import { deleteOrder } from "@/app/admin/usuarios/actions";
import { formatBRL, formatDate } from "@/lib/utils";

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

export default function OrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const { toast } = useToast();
  const [orders, setOrders] = useState(initialOrders);

  const handleDelete = async (id: number) => {
    if (!confirm(`Excluir permanentemente o pedido #${id}?`)) return;
    const result = await deleteOrder(id);
    if (result.success) {
      setOrders(prev => prev.filter(o => o.id !== id));
      toast("success", `Pedido #${id} excluído.`);
    } else {
      toast("error", "Erro ao excluir pedido", result.error);
    }
  };

  if (orders.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="px-8 py-24 text-center opacity-30">
          <div className="flex flex-col items-center gap-4">
            <span className="text-muted text-sm font-black uppercase tracking-widest">Nenhum pedido</span>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <>
      {orders.map((order: any) => (
        <tr key={order.id} className="hover:bg-surface/40 transition-colors group">
          <td className="px-8 py-6">
            <p className="text-sm font-black text-foreground mb-1 leading-tight group-hover:text-primary transition-colors">#{order.id}</p>
            <p className="text-[10px] font-bold text-muted uppercase tracking-tighter">{formatDate(order.createdAt)}</p>
          </td>
          <td className="px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-surface border border-border flex items-center justify-center text-muted group-hover:bg-primary-light group-hover:text-primary transition-all shadow-sm text-xs font-black">
                {(order.user?.email?.[0] ?? "?").toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black truncate text-foreground leading-tight">{order.user?.email}</p>
                <p className="text-[10px] font-bold text-muted truncate mt-1 uppercase tracking-tighter">{order.user?.whatsapp || "Sem whats"}</p>
              </div>
            </div>
          </td>
          <td className="px-8 py-6">
            <p className="text-sm font-black text-foreground mb-1.5 leading-tight truncate max-w-[200px]">{order.service?.name}</p>
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-[9px] font-black text-primary uppercase bg-primary-light px-2 py-0.5 rounded-lg border border-primary/10 shrink-0">
                {order.service?.category?.socialNetwork?.name}
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
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => handleDelete(order.id)}
                className="h-11 w-11 flex items-center justify-center rounded-2xl border border-border text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all shadow-sm opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
              <Link
                href={`/admin/pedidos/${order.id}`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border text-muted hover:text-primary hover:bg-card transition-all shadow-sm group-hover:scale-105"
              >
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
