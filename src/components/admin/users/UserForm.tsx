"use client";

import React, { useState } from "react";
import { 
  X, 
  Save, 
  User, 
  Mail, 
  Smartphone, 
  ShieldCheck, 
  Info,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { motion } from "framer-motion";

interface UserFormProps {
  initialData: any;
  onSave: (id: number, data: any) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

export default function UserForm({ 
  initialData, 
  onSave, 
  onClose,
  isSaving 
}: UserFormProps) {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    email: initialData.email || "",
    whatsapp: initialData.whatsapp || "",
    role: initialData.role || "CUSTOMER",
    status: initialData.status ?? 1,
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(initialData.id, formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-8 border-b border-brand/10 flex items-center justify-between bg-surface/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center text-white shadow-brand">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground">Editar Usuário</h2>
              <p className="text-xs font-bold text-muted uppercase tracking-tighter">ID: #{initialData.id} • Membro desde {new Date(initialData.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-muted"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* Nome e E-mail */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Info size={16} />
              <h3 className="text-xs font-black uppercase tracking-widest">Informações Pessoais</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-muted mb-2 ml-1">Nome</label>
                <input 
                  type="text" 
                  className="w-full h-12 px-4 bg-surface rounded-2xl border border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-muted mb-2 ml-1">Sobrenome</label>
                <input 
                  type="text" 
                  className="w-full h-12 px-4 bg-surface rounded-2xl border border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-muted mb-2 ml-1">E-mail de Acesso</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input 
                    type="email" 
                    className="w-full h-12 pl-10 pr-4 bg-surface rounded-2xl border border-transparent font-bold text-sm outline-none"
                    value={formData.email}
                    disabled
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-muted mb-2 ml-1">WhatsApp</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input 
                    type="text" 
                    className="w-full h-12 pl-10 pr-4 bg-surface rounded-2xl border border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 font-bold text-sm outline-none transition-all"
                    placeholder="5511999999999"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-brand/5" />

          {/* Permissões e Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck size={16} />
              <h3 className="text-xs font-black uppercase tracking-widest">Controles de Acesso</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-muted mb-2 ml-1">Cargo (Role)</label>
                <select 
                  className="w-full h-12 px-4 bg-surface rounded-2xl border border-transparent focus:ring-2 focus:ring-primary/20 font-bold text-sm outline-none cursor-pointer"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="CUSTOMER">Cliente</option>
                  <option value="SUPPORTER">Suporte</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-muted mb-2 ml-1">Status da Conta</label>
                <select 
                  className="w-full h-12 px-4 bg-surface rounded-2xl border border-transparent focus:ring-2 focus:ring-primary/20 font-bold text-sm outline-none cursor-pointer"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: Number(e.target.value)})}
                >
                  <option value={1}>Ativo</option>
                  <option value={0}>Bloqueado / Inativo</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-px bg-brand/5" />

          {/* Segurança */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Lock size={16} />
              <h3 className="text-xs font-black uppercase tracking-widest">Segurança</h3>
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-muted mb-2 ml-1">Nova Senha (deixe em branco para manter)</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full h-12 px-4 bg-surface rounded-2xl border border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm"
                  placeholder="Mínimo 8 caracteres"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-8 border-t border-brand/10 bg-surface/30 flex justify-between items-center">
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
