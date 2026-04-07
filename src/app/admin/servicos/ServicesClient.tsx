"use client";

import React, { useState, useTransition } from "react";
import ServicesList from "@/components/admin/services/ServicesList";
import ServiceForm from "@/components/admin/services/ServiceForm";
import { 
  upsertService, 
  toggleServiceStatus, 
  deleteService,
  bulkPriceAdjustment,
  bulkApiIdAdjustment
} from "@/app/admin/servicos/actions";
import { AnimatePresence, motion } from "framer-motion";
import { TrendingUp, Percent, AlertCircle, Settings, CheckSquare } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";

export default function ServicesClient({ 
  initialServices, 
  socialNetworks, 
  apiProviders 
}: { 
  initialServices: any[], 
  socialNetworks: any[], 
  apiProviders: any[] 
}) {
  const [services, setServices] = useState(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkPercentage, setBulkPercentage] = useState("");
  const [bulkNetworkId, setBulkNetworkId] = useState<number | "all">("all");

  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  
  const [isBulkApiModalOpen, setIsBulkApiModalOpen] = useState(false);
  const [bulkApiProviderId, setBulkApiProviderId] = useState<number | "">("");
  const [bulkApiServiceId, setBulkApiServiceId] = useState("");

  const handleEdit = (service: any) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleSave = async (data: any) => {
    setIsSaving(true);
    const result = await upsertService(data);
    if (result.success) {
      // Recarrega localmente ou via router.refresh()
      window.location.reload(); 
    } else {
      alert(result.error);
    }
    setIsSaving(false);
  };

  const handleToggleStatus = async (id: number, currentStatus: number) => {
    const result = await toggleServiceStatus(id, currentStatus);
    if (result.success) {
      setServices(prev => prev.map(s => s.id === id ? { ...s, status: currentStatus === 1 ? 0 : 1 } : s));
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir? Se houver pedidos vinculados, o serviço será apenas desativado.")) {
      const result = await deleteService(id);
      if (result.success) {
        window.location.reload();
      }
    }
  };

  const handleBulkAdjustment = async () => {
    if (!bulkPercentage || isNaN(Number(bulkPercentage))) return;
    
    if (confirm(`Ajustar preços em ${bulkPercentage}% para ${bulkNetworkId === 'all' ? 'todos os serviços' : 'a rede selecionada'}?`)) {
      const result = await bulkPriceAdjustment(Number(bulkPercentage), { 
        socialNetworkId: bulkNetworkId === 'all' ? undefined : Number(bulkNetworkId) 
      });
      if (result.success) {
        alert(`${result.count} serviços atualizados!`);
        window.location.reload();
      }
    }
  };

  const handleBulkApiAdjustment = async () => {
    if (selectedServices.length === 0) return;
    
    setIsSaving(true);
    const result = await bulkApiIdAdjustment(
      selectedServices, 
      bulkApiProviderId ? Number(bulkApiProviderId) : null, 
      bulkApiServiceId
    );
    
    if (result.success) {
      alert(`${result.count} serviços vinculados com sucesso!`);
      window.location.reload();
    } else {
      alert(result.error);
    }
    setIsSaving(false);
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in-up">
      {/* Header com Stats & Ações em Massa */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Catálogo de Serviços</h1>
          <p className="text-sm font-bold text-muted uppercase tracking-tighter">Gerencie seus pacotes, preços e integrações SMM</p>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
             {selectedServices.length > 0 && isSelectionMode && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setIsBulkApiModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-brand-gradient text-white rounded-2xl text-xs font-black shadow-brand active:scale-95 transition-all"
                >
                  <Settings size={16} />
                  Alterar API ({selectedServices.length})
                </motion.button>
             )}
          </AnimatePresence>
          <button 
            onClick={() => {
              setIsSelectionMode(!isSelectionMode);
              if (isSelectionMode) setSelectedServices([]);
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black shadow-sm transition-all active:scale-95 ${
              isSelectionMode 
                ? "bg-red-50 text-red-500 border border-red-100 hover:bg-red-100" 
                : "bg-surface border border-border/50 text-foreground hover:bg-card"
            }`}
          >
            <CheckSquare size={16} />
            {isSelectionMode ? "Concluir / Cancelar" : "Selecionar Vários"}
          </button>
          <div className="w-px h-8 bg-border/50 mx-1" />
          <button 
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-brand/10 text-primary rounded-2xl text-xs font-black shadow-sm hover:bg-primary-light transition-all active:scale-95"
          >
            <Percent size={16} />
            Ajuste em Massa
          </button>
        </div>
      </div>

      {/* Tabela de Serviços */}
      <ServicesList 
        services={services}
        socialNetworks={socialNetworks}
        onEdit={handleEdit}
        onAdd={handleAdd}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        selectedServices={selectedServices}
        onSelectionChange={setSelectedServices}
        isSelectionMode={isSelectionMode}
      />

      {/* Modal de Formulário */}
      <AnimatePresence>
        {isModalOpen && (
          <ServiceForm 
            initialData={editingService}
            socialNetworks={socialNetworks}
            apiProviders={apiProviders}
            onSave={handleSave}
            onClose={() => setIsModalOpen(false)}
            isSaving={isSaving}
          />
        )}
      </AnimatePresence>

      {/* Modal de Ajuste em Massa */}
      <AnimatePresence>
        {isBulkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsBulkModalOpen(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-md bg-card border border-border rounded-[2.5rem] p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                  <Percent size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground">Ajuste de Preços</h3>
                  <p className="text-xs font-bold text-muted uppercase tracking-widest text-[10px]">Aumento ou redução global</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-muted mb-2 ml-1">Porcentagem (%)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 10 para aumentar, -5 para baixar"
                    className="w-full h-14 px-6 bg-surface rounded-2xl border border-transparent focus:ring-8 focus:ring-amber-500/5 font-black text-sm outline-none transition-all"
                    value={bulkPercentage}
                    onChange={(e) => setBulkPercentage(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-muted mb-2 ml-1">Filtrar Rede</label>
                  <CustomSelect 
                    options={[
                      { value: "all", label: "Todas as Redes" },
                      ...socialNetworks.map(sn => ({ value: sn.id, label: sn.name }))
                    ]}
                    value={bulkNetworkId}
                    onChange={(val) => setBulkNetworkId(val)}
                  />
                </div>
                
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/30 flex gap-3">
                    <AlertCircle size={20} className="text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-medium text-amber-700 dark:text-amber-200/70 leading-relaxed">
                        Esta ação atualizará o preço de todos os serviços selecionados permanentemente. Use com cautela.
                    </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setIsBulkModalOpen(false)} className="flex-1 px-6 py-3 font-bold text-muted hover:text-foreground">Cancelar</button>
                  <button onClick={handleBulkAdjustment} className="flex-1 px-6 py-3 bg-amber-500 text-white rounded-2xl text-sm font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all">
                    Aplicar Agora
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Integração API em Massa */}
      <AnimatePresence>
        {isBulkApiModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsBulkApiModalOpen(false)} className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-card border border-border rounded-[2.5rem] p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center text-white shadow-brand">
                  <Settings size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground tracking-tight">Vincular Fornecedor</h3>
                  <p className="text-xs font-bold text-muted uppercase tracking-widest text-[10px]">Ação em lote</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-muted mb-2 ml-1">Provedor de API *</label>
                  <CustomSelect 
                    options={[
                      { value: "", label: "Selecione o fornecedor..." },
                      ...apiProviders.map(ap => ({ value: ap.id, label: ap.name }))
                    ]}
                    value={bulkApiProviderId}
                    onChange={(val) => setBulkApiProviderId(Number(val) || "")}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-muted mb-2 ml-1">ID do Serviço (API) Opcional</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 1450"
                    className="w-full h-14 px-6 bg-surface rounded-2xl border border-transparent focus:ring-8 focus:ring-primary/5 font-black text-sm outline-none transition-all"
                    value={bulkApiServiceId}
                    onChange={(e) => setBulkApiServiceId(e.target.value)}
                  />
                </div>
                
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex gap-3">
                    <AlertCircle size={20} className="text-primary shrink-0 mt-0.5" />
                    <p className="text-[11px] font-medium text-foreground leading-relaxed">
                        Os <strong>{selectedServices.length} serviços</strong> selecionados serão definidos para entrega via API com o ID informado.
                    </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setIsBulkApiModalOpen(false)} className="flex-1 px-6 py-3 font-bold text-muted hover:text-foreground">Cancelar</button>
                  <button disabled={isSaving || !bulkApiProviderId} onClick={handleBulkApiAdjustment} className="flex-1 px-6 py-3 bg-brand-gradient text-white rounded-2xl text-sm font-black shadow-brand active:scale-95 transition-all disabled:opacity-50">
                    {isSaving ? "Integrando..." : "Salvar Configuração"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
