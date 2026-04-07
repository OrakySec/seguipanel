"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download,
  History,
  Hash,
  CheckCircle2,
  Clock,
  PieChart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomSelect from "@/components/ui/CustomSelect";

interface TransactionLog {
  id: number;
  amount: number;
  paymentType: string;
  transactionId: string;
  orderId: number | null;
  status: number;
  refundStatus: number;
  createdAt: string | Date;
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
}

interface TransactionListProps {
  transactions: TransactionLog[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const uName = `${t.user.firstName || ""} ${t.user.lastName || ""}`.toLowerCase();
      const matchesSearch = 
        t.user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
        uName.includes(searchTerm.toLowerCase()) ||
        t.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const tStatus = t.status === 1 ? "COMPLETED" : "PENDING";
      const matchesStatus = selectedStatus === "all" || tStatus === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchTerm, selectedStatus]);

  return (
    <div className="bg-card rounded-[2.5rem] border border-border shadow-card overflow-hidden">
      {/* Search & Filters */}
      <div className="p-8 border-b border-border bg-surface/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input 
                type="text" 
                placeholder="Buscar por e-mail ou ID..."
                className="w-full h-12 pl-12 pr-4 bg-card rounded-2xl text-sm border border-border focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <CustomSelect
              className="w-64 !h-12"
              options={[
                { value: "all", label: "Todos os Status" },
                { value: "COMPLETED", label: "Sucesso (Pago)" },
                { value: "PENDING", label: "Pendente" }
              ]}
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val)}
              icon={PieChart}
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 hover:bg-surface rounded-xl text-[10px] font-black uppercase tracking-widest text-muted transition-colors border border-transparent hover:border-border shadow-sm">
            <Download size={14} /> Exportar CSV
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-surface/50 text-left">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted border-b border-border text-center">Tipo</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted border-b border-border">Usuário</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted border-b border-border">Data / Referência</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted border-b border-border text-right">Valor</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted border-b border-border text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filteredTransactions.map((t, i) => (
                <motion.tr 
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.01 }}
                  className="hover:bg-surface/40 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm border border-brand/5 ${
                            t.refundStatus === 1 ? 'bg-red-500/10 text-red-500' : 
                            t.orderId ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                            {t.refundStatus === 1 ? <ArrowDownLeft size={18} /> : 
                             t.orderId ? <History size={18} /> : <ArrowUpRight size={18} />}
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{t.user.firstName || "Usuário"} {t.user.lastName || ""}</p>
                      <span className="text-[10px] text-muted font-bold uppercase tracking-tighter mt-1">{t.user.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground">{new Date(t.createdAt).toLocaleString('pt-BR')}</span>
                      <span className="text-[10px] text-primary font-black uppercase tracking-widest mt-1.5 flex items-center gap-1.5 border border-primary/10 bg-primary/5 w-fit px-2 py-0.5 rounded-lg">
                        <Hash size={10} /> {t.paymentType || "PIX"} • {t.transactionId}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right uppercase">
                    <span className={`text-sm font-black ${
                        t.refundStatus === 1 ? 'text-red-500' : 'text-foreground'
                    }`}>
                        {t.refundStatus === 1 ? '-' : '+'} R$ {Number(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        t.status === 1 
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                          : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    }`}>
                        {t.status === 1 ? <CheckCircle2 size={10} className="animate-pulse" /> : <Clock size={10} />}
                        {t.status === 1 ? "Pago" : "Pendente"}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center opacity-30">
                  <div className="flex flex-col items-center gap-3 text-muted">
                    <PieChart size={48} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Nenhuma movimentação</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-6 bg-surface/30 border-t border-border">
        <p className="text-[10px] text-muted font-black uppercase tracking-widest">
          Consolidando histórico de {filteredTransactions.length} logs de transação
        </p>
      </div>
    </div>
  );
}
