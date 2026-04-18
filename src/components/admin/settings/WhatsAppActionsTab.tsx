"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import {
  upsertWhatsAppAction,
  deleteWhatsAppAction,
  toggleWhatsAppAction,
} from "@/app/admin/configuracoes/actions";

export interface WhatsAppActionRow {
  id: number;
  name: string;
  type: string;
  messageTemplate: string;
  isActive: boolean;
  sortOrder: number;
}

const emptyForm = (): Omit<WhatsAppActionRow, "id"> => ({
  name: "",
  type: "supplier",
  messageTemplate: "",
  isActive: true,
  sortOrder: 0,
});

export function WhatsAppActionsTab({
  actions: initialActions,
  onUpdate,
}: {
  actions: WhatsAppActionRow[];
  onUpdate: (actions: WhatsAppActionRow[]) => void;
}) {
  const { toast } = useToast();
  const [actions, setActions] = useState<WhatsAppActionRow[]>(initialActions);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const sync = (next: WhatsAppActionRow[]) => {
    setActions(next);
    onUpdate(next);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setShowModal(true);
  };

  const openEdit = (action: WhatsAppActionRow) => {
    setEditingId(action.id);
    setForm({
      name: action.name,
      type: action.type,
      messageTemplate: action.messageTemplate,
      isActive: action.isActive,
      sortOrder: action.sortOrder,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.messageTemplate.trim()) {
      toast("error", "Nome e mensagem são obrigatórios.");
      return;
    }
    setSaving(true);
    const result = await upsertWhatsAppAction(
      editingId ? { id: editingId, ...form } : form
    );
    setSaving(false);
    if (!result.success) {
      toast("error", result.error ?? "Erro ao salvar.");
      return;
    }
    toast("success", editingId ? "Ação atualizada!" : "Ação criada!");
    setShowModal(false);
    // Refetch optimistically
    if (editingId) {
      sync(actions.map((a) => (a.id === editingId ? { ...a, ...form } : a)));
    } else {
      // We don't have the new id client-side; reload via revalidation isn't instant in client component.
      // Add a temporary placeholder with a negative id so the row appears immediately.
      const tmpId = Date.now() * -1;
      sync([...actions, { id: tmpId, ...form }]);
    }
  };

  const handleToggle = async (action: WhatsAppActionRow) => {
    const result = await toggleWhatsAppAction(action.id, action.isActive);
    if (result.success) {
      sync(actions.map((a) => (a.id === action.id ? { ...a, isActive: !a.isActive } : a)));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir esta ação permanentemente?")) return;
    const result = await deleteWhatsAppAction(id);
    if (result.success) {
      sync(actions.filter((a) => a.id !== id));
      toast("success", "Ação excluída.");
    } else {
      toast("error", result.error ?? "Erro ao excluir.");
    }
  };

  return (
    <div className="p-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-foreground tracking-tight">Ações WhatsApp</h3>
          <p className="text-sm text-muted mt-1">
            Mensagens rápidas para enviar a fornecedores ou clientes diretamente nos pedidos.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 h-12 px-6 rounded-2xl bg-brand-gradient
                     text-sm font-black text-white shadow-lg hover:opacity-90 transition-all"
        >
          <Plus size={16} /> Nova Ação
        </button>
      </div>

      {/* Variáveis disponíveis */}
      <div className="bg-surface border border-border rounded-2xl px-5 py-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">
          Variáveis disponíveis nos templates
        </p>
        <div className="flex flex-wrap gap-2">
          {["{{orderId}}", "{{servico}}", "{{link}}"].map((v) => (
            <code
              key={v}
              className="text-xs font-mono bg-primary/10 text-primary px-2.5 py-1 rounded-lg border border-primary/10"
            >
              {v}
            </code>
          ))}
        </div>
      </div>

      {/* Tabela */}
      {actions.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-3xl">
          <MessageSquare size={36} className="text-muted/30 mx-auto mb-3" />
          <p className="text-sm font-bold text-muted">Nenhuma ação configurada ainda.</p>
          <p className="text-xs text-muted/60 mt-1">Clique em "Nova Ação" para começar.</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-border overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface/60 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted">Nome</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted">Tipo</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted">Mensagem</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted text-center">Ativo</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {actions.map((action) => (
                <tr key={action.id} className="hover:bg-surface/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-foreground">{action.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${
                        action.type === "supplier"
                          ? "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800"
                          : "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800"
                      }`}
                    >
                      {action.type === "supplier" ? "Fornecedor" : "Cliente"}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-xs text-muted font-mono truncate">
                      {action.messageTemplate.length > 65
                        ? action.messageTemplate.slice(0, 65) + "…"
                        : action.messageTemplate}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggle(action)}
                      className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                        action.isActive ? "bg-primary" : "bg-border"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          action.isActive ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(action)}
                        className="h-9 w-9 flex items-center justify-center rounded-xl border border-border
                                   text-muted hover:text-primary hover:bg-primary/5 transition-all"
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(action.id)}
                        className="h-9 w-9 flex items-center justify-center rounded-xl border border-border
                                   text-muted hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Excluir"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal criar/editar */}
      {showModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !saving && setShowModal(false)}
          />
          <div className="relative bg-card rounded-3xl border border-border shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="px-7 pt-7 pb-5 flex items-center justify-between border-b border-border">
              <h3 className="text-lg font-black text-foreground">
                {editingId ? "Editar Ação" : "Nova Ação"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface hover:bg-border transition-colors"
              >
                <X size={16} className="text-muted" />
              </button>
            </div>

            {/* Body */}
            <div className="px-7 py-6 space-y-5">
              {/* Nome */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
                  Nome da ação *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: Notificar atraso, Confirmar pedido…"
                  className="w-full h-12 px-4 bg-surface border border-border rounded-2xl text-sm
                             font-medium text-foreground placeholder:text-muted/50
                             focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                />
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
                  Tipo de envio *
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full h-12 px-4 bg-surface border border-border rounded-2xl text-sm
                             font-medium text-foreground focus:outline-none focus:ring-2
                             focus:ring-primary/30 focus:border-primary/50 appearance-none"
                >
                  <option value="supplier">📣 Fornecedor (grupo WhatsApp)</option>
                  <option value="user">📱 Cliente (WhatsApp do cliente)</option>
                </select>
              </div>

              {/* Mensagem */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
                  Mensagem *
                </label>
                <textarea
                  value={form.messageTemplate}
                  onChange={(e) => setForm((f) => ({ ...f, messageTemplate: e.target.value }))}
                  rows={5}
                  placeholder={"Ex: Pedido #{{orderId}} - {{servico}}\nLink: {{link}}\nPor favor, priorize a entrega."}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-2xl text-sm
                             font-mono text-foreground placeholder:text-muted/40 resize-none
                             focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                />
                <p className="text-[10px] text-muted mt-2">
                  Variáveis:{" "}
                  {["{{orderId}}", "{{servico}}", "{{link}}"].map((v) => (
                    <code key={v} className="font-mono bg-surface px-1 rounded mr-1">{v}</code>
                  ))}
                </p>
              </div>

              {/* Ordem */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
                  Ordem de exibição
                </label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                  min={0}
                  className="w-24 h-12 px-4 bg-surface border border-border rounded-2xl text-sm
                             font-medium text-foreground focus:outline-none focus:ring-2
                             focus:ring-primary/30 focus:border-primary/50"
                />
              </div>

              {/* Ativo toggle */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-bold text-foreground">Ativa</span>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                  className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                    form.isActive ? "bg-primary" : "bg-border"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      form.isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 pb-7 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="flex-1 h-12 rounded-2xl border border-border text-sm font-black
                           text-muted hover:bg-surface transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 h-12 rounded-2xl bg-brand-gradient text-sm font-black
                           text-white shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
              >
                {saving ? "Salvando…" : "Salvar Ação"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
