"use client";

import React, { useState } from "react";
import PayoutsList from "@/components/admin/payouts/PayoutsList";
import { approvePayout, rejectPayout } from "./actions";
import { useToast } from "@/components/ui/Toast";

export default function PayoutsClient({ 
  initialPayouts 
}: { 
  initialPayouts: any[]
}) {
  const { toast } = useToast();
  const [payouts, setPayouts] = useState(initialPayouts);

  const handleApprove = async (id: number) => {
    if (confirm("Tem certeza que deseja aprovar este saque? Certifique-se de já ter feito a transferência via PIX.")) {
      const result = await approvePayout(id);
      if (result.success) {
        setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: "completed" } : p));
        toast("success", "Saque aprovado com sucesso.");
      } else {
        toast("error", "Erro ao aprovar", result.error);
      }
    }
  };

  const handleReject = async (id: number) => {
    if (confirm("Tem certeza que deseja rejeitar este saque? O valor será devolvido ao saldo do afiliado.")) {
      const result = await rejectPayout(id);
      if (result.success) {
        setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: "rejected" } : p));
        toast("success", "Saque rejeitado com sucesso. Saldo devolvido.");
      } else {
        toast("error", "Erro ao rejeitar", result.error);
      }
    }
  };

  const pendingCount = payouts.filter(p => p.status === "pending").length;

  return (
    <div className="p-8 space-y-8 animate-fade-in-up">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Gestão de Saques</h1>
          <p className="text-sm font-bold text-muted uppercase tracking-tighter">Aprove pagamentos de comissões aos afiliados</p>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="px-5 py-3 bg-white border border-brand/10 rounded-2xl shadow-sm">
             <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Saques Pendentes</p>
             <p className="text-xl font-black text-amber-500">{pendingCount}</p>
          </div>
        </div>
      </div>

      <PayoutsList 
        payouts={payouts}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
