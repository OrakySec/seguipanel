import React, { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Edit2, Search } from "lucide-react";
import { Badge } from "@/components/ui/affiliate-ui";

export default function AffiliatesList({
  affiliates,
  onEdit
}: {
  affiliates: any[];
  onEdit: (affiliate: any) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = affiliates.filter(a => 
    a.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.affiliateCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-brand/5 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-brand/5 flex justify-between items-center bg-surface/50">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou código..."
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
              <th className="p-4 text-xs font-black uppercase tracking-widest text-muted border-b border-brand/5">Código</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-muted border-b border-brand/5">Comissão</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-muted border-b border-brand/5">Saldo</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-muted border-b border-brand/5">Métricas</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-muted border-b border-brand/5">Status</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-muted border-b border-brand/5">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted font-medium">
                  Nenhum afiliado encontrado.
                </td>
              </tr>
            ) : filtered.map(a => (
              <tr key={a.id} className="hover:bg-brand/[0.02] transition-colors group">
                <td className="p-4">
                  <p className="font-bold text-foreground">{a.firstName || "Sem Nome"}</p>
                  <p className="text-xs text-muted font-medium">{a.email}</p>
                  <p className="text-xs text-muted">{a.whatsapp || "S/ WhatsApp"}</p>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-surface text-foreground font-mono text-xs rounded-lg border border-brand/10">
                    {a.affiliateCode}
                  </span>
                </td>
                <td className="p-4">
                  {a.commissionRate !== null ? (
                    <Badge variant="default">{a.commissionRate}% (Esp.)</Badge>
                  ) : (
                    <Badge variant="outline">{a.globalRate}% (Global)</Badge>
                  )}
                </td>
                <td className="p-4">
                  <p className="font-bold text-emerald-600">{formatCurrency(Number(a.balance))}</p>
                  <p className="text-[10px] text-muted">PIX: {a.pixKey || "N/A"}</p>
                </td>
                <td className="p-4">
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-muted uppercase">Cliques</p>
                      <p className="font-black text-foreground">{a._count.affiliateClicks}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-muted uppercase">Vendas</p>
                      <p className="font-black text-emerald-600">{a._count.referredOrders}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant={a.status === 1 ? "success" : "destructive"}>
                    {a.status === 1 ? "Ativo" : "Inativo"}
                  </Badge>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onEdit(a)}
                    className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                    title="Editar Afiliado"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
