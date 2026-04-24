export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { Package } from "lucide-react";
import OrdersClient from "./OrdersClient";
import SearchBar from "./SearchBar";

const statusLabels: Record<string, string> = {
  pending:    "Pendente",
  processing: "Processando",
  inprogress: "Em Andamento",
  completed:  "Concluído",
  partial:    "Parcial",
  canceled:   "Cancelado",
  refunded:   "Reembolsado",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const term = q?.trim() ?? "";

  const numId   = term !== "" ? parseInt(term) : NaN;
  const uuidReg = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  const where: any = {};
  if (term) {
    if (!isNaN(numId)) {
      // Busca por ID do pedido
      where.id = numId;
    } else if (uuidReg.test(term)) {
      // Busca por ID de transação (PushinPay UUID)
      const txLog = await prisma.transactionLog.findFirst({
        where: { transactionId: { equals: term, mode: "insensitive" as const } },
        select: { orderId: true },
      });
      // Se encontrou o log mas o orderId ainda é null (pagamento não processado)
      // ou não encontrou nada → força resultado vazio com id impossível
      where.id = txLog?.orderId ?? -1;
    } else {
      // Busca por e-mail do cliente
      where.user = { email: { contains: term, mode: "insensitive" as const } };
    }
  }
  if (status && statusLabels[status]) {
    where.status = status;
  }

  const [whatsappActions, pendingCount] = await Promise.all([
    prisma.whatsAppAction.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, type: true, messageTemplate: true },
    }).catch(() => []),
    prisma.order.count({
      where: { type: "api", apiOrderId: 0, status: "pending" },
    }).catch(() => 0),
  ]);

  let orders: any[];
  try {
    orders = await prisma.order.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      where,
      include: {
        service: { select: { name: true, category: { select: { socialNetwork: { select: { name: true } } } } } },
        user: { select: { email: true, whatsapp: true } }
      }
    });
  } catch (e: any) {
    if (e?.code === 'P2022' && e?.meta?.column?.includes('speedRequestedAt')) {
      orders = await (prisma.order as any).findMany({
        take: 50,
        orderBy: { createdAt: "desc" },
        where,
        select: {
          id: true, userId: true, type: true, categoryId: true,
          serviceId: true, serviceType: true, apiProviderId: true,
          apiServiceId: true, apiOrderId: true, status: true,
          charge: true, link: true, quantity: true, startCounter: true,
          remains: true, note: true, lastStatusCheckAt: true,
          refillRequestedAt: true, createdAt: true, updatedAt: true,
          service: { select: { name: true, category: { select: { socialNetwork: { select: { name: true } } } } } },
          user: { select: { email: true, whatsapp: true } }
        }
      });
    } else {
      throw e;
    }
  }

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
        <Suspense fallback={
          <div className="flex gap-3">
            <div className="pl-12 pr-4 h-12 bg-card border border-border rounded-2xl w-72" />
          </div>
        }>
          <SearchBar activeStatus={status} />
        </Suspense>
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
              <OrdersClient initialOrders={serialized} actions={whatsappActions} pendingCount={pendingCount} />
            </tbody>
          </table>
        </div>
        
        {/* Paginação */}
        <div className="px-10 py-8 bg-surface/30 border-t border-border flex items-center justify-between">
           <p className="text-[10px] font-black text-muted uppercase tracking-widest opacity-60">
             {orders.length} resultado{orders.length !== 1 ? "s" : ""}
             {status && statusLabels[status] ? ` · ${statusLabels[status]}` : ""}
             {term ? ` · "${term}"` : ""}
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
