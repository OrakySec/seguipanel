import React, { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/affiliate-ui";
import { Button } from "@/components/ui/button";

export default function PayoutsList({
  payouts,
  onApprove,
  onReject
}: {
  payouts: any[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = payouts.filter(p => 
    p.affiliate?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.affiliate?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.pixKey?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-brand/5 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-brand/5 flex justify-between items-center bg-surface/50">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Buscar por afiliado ou chave PIX..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface/30">
              <th className="p-4 text-xs font-black uppercase tracking-widest text-muted border-b border-brand/5">Afiliado</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-muted border-b border-brand/5">Data da Solicitação</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-muted border-b border-brand/5">Valor (R$)</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-muted border-b border-brand/5">Chave PIX</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-muted border-b border-brand/5">Status</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-muted border-b border-brand/5">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted font-medium">
                  Nenhum saque encontrado.
                </td>
              </tr>
            ) : filtered.map(p => (
              <tr key={p.id} className="hover:bg-brand/[0.02] transition-colors group">
                <td className="p-4">
                  <p className="font-bold text-foreground">{p.affiliate?.firstName || "Sem Nome"}</p>
                  <p className="text-xs text-muted font-medium">{p.affiliate?.email}</p>
                  <p className="text-xs text-muted">{p.affiliate?.whatsapp || "S/ WhatsApp"}</p>
                </td>
                <td className="p-4">
                  <p className="text-sm font-medium">{formatDate(p.createdAt)}</p>
                </td>
                <td className="p-4">
                  <p className="font-bold text-emerald-600 text-lg">{formatCurrency(Number(p.amount))}</p>
                </td>
                <td className="p-4">
                  <span className="px-3 py-1.5 bg-surface text-foreground font-mono text-sm rounded-xl border border-brand/10 select-all">
                    {p.pixKey}
                  </span>
                </td>
                <td className="p-4">
                  <Badge variant={
                    p.status === "completed" ? "success" : 
                    p.status === "rejected" ? "destructive" : "warning"
                  }>
                    {p.status === "completed" ? "Pago" : 
                     p.status === "rejected" ? "Rejeitado" : "Pendente"}
                  </Badge>
                </td>
                <td className="p-4">
                  {p.status === "pending" ? (
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        className="h-8 px-3 text-xs gap-1"
                        onClick={() => onApprove(p.id)}
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Aprovar
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 px-3 text-xs gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                        onClick={() => onReject(p.id)}
                      >
                        <XCircle className="w-3.5 h-3.5" /> Rejeitar
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted font-medium">Ação finalizada</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
