"use client";

import React, { useState } from "react";
import {
  Save,
  Settings,
  Globe,
  ShieldCheck,
  CreditCard,
  Share2,
  Mail,
  Zap,
  Loader2,
  CheckCircle,
  AlertCircle,
  Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Tab = "geral" | "seo" | "pagamentos" | "smtp" | "smm" | "config";

export default function SettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState<Tab>("geral");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error", message: string } | null>(null);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (status) setStatus(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setStatus({ type: "success", message: "Configurações salvas com sucesso!" });
      } else {
        setStatus({ type: "error", message: "Erro ao salvar as configurações." });
      }
    } catch {
      setStatus({ type: "error", message: "Erro de conexão ao servidor." });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "geral",     label: "Geral & Marca",       icon: Settings  },
    { id: "config",    label: "Configurações Gerais", icon: Gift      },
    { id: "seo",       label: "SEO & Google",         icon: Globe     },
    { id: "pagamentos",label: "Pagamentos (Pix)",     icon: CreditCard},
    { id: "smtp",      label: "E-mail (SMTP)",        icon: Mail      },
    { id: "smm",       label: "Provedor SMM",         icon: Zap       },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar de Abas */}
      <div className="lg:w-64 flex flex-col gap-1 shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? "bg-primary text-white shadow-brand" 
                : "text-muted hover:bg-white hover:text-primary border border-transparent hover:border-brand/10"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}

        <div className="mt-8 p-4 bg-primary-light rounded-2xl border border-primary/20">
          <p className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-1">Dica de Segurança</p>
          <p className="text-[11px] text-primary/70 font-medium leading-relaxed">
            Nunca compartilhe sua API Key ou senhas SMTP com ninguém. Todas as chaves são criptografadas em vôo.
          </p>
        </div>
      </div>

      {/* Conteúdo do Form */}
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-[32px] border border-brand/10 shadow-card p-8 lg:p-10">
          
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-brand/10">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-primary">
                    {tabs.find(t => t.id === activeTab)?.icon({ size: 20 })}
                 </div>
                 <h3 className="text-xl font-jakarta font-extrabold text-foreground">
                    {tabs.find(t => t.id === activeTab)?.label}
                 </h3>
              </div>
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="h-11 px-8 font-bold shadow-brand flex items-center gap-2"
              >
                {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                Salvar Alterações
              </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {activeTab === "geral" && (
              <>
                <Field label="Nome do Site" keyName="site_name" value={settings.site_name} onChange={handleChange} />
                <Field label="Título do Site" keyName="site_title" value={settings.site_title} onChange={handleChange} />
                <Field label="WhatsApp Suporte" keyName="whatsapp_number" value={settings.whatsapp_number} tip="Ex: 5511999999999" onChange={handleChange} />
                <Field label="E-mail Contato" keyName="site_email" value={settings.site_email} onChange={handleChange} />
                <Field label="Endereço Site" keyName="site_url" value={settings.site_url} onChange={handleChange} />
                <Field label="Página de FAQ" keyName="page_faq" value={settings.page_faq} isToggle onChange={handleChange} />
              </>
            )}

            {activeTab === "config" && (
              <>
                {/* Card explicativo */}
                <div className="md:col-span-2 p-5 bg-primary/5 rounded-2xl border border-primary/20 flex gap-4 mb-2">
                  <Gift size={22} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-black text-foreground mb-1">Over-delivery (Bônus automático)</p>
                    <p className="text-[12px] text-muted font-medium leading-relaxed">
                      Defina um percentual extra que será entregue além do que o cliente comprou.
                      Exemplo: cliente compra <strong>1.000 seguidores</strong> com <strong>10%</strong> configurado → recebe <strong>1.100</strong>.
                      Deixe em <strong>0</strong> para desativar.
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2 max-w-xs">
                  <label className="text-xs font-extrabold text-muted uppercase tracking-widest px-1 mb-2 block">
                    Percentual de Bônus (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={settings.overdelivery_percentage || "0"}
                      onChange={(e) => handleChange("overdelivery_percentage", e.target.value)}
                      className="w-full px-4 pr-10 h-12 bg-surface rounded-2xl text-sm font-bold border border-transparent focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-muted">%</span>
                  </div>
                  <p className="text-[11px] text-muted font-medium mt-2 px-1">
                    {Number(settings.overdelivery_percentage) > 0
                      ? `✓ Clientes receberão ${settings.overdelivery_percentage}% a mais do que compraram.`
                      : "Over-delivery desativado."}
                  </p>
                </div>
              </>
            )}

            {activeTab === "seo" && (
              <>
                <Field label="Meta Descrição" keyName="meta_desc" value={settings.meta_desc} isTextArea onChange={handleChange} />
                <Field label="Palavras-chave" keyName="meta_key" value={settings.meta_key} isTextArea onChange={handleChange} />
                <Field label="Google Analytics ID" keyName="google_analytics" value={settings.google_analytics} onChange={handleChange} />
                <Field label="Facebook Pixel ID" keyName="facebook_pixel" value={settings.facebook_pixel} onChange={handleChange} />
              </>
            )}

            {activeTab === "pagamentos" && (
              <>
                <Field label="PushinPay API Token" keyName="pushinpay_token" value={settings.pushinpay_token} isPassword onChange={handleChange} />
                <Field label="Moeda Padrão" keyName="currency_code" value={settings.currency_code} onChange={handleChange} />
                <Field label="Símbolo Moeda" keyName="currency_symbol" value={settings.currency_symbol} onChange={handleChange} />
                <Field label="Taxa do Sistema (%)" keyName="system_fee" value={settings.system_fee} onChange={handleChange} />
              </>
            )}

            {activeTab === "smtp" && (
              <>
                <Field label="Servidor SMTP" keyName="smtp_host" value={settings.smtp_host} tip="Ex: smtp.hostinger.com" onChange={handleChange} />
                <Field label="Porta SMTP" keyName="smtp_port" value={settings.smtp_port} tip="465 (SSL) ou 587 (TLS)" onChange={handleChange} />
                <Field label="Usuário SMTP" keyName="smtp_user" value={settings.smtp_user} tip="Seu e-mail completo (ex: contato@seusite.com)" onChange={handleChange} />
                <Field label="Senha SMTP" keyName="smtp_password" value={settings.smtp_password} isPassword onChange={handleChange} />
                <Field label="E-mail Remetente (From)" keyName="smtp_from_email" value={settings.smtp_from_email} tip="Deve ser igual ao Usuário SMTP na Hostinger" onChange={handleChange} />
                <Field label="Nome Remetente" keyName="smtp_from_name" value={settings.smtp_from_name} tip="Ex: SeguiFacil" onChange={handleChange} />
              </>
            )}

            {activeTab === "smm" && (
              <>
                <Field label="URL da API do Provedor" keyName="smm_api_url" value={settings.smm_api_url} onChange={handleChange} />
                <Field label="API Key do Provedor" keyName="smm_api_key" value={settings.smm_api_key} isPassword onChange={handleChange} />
                <Field label="Percentual de Lucro (%)" keyName="profit_percentage" value={settings.profit_percentage} onChange={handleChange} />
              </>
            )}

          </div>

          {status && (
            <div className={`mt-8 p-4 rounded-xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-bottom-2 ${
              status.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
            }`}>
              {status.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              {status.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ 
  label, keyName, value, onChange, isTextArea, isPassword, isToggle, tip 
}: { 
  label: string, keyName: string, value: string, onChange: (k: string, v: string) => void, isTextArea?: boolean, isPassword?: boolean, isToggle?: boolean, tip?: string 
}) {
  return (
    <div className={`flex flex-col gap-2 ${isTextArea ? "md:col-span-2" : ""}`}>
      <label className="text-xs font-extrabold text-muted uppercase tracking-widest px-1">{label}</label>
      {isTextArea ? (
        <textarea 
          value={value || ""}
          onChange={(e) => onChange(keyName, e.target.value)}
          className="w-full p-4 bg-surface rounded-2xl text-sm font-medium border border-transparent focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all min-h-[120px] outline-none"
        />
      ) : isToggle ? (
        <label className="relative inline-flex items-center cursor-pointer py-2">
            <input 
              type="checkbox" 
              checked={value === "1"} 
              onChange={(e) => onChange(keyName, e.target.checked ? "1" : "0")}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            <span className="ml-3 text-sm font-bold text-muted uppercase tracking-tight">{value === "1" ? "Ativado" : "Desativado"}</span>
        </label>
      ) : (
        <input 
          type={isPassword ? "password" : "text"}
          value={value || ""}
          onChange={(e) => onChange(keyName, e.target.value)}
          className="w-full px-4 h-12 bg-surface rounded-2xl text-sm font-medium border border-transparent focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
        />
      )}
      {tip && <p className="text-[10px] text-muted font-medium px-1 italic">{tip}</p>}
    </div>
  );
}
