import React from "react";
import { getFinanceStats, getTransactions } from "./actions";
import FinanceStats from "@/components/admin/finance/FinanceStats";
import TransactionList from "@/components/admin/finance/TransactionList";

export const metadata = {
  title: "Gestão Financeira | Painel Admin SeguiFacil",
  description: "Monitore o faturamento, lucros e transações do SeguiFacil em tempo real.",
};

export default async function AdminFinancePage() {
  // Busca inicial de dados no servidor (SSR)
  const [stats, transactions] = await Promise.all([
    getFinanceStats(),
    getTransactions()
  ]);

  return (
    <div className="p-8 space-y-10 bg-surface/50 min-h-screen animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Financeiro & Fluxo de Caixa</h1>
          <p className="text-sm font-bold text-muted uppercase tracking-tighter">Monitore faturamento, depósitos e lucratividade do sistema</p>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <FinanceStats stats={stats} />

      {/* Lista de Transações */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 ml-2">
            <div className="w-2 h-8 bg-brand-gradient rounded-full" />
            <h2 className="text-xl font-black text-foreground tracking-tight">Extrato Recente</h2>
        </div>
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
}
