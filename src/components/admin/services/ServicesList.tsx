"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Power, 
  Filter,
  Package,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomSelect from "@/components/ui/CustomSelect";

interface Service {
  id: number;
  name: string;
  price: number | any;
  originalPrice?: number | any;
  status: number;
  categoryId: number;
  category: {
    name: string;
    status: number;
    socialNetwork: {
      id: number;
      name: string;
    }
  };
  apiProvider?: {
    name: string;
  } | null;
}

interface ServicesListProps {
  services: Service[];
  socialNetworks: { id: number; name: string }[];
  onEdit: (service: Service) => void;
  onToggleStatus: (id: number, currentStatus: number) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
  selectedServices: number[];
  onSelectionChange: (ids: number[]) => void;
  isSelectionMode: boolean;
}

export default function ServicesList({ 
  services, 
  socialNetworks, 
  onEdit, 
  onToggleStatus, 
  onDelete,
  onAdd,
  selectedServices,
  onSelectionChange,
  isSelectionMode
}: ServicesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<number | "all">("all");

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      if (s.category.status === 0) return false;
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesNetwork = selectedNetwork === "all" || s.category.socialNetwork.id === selectedNetwork;
      return matchesSearch && matchesNetwork;
    });
  }, [services, searchTerm, selectedNetwork]);

  const groupedServices = useMemo(() => {
    const groups: Record<string, Record<string, Service[]>> = {};
    filteredServices.forEach(s => {
      const net = s.category.socialNetwork.name;
      const cat = s.category.name;
      if (!groups[net]) groups[net] = {};
      if (!groups[net][cat]) groups[net][cat] = [];
      groups[net][cat].push(s);
    });
    return groups;
  }, [filteredServices]);

  return (
    <div className="bg-card rounded-[2.5rem] border border-border shadow-card overflow-hidden">
      {/* Header & Filters */}
      <div className="p-8 border-b border-border bg-surface/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input 
                type="text" 
                placeholder="Buscar serviço..."
                className="w-full h-12 pl-12 pr-4 bg-card rounded-2xl text-sm border border-border focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <CustomSelect
              className="w-64 !h-12"
              options={[
                { value: "all", label: "Todas as Redes" },
                ...socialNetworks.map(sn => ({ value: sn.id, label: sn.name }))
              ]}
              value={selectedNetwork}
              onChange={(val) => setSelectedNetwork(val)}
              icon={Filter}
            />
          </div>
          
          <button 
            onClick={onAdd}
            className="flex items-center justify-center gap-2 px-6 h-12 bg-brand-gradient text-white rounded-2xl text-sm font-bold shadow-brand hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Novo Serviço
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-surface/50 text-left">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted border-b border-border">Serviço</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted border-b border-border">Preço (Custo)</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted border-b border-border text-right">Status</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted border-b border-border text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {Object.entries(groupedServices).map(([netName, categories]) => (
                <React.Fragment key={netName}>
                  <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-primary/5 border-l-4 border-l-primary border-b border-border/50">
                    <td colSpan={4} className="px-8 py-4 text-xs font-black text-primary uppercase tracking-widest flex items-center gap-3">
                       {netName}
                    </td>
                  </motion.tr>
                  
                  {Object.entries(categories).map(([catName, servs]) => (
                    <React.Fragment key={`${netName}-${catName}`}>
                      <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface/60 border-b border-border/30">
                        <td colSpan={4} className="px-8 py-3 text-[10px] font-black text-muted uppercase tracking-widest pl-12 flex items-center gap-3">
                           <ChevronRight size={14}/> {catName}
                        </td>
                      </motion.tr>
                      
                      {servs.map((s, i) => (
                        <motion.tr 
                          key={s.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: i * 0.01 }}
                          className="hover:bg-surface/40 transition-colors group border-b border-border/10 last:border-0"
                        >
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-4">
                              <AnimatePresence>
                                {isSelectionMode && (
                                  <motion.div 
                                    initial={{ opacity: 0, width: 0, paddingRight: 0 }} 
                                    animate={{ opacity: 1, width: "auto", paddingRight: 12 }} 
                                    exit={{ opacity: 0, width: 0, paddingRight: 0 }} 
                                    className="overflow-hidden shrink-0"
                                  >
                                    <input 
                                      type="checkbox" 
                                      className="w-4 h-4 rounded-[4px] border-2 border-border text-primary focus:ring-opacity-20 cursor-pointer shadow-sm focus:ring-primary focus:ring-2 transition-all accent-primary hover:border-primary/50"
                                      checked={selectedServices.includes(s.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) onSelectionChange([...selectedServices, s.id]);
                                        else onSelectionChange(selectedServices.filter(id => id !== s.id));
                                      }}
                                    />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <div className="w-10 h-10 rounded-2xl bg-surface border border-border flex items-center justify-center text-primary group-hover:scale-105 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all shrink-0">
                                <Package size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-black text-foreground leading-tight group-hover:text-primary transition-colors">{s.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-4 uppercase tracking-tighter w-48">
                            <p className="text-sm font-black text-foreground">R$ {Number(s.price).toFixed(2).replace(".", ",")}</p>
                            {s.originalPrice && (
                              <p className="text-[10px] font-bold text-muted mt-0.5">Original: R$ {Number(s.originalPrice).toFixed(2)}</p>
                            )}
                          </td>
                          <td className="px-8 py-4 text-right w-40">
                            <button 
                              onClick={() => onToggleStatus(s.id, s.status)}
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                s.status === 1 
                                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                                  : "bg-red-500/10 text-red-500 border border-red-500/20"
                              }`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${s.status === 1 ? "bg-emerald-500" : "bg-red-500"} animate-pulse`} />
                              {s.status === 1 ? "Ativo" : "Pausa"}
                            </button>
                          </td>
                          <td className="px-8 py-4 text-right w-32">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => onEdit(s)}
                                className="p-2.5 bg-surface hover:bg-white hover:text-primary hover:shadow-sm rounded-xl transition-all text-muted border border-transparent hover:border-border"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => onDelete(s.id)}
                                className="p-2.5 bg-surface hover:bg-white hover:text-red-500 hover:shadow-sm rounded-xl transition-all text-muted border border-transparent hover:border-border"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </AnimatePresence>
            {filteredServices.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center text-muted">
                      <Search size={32} />
                    </div>
                    <p className="text-muted text-sm font-bold">Nenhum serviço encontrado.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-6 bg-surface/30 border-t border-brand/10">
        <p className="text-[11px] text-muted font-bold uppercase tracking-widest">
          Mostrando {filteredServices.length} de {services.length} serviços cadastrados
        </p>
      </div>
    </div>
  );
}
