"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Package, 
  CreditCard,
  Menu,
  X,
  User,
  Bell,
  Search,
  ExternalLink
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: ShoppingCart, label: "Pedidos", href: "/admin/pedidos" },
  { icon: Package, label: "Serviços", href: "/admin/servicos" },
  { icon: Users, label: "Usuários", href: "/admin/usuarios" },
  { icon: CreditCard, label: "Financeiro", href: "/admin/financeiro" },
  { icon: Settings, label: "Configurações", href: "/admin/configuracoes" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Sidebar - Desktop */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="hidden md:flex flex-col bg-white border-r border-brand/20 relative z-20 transition-all duration-300"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shrink-0 shadow-brand">
            <span className="text-white font-jakarta font-extrabold text-xl">S</span>
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-jakarta font-extrabold text-xl tracking-tight whitespace-nowrap"
              >
                SeguiFacil
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${
                  isActive
                    ? "bg-primary-light text-primary"
                    : "text-muted hover:bg-surface hover:text-foreground"
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-primary" : "group-hover:text-primary"}`} />
                {isSidebarOpen && (
                  <span className="text-sm font-bold tracking-tight">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-brand/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-muted hover:bg-surface transition-all group"
          >
            <ExternalLink className="w-5 h-5" />
            {isSidebarOpen && <span className="text-sm font-bold">Ver Loja</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-muted hover:bg-red-50 hover:text-red-500 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {isSidebarOpen && <span className="text-sm font-bold">Encerrar Sessão</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-brand/10 flex items-center justify-between px-8 z-10 shadow-card">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-surface rounded-lg transition-colors md:block hidden"
            >
              {isSidebarOpen ? <X className="w-5 h-5 text-muted" /> : <Menu className="w-5 h-5 text-muted" />}
            </button>
            <div className="relative md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input 
                type="text" 
                placeholder="Buscar pedidos, usuários..."
                className="w-full pl-10 pr-4 h-11 bg-surface rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-surface rounded-full relative">
              <Bell className="w-5 h-5 text-muted" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-[1px] bg-brand/10 mx-2" />
            <div className="flex items-center gap-3 px-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-foreground leading-none mb-1">Admin Administrador</p>
                <p className="text-[10px] text-muted font-bold uppercase tracking-tighter">Acesso Total</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-gradient p-[2px] shadow-brand">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
