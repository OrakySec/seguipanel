"use client";

import React, { useState } from "react";
import UsersList from "@/components/admin/users/UsersList";
import UserForm from "@/components/admin/users/UserForm";
import {
  getUsers,
  updateUser,
  toggleUserStatus,
  deleteUser
} from "@/app/admin/usuarios/actions";
import { AnimatePresence, motion } from "framer-motion";
import { Users, UserPlus, Search } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function UsersClient({ 
  initialUsers 
}: { 
  initialUsers: any[]
}) {
  const { toast } = useToast();
  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSave = async (id: number, data: any) => {
    setIsSaving(true);
    const result = await updateUser(id, data);
    if (result.success) {
      // Recarrega para refletir mudanças pesadas (como role/email)
      window.location.reload();
    } else {
      toast("error", "Erro ao salvar usuário", result.error);
    }
    setIsSaving(false);
  };

  const handleToggleStatus = async (id: number, currentStatus: number) => {
    const result = await toggleUserStatus(id, currentStatus);
    if (result.success) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: currentStatus === 1 ? 0 : 1 } : u));
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir permanentemente este usuário? Esta ação não pode ser desfeita e só é permitida se o usuário não tiver pedidos.")) {
      const result = await deleteUser(id);
      if (result.success) {
        setUsers(prev => prev.filter(u => u.id !== id));
        toast("success", "Usuário excluído.");
      } else {
        toast("error", "Erro ao excluir usuário", result.error);
      }
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in-up">
      {/* Header com Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Gestão de Usuários</h1>
          <p className="text-sm font-bold text-muted uppercase tracking-tighter">Administre clientes, permissões e monitore atividades</p>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="px-5 py-3 bg-white border border-brand/10 rounded-2xl shadow-sm">
             <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Total de Clientes</p>
             <p className="text-xl font-black text-primary">{users.length}</p>
          </div>
        </div>
      </div>

      {/* Tabela de Usuários */}
      <UsersList 
        users={users}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />

      {/* Modal de Formulário */}
      <AnimatePresence>
        {isModalOpen && (
          <UserForm 
            initialData={editingUser}
            onSave={handleSave}
            onClose={() => setIsModalOpen(false)}
            isSaving={isSaving}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
