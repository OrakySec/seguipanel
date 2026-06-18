"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input, Label } from "@/components/ui/affiliate-ui";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/Toast";
import { ArrowLeft } from "lucide-react";

export default function AffiliateRegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    password: "",
    whatsapp: "",
    pixKey: "",
    affiliateCode: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/afiliados/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          affiliateCode: formData.affiliateCode.trim().toLowerCase(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast("success", "Cadastro concluído!", "Bem-vindo ao programa de afiliados.");
        router.push("/afiliados/painel");
        router.refresh();
      } else {
        toast("error", "Erro no cadastro", data.error || "Verifique os dados e tente novamente.");
      }
    } catch {
      toast("error", "Erro de conexão", "Não foi possível criar sua conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Seja um Afiliado</h1>
          <p className="text-slate-500 mt-2">Crie sua conta e comece a lucrar hoje mesmo.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Seu Nome</Label>
            <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="João da Silva" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="(11) 99999-9999" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pixKey">Chave PIX (para receber pagamentos)</Label>
            <Input id="pixKey" name="pixKey" value={formData.pixKey} onChange={handleChange} placeholder="CPF, Celular, E-mail ou Aleatória" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="affiliateCode">Código de Afiliado</Label>
            <Input
              id="affiliateCode"
              name="affiliateCode"
              value={formData.affiliateCode}
              onChange={handleChange}
              placeholder="Ex: joaosilva"
              pattern="[a-zA-Z0-9_-]+"
              title="Apenas letras, números, hífen e underline."
              required
            />
            <p className="text-xs text-slate-500">
              Seu link será: seguifacil.com/?ref={formData.affiliateCode || "codigo"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required minLength={6} />
          </div>

          <Button type="submit" className="w-full h-11 mt-2" isLoading={loading} disabled={loading}>
            Criar Conta de Afiliado
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Já tem uma conta?{" "}
          <Link href="/afiliados/login" className="text-primary font-semibold hover:underline">
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}
