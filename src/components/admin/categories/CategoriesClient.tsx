"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  FolderTree, 
  Layers, 
  Smartphone,
  ChevronRight,
  LayoutGrid,
  Hash,
  Activity,
  Globe,
  Settings2,
  Package
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    upsertSocialNetwork, 
    deleteSocialNetwork, 
    upsertCategory, 
    deleteCategory 
} from "@/app/admin/categorias/actions";
import CustomSelect from "@/components/ui/CustomSelect";

interface Category {
  id: number;
  name: string;
  description: string | null;
  sortOrder: number;
  status: number;
  _count: { services: number };
}

interface SocialNetwork {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  status: number;
  categories: Category[];
}

export default function CategoriesClient({ 
  initialSocialNetworks 
}: { 
  initialSocialNetworks: SocialNetwork[] 
}) {
  const [networks, setNetworks] = useState<SocialNetwork[]>(initialSocialNetworks);
  const [selectedNetworkId, setSelectedNetworkId] = useState<number | null>(
    initialSocialNetworks.length > 0 ? initialSocialNetworks[0].id : null
  );

  // Estados de Modais
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingNetwork, setEditingNetwork] = useState<Partial<SocialNetwork> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const selectedNetwork = networks.find(n => n.id === selectedNetworkId);

  // --- Handlers Redes Sociais ---
  const handleSaveNetwork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNetwork?.name) return;
    setIsSaving(true);
    const result = await upsertSocialNetwork(editingNetwork.id || null, editingNetwork);
    if (result.success) {
      window.location.reload();
    } else {
      alert(result.error);
    }
    setIsSaving(false);
  };

  const handleDeleteNetwork = async (id: number) => {
    if (confirm("Deseja realmente excluir esta rede social? Isso removerá o acesso às suas categorias.")) {
      const result = await deleteSocialNetwork(id);
      if (result.success) {
        setNetworks(prev => prev.filter(n => n.id !== id));
        if (selectedNetworkId === id) setSelectedNetworkId(null);
      } else {
        alert(result.error);
      }
    }
  };

  // --- Handlers Categorias ---
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name || !selectedNetworkId) return;
    setIsSaving(true);
    const result = await upsertCategory(editingCategory.id || null, selectedNetworkId, editingCategory);
    if (result.success) {
      window.location.reload();
    } else {
      alert(result.error);
    }
    setIsSaving(false);
  };

  const handleDeleteCategory = async (id: number) => {
    if (confirm("Excluir esta categoria? Isso falhará se houver serviços vinculados.")) {
      const result = await deleteCategory(id);
      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error);
      }
    }
  };

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tighter mb-1">Redes & Categorias</h1>
          <p className="text-[10px] font-black text-muted uppercase tracking-widest">Organize a estrutura do seu catálogo de serviços</p>
        </div>
        <button 
           onClick={() => { setEditingNetwork({ status: 1, sortOrder: 0 }); setIsNetworkModalOpen(true); }}
           className="flex items-center gap-2 px-8 py-4 bg-brand-gradient text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-brand hover:opacity-90 active:scale-95 transition-all"
        >
            <Plus size={18} /> Nova Rede Social
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar: Redes Sociais */}
          <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between px-4 mb-4">
                 <h2 className="text-[10px] font-black uppercase tracking-widest text-muted">Redes Ativas</h2>
              </div>
              <div className="space-y-3">
                {networks.map((network) => (
                    <div 
                      key={network.id}
                      onClick={() => setSelectedNetworkId(network.id)}
                      className={`group flex items-center justify-between p-4 rounded-3xl cursor-pointer transition-all border ${
                        selectedNetworkId === network.id 
                        ? "bg-card border-border shadow-card scale-[1.02]" 
                        : "bg-surface border-transparent hover:bg-card/50 text-muted"
                      }`}
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                                selectedNetworkId === network.id ? "bg-primary text-white shadow-brand" : "bg-surface text-muted group-hover:text-primary"
                            }`}>
                                <Globe size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className={`text-sm font-black truncate ${selectedNetworkId === network.id ? "text-foreground" : "text-muted group-hover:text-foreground"}`}>
                                    {network.name}
                                </p>
                                <p className="text-[9px] font-bold uppercase tracking-widest opacity-50">
                                    {network.categories.length} categorias
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); setEditingNetwork(network); setIsNetworkModalOpen(true); }} className="p-2 hover:bg-surface rounded-xl text-muted hover:text-primary"><Edit2 size={14} /></button>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteNetwork(network.id); }} className="p-2 hover:bg-surface rounded-xl text-muted hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${selectedNetworkId === network.id ? "scale-110 text-primary" : "text-muted/30"}`} />
                    </div>
                ))}
              </div>
          </div>

          {/* Central: Categorias da Rede Selecionada */}
          <div className="lg:col-span-8">
              {selectedNetwork ? (
                  <div className="bg-card rounded-[2.5rem] border border-border shadow-card overflow-hidden">
                      <div className="p-10 border-b border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                         <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white border border-border flex items-center justify-center text-primary shadow-sm">
                                <FolderTree size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-foreground tracking-tighter">{selectedNetwork.name}</h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted">Gestão de Segmentos</p>
                            </div>
                         </div>
                         <button 
                            onClick={() => { setEditingCategory({ status: 1, sortOrder: 0 }); setIsCategoryModalOpen(true); }}
                            className="px-6 py-3.5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-brand hover:opacity-90 transition-all flex items-center gap-2"
                         >
                            <Plus size={16} /> Nova Categoria
                         </button>
                      </div>

                      <div className="p-10">
                        {selectedNetwork.categories.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {selectedNetwork.categories.map((cat) => (
                                    <div key={cat.id} className="p-6 bg-surface rounded-[2rem] border border-border group hover:bg-card hover:shadow-sm transition-all border-l-4 border-l-primary/30">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-primary">
                                                <Layers size={20} />
                                            </div>
                                            <div className="flex gap-1">
                                                <button onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); }} className="p-2.5 text-muted hover:text-primary hover:bg-white rounded-xl transition-all"><Edit2 size={14} /></button>
                                                <button onClick={() => handleDeleteCategory(cat.id)} className="p-2.5 text-muted hover:text-red-500 hover:bg-white rounded-xl transition-all"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                        <h4 className="text-lg font-black text-foreground mb-1">{cat.name}</h4>
                                        <p className="text-xs font-bold text-muted uppercase tracking-widest flex items-center gap-2">
                                            <Activity size={10} className="text-primary" /> {cat._count.services} Serviços Vinculados
                                        </p>
                                        <div className="mt-6 flex items-center justify-between">
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                                cat.status === 1 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                                {cat.status === 1 ? "Ativo" : "Pausa"}
                                            </span>
                                            <span className="text-[10px] font-black text-muted flex items-center gap-1 opacity-40">
                                                <Settings2 size={10} /> Ordem: #{cat.sortOrder}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 text-center opacity-30 flex flex-col items-center gap-4">
                                <LayoutGrid size={48} />
                                <p className="text-sm font-black uppercase tracking-widest">Nenhuma categoria registrada.</p>
                            </div>
                        )}
                      </div>
                  </div>
              ) : (
                  <div className="py-24 text-center opacity-30 flex flex-col items-center gap-4">
                      <Smartphone size={64} />
                      <p className="text-lg font-black uppercase tracking-widest">Selecione uma rede ao lado.</p>
                  </div>
              )}
          </div>
      </div>

      {/* --- MODAIS --- */}

      {/* Modal Redes Sociais */}
      <AnimatePresence>
        {isNetworkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsNetworkModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-md" />
             <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-card rounded-[2.5rem] p-12 shadow-2xl border border-border">
                <h2 className="text-2xl font-black text-foreground tracking-tighter mb-8">{editingNetwork?.id ? "Editar" : "Nova"} Rede Social</h2>
                <form onSubmit={handleSaveNetwork} className="space-y-6">
                   <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Nome da Rede</label>
                       <input 
                         className="w-full h-14 px-6 bg-surface rounded-2xl border border-transparent focus:border-primary/20 focus:ring-8 focus:ring-primary/5 outline-none transition-all font-black"
                         value={editingNetwork?.name || ""}
                         onChange={(e) => setEditingNetwork({...editingNetwork, name: e.target.value})}
                         placeholder="Ex: Instagram, TikTok..."
                         required
                       />
                   </div>
                   <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Descrição (Suporta HTML)</label>
                       <textarea 
                         className="w-full min-h-[100px] p-6 bg-surface rounded-2xl border border-transparent focus:border-primary/20 focus:ring-8 focus:ring-primary/5 outline-none transition-all text-sm font-medium resize-y"
                         value={editingNetwork?.description || ""}
                         onChange={(e) => setEditingNetwork({...editingNetwork, description: e.target.value})}
                         placeholder="Ex: <p>Quer crescer rápido no <strong>Instagram?</strong>..."
                       />
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Ordem (Ex: 1, 2, 3)</label>
                            <input 
                                type="number"
                                className="w-full h-14 px-6 bg-surface rounded-2xl border border-transparent focus:ring-4 focus:ring-primary/5 outline-none transition-all font-black"
                                value={editingNetwork?.sortOrder ?? 0}
                                onChange={(e) => setEditingNetwork({...editingNetwork, sortOrder: Number(e.target.value)})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Status</label>
                            <CustomSelect 
                                options={[
                                    { value: 1, label: "Ativo" },
                                    { value: 0, label: "Desativado" }
                                ]}
                                value={editingNetwork?.status ?? 1}
                                onChange={(val) => setEditingNetwork({...editingNetwork, status: val})}
                            />
                        </div>
                   </div>
                   <div className="flex justify-end gap-3 pt-4">
                      <button type="button" onClick={() => setIsNetworkModalOpen(false)} className="px-6 py-4 text-[10px] font-black uppercase text-muted">Cancelar</button>
                      <button type="submit" disabled={isSaving} className="px-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-brand hover:opacity-90">
                         {isSaving ? "Salvando..." : "Salvar Configuração"}
                      </button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Categorias */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCategoryModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-md" />
             <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-card rounded-[2.5rem] p-12 shadow-2xl border border-border">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Package size={20} />
                    </div>
                    <h2 className="text-2xl font-black text-foreground tracking-tighter">{editingCategory?.id ? "Editar" : "Nova"} Categoria</h2>
                </div>
                <form onSubmit={handleSaveCategory} className="space-y-6">
                   <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Nome da Categoria</label>
                       <input 
                         className="w-full h-14 px-6 bg-surface rounded-2xl border border-transparent focus:ring-8 focus:ring-primary/5 outline-none transition-all font-black"
                         value={editingCategory?.name || ""}
                         onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                         placeholder="Ex: Seguidores Brasileiros, Curtidas Reais..."
                         required
                       />
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Ordem (Prioridade)</label>
                            <input 
                                type="number"
                                className="w-full h-14 px-6 bg-surface rounded-2xl border border-transparent focus:ring-4 focus:ring-primary/5 outline-none transition-all font-black"
                                value={editingCategory?.sortOrder ?? 0}
                                onChange={(e) => setEditingCategory({...editingCategory, sortOrder: Number(e.target.value)})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Status Visível</label>
                            <CustomSelect 
                                options={[
                                    { value: 1, label: "Ligar" },
                                    { value: 0, label: "Desligar" }
                                ]}
                                value={editingCategory?.status ?? 1}
                                onChange={(val) => setEditingCategory({...editingCategory, status: val})}
                            />
                        </div>
                   </div>
                   <div className="flex justify-end gap-3 pt-4">
                      <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-6 py-4 text-[10px] font-black uppercase text-muted">Cancelar</button>
                      <button type="submit" disabled={isSaving} className="px-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-brand hover:opacity-90">
                         {isSaving ? "Processando..." : "Salvar Categoria"}
                      </button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
