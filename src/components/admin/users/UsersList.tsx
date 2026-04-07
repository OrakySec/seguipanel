"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  User, 
  Edit2, 
  Trash2, 
  Filter,
  Mail,
  Smartphone,
  Calendar,
  Globe,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomSelect from "@/components/ui/CustomSelect";

interface UserData {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  status: number;
  whatsapp: string | null;
  totalOrders: number;
  totalSpent: number | any;
  historyIp: string | null;
  createdAt: Date;
}

interface UsersListProps {
  users: UserData[];
  onEdit: (user: UserData) => void;
  onToggleStatus: (id: number, currentStatus: number) => void;
  onDelete: (id: number) => void;
}

export default function UsersList({ 
  users, 
  onEdit, 
  onToggleStatus, 
  onDelete 
}: UsersListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const name = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
      const matchesSearch = 
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
        name.includes(searchTerm.toLowerCase()) ||
        (u.whatsapp && u.whatsapp.includes(searchTerm));
      
      const matchesRole = selectedRole === "all" || u.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, selectedRole]);

  return (
    <div className="bg-card rounded-[2.5rem] border border-border shadow-card overflow-hidden">
      {/* Search & Filters */}
      <div className="p-8 border-b border-border bg-surface/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input 
                type="text" 
                placeholder="Buscar usuário..."
                className="w-full h-12 pl-12 pr-4 bg-card rounded-2xl text-sm border border-border focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <CustomSelect
              className="w-64 !h-12"
              options={[
                { value: "all", label: "Todos os Cargos" },
                { value: "ADMIN", label: "Administradores" },
                { value: "CUSTOMER", label: "Clientes" },
                { value: "SUPPORTER", label: "Suporte" }
              ]}
              value={selectedRole}
              onChange={(val) => setSelectedRole(val)}
              icon={ShieldCheck}
            />
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-surface/50 text-left">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted border-b border-border">Usuário</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted border-b border-border">Nível / Status</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted border-b border-border">Gasto Total</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted border-b border-border text-right">Último IP</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted border-b border-border text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((u, i) => (
                <motion.tr 
                  key={u.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.01 }}
                  className="hover:bg-surface/40 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-primary group-hover:scale-105 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all">
                        <User size={22} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-foreground leading-tight group-hover:text-primary transition-colors">
                          {u.firstName || "Usuário"} {u.lastName || ""}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-muted font-bold flex items-center gap-1">
                            <Mail size={10} /> {u.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest ${
                        u.role === 'ADMIN' ? 'text-purple-500' : 'text-primary'
                      }`}>
                        {u.role === 'ADMIN' && <ShieldCheck size={10} />}
                        {u.role}
                      </span>
                      <button 
                        onClick={() => onToggleStatus(u.id, u.status)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 w-fit rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${
                          u.status === 1 
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                            : "bg-red-500/10 text-red-500 border border-red-500/20"
                        }`}
                      >
                        <div className={`w-1 h-1 rounded-full ${u.status === 1 ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                        {u.status === 1 ? "Ativo" : "Bloqueado"}
                      </button>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-foreground">
                        R$ {Number(u.totalSpent).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[9px] text-muted font-black uppercase tracking-widest mt-1">
                        {u.totalOrders} pedidos
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex flex-col items-end">
                      <code className="text-[10px] font-bold text-muted bg-surface px-2 py-0.5 rounded-lg flex items-center gap-1 border border-border">
                        <Globe size={10} /> {u.historyIp || "S/IP"}
                      </code>
                      <span className="text-[9px] text-muted font-black uppercase tracking-widest mt-1.5 inline-flex items-center gap-1">
                        <Calendar size={10} /> {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onEdit(u)}
                        className="p-3 bg-surface hover:bg-card hover:text-primary hover:shadow-sm rounded-xl transition-all text-muted"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(u.id)}
                        className="p-3 bg-surface hover:bg-card hover:text-red-500 hover:shadow-sm rounded-xl transition-all text-muted"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center text-muted">
                      <Search size={32} />
                    </div>
                    <p className="text-sm font-black uppercase tracking-widest">Nenhum registro</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-6 bg-surface/30 border-t border-border">
        <p className="text-[10px] text-muted font-black uppercase tracking-widest">
          Gerenciando {filteredUsers.length} de {users.length} usuários registrados
        </p>
      </div>
    </div>
  );
}
