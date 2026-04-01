import React from "react";
import { 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  CreditCard,
  ArrowUpRight,
  Clock,
  ExternalLink
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // ─── Estatísticas de Vendas ───
  const [
    salesTodayRaw, 
    salesMonthRaw, 
    salesTotalRaw,
    pendingOrdersCount,
    newUsersCount,
    latestOrders
  ] = await Promise.all([
    // Vendas hoje
    prisma.transactionLog.aggregate({
      where: { status: 1, createdAt: { gte: startOfToday } },
      _sum: { amount: true }
    }),
    // Vendas mês
    prisma.transactionLog.aggregate({
      where: { status: 1, createdAt: { gte: startOfMonth } },
      _sum: { amount: true }
    }),
    // Vendas totais
    prisma.transactionLog.aggregate({
      where: { status: 1 },
      _sum: { amount: true }
    }),
    // Pedidos pendentes
    prisma.order.count({ where: { status: "pending" } }),
    // Novos usuários (últimos 30 dias)
    prisma.user.count({ 
      where: { 
        createdAt: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) },
        role: "CUSTOMER"
      } 
    }),
    // Últimos pedidos
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        service: { select: { name: true } },
        user: { select: { email: true } }
      }
    })
  ]);

  const stats = [
    { label: "Vendas (Hoje)", value: formatBRL(salesTodayRaw._sum.amount || 0), trend: "Tempo Real", icon: TrendingUp },
    { label: "Vendas (Mês)", value: formatBRL(salesMonthRaw._sum.amount || 0), trend: "Faturamento", icon: CreditCard },
    { label: "Vendas (Total)", value: formatBRL(salesTotalRaw._sum.amount || 0), trend: "Histórico", icon: ExternalLink },
    { label: "Pedidos Pendentes", value: pendingOrdersCount.toString(), trend: "Ação Necessária", icon: Clock },
  ];

  return (
    <div className="p-8 space-y-8">
      <header className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-jakarta font-extrabold text-foreground mb-1">
            Olá, Bem-vindo de volta!
          </h2>
          <p className="text-muted text-sm font-medium">
            Aqui está o resumo real da sua plataforma hoje.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-11">
            Mês Anterior
          </Button>
          <Button className="h-11 shadow-brand">
            Novidades v2.0
          </Button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-[24px] border border-brand/10 shadow-card hover:shadow-brand transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center group-hover:bg-primary-light transition-colors">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted bg-surface px-2 py-1 rounded-lg group-hover:text-primary transition-colors">
                {stat.trend}
              </span>
            </div>
            <p className="text-sm font-medium text-muted mb-1">{stat.label}</p>
            <h3 className="text-xl font-jakarta font-extrabold text-foreground">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-brand/10 p-8 shadow-card flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-lg font-jakarta font-extrabold">Evolução do Faturamento</h4>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-muted">
                <div className="w-2 h-2 rounded-full bg-primary" /> Vendas
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-[300px] bg-surface/50 rounded-2xl border-2 border-dashed border-brand/10 flex flex-col items-center justify-center p-6 text-center">
            <TrendingUp className="w-12 h-12 text-brand-gradient opacity-20 mb-4" />
            <p className="text-sm text-muted font-bold max-w-xs">
              Os gráficos serão ativados assim que houver histórico de 7 dias de transações pagas.
            </p>
          </div>
        </div>

        {/* Últimos Pedidos Dinámicos */}
        <div className="bg-white rounded-[32px] border border-brand/10 p-8 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-jakarta font-extrabold">Últimos Pedidos</h4>
            <Link href="/admin/pedidos" className="text-xs font-bold text-primary hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-4">
            {latestOrders.length > 0 ? latestOrders.map((order: any) => (
              <div key={order.id} className="flex items-center gap-4 p-3 hover:bg-surface rounded-xl transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate text-foreground">{order.service.name}</p>
                  <p className="text-[10px] font-medium text-muted uppercase tracking-tight truncate">
                    #{order.id} • {order.user.email}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">R$ {Number(order.charge).toFixed(2).replace(".", ",")}</p>
                </div>
              </div>
            )) : (
              <div className="py-10 text-center">
                <p className="text-sm text-muted font-medium">Nenhum pedido realizado ainda.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
