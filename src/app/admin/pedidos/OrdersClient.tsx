"use client";

import React, { useState } from "react";
import { Trash2, Eye, X, RefreshCw, ExternalLink, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { deleteOrder } from "@/app/admin/usuarios/actions";
import { formatBRL, formatDate } from "@/lib/utils";

const getStatusStyle = (status: string) => {
  switch (status) {
    case "completed":  return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "processing": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "pending":    return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "canceled":   return "bg-red-500/10 text-red-500 border-red-500/20";
    case "inprogress": return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
    case "partial":    return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    default:           return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
  }
};

const statusMap: Record<string, string> = {
  pending:    "Pendente",
  processing: "Processando",
  inprogress: "Em Andamento",
  completed:  "Concluído",
  partial:    "Parcial",
  canceled:   "Cancelado",
  refunded:   "Reembolsado",
};

/* ─────────────────────────────────────────────────────── Modal ── */
function OrderDetailModal({ order, onClose }: { order: any; onClose: () => void }) {
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const checkApi = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/order-api-status/${order.id}`);
      const data = await res.json();
      setApiData(data);
    } catch {
      setApiData({ message: "Erro ao conectar com a API" });
    } finally {
      setLoading(false);
      setChecked(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Card */}
      <div className="relative bg-card rounded-3xl border border-border shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-border">
          <div>
            <h2 className="text-lg font-black text-foreground tracking-tight">Pedido #{order.id}</h2>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-0.5">{formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
              {statusMap[order.status] || order.status}
            </span>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface hover:bg-border transition-colors"
            >
              <X size={16} className="text-muted" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {/* Cliente */}
          <Section title="Cliente">
            <Row label="E-mail"    value={order.user?.email ?? "—"} />
            <Row label="WhatsApp"  value={order.user?.whatsapp ?? "—"} />
          </Section>

          {/* Serviço */}
          <Section title="Serviço">
            <Row label="Nome"       value={order.service?.name ?? "—"} />
            <Row label="Rede"       value={order.service?.category?.socialNetwork?.name ?? "—"} />
            <Row label="Link"       value={order.link ?? "—"} mono />
            <Row label="Quantidade" value={order.quantity ?? "—"} />
            <Row label="Valor"      value={formatBRL(Number(order.charge))} />
          </Section>

          {/* Fornecedor */}
          <Section title="Fornecedor / API">
            <Row label="Tipo"           value={order.type ?? "—"} />
            <Row label="Provider ID"    value={order.apiProviderId ?? "Não definido"} />
            <Row label="Service ID"     value={order.apiServiceId ?? "Não definido"} />
            <Row label="Order ID (API)" value={order.apiOrderId === 0 ? "⚠ Ainda não enviado" : String(order.apiOrderId)} highlight={order.apiOrderId === 0} />
            {order.remains   != null && <Row label="Restam"       value={String(order.remains)} />}
            {order.startCounter != null && <Row label="Início"    value={String(order.startCounter)} />}
            {order.lastStatusCheckAt && <Row label="Último check" value={formatDate(order.lastStatusCheckAt)} />}
          </Section>

          {/* Resposta da API */}
          <Section title="Resposta do Fornecedor">
            {!checked ? (
              <button
                onClick={checkApi}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-border text-sm font-bold text-muted hover:text-primary hover:border-primary/30 transition-all"
              >
                {loading ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <ExternalLink size={15} />
                )}
                {loading ? "Consultando fornecedor…" : "Consultar status na API do fornecedor"}
              </button>
            ) : (
              <div className="space-y-3">
                {apiData?.message && (
                  <p className="text-xs text-muted font-medium bg-surface rounded-xl px-4 py-3 border border-border">
                    {apiData.message}
                  </p>
                )}
                {apiData?.providerName && (
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest">
                    Fornecedor: {apiData.providerName}
                  </p>
                )}
                {apiData?.providerResponse && (
                  <pre className="text-xs font-mono bg-surface rounded-2xl border border-border px-4 py-3 overflow-x-auto text-foreground whitespace-pre-wrap break-all">
                    {JSON.stringify(apiData.providerResponse, null, 2)}
                  </pre>
                )}
                <button
                  onClick={checkApi}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-[10px] font-black text-muted hover:text-primary uppercase tracking-widest transition-colors"
                >
                  <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
                  Atualizar
                </button>
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest text-muted mb-2">{title}</p>
      <div className="bg-surface rounded-2xl border border-border divide-y divide-border overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, mono, highlight }: { label: string; value: string; mono?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-2.5">
      <span className="text-[10px] font-bold text-muted uppercase tracking-wider whitespace-nowrap">{label}</span>
      <span className={`text-xs font-semibold text-right break-all ${mono ? "font-mono" : ""} ${highlight ? "text-amber-500" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}

type WaAction = { id: number; name: string; type: string; messageTemplate: string };

/* ─────────────────────────────────────────────────────── Table ── */
export default function OrdersClient({
  initialOrders,
  actions = [],
}: {
  initialOrders: any[];
  actions?: WaAction[];
}) {
  const { toast } = useToast();
  const [orders, setOrders]           = useState(initialOrders);
  const [selected, setSelected]       = useState<any>(null);
  const [actionMenuId, setActionMenuId]   = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    orderId: number; actionId: number; actionName: string;
    actionType: string; preview: string;
  } | null>(null);
  const [sending, setSending]         = useState(false);

  const handleSelectAction = (order: any, action: WaAction) => {
    const preview = action.messageTemplate
      .replace(/\{\{orderId\}\}/g, String(order.apiOrderId ?? order.id))
      .replace(/\{\{servico\}\}/g, order.service?.name ?? "")
      .replace(/\{\{link\}\}/g,    order.link ?? "");
    setPendingAction({
      orderId: order.id, actionId: action.id,
      actionName: action.name, actionType: action.type, preview,
    });
    setActionMenuId(null);
  };

  const handleSendAction = async () => {
    if (!pendingAction) return;
    setSending(true);
    try {
      const res  = await fetch(`/api/admin/orders/${pendingAction.orderId}/send-action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionId: pendingAction.actionId }),
      });
      const data = await res.json();
      if (data.success) {
        toast("success", "Mensagem enviada com sucesso!");
      } else {
        toast("error", "Erro ao enviar mensagem", data.error);
      }
    } catch {
      toast("error", "Erro ao enviar mensagem");
    } finally {
      setSending(false);
      setPendingAction(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`Excluir permanentemente o pedido #${id}?`)) return;
    const result = await deleteOrder(id);
    if (result.success) {
      setOrders(prev => prev.filter(o => o.id !== id));
      toast("success", `Pedido #${id} excluído.`);
    } else {
      toast("error", "Erro ao excluir pedido", result.error);
    }
  };

  if (orders.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="px-8 py-24 text-center opacity-30">
          <div className="flex flex-col items-center gap-4">
            <span className="text-muted text-sm font-black uppercase tracking-widest">Nenhum pedido</span>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <>
      {orders.map((order: any) => (
        <tr key={order.id} className="hover:bg-surface/40 transition-colors group">
          <td className="px-8 py-6">
            <p className="text-sm font-black text-foreground mb-1 leading-tight group-hover:text-primary transition-colors">#{order.id}</p>
            <p className="text-[10px] font-bold text-muted uppercase tracking-tighter">{formatDate(order.createdAt)}</p>
          </td>
          <td className="px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-surface border border-border flex items-center justify-center text-muted group-hover:bg-primary-light group-hover:text-primary transition-all shadow-sm text-xs font-black">
                {(order.user?.email?.[0] ?? "?").toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black truncate text-foreground leading-tight">{order.user?.email}</p>
                <p className="text-[10px] font-bold text-muted truncate mt-1 uppercase tracking-tighter">{order.user?.whatsapp || "Sem whats"}</p>
              </div>
            </div>
          </td>
          <td className="px-8 py-6">
            <p className="text-sm font-black text-foreground mb-1.5 leading-tight truncate max-w-[200px]">{order.service?.name}</p>
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-[9px] font-black text-primary uppercase bg-primary-light px-2 py-0.5 rounded-lg border border-primary/10 shrink-0">
                {order.service?.category?.socialNetwork?.name}
              </span>
              <p className="text-[10px] font-bold text-muted truncate opacity-60 tracking-tighter">{order.link}</p>
            </div>
          </td>
          <td className="px-8 py-6 whitespace-nowrap">
            <p className="text-sm font-black text-foreground leading-tight">{formatBRL(Number(order.charge))}</p>
            <p className="text-[10px] font-bold text-muted uppercase tracking-tighter mt-1">PIX Pago</p>
          </td>
          <td className="px-8 py-6 whitespace-nowrap">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
              {statusMap[order.status] || order.status}
            </span>
          </td>
          <td className="px-8 py-6 text-right">
            <div className="flex items-center justify-end gap-2">
              {/* Botão de ações WhatsApp */}
              {actions.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setActionMenuId(prev => prev === order.id ? null : order.id)}
                    className="h-11 w-11 flex items-center justify-center rounded-2xl border border-border
                               text-muted hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30
                               transition-all shadow-sm opacity-0 group-hover:opacity-100"
                    title="Enviar mensagem WhatsApp"
                  >
                    <MessageSquare size={16} />
                  </button>

                  {actionMenuId === order.id && (
                    <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border
                                    rounded-2xl shadow-xl w-56 py-2 overflow-hidden">
                      {actions.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => handleSelectAction(order, action)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm
                                     hover:bg-surface text-left transition-colors"
                        >
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                            action.type === "supplier"
                              ? "bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"
                              : "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                          }`}>
                            {action.type === "supplier" ? "Fornecedor" : "Cliente"}
                          </span>
                          <span className="font-bold text-foreground truncate">{action.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => handleDelete(order.id)}
                className="h-11 w-11 flex items-center justify-center rounded-2xl border border-border text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all shadow-sm opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setSelected(order)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border text-muted hover:text-primary hover:bg-card transition-all shadow-sm group-hover:scale-105"
                title="Ver detalhes"
              >
                <Eye size={18} />
              </button>
            </div>
          </td>
        </tr>
      ))}

      {/* Painel de confirmação — fixo no canto inferior direito */}
      {pendingAction && (
        <tr aria-hidden>
          <td>
            <div className="fixed bottom-6 right-6 z-[99999] w-[22rem] bg-card border border-border
                            rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                      pendingAction.actionType === "supplier"
                        ? "bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                    }`}>
                      {pendingAction.actionType === "supplier" ? "📣 Fornecedor" : "📱 Cliente"}
                    </span>
                    <span className="text-sm font-black text-foreground truncate">{pendingAction.actionName}</span>
                  </div>
                  <p className="text-[10px] font-bold text-muted mt-1 uppercase tracking-widest">
                    Confirmar envio da mensagem
                  </p>
                </div>
                <button
                  onClick={() => !sending && setPendingAction(null)}
                  disabled={sending}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-surface
                             hover:bg-border transition-colors disabled:opacity-40"
                >
                  <X size={14} className="text-muted" />
                </button>
              </div>

              {/* Preview da mensagem */}
              <div className="px-5 pb-4">
                <pre className="bg-surface border border-border rounded-2xl px-3 py-3 text-xs
                                whitespace-pre-wrap break-words font-mono text-foreground leading-relaxed
                                max-h-36 overflow-y-auto">
                  {pendingAction.preview}
                </pre>
              </div>

              {/* Botões */}
              <div className="flex gap-2 px-5 pb-5">
                <button
                  onClick={() => setPendingAction(null)}
                  disabled={sending}
                  className="flex-1 h-11 rounded-2xl border border-border text-sm font-black
                             text-muted hover:bg-surface transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSendAction}
                  disabled={sending}
                  className="flex-1 h-11 rounded-2xl bg-brand-gradient text-sm font-black
                             text-white shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {sending ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando…
                    </span>
                  ) : "Enviar"}
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}

      {selected && (
        <tr>
          <td>
            <OrderDetailModal order={selected} onClose={() => setSelected(null)} />
          </td>
        </tr>
      )}
    </>
  );
}
