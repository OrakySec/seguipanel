"use client";

import React, { useState, useEffect } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Package, 
  CreditCard,
  ExternalLink,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  FolderTree,
  Tag
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: ShoppingCart, label: "Pedidos", href: "/admin/pedidos" },
  { icon: FolderTree, label: "Categorias", href: "/admin/categorias" },
  { icon: Smartphone, label: "Serviços", href: "/admin/servicos" },
  { icon: Tag, label: "Cupons", href: "/admin/cupons" },
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
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  // Inicialização do Tema
  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
    setMounted(true);
  }, []);

  // Persistência e Aplicação do Tema (Isolado no Admin)
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("admin-theme", theme);
      
      if (theme === "dark") {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    }
    
    // Limpeza ao sair do Admin (Garante que o site público volte ao normal)
    return () => {
      document.body.classList.remove("dark");
    };
  }, [theme, mounted]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  if (!mounted) return null;

  return (
    <ToastProvider>
    <div className={`h-screen w-full transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex h-full bg-background text-foreground overflow-hidden">
        {/* Sidebar - Desktop */}
        <motion.aside
          initial={false}
          animate={{ width: isSidebarOpen ? 280 : 100 }}
          className="hidden md:flex flex-col bg-card border-r border-border relative z-20 m-4 rounded-3xl shadow-card transition-all duration-500 overflow-hidden"
        >
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-gradient flex items-center justify-center shrink-0 shadow-brand">
                  <span className="text-white font-jakarta font-extrabold text-xl">S</span>
              </div>
              <AnimatePresence>
                  {isSidebarOpen && (
                  <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-jakarta font-extrabold text-xl tracking-tighter whitespace-nowrap"
                  >
                      SeguiFacil
                  </motion.span>
                  )}
              </AnimatePresence>
            </div>
            <button 
                  onClick={() => setSidebarOpen(!isSidebarOpen)}
                  className="p-1.5 hover:bg-surface rounded-lg transition-colors text-muted"
              >
                  {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group ${
                    isActive
                      ? "bg-primary text-white shadow-brand scale-[1.02]"
                      : "text-muted hover:bg-surface hover:text-foreground"
                  }`}
                >
                  <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "group-hover:text-primary transition-colors"}`} />
                  {isSidebarOpen && (
                    <span className="text-sm font-black tracking-tight uppercase tracking-widest text-[11px]">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 space-y-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-muted hover:bg-surface transition-all group"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              {isSidebarOpen && <span className="text-[11px] font-black uppercase tracking-widest">Tema {theme === "light" ? "Escuro" : "Claro"}</span>}
            </button>
            
            <div className="h-px bg-border my-2" />

            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-muted hover:bg-surface transition-all group"
            >
              <ExternalLink className="w-5 h-5" />
              {isSidebarOpen && <span className="text-[11px] font-black uppercase tracking-widest">Ver Loja</span>}
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-muted hover:bg-red-500/10 hover:text-red-500 transition-all group"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {isSidebarOpen && <span className="text-[11px] font-black uppercase tracking-widest">Encerrar</span>}
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden relative rounded-[3rem] m-4 bg-card border border-border">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
              <div className="max-w-7xl mx-auto">
                  {children}
              </div>
          </div>
        </main>
      </div>
    </div>
    </ToastProvider>
  );
}
