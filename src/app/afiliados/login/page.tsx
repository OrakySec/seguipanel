"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input, Label } from "@/components/ui/affiliate-ui";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/Toast";
import { ArrowLeft } from "lucide-react";

export default function AffiliateLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/afiliados/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast("success", "Bem-vindo!", "Login realizado com sucesso.");
        router.push("/afiliados/painel");
        router.refresh();
      } else {
        toast("error", "Erro no login", data.error || "Verifique suas credenciais.");
      }
    } catch {
      toast("error", "Erro de conexão", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Login Afiliado</h1>
          <p className="text-slate-500 mt-2">Acesse seu painel e acompanhe seus ganhos.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full h-11" isLoading={loading} disabled={loading}>
            Entrar no Painel
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Ainda não é afiliado?{" "}
          <Link href="/afiliados/cadastro" className="text-primary font-semibold hover:underline">
            Cadastre-se agora
          </Link>
        </div>
      </div>
    </div>
  );
}
