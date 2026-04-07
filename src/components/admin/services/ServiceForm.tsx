"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Save, 
  Package, 
  DollarSign, 
  Settings, 
  Info,
  ChevronDown,
  Trash2,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomSelect from "@/components/ui/CustomSelect";

interface Category {
  id: number;
  name: string;
  socialNetworkId: number;
}

interface SocialNetwork {
  id: number;
  name: string;
  categories: Category[];
}

interface ApiProvider {
  id: number;
  name: string;
}

interface ServiceFormProps {
  initialData?: any;
  socialNetworks: SocialNetwork[];
  apiProviders: ApiProvider[];
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

export default function ServiceForm({ 
  initialData, 
  socialNetworks, 
  apiProviders, 
  onSave, 
  onClose,
  isSaving 
}: ServiceFormProps) {
  const [formData, setFormData] = useState<any>({
    name: "",
    categoryId: "",
    description: "",
    discount: 0,
    minOrder: 100,
    maxOrder: 10000,
    addType: "MANUAL",
    apiProviderId: "",
    apiServiceId: "",
    status: 1,
    ...initialData,
    // Se estiver editando, Price e Decimal podem vir como objetos Prisma.Decimal
    price: initialData?.price ? Number(initialData.price) : "",
    originalPrice: initialData?.originalPrice ? Number(initialData.originalPrice) : ""
  });

  const [selectedNetworkId, setSelectedNetworkId] = useState<number | "">(
    initialData?.category?.socialNetworkId || ""
  );

  const filteredCategories = socialNetworks.find(sn => sn.id === selectedNetworkId)?.categories || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId || !formData.price) {
      alert("Por favor, preencha os campos obrigatórios (Nome, Categoria e Preço)");
      return;
    }
    
    // Remove relacionamentos e metadados que causam erro no Prisma Update
    const payload = {
      id: formData.id,
      name: formData.name,
      description: formData.description,
      categoryId: Number(formData.categoryId),
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      discount: Number(formData.discount),
      addType: formData.addType,
      apiProviderId: formData.apiProviderId ? Number(formData.apiProviderId) : null,
      apiServiceId: formData.apiServiceId,
      status: Number(formData.status)
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-8 border-b border-border flex items-center justify-between bg-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center text-white shadow-brand">
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground">{initialData ? "Editar" : "Novo"} Serviço</h2>
              <p className="text-xs font-bold text-muted uppercase tracking-tighter">Configure os detalhes do seu pacote</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface hover:shadow-sm rounded-xl transition-all text-muted"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* Sessão Básica */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Info size={16} />
              <h3 className="text-xs font-black uppercase tracking-widest">Informações Básicas</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-muted mb-2 ml-1">Nome do Serviço *</label>
                <input 
                  type="text" 
                  className="w-full h-12 px-4 bg-surface rounded-2xl border border-transparent focus:border-primary/20 focus:bg-card focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm text-foreground"
                  placeholder="Ex: 1000 Seguidores Brasileiros"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-muted mb-2 ml-1">Descrição (Opcional)</label>
                <textarea 
                  className="w-full p-4 min-h-[100px] bg-surface rounded-2xl border border-transparent focus:border-primary/20 focus:bg-card focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-sm text-foreground"
                  placeholder="Detalhes sobre a entrega, garantia, etc..."
                  value={formData.description || ""}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Categoria e Rede */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-muted mb-2 ml-1">Rede Social</label>
              <CustomSelect 
                options={[
                  { value: "", label: "Selecione..." },
                  ...socialNetworks.map(sn => ({ value: sn.id, label: sn.name }))
                ]}
                value={selectedNetworkId}
                onChange={(val) => {
                  setSelectedNetworkId(Number(val));
                  setFormData({...formData, categoryId: ""});
                }}
              />
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-muted mb-2 ml-1">Categoria *</label>
              <CustomSelect 
                options={[
                  { value: "", label: selectedNetworkId ? "Selecione a categoria..." : "Selecione a rede primeiro..." },
                  ...filteredCategories.map(cat => ({ value: cat.id, label: cat.name }))
                ]}
                value={formData.categoryId}
                onChange={(val) => setFormData({...formData, categoryId: val})}
              />
            </div>
          </div>

          <div className="h-px bg-brand/5" />

          {/* Preços e Quantidade */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <DollarSign size={16} />
              <h3 className="text-xs font-black uppercase tracking-widest">Pricing & Config</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-muted mb-2 ml-1">Preço Atual (R$) *</label>
                <input 
                  type="number" step="0.01" 
                  className="w-full h-12 px-4 bg-surface rounded-2xl border border-transparent focus:ring-8 focus:ring-primary/5 font-black text-sm outline-none text-foreground"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-muted mb-2 ml-1">Preço Original (R$)</label>
                <input 
                  type="number" step="0.01" 
                  className="w-full h-12 px-4 bg-surface rounded-2xl border border-transparent focus:ring-2 focus:ring-primary/20 font-bold text-sm outline-none"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-muted mb-2 ml-1">% Desconto Exibido</label>
                <input 
                  type="number" 
                  className="w-full h-12 px-4 bg-surface rounded-2xl border border-transparent focus:ring-2 focus:ring-primary/20 font-bold text-sm outline-none"
                  value={formData.discount}
                  onChange={(e) => setFormData({...formData, discount: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-muted mb-2 ml-1">Status</label>
                <CustomSelect 
                  options={[
                    { value: 1, label: "Ativo" },
                    { value: 0, label: "Inativo" }
                  ]}
                  value={formData.status}
                  onChange={(val) => setFormData({...formData, status: Number(val)})}
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-brand/5" />

          {/* Integração de API */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Settings size={16} />
              <h3 className="text-xs font-black uppercase tracking-widest">Integração Externa (SMM Panel)</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-muted mb-2 ml-1">Tipo de Envio</label>
                <CustomSelect 
                  options={[
                    { value: "MANUAL", label: "MANUAL" },
                    { value: "API", label: "API (Automático)" }
                  ]}
                  value={formData.addType}
                  onChange={(val) => setFormData({...formData, addType: val})}
                />
              </div>
              {formData.addType === "API" && (
                <>
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-muted mb-2 ml-1">Provedor API</label>
                    <CustomSelect 
                      options={[
                        { value: "", label: "Nenhum..." },
                        ...apiProviders.map(ap => ({ value: ap.id, label: ap.name }))
                      ]}
                      value={formData.apiProviderId}
                      onChange={(val) => setFormData({...formData, apiProviderId: val})}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-muted mb-2 ml-1">ID do Serviço na API</label>
                    <input 
                      type="text" 
                      className="w-full h-12 px-4 bg-surface rounded-2xl border border-transparent focus:ring-2 focus:ring-primary/20 font-bold text-sm outline-none"
                      placeholder="Ex: 1450"
                      value={formData.apiServiceId || ""}
                      onChange={(e) => setFormData({...formData, apiServiceId: e.target.value})}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-8 border-t border-border bg-surface flex justify-between items-center">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-sm font-bold text-muted hover:text-foreground transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className={`flex items-center gap-2 px-10 py-3 bg-brand-gradient text-white rounded-2xl text-sm font-black shadow-brand active:scale-95 transition-all ${
              isSaving ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Salvar Alterações
          </button>
        </div>
      </motion.div>
    </div>
  );
}
