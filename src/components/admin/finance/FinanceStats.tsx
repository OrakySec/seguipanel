"use client";

import React from "react";
import { 
  TrendingUp, 
  Calendar, 
  Wallet, 
  ArrowUpRight, 
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

interface FinanceStatsProps {
  stats: {
    today: number;
    month: number;
    total: number;
    pending: number;
  };
}

export default function FinanceStats({ stats }: FinanceStatsProps) {
  const cards = [
    {
      label: "Faturamento Hoje",
      value: stats.today,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      description: "Vendas reais nas últimas 24h"
    },
    {
      label: "Faturamento Mensal",
      value: stats.month,
      icon: Calendar,
      color: "text-primary",
      bg: "bg-primary/10",
      description: "Acumulado do mês atual"
    },
    {
      label: "Histórico Total",
      value: stats.total,
      icon: Wallet,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      description: "Total bruto faturado"
    },
    {
      label: "Aguardando (PIX)",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      description: "Pagamentos em espera"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <motion.div 
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="relative bg-card rounded-[2.5rem] p-8 border border-border shadow-card group overflow-hidden"
        >
          {/* Fundo Decorativo Shimmer */}
          <div className={`absolute top-0 right-0 w-32 h-32 ${card.bg} rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700`} />

          <div className="relative flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center ${card.color} shadow-sm group-hover:scale-110 transition-transform`}>
                <card.icon size={24} />
              </div>
              <div className={`px-2 py-1 rounded-lg ${card.bg} ${card.color} text-[10px] font-black uppercase tracking-widest flex items-center gap-1 opacity-70`}>
                <ArrowUpRight size={10} /> 
                Live
              </div>
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-muted mb-1">{card.label}</p>
              <h3 className="text-3xl font-black text-foreground tracking-tighter">
                R$ {Number(card.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-[10px] font-bold text-muted mt-3 uppercase tracking-widest leading-relaxed opacity-60">
                {card.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
