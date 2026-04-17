"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Tag, Search, X, Loader2, Percent, Hash, Calendar, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { upsertCoupon, toggleCouponStatus, deleteCoupon } from "./actions";

interface Coupon {
  id: number;
  code: string;
  name: string;
  type: string;
  value: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: Date | null;
  createdAt: Date;
}

const EMPTY_FORM = {
  id: undefined as number | undefined,
  code: "",
  name: "",
  value: 10,
  usageLimit: 0,
  isActive: true,
  expiresAt: "",
};

export default function CouponsClient({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [formError, setFormError] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setForm({ ...EMPTY_FORM });
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(c: Coupon) {
    setForm({
      id: c.id,
      code: c.code,
      name: c.name,
      value: c.value,
      usageLimit: c.usageLimit,
      isActive: c.isActive,
      expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().split("T")[0] : "",
    });
    setFormError("");
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.code.trim()) { setFormError("Informe o código do cupom."); return; }
    if (!form.name.trim()) { setFormError("Informe o nome do cupom."); return; }
    if (form.value <= 0 || form.value > 100) { setFormError("O desconto deve ser entre 1% e 100%."); return; }

    startTransition(async () => {
      const res = await upsertCoupon({
        id: form.id,
        code: form.code,
        name: form.name,
        value: form.value,
        usageLimit: form.usageLimit,
        isActive: form.isActive,
        expiresAt: form.expiresAt || null,
      });

      if (!res.success) {
        setFormError(res.error || "Erro ao salvar.");
        return;
      }

      // Atualiza lista localmente
      const saved: Coupon = {
        id: form.id ?? Date.now(),
        code: form.code.toUpperCase().trim(),
        name: form.name.trim(),
        type: "percentage",
        value: form.value,
        usageLimit: form.usageLimit,
        usedCount: coupons.find((c) => c.id === form.id)?.usedCount ?? 0,
        isActive: form.isActive,
        expiresAt: form.expiresAt ? new Date(form.expiresAt) : null,
        createdAt: coupons.find((c) => c.id === form.id)?.createdAt ?? new Date(),
      };

      if (form.id) {
        setCoupons((prev) => prev.map((c) => (c.id === form.id ? saved : c)));
      } else {
        setCoupons((prev) => [saved, ...prev]);
      }

      setModalOpen(false);
      toast("success", form.id ? "Cupom atualizado!" : "Cupom criado!");
    });
  }

  function handleToggle(id: number, current: boolean) {
    startTransition(async () => {
      const res = await toggleCouponStatus(id, current);
      if (!res.success) { toast("error", res.error || "Erro"); return; }
      setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: !current } : c)));
    });
  }

  function handleDelete(id: number) {
    if (!confirm("Excluir este cupom? Esta ação não pode ser desfeita.")) return;
    startTransition(async () => {
      const res = await deleteCoupon(id);
      if (!res.success) { toast("error", res.error || "Erro"); return; }
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      toast("success", "Cupom excluído.");
    });
  }

  const isExpired = (c: Coupon) => c.expiresAt && new Date(c.expiresAt) < new Date();

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Header */}
      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground mb-1">Cupons de Desconto</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted">
            Gerencie os códigos promocionais da loja
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-6 py-3 bg-brand-gradient text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-brand hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Novo Cupom
        </button>
      </header>

      {/* Tabela */}
      <div className="bg-card rounded-[2.5rem] border border-border shadow-card overflow-hidden">
        {/* Search */}
        <div className="p-8 border-b border-border bg-surface/30">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Buscar por código ou nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-card rounded-2xl text-sm border border-border focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface/50 text-left">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Código / Nome</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Desconto</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Usos</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Validade</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence mode="popLayout">
                {filtered.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ delay: i * 0.01 }}
                    className="hover:bg-surface/40 transition-colors group"
                  >
                    {/* Código / Nome */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Tag size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-foreground tracking-wider font-mono">{c.code}</p>
                          <p className="text-[10px] text-muted font-bold mt-0.5">{c.name}</p>
                        </div>
                      </div>
                    </td>

                    {/* Desconto */}
                    <td className="px-8 py-6">
                      <span className="text-xl font-black text-primary">{c.value}%</span>
                      <p className="text-[9px] text-muted font-black uppercase tracking-widest mt-0.5">de desconto</p>
                    </td>

                    {/* Usos */}
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-foreground">
                        {c.usedCount}
                        {c.usageLimit > 0 && (
                          <span className="text-muted font-bold"> / {c.usageLimit}</span>
                        )}
                      </span>
                      <p className="text-[9px] text-muted font-black uppercase tracking-widest mt-0.5">
                        {c.usageLimit === 0 ? "ilimitado" : "usos"}
                      </p>
                    </td>

                    {/* Validade */}
                    <td className="px-8 py-6">
                      {c.expiresAt ? (
                        <div>
                          <span className={`text-sm font-black ${isExpired(c) ? "text-red-500" : "text-foreground"}`}>
                            {new Date(c.expiresAt).toLocaleDateString("pt-BR")}
                          </span>
                          {isExpired(c) && (
                            <p className="text-[9px] text-red-500 font-black uppercase tracking-widest mt-0.5">Expirado</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted font-black uppercase tracking-widest">Sem validade</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-8 py-6">
                      <button
                        onClick={() => handleToggle(c.id, c.isActive)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
                          c.isActive
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-red-500/10 text-red-500 border-red-500/20"
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${c.isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                        {c.isActive ? "Ativo" : "Inativo"}
                      </button>
                    </td>

                    {/* Ações */}
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          className="p-3 bg-surface hover:bg-card hover:text-primary hover:shadow-sm rounded-xl transition-all text-muted"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-3 bg-surface hover:bg-card hover:text-red-500 hover:shadow-sm rounded-xl transition-all text-muted"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center text-muted">
                        <Tag size={32} />
                      </div>
                      <p className="text-sm font-black uppercase tracking-widest">Nenhum cupom encontrado</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-surface/30 border-t border-border">
          <p className="text-[10px] text-muted font-black uppercase tracking-widest">
            {filtered.length} cupom{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              className="relative bg-card border border-border rounded-[2rem] shadow-2xl w-full max-w-md p-8 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header modal */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">
                    {form.id ? "Editar" : "Novo"} Cupom
                  </p>
                  <h3 className="text-xl font-black text-foreground tracking-tighter">
                    {form.id ? "Atualizar cupom" : "Criar cupom"}
                  </h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-surface rounded-xl text-muted transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5">
                {/* Código */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">Código</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="text"
                      value={form.code}
                      onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                      placeholder="EX: DESCONTO10"
                      className="w-full h-12 pl-11 pr-4 bg-surface border border-border rounded-2xl text-sm font-black tracking-widest outline-none focus:ring-2 focus:ring-primary/20 transition-all uppercase"
                    />
                  </div>
                </div>

                {/* Nome */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">Nome / Descrição</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Ex: Desconto de boas-vindas"
                    className="w-full h-12 px-4 bg-surface border border-border rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Desconto + Limite lado a lado */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">Desconto (%)</label>
                    <div className="relative">
                      <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={form.value}
                        onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))}
                        className="w-full h-12 pl-11 pr-4 bg-surface border border-border rounded-2xl text-sm font-black outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">Limite de Usos</label>
                    <div className="relative">
                      <RefreshCw className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        type="number"
                        min={0}
                        value={form.usageLimit}
                        onChange={(e) => setForm((f) => ({ ...f, usageLimit: Number(e.target.value) }))}
                        placeholder="0 = ilimitado"
                        className="w-full h-12 pl-11 pr-4 bg-surface border border-border rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <p className="text-[9px] text-muted font-bold mt-1 ml-1">0 = ilimitado</p>
                  </div>
                </div>

                {/* Validade */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">Validade (opcional)</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="date"
                      value={form.expiresAt}
                      onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                      className="w-full h-12 pl-11 pr-4 bg-surface border border-border rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                {/* Ativo */}
                <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-border">
                  <div>
                    <p className="text-sm font-black text-foreground">Cupom Ativo</p>
                    <p className="text-[10px] text-muted font-bold mt-0.5">Clientes poderão usar este cupom</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                    className={`w-12 h-6 rounded-full transition-all relative ${form.isActive ? "bg-emerald-500" : "bg-border"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.isActive ? "left-6" : "left-0.5"}`} />
                  </button>
                </div>

                {/* Erro */}
                {formError && (
                  <p className="text-xs text-red-500 font-bold flex items-center gap-1.5 bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20">
                    {formError}
                  </p>
                )}

                {/* Botão salvar */}
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  className="w-full h-13 py-3.5 bg-brand-gradient text-white font-black rounded-2xl shadow-brand hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
                >
                  {isPending ? <><Loader2 size={16} className="animate-spin" /> Salvando…</> : <><Tag size={16} /> {form.id ? "Atualizar Cupom" : "Criar Cupom"}</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
