export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { 
  Search, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  MessageCircle,
  ExternalLink
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSetting } from "@/lib/settings";
import { formatBRL, formatDate } from "@/lib/utils";
import { RefillButton } from "./RefillButton";

interface SearchParams {
  email?: string;
}

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { email } = await searchParams;
  const siteName = await getSetting("site_name", "SeguiFacil");
  const whatsapp = await getSetting("whatsapp_number", "558193886173");
  const refillActive = (await getSetting("refill_active", "0")) === "1";
  const intervalDays = Number(await getSetting("refill_interval_days", "7"));
  const maxDays = Number(await getSetting("refill_max_days", "30"));

  let orders: any[] | null = null;
  let error = null;

  if (email) {
    orders = await prisma.order.findMany({
      where: { user: { email } },
      include: {
        service: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!orders || orders.length === 0) {
      error = "Nenhum pedido encontrado para o e-mail informado.";
      orders = null;
    }
  }

  const isRefillEligible = (order: any) => {
    if (!refillActive) return false;
    if (order.status !== "completed") return false;
    if (order.type !== "api" || !order.apiOrderId || order.apiOrderId === 0) return false;
    const now = Date.now();
    const daysSinceCreation = (now - new Date(order.createdAt).getTime()) / 86400000;
    const daysSinceLastRefill = order.refillRequestedAt
      ? (now - new Date(order.refillRequestedAt).getTime()) / 86400000
      : Infinity;
    return daysSinceCreation <= maxDays && daysSinceLastRefill >= intervalDays;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-success bg-green-50 border-green-200";
      case "processing": return "text-primary bg-primary-light border-primary/20";
      case "pending": return "text-amber-600 bg-amber-50 border-amber-200";
      case "canceled": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-muted bg-surface border-brand/10";
    }
  };

  const statusMap: Record<string, string> = {
    pending: "Aguardando Entrega",
    processing: "Em Processamento",
    inprogress: "Em Andamento",
    completed: "Concluído com Sucesso",
    partial: "Concluído Parcialmente",
    canceled: "Cancelado",
    refunded: "Reembolsado"
  };

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/20 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-brand/10 py-6 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-jakarta font-extrabold text-2xl tracking-tighter text-brand-gradient">
            {siteName}
          </Link>
          <Link href="/" className="text-sm font-bold text-muted hover:text-primary flex items-center gap-2 transition-colors">
            <ArrowLeft size={16} /> Voltar para a loja
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-jakarta font-extrabold text-foreground mb-3">Acompanhar Pedido</h1>
          <p className="text-muted font-medium">Consulte o status da sua entrega em tempo real.</p>
        </div>

        {/* Formulário de Busca */}
        {!orders && (
          <form action="/meus-pedidos" method="GET" className="bg-white p-8 rounded-[32px] border border-brand/10 shadow-card space-y-6">
            <div>
              <label className="block text-sm font-bold text-muted uppercase tracking-widest mb-2 px-1">E-mail da Compra</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="Seu e-mail usado no checkout..."
                  className="w-full pl-12 pr-4 h-14 bg-surface rounded-2xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <button type="submit" className="w-full h-14 bg-brand-gradient text-white font-extrabold rounded-2xl shadow-brand hover:scale-[1.02] transition-transform flex items-center justify-center gap-3">
              Consultar Status <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* Resultado Detalhado */}
        {orders && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-jakarta font-extrabold text-foreground">
                Foram encontrados {orders.length} pedido(s)
              </h2>
              <Link href="/meus-pedidos" className="text-sm font-bold text-primary hover:underline">
                Nova Consulta
              </Link>
            </div>

            {orders.map((order: any) => (
              <div key={order.id} className="bg-white p-8 rounded-[32px] border border-brand/10 shadow-card">
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1 block">Rastreamento Oficial</span>
                      <h2 className="text-2xl font-jakarta font-extrabold text-foreground">Pedido #{order.id}</h2>
                    </div>
                    <div className={`px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                      {statusMap[order.status] || order.status}
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-brand/10">
                    <div className="space-y-4">
                       <div>
                          <p className="text-[10px] font-extrabold text-muted uppercase tracking-widest mb-1">Serviço Contratado</p>
                          <p className="font-bold text-foreground">{order.service.name}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-extrabold text-muted uppercase tracking-widest mb-1">Link do Perfil</p>
                          <a href={order.link || "#"} target="_blank" className="text-primary font-bold flex items-center gap-1.5 hover:underline truncate max-w-[250px]">
                            {order.link} <ExternalLink size={14} className="shrink-0" />
                          </a>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div>
                          <p className="text-[10px] font-extrabold text-muted uppercase tracking-widest mb-1">Quantidade</p>
                          <p className="font-bold text-foreground">{order.quantity} unidades</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-extrabold text-muted uppercase tracking-widest mb-1">Data da Compra</p>
                          <p className="font-bold text-foreground italic">{formatDate(order.createdAt)}</p>
                       </div>
                    </div>
                 </div>

                 <div className="mt-8 pt-2 flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 text-sm text-muted font-medium">
                       <Clock size={16} /> Atualizado em real-time
                    </div>
                    {isRefillEligible(order) && (
                      <RefillButton orderId={order.id} email={email!} createdAt={order.createdAt.toISOString()} />
                    )}
                 </div>
              </div>
            ))}

            <div className="bg-primary-light border border-primary/20 p-6 rounded-3xl flex items-center justify-between gap-4 mt-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm font-bold text-xl">?</div>
                <div>
                   <p className="text-sm font-bold text-primary">Alguma dúvida sobre seus pedidos?</p>
                   <p className="text-xs text-primary/70 font-medium">Fale agora mesmo com nosso suporte VIP.</p>
                </div>
              </div>
              <Link 
                href={`https://wa.me/${whatsapp}?text=Olá! Preciso de ajuda com os meus pedidos do email ${email}`}
                target="_blank"
                className="bg-primary text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg hover:scale-105 transition-all w-max shrink-0 text-center"
              >
                Suporte WhatsApp
              </Link>
            </div>
          </div>
        )}
      </main>

      <footer className="py-10 text-center">
         <p className="text-xs text-muted font-bold uppercase tracking-tight">
           &copy; {new Date().getFullYear()} {siteName} &mdash; Compra Segura via PIX
         </p>
      </footer>
    </div>
  );
}

function ArrowRight({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
