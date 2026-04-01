"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, ShieldCheck, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao fazer login");
      }

      // Sucesso - redirecionar para o admin
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-surface">
      {/* Decoração de fundo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-gradient shadow-brand mb-6"
          >
            <ShieldCheck className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-jakarta font-extrabold text-foreground tracking-tight mb-2">
            Área Administrativa
          </h1>
          <p className="text-muted text-sm font-medium">
            Entre com suas credenciais para gerenciar o SeguiFacil
          </p>
        </div>

        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-brand border border-brand/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted ml-1">
                E-mail
              </label>
              <div className="relative group/field">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within/field:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <Input
                  name="email"
                  type="email"
                  placeholder="admin@exemplo.com"
                  className="pl-12 bg-surface/50 border-transparent focus:bg-white"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted ml-1">
                Senha
              </label>
              <div className="relative group/field">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within/field:text-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-12 bg-surface/50 border-transparent focus:bg-white"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full h-14 text-base"
              isLoading={isLoading}
            >
              <LogIn className="w-5 h-5 mr-2" />
              Acessar Painel
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-brand/10 text-center">
            <p className="text-xs text-muted font-medium mb-1">
              Segurança reforçada SeguiFacil
            </p>
            <p className="text-[10px] text-muted/60 uppercase tracking-widest font-bold">
              v2.0 Beta — 2024
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-xs text-muted font-medium">
          Esqueceu seu acesso? Entre em contato com a TI.
        </p>
      </motion.div>
    </main>
  );
}
