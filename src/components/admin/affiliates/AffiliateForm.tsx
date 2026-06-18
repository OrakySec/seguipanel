import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Save, Percent, ShieldBan, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AffiliateForm({
  initialData,
  onSave,
  onClose,
  isSaving
}: {
  initialData: any;
  onSave: (id: number, data: any) => void;
  onClose: () => void;
  isSaving: boolean;
}) {
  const [formData, setFormData] = useState({
    commissionRate: initialData?.commissionRate ? String(initialData.commissionRate) : "",
    status: initialData?.status ?? 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(initialData.id, {
      commissionRate: formData.commissionRate ? Number(formData.commissionRate) : null,
      status: formData.status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-brand/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg border border-brand/10 overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-brand/5 flex justify-between items-center bg-surface/50">
          <div>
            <h2 className="text-xl font-black text-foreground">Editar Afiliado</h2>
            <p className="text-xs font-bold text-muted uppercase tracking-widest">{initialData?.firstName || initialData?.email}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-muted hover:text-foreground hover:bg-brand/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="affiliate-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted border-b border-brand/5 pb-2">Comissões</h3>
              
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Taxa de Comissão Específica (%)
                </label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-brand/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    placeholder={`Deixe vazio para usar a global (${initialData?.globalRate}%)`}
                  />
                </div>
                <p className="text-xs text-muted mt-2 font-medium">
                  Se preenchido, esta taxa substituirá a taxa global para este afiliado específico.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted border-b border-brand/5 pb-2">Status</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 1 })}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                    formData.status === 1 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : 'border-brand/10 bg-surface text-muted hover:bg-brand/5'
                  }`}
                >
                  <UserCheck className={`w-6 h-6 mb-2 ${formData.status === 1 ? 'text-emerald-500' : ''}`} />
                  <span className="font-bold">Ativo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 0 })}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                    formData.status === 0 
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-brand/10 bg-surface text-muted hover:bg-brand/5'
                  }`}
                >
                  <ShieldBan className={`w-6 h-6 mb-2 ${formData.status === 0 ? 'text-red-500' : ''}`} />
                  <span className="font-bold">Inativo</span>
                </button>
              </div>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-brand/5 bg-surface/50 flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="affiliate-form"
            isLoading={isSaving}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar Alterações
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
