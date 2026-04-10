"use client";

import React, { useState } from "react";
import {
  CreditCard,
  TrendingUp,
  Mail,
  Share2,
  Save,
  Globe,
  ShieldAlert,
  Server,
  Plus,
  Trash2,
  RefreshCw,
  Edit,
  Image as ImageIcon,
  Upload,
  MessageCircle,
  X,
  Gift,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateSettings, upsertApiProvider, deleteApiProvider, getProviderBalance, uploadLogo } from "@/app/admin/configuracoes/actions";
import CustomSelect from "@/components/ui/CustomSelect";
import { useToast } from "@/components/ui/Toast";

interface ApiProvider {
  id: number;
  name: string;
  url: string;
  apiKey: string;
  type: string;
}

type MsgStep = { text: string; delayAfter: number };
type MsgFlow = { active: boolean; initialDelay: number; messages: MsgStep[] };

const DEFAULT_FLOW: MsgFlow = { active: false, initialDelay: 5, messages: [{ text: "", delayAfter: 0 }] };

function parseFlow(json: string | undefined): MsgFlow {
  if (!json) return DEFAULT_FLOW;
  try { return JSON.parse(json) as MsgFlow; } catch { return DEFAULT_FLOW; }
}

export default function SettingsClient({ 
  initialSettings, 
  initialProviders 
}: { 
  initialSettings: Record<string, string>,
  initialProviders: ApiProvider[]
}) {
  const [activeTab, setActiveTab] = useState("geral");
  const { toast } = useToast();
  const [settings, setSettings] = useState(initialSettings);
  const [providers, setProviders] = useState<ApiProvider[]>(initialProviders);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [orderConfirmedFlow, setOrderConfirmedFlow] = useState<MsgFlow>(() =>
    parseFlow(initialSettings.evolution_msg_order_confirmed)
  );
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false);
  const [emailModal, setEmailModal] = useState<string | null>(null);

  // Estados para Modal de Provedor
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Partial<ApiProvider> | null>(null);
  const [providerBalances, setProviderBalances] = useState<Record<number, string>>({});

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    const merged = {
      ...settings,
      evolution_msg_order_confirmed: JSON.stringify(orderConfirmedFlow),
    };
    const result = await updateSettings(merged);
    if (result.success) {
      toast("success", "Configurações salvas!");
    } else {
      toast("error", "Erro ao salvar", result.error);
    }
    setIsSaving(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('logo', file);

    const result = await uploadLogo(formData);
    setIsUploading(false);

    if (result.success && result.url) {
      setSettings(prev => ({ ...prev, logo_url: result.url }));
      toast("info", "Logo enviada!", "Clique em 'Salvar Tudo' para confirmar.");
    } else {
      toast("error", "Erro no upload", result.error);
    }
  };

  const handleUpsertProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProvider?.name || !editingProvider?.url || !editingProvider?.apiKey) return;

    setIsSaving(true);
    const result = await upsertApiProvider(editingProvider.id || null, editingProvider);
    if (result.success) {
      setIsProviderModalOpen(false);
      const updated = await fetch("/api/admin/providers").catch(() => null);
      toast("success", "Provedor salvo com sucesso!");
      window.location.reload();
    } else {
      toast("error", "Erro ao salvar provedor", result.error);
    }
    setIsSaving(false);
  };

  const handleDeleteProvider = async (id: number) => {
    if (confirm("Excluir provedor?")) {
      const result = await deleteApiProvider(id);
      if (result.success) {
        setProviders(prev => prev.filter(p => p.id !== id));
        toast("success", "Provedor removido.");
      } else {
        toast("error", "Erro ao remover provedor", result.error);
      }
    }
  };

  const handleCheckBalance = async (id: number) => {
    setProviderBalances(prev => ({ ...prev, [id]: "..." }));
    const result = await getProviderBalance(id);
    if (result.success) {
      setProviderBalances(prev => ({ ...prev, [id]: `${result.currency} ${result.balance}` }));
    } else {
      setProviderBalances(prev => ({ ...prev, [id]: "Erro" }));
    }
  };

  const tabs = [
    { id: "geral",    label: "Identidade",          icon: Globe,          color: "text-blue-500",    bg: "bg-blue-500/10"    },
    { id: "config",   label: "Config. Gerais",       icon: Gift,           color: "text-violet-500",  bg: "bg-violet-500/10"  },
    { id: "pagamentos",label: "Pagamentos",          icon: CreditCard,     color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: "provedores",label: "Provedores API",      icon: Server,         color: "text-purple-500",  bg: "bg-purple-500/10"  },
    { id: "marketing", label: "Marketing",           icon: TrendingUp,     color: "text-primary",     bg: "bg-primary/10"     },
    { id: "email",     label: "E-mail (SMTP)",       icon: Mail,           color: "text-amber-500",   bg: "bg-amber-500/10"   },
    { id: "social",    label: "Social & Links",      icon: Share2,         color: "text-pink-500",    bg: "bg-pink-500/10"    },
    { id: "whatsapp",  label: "Respostas Auto.",     icon: MessageCircle,  color: "text-green-500",   bg: "bg-green-500/10"   },
  ];

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tighter mb-1">Configurações</h1>
          <p className="text-[10px] font-black text-muted uppercase tracking-widest">Ajustes globais do ecossistema SeguiFacil</p>
        </div>
        {activeTab !== "provedores" && (
            <button 
                onClick={handleSaveSettings}
                disabled={isSaving}
                className={`flex items-center gap-2 px-10 py-4 bg-brand-gradient text-white rounded-2xl text-xs font-black shadow-brand active:scale-95 transition-all uppercase tracking-widest ${
                    isSaving ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
                }`}
            >
                {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                Salvar Tudo
            </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Nav */}
        <div className="lg:w-72 space-y-3">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                        isActive 
                        ? "bg-card text-foreground shadow-card border border-border" 
                        : "text-muted hover:bg-card/50 hover:text-foreground"
                      }`}
                    >
                        <div className={`w-8 h-8 rounded-xl ${isActive ? tab.bg : "bg-surface"} flex items-center justify-center ${isActive ? tab.color : "text-muted"} transition-colors`}>
                            <tab.icon size={16} />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
                    </button>
                );
            })}
        </div>

        {/* Form Content */}
        <div className="flex-1">
          <div className="bg-card rounded-[2.5rem] border border-border shadow-card min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeTab === "geral" && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-10 space-y-10">
                    <TabHeader icon={Globe} title="Identidade Visual" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <SettingField label="Nome do Website" name="website_name" value={settings.website_name} onChange={handleChange} />
                        <SettingField label="SEO Title" name="website_title" value={settings.website_title} onChange={handleChange} />
                        <SettingField label="Meta Description" name="website_desc" value={settings.website_desc} onChange={handleChange} full />
                        
                        <div className="col-span-full pt-6">
                            <div className="p-8 bg-surface rounded-[2rem] border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <ImageIcon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-foreground">Identidade da Logo</p>
                                        <p className="text-[11px] font-bold text-muted uppercase tracking-widest mt-1 opacity-70">Define se usará texto ou imagem original</p>
                                    </div>
                                </div>
                                <CustomSelect 
                                  className="w-48 !h-12 shrink-0"
                                  options={[
                                      { value: "text", label: "Apenas Texto" },
                                      { value: "image", label: "Logomarca" }
                                  ]}
                                  value={settings.logo_type || "text"}
                                  onChange={(val) => handleChange("logo_type", val)}
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                          {(settings.logo_type === "text" || !settings.logo_type) && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="col-span-full overflow-hidden">
                                <div className="p-8 bg-surface rounded-[2rem] border border-border">
                                    <SettingField 
                                      label="Texto Customizado da Logo" 
                                      name="website_logo_text" 
                                      value={settings.website_logo_text} 
                                      onChange={handleChange} 
                                      full 
                                    />
                                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-4 ml-1 opacity-60">
                                        * Caso vazio, será usado o Nome do Website.
                                    </p>
                                </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <AnimatePresence>
                          {settings.logo_type === "image" && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="col-span-full overflow-hidden">
                                <div className="p-8 bg-card rounded-[2rem] border-2 border-dashed border-border hover:border-primary/50 transition-colors flex items-center justify-center relative group">
                                    <input 
                                      type="file" 
                                      accept="image/*"
                                      onChange={handleLogoUpload}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                      title="Selecione ou solte a imagem"
                                    />
                                    <div className="text-center">
                                       {settings.logo_url && !isUploading ? (
                                          <img src={settings.logo_url} alt="Logo preview" className="max-h-24 mx-auto mb-4 object-contain bg-surface/50 rounded-lg p-2" />
                                       ) : (
                                          <div className="w-16 h-16 rounded-full bg-brand-gradient/10 text-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            {isUploading ? <RefreshCw className="animate-spin" size={32} /> : <Upload size={32} />}
                                          </div>
                                       )}
                                       <p className="font-bold text-sm text-foreground">Arraste ou clique para {settings.logo_url ? "trocar" : "enviar a"} imagem</p>
                                       <p className="text-[10px] uppercase tracking-widest text-muted mt-1">Recomendado: PNG Transparente 250x80</p>
                                    </div>
                                </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="col-span-full pt-6 border-t border-border/50">
                            <div className="p-8 bg-surface rounded-[2rem] border border-border flex items-center justify-between group">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
                                        <ShieldAlert size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-foreground">Modo Manutenção</p>
                                        <p className="text-[11px] font-bold text-muted uppercase tracking-widest mt-1 opacity-70">Desativa o acesso público dos clientes</p>
                                    </div>
                                </div>
                                <CustomSelect 
                                  className="w-48 !h-12"
                                  options={[
                                      { value: "0", label: "Desativado" },
                                      { value: "1", label: "Ativado" }
                                  ]}
                                  value={settings.is_maintenance_mode}
                                  onChange={(val) => handleChange("is_maintenance_mode", val)}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
              )}

              {activeTab === "pagamentos" && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-10 space-y-10">
                    <TabHeader icon={CreditCard} title="Gateways (PushinPay)" />
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <SettingField label="Status Gateway" name="is_active_pushinpay" type="select" options={[{v: "1", l: "Habilitado"}, {v: "0", l: "Desativado"}]} value={settings.is_active_pushinpay} onChange={handleChange} />
                            <SettingField label="Token de API" name="api_token_pushinpay" type="password" value={settings.api_token_pushinpay} onChange={handleChange} />
                            <SettingField label="Webhook Secret Token" name="pushinpay_webhook_secret" type="password" value={settings.pushinpay_webhook_secret} onChange={handleChange} />
                            <SettingField label="Base URL" name="pushinpay_base_url" value={settings.pushinpay_base_url} onChange={handleChange} full />
                        </div>
                    </div>
                </motion.div>
              )}

              {activeTab === "provedores" && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-10 space-y-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <TabHeader icon={Server} title="Provedores de API" />
                        <button 
                          onClick={() => { setEditingProvider({ type: "standard", url: "" }); setIsProviderModalOpen(true); }}
                          className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-brand hover:opacity-90"
                        >
                            <Plus size={16} /> Adicionar Provedor
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {providers.map((p) => (
                          <div key={p.id} className="p-8 bg-surface rounded-[2rem] border border-border flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-surface/80 transition-all group">
                             <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                   <Server size={24} />
                                </div>
                                <div className="min-w-0">
                                   <h3 className="text-lg font-black text-foreground truncate">{p.name}</h3>
                                   <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1 truncate">{p.url}</p>
                                </div>
                             </div>

                             <div className="flex items-center gap-4">
                                <div className="flex flex-col items-end mr-4">
                                   <button 
                                     onClick={() => handleCheckBalance(p.id)}
                                     className="text-[10px] font-black text-primary uppercase flex items-center gap-1 hover:opacity-70 mb-1"
                                   >
                                      <RefreshCw size={10} className={providerBalances[p.id] === "..." ? "animate-spin" : ""} /> Saldo
                                   </button>
                                   <p className="text-sm font-black text-foreground tracking-tighter">
                                      {providerBalances[p.id] || "Consultar"}
                                   </p>
                                </div>
                                <button onClick={() => { setEditingProvider(p); setIsProviderModalOpen(true); }} className="p-3.5 bg-card border border-border rounded-xl text-muted hover:text-primary transition-all shadow-sm">
                                   <Edit size={16} />
                                </button>
                                <button onClick={() => handleDeleteProvider(p.id)} className="p-3.5 bg-card border border-border rounded-xl text-muted hover:text-red-500 transition-all shadow-sm">
                                   <Trash2 size={16} />
                                </button>
                             </div>
                          </div>
                        ))}
                    </div>
                </motion.div>
              )}

              {activeTab === "marketing" && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-10 space-y-10">
                    <TabHeader icon={TrendingUp} title="Marketing & Pixels" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <SettingField label="GTM ID" name="google_tag_manager_id" value={settings.google_tag_manager_id} onChange={handleChange} />
                        <SettingField label="Facebook Pixel ID" name="facebook_pixel_id" value={settings.facebook_pixel_id} onChange={handleChange} />
                        <SettingField label="CAPI Access Token" name="facebook_access_token" type="password" value={settings.facebook_access_token} onChange={handleChange} full />
                    </div>
                </motion.div>
              )}

              {activeTab === "email" && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-10 space-y-10">
                    <TabHeader icon={Mail} title="Servidor SMTP" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <SettingField label="Servidor Host" name="smtp_server" value={settings.smtp_server} onChange={handleChange} />
                        <SettingField label="Porta" name="smtp_port" value={settings.smtp_port} onChange={handleChange} />
                        <SettingField label="Username" name="smtp_username" value={settings.smtp_username} onChange={handleChange} />
                        <SettingField label="Security Key" name="smtp_password" type="password" value={settings.smtp_password} onChange={handleChange} />
                    </div>

                    {/* Templates de E-mail */}
                    <div className="space-y-4 pt-6 border-t border-border/50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted">Templates de E-mail</p>
                      <p className="text-xs text-muted font-medium -mt-2">Personalize o assunto e o corpo HTML de cada e-mail automático. Se deixar em branco, o template padrão é usado.</p>
                      <div className="space-y-3">
                        {EMAIL_TEMPLATES.map((tpl) => {
                          const hasCustom = !!(settings[`email_${tpl.key}_body`] || settings[`email_${tpl.key}_subject`]);
                          return (
                            <button
                              key={tpl.key}
                              type="button"
                              onClick={() => setEmailModal(tpl.key)}
                              className="w-full flex items-center justify-between p-6 bg-surface rounded-[2rem] border border-border hover:bg-surface/70 hover:border-amber-500/30 transition-all group text-left"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 text-lg group-hover:scale-110 transition-transform">
                                  {tpl.icon}
                                </div>
                                <div>
                                  <p className="text-sm font-black text-foreground">{tpl.label}</p>
                                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-0.5">{tpl.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${hasCustom ? "bg-amber-500/10 text-amber-500" : "bg-surface text-muted border border-border"}`}>
                                  {hasCustom ? "Personalizado" : "Padrão"}
                                </span>
                                <Edit size={15} className="text-muted group-hover:text-foreground transition-colors" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                </motion.div>
              )}

              {activeTab === "social" && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-10 space-y-10">
                    <TabHeader icon={Share2} title="Redes & Suporte" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <SettingField label="Instagram" name="social_instagram_link" value={settings.social_instagram_link} onChange={handleChange} full />
                        <SettingField label="WhatsApp Suporte" name="social_whatsapp_link" value={settings.social_whatsapp_link} onChange={handleChange} full />
                    </div>
                </motion.div>
              )}

              {activeTab === "config" && (
                <motion.div key="config" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-10 space-y-10">
                  <TabHeader icon={Gift} title="Configurações Gerais" />

                  {/* Over-delivery */}
                  <div className="space-y-6">
                    <div className="p-6 bg-violet-500/5 rounded-2xl border border-violet-500/20 flex gap-4">
                      <Gift size={22} className="text-violet-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-black text-foreground mb-1">Over-delivery (Bônus automático)</p>
                        <p className="text-[12px] text-muted font-medium leading-relaxed">
                          Percentual extra entregue além do que o cliente comprou.<br />
                          Exemplo: cliente compra <strong>1.000 seguidores</strong> com <strong>10%</strong> → recebe <strong>1.100</strong>. Deixe em <strong>0</strong> para desativar.
                        </p>
                      </div>
                    </div>

                    <div className="max-w-xs">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-3 ml-1">Percentual de Bônus (%)</label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={settings.overdelivery_percentage || "0"}
                          onChange={(e) => handleChange("overdelivery_percentage", e.target.value)}
                          className="w-full h-14 px-6 pr-12 bg-surface rounded-2xl border border-transparent focus:border-primary/20 focus:ring-8 focus:ring-primary/5 outline-none transition-all font-black text-sm"
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-black text-muted">%</span>
                      </div>
                      <p className="text-[11px] text-muted font-medium mt-2 px-1">
                        {Number(settings.overdelivery_percentage) > 0
                          ? `✓ Clientes receberão ${settings.overdelivery_percentage}% a mais do que compraram.`
                          : "Over-delivery desativado."}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "whatsapp" && (
                <motion.div key="whatsapp" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-10 space-y-10">
                  <TabHeader icon={MessageCircle} title="Respostas Automáticas" />

                  {/* Evolution API config */}
                  <div className="space-y-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted">Configuração da Evolution API</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <SettingField label="URL Base da API" name="evolution_api_url" value={settings.evolution_api_url} onChange={handleChange} full />
                      <SettingField label="Token (apikey)" name="evolution_api_token" type="password" value={settings.evolution_api_token} onChange={handleChange} />
                      <SettingField label="Nome da Instância" name="evolution_instance" value={settings.evolution_instance} onChange={handleChange} />
                      <div className="col-span-1 flex flex-col justify-end">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-3 ml-1">Status</label>
                        <CustomSelect
                          options={[{ value: "1", label: "Ativado" }, { value: "0", label: "Desativado" }]}
                          value={settings.evolution_active || "0"}
                          onChange={(val) => handleChange("evolution_active", val)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gatilhos de mensagem */}
                  <div className="space-y-4 pt-6 border-t border-border/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted">Gatilhos de Mensagem</p>

                    {/* Card — Pedido Confirmado */}
                    <button
                      type="button"
                      onClick={() => setIsFlowModalOpen(true)}
                      className="w-full flex items-center justify-between p-8 bg-surface rounded-[2rem] border border-border hover:bg-surface/70 hover:border-green-500/30 transition-all group text-left"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <MessageCircle size={22} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-foreground">Pedido Confirmado</p>
                          <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">
                            {orderConfirmedFlow.messages.length} mensagem{orderConfirmedFlow.messages.length !== 1 ? "s" : ""} · delay inicial: {orderConfirmedFlow.initialDelay}s
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${orderConfirmedFlow.active ? "bg-green-500/10 text-green-500" : "bg-surface text-muted border border-border"}`}>
                          {orderConfirmedFlow.active ? "Ativo" : "Inativo"}
                        </span>
                        <Edit size={16} className="text-muted group-hover:text-foreground transition-colors" />
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modal — Fluxo de mensagens: Pedido Confirmado */}
      <AnimatePresence>
        {isFlowModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFlowModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-2xl bg-card rounded-[2.5rem] p-12 shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center">
                    <MessageCircle size={22} />
                  </div>
                  <h2 className="text-2xl font-black text-foreground tracking-tighter">Pedido Confirmado</h2>
                </div>
                <button type="button" onClick={() => setIsFlowModalOpen(false)} className="p-3 rounded-2xl text-muted hover:text-foreground hover:bg-surface transition-all">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Toggle ativo/inativo */}
                <div className="p-6 bg-surface rounded-[1.5rem] border border-border flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-foreground">Ativar gatilho</p>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Enviar mensagem quando o pedido for confirmado</p>
                  </div>
                  <CustomSelect
                    className="w-40 !h-11 shrink-0"
                    options={[{ value: "1", label: "Ativado" }, { value: "0", label: "Desativado" }]}
                    value={orderConfirmedFlow.active ? "1" : "0"}
                    onChange={(val) => setOrderConfirmedFlow((f) => ({ ...f, active: val === "1" }))}
                  />
                </div>

                {/* Delay inicial */}
                <div className="p-6 bg-surface rounded-[1.5rem] border border-border">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-3 ml-1">
                    Aguardar antes de enviar (segundos)
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="w-40 h-12 px-5 bg-card rounded-2xl border border-transparent focus:border-primary/20 focus:ring-8 focus:ring-primary/5 outline-none transition-all font-black text-sm"
                    value={orderConfirmedFlow.initialDelay}
                    onChange={(e) => setOrderConfirmedFlow((f) => ({ ...f, initialDelay: Number(e.target.value) }))}
                  />
                </div>

                {/* Lista de mensagens */}
                <div className="space-y-3">
                  {orderConfirmedFlow.messages.map((msg, idx) => (
                    <div key={idx} className="p-6 bg-surface rounded-[1.5rem] border border-border space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted">Mensagem {idx + 1}</span>
                        {orderConfirmedFlow.messages.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setOrderConfirmedFlow((f) => ({ ...f, messages: f.messages.filter((_, i) => i !== idx) }))}
                            className="p-2 rounded-xl text-muted hover:text-red-500 transition-colors"
                          >
                            <X size={13} />
                          </button>
                        )}
                      </div>

                      <textarea
                        rows={3}
                        placeholder="Ex: Olá {{nome}}! Seu pedido #{{orderId}} foi confirmado 🎉"
                        className="w-full px-5 py-4 bg-card rounded-2xl border border-transparent focus:border-primary/20 focus:ring-8 focus:ring-primary/5 outline-none transition-all font-bold text-sm resize-none"
                        value={msg.text}
                        onChange={(e) => setOrderConfirmedFlow((f) => {
                          const msgs = [...f.messages];
                          msgs[idx] = { ...msgs[idx], text: e.target.value };
                          return { ...f, messages: msgs };
                        })}
                      />

                      {idx < orderConfirmedFlow.messages.length - 1 && (
                        <div className="flex items-center gap-4">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted whitespace-nowrap">
                            Aguardar antes da próxima (s)
                          </label>
                          <input
                            type="number"
                            min={0}
                            className="w-24 h-10 px-4 bg-card rounded-xl border border-transparent focus:border-primary/20 outline-none font-black text-sm"
                            value={msg.delayAfter}
                            onChange={(e) => setOrderConfirmedFlow((f) => {
                              const msgs = [...f.messages];
                              msgs[idx] = { ...msgs[idx], delayAfter: Number(e.target.value) };
                              return { ...f, messages: msgs };
                            })}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setOrderConfirmedFlow((f) => ({ ...f, messages: [...f.messages, { text: "", delayAfter: 0 }] }))}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500/10 text-green-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500/20 transition-colors"
                >
                  <Plus size={13} /> Adicionar mensagem ao fluxo
                </button>

                {/* Variáveis */}
                <div className="p-5 bg-surface rounded-2xl border border-border/50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-3">Variáveis disponíveis</p>
                  <div className="flex flex-wrap gap-2">
                    {["{{nome}}", "{{orderId}}", "{{valor}}", "{{servico}}"].map((v) => (
                      <code key={v} className="px-3 py-1 bg-card rounded-lg text-[11px] font-bold text-primary border border-border">{v}</code>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-2">
                  <button type="button" onClick={() => setIsFlowModalOpen(false)} className="px-6 py-4 text-[10px] font-black uppercase text-muted hover:text-foreground transition-colors">
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFlowModalOpen(false)}
                    className="px-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-brand hover:opacity-90 transition-opacity"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Provider com NOVO DESIGN */}
      <AnimatePresence>
        {isProviderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProviderModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-md" />
             <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-card rounded-[2.5rem] p-12 shadow-2xl border border-border">
                <h2 className="text-2xl font-black text-foreground tracking-tighter mb-8">{editingProvider?.id ? "Editar" : "Novo"} Provedor</h2>
                <form onSubmit={handleUpsertProvider} className="space-y-8">
                   <SettingField label="Nome Público" value={editingProvider?.name} onChange={(_: any, v: any) => setEditingProvider({...editingProvider, name: v})} full />
                   <SettingField label="URL da API v2" value={editingProvider?.url} onChange={(_: any, v: any) => setEditingProvider({...editingProvider, url: v})} full />
                   <SettingField label="API Server Key" value={editingProvider?.apiKey} type="password" onChange={(_: any, v: any) => setEditingProvider({...editingProvider, apiKey: v})} full />
                   <div className="flex justify-end gap-4 pt-4">
                      <button type="button" onClick={() => setIsProviderModalOpen(false)} className="px-6 py-4 text-[10px] font-black uppercase text-muted">Voltar</button>
                      <button type="submit" disabled={isSaving} className="px-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-brand hover:opacity-90">Salvar Conexão</button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal — Template de E-mail */}
      <AnimatePresence>
        {emailModal && (() => {
          const tpl = EMAIL_TEMPLATES.find(t => t.key === emailModal)!;
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEmailModal(null)} className="absolute inset-0 bg-background/80 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-3xl bg-card rounded-[2.5rem] p-10 shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-2xl flex items-center justify-center">{tpl.icon}</div>
                    <div>
                      <h2 className="text-xl font-black text-foreground tracking-tighter">{tpl.label}</h2>
                      <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{tpl.description}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setEmailModal(null)} className="p-3 rounded-2xl text-muted hover:text-foreground hover:bg-surface transition-all">
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Assunto */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-3 ml-1">Assunto (título do e-mail)</label>
                    <input
                      type="text"
                      placeholder={tpl.defaultSubject}
                      value={settings[`email_${tpl.key}_subject`] || ""}
                      onChange={(e) => handleChange(`email_${tpl.key}_subject`, e.target.value)}
                      className="w-full h-14 px-6 bg-surface rounded-2xl border border-transparent focus:border-primary/20 focus:ring-8 focus:ring-primary/5 outline-none transition-all font-bold text-sm"
                    />
                  </div>

                  {/* Corpo HTML */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-3 ml-1">Corpo do e-mail (HTML completo)</label>
                    <textarea
                      rows={16}
                      placeholder={`<!DOCTYPE html>\n<html>\n<body>\n  <h1>Pedido #{{orderId}} confirmado!</h1>\n  <p>Obrigado, {{siteName}}.</p>\n</body>\n</html>`}
                      value={settings[`email_${tpl.key}_body`] || ""}
                      onChange={(e) => handleChange(`email_${tpl.key}_body`, e.target.value)}
                      className="w-full px-5 py-4 bg-surface rounded-2xl border border-transparent focus:border-primary/20 focus:ring-8 focus:ring-primary/5 outline-none transition-all font-mono text-xs resize-y"
                    />
                    <p className="text-[10px] text-muted mt-2 ml-1">Aceita HTML completo. Se deixar em branco, o template padrão do sistema é usado.</p>
                  </div>

                  {/* Variáveis */}
                  <div className="p-5 bg-surface rounded-2xl border border-border/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-3">Variáveis disponíveis</p>
                    <div className="flex flex-wrap gap-2">
                      {tpl.vars.map((v) => (
                        <code key={v} className="px-3 py-1 bg-card rounded-lg text-[11px] font-bold text-primary border border-border">{`{{${v}}}`}</code>
                      ))}
                    </div>
                  </div>

                  {/* Limpar / Confirmar */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleChange(`email_${tpl.key}_subject`, "");
                        handleChange(`email_${tpl.key}_body`, "");
                      }}
                      className="px-5 py-3 text-[10px] font-black uppercase text-red-400 hover:text-red-500 transition-colors"
                    >
                      Limpar (usar padrão)
                    </button>
                    <button type="button" onClick={() => setEmailModal(null)} className="px-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-brand hover:opacity-90 transition-opacity">
                      Confirmar
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

const EMAIL_TEMPLATES = [
  {
    key: "confirmed",
    icon: "✅",
    label: "Pedido Confirmado",
    description: "Enviado após o pagamento ser aprovado",
    defaultSubject: "✅ Pedido #{{orderId}} confirmado — {{siteName}}",
    vars: ["orderId", "email", "link", "valor", "servico", "siteName"],
  },
  {
    key: "completed",
    icon: "🎉",
    label: "Pedido Concluído",
    description: "Enviado quando a entrega é finalizada com sucesso",
    defaultSubject: "🎉 Pedido #{{orderId}} entregue — {{siteName}}",
    vars: ["orderId", "link", "quantidade", "siteName"],
  },
  {
    key: "failed",
    icon: "⚠️",
    label: "Problema na Entrega",
    description: "Enviado quando o pedido é cancelado pelo fornecedor",
    defaultSubject: "⚠️ Problema no pedido #{{orderId}} — {{siteName}}",
    vars: ["orderId", "siteName"],
  },
  {
    key: "partial",
    icon: "📦",
    label: "Entrega Parcial",
    description: "Enviado quando o fornecedor entrega apenas parte do pedido",
    defaultSubject: "⚠️ Pedido #{{orderId}} entregue parcialmente — {{siteName}}",
    vars: ["orderId", "siteName"],
  },
];

const TabHeader = ({ icon: Icon, title }: any) => (
    <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center text-primary shadow-sm border border-border">
            <Icon size={24} />
        </div>
        <h2 className="text-2xl font-black text-foreground tracking-tighter">{title}</h2>
    </div>
);

const SettingField = ({ label, name, value, onChange, full = false, type = "text", options = [] }: any) => {
    return (
        <div className={`${full ? "col-span-full" : "col-span-1"}`}>
            <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-3 ml-1">{label}</label>
            {type === "text" || type === "password" ? (
                <input 
                  type={type}
                  className="w-full h-14 px-6 bg-surface rounded-2xl border border-transparent focus:border-primary/20 focus:bg-card focus:ring-8 focus:ring-primary/5 outline-none transition-all font-black text-sm"
                  value={value || ""}
                  onChange={(e) => onChange(name, e.target.value)}
                />
            ) : (
                <CustomSelect 
                    options={options.map((opt: any) => ({ 
                        value: opt.v || opt.value, 
                        label: opt.l || opt.label 
                    }))}
                    value={value || ""}
                    onChange={(val) => onChange(name, val)}
                />
            )}
        </div>
    );
};
