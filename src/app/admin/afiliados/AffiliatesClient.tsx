"use client";

import React, { useState } from "react";
import AffiliatesList from "@/components/admin/affiliates/AffiliatesList";
import AffiliateForm from "@/components/admin/affiliates/AffiliateForm";
import { updateAffiliate } from "./actions";
import { AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/Toast";

export default function AffiliatesClient({ 
  initialAffiliates 
}: { 
  initialAffiliates: any[]
}) {
  const { toast } = useToast();
  const [affiliates, setAffiliates] = useState(initialAffiliates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (affiliate: any) => {
    setEditingAffiliate(affiliate);
    setIsModalOpen(true);
  };

  const handleSave = async (id: number, data: any) => {
    setIsSaving(true);
    const result = await updateAffiliate(id, data);
    if (result.success) {
      setAffiliates(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
      toast("success", "Afiliado atualizado com sucesso.");
      setIsModalOpen(false);
    } else {
      toast("error", "Erro ao salvar", result.error);
    }
    setIsSaving(false);
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in-up">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Gestão de Afiliados</h1>
          <p className="text-sm font-bold text-muted uppercase tracking-tighter">Administre parceiros, comissões individuais e métricas</p>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="px-5 py-3 bg-white border border-brand/10 rounded-2xl shadow-sm">
             <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Total de Afiliados</p>
             <p className="text-xl font-black text-primary">{affiliates.length}</p>
          </div>
        </div>
      </div>

      <AffiliatesList 
        affiliates={affiliates}
        onEdit={handleEdit}
      />

      <AnimatePresence>
        {isModalOpen && (
          <AffiliateForm 
            initialData={editingAffiliate}
            onSave={handleSave}
            onClose={() => setIsModalOpen(false)}
            isSaving={isSaving}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
