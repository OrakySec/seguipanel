export const dynamic = "force-dynamic";

import React from "react";
import {
  ShoppingCart,
  Users,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  Clock,
  ExternalLink,
  ShieldCheck,
  Zap,
  RotateCcw
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/utils";
import Link from "next/link";
import { RevenueChart } from "@/components/admin/RevenueChart";

export default async function AdminDashboard() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // ─── Estatísticas de Vendas ───
  const [
    salesTodayRaw,
    salesMonthRaw,
    salesTotalRaw,
    refundedTotalRaw,
    pendingOrdersCount,
    latestOrders,
    last7DaysTransactions
  ] = await Promise.all([
    // Vendas hoje (excluindo cancelados/parciais)
    prisma.transactionLog.aggregate({
      where: { status: 1, createdAt: { gte: startOfToday }, NOT: { order: { status: { in: ["canceled", "partial"] } } } },
      _sum: { amount: true }
    }),
    // Vendas mês (excluindo cancelados/parciais)
    prisma.transactionLog.aggregate({
      where: { status: 1, createdAt: { gte: startOfMonth }, NOT: { order: { status: { in: ["canceled", "partial"] } } } },
      _sum: { amount: true }
    }),
    // Vendas totais (excluindo cancelados/parciais)
    prisma.transactionLog.aggregate({
      where: { status: 1, NOT: { order: { status: { in: ["canceled", "partial"] } } } },
      _sum: { amount: true }
    }),
    // Total reembolsado (pedidos cancelados + parciais)
    prisma.transactionLog.aggregate({
      where: { status: 1, order: { status: { in: ["canceled", "partial"] } } },
      _sum: { amount: true }
    }),
    // Pedidos pendentes
    prisma.order.count({ where: { status: "pending" } }),
    // Últimos pedidos
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        service: { select: { name: true } },
        user: { select: { email: true } }
      }
    }),
    // Transações dos últimos 30 dias
    prisma.transactionLog.findMany({
      where: {
        status: 1,
        createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29) },
        NOT: { order: { status: { in: ["canceled", "partial"] } } }
      },
      select: { amount: true, createdAt: true }
    })
  ]);

  // Processamento dos dados para o gráfico de 30 dias
  const revenueByDay = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29 + i);
    const dateStr = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    return { date: dateStr, amount: 0, fullDate: d };
  });

  const last30DaysTransactions = last7DaysTransactions; // Reaproveitando a variável para evitar erro de escopo se usada embaixo
  
  if (Array.isArray(last30DaysTransactions)) {
    last30DaysTransactions.forEach((tx: any) => {
      const txDate = new Date(tx.createdAt);
      const txDateOnly = new Date(txDate.getFullYear(), txDate.getMonth(), txDate.getDate());
      
      const dayData = revenueByDay.find(d => d.fullDate.getTime() === txDateOnly.getTime());
      if (dayData) {
        dayData.amount += Number(tx.amount) || 0;
      }
    });
  }

  const maxRevenue = Math.max(...revenueByDay.map(d => d.amount), 1);

  const stats = [
    { label: "Vendas (Hoje)", value: formatBRL(salesTodayRaw._sum.amount || 0), trend: "Live", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Vendas (Mês)", value: formatBRL(salesMonthRaw._sum.amount || 0), trend: "Mensal", icon: CreditCard, color: "text-primary", bg: "bg-primary/10" },
    { label: "Vendas (Total)", value: formatBRL(salesTotalRaw._sum.amount || 0), trend: "Acumulado", icon: ShieldCheck, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Pedidos Pendentes", value: pendingOrdersCount.toString(), trend: "Pendência", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground mb-1">
            Painel de Controle
          </h2>
          <p className="text-muted text-sm font-bold uppercase tracking-widest text-[10px]">
            Dados consolidados em tempo real
          </p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/servicos"
            className="px-6 py-3 bg-card border border-border text-foreground hover:bg-surface rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm"
          >
            Gerenciar Serviços
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="bg-card p-8 rounded-[2.5rem] border border-border shadow-card hover:border-primary/20 transition-all group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50`} />

            <div className="flex justify-between items-start mb-6 relative">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${stat.color} opacity-70`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">{stat.label}</p>
            <h3 className="text-2xl font-black text-foreground tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Card Reembolsos */}
      <div className="bg-card p-8 rounded-[2.5rem] border border-rose-200 shadow-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-60" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-sm shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-1">Reembolsos Totais</p>
              <p className="text-xs text-muted font-bold">Pedidos com status <span className="text-rose-400">Cancelado</span> ou <span className="text-amber-500">Parcial</span></p>
            </div>
          </div>
          <h3 className="text-3xl font-black text-rose-500 tracking-tighter">
            {formatBRL(refundedTotalRaw._sum.amount || 0)}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico 30 Dias */}
        <div className="lg:col-span-2 bg-card rounded-[2.5rem] border border-border p-8 md:p-10 shadow-card flex flex-col">
            <h4 className="text-xl font-black text-foreground mb-2">Evolução de Faturamento</h4>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-4">Últimos 30 Dias</p>
            
            <RevenueChart data={revenueByDay} />
        </div>

        {/* Últimos Pedidos Dinámicos */}
        <div className="bg-card rounded-[2.5rem] border border-border p-10 shadow-card">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-xl font-black text-foreground">Últimos Pedidos</h4>
            <Link href="/admin/pedidos" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-6">
            {latestOrders.length > 0 ? latestOrders.map((order: any) => (
              <div key={order.id} className="flex items-center gap-4 group p-1">
                <div className="w-11 h-11 rounded-2xl bg-surface border border-border flex items-center justify-center text-muted group-hover:bg-primary-light group-hover:text-primary transition-all shadow-sm">
                  <ArrowUpRight className="w-5 h-5 group-hover:scale-125 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black truncate text-foreground leading-tight">{order.service.name}</p>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-tighter truncate mt-1">
                    #{order.id} • {order.user.email}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-foreground">R$ {Number(order.charge).toFixed(2).replace(".", ",")}</p>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center opacity-30">
                <p className="text-sm font-bold uppercase tracking-widest">Nenhum pedido</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
