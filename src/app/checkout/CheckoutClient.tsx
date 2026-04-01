"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle, Copy, Check, Loader2, Tag, AlertCircle,
  ArrowLeft, Clock, RefreshCw, Zap,
} from "lucide-react";

/* ─── Tipos ─── */
interface ServiceInfo {
  id: number;
  name: string;
  platform: string;
  price: number;
  originalPrice?: number;
  quantity?: string;
  platformGradient: string;
}

interface PixData {
  transactionId: number;
  pixCode: string;
  qrCodeUrl: string;
  amount: number;
  productName: string;
}

interface CouponState {
  code: string;
  status: "idle" | "loading" | "valid" | "invalid";
  discount: number;
  name: string;
  error: string;
}

type Step = "form" | "pix" | "success";

/* ─── Gradientes por plataforma ─── */
const GRADIENTS: Record<string, string> = {
  Instagram: "linear-gradient(135deg, #f09433, #dc2743, #bc1888)",
  TikTok:    "linear-gradient(135deg, #010101, #383838)",
  Kwai:      "linear-gradient(135deg, #FF7000, #FFAA00)",
  YouTube:   "linear-gradient(135deg, #FF0000, #CC0000)",
  Facebook:  "linear-gradient(135deg, #1877F2, #145DBF)",
};

/* ─── Mock service (usado quando params não trazem o serviço) ─── */
const MOCK_SERVICE: ServiceInfo = {
  id: 1,
  name: "Seguidores Brasileiros Instagram",
  platform: "Instagram",
  price: 8.9,
  originalPrice: 17.8,
  quantity: "100",
  platformGradient: GRADIENTS.Instagram,
};

const PIX_DURATION = 15 * 60; // 15 minutos em segundos

/* ─── Helpers ─── */
function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatCountdown(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function normalizeLink(raw: string, platform: string): string {
  const v = raw.trim();
  if (v.startsWith("http")) return v;
  const handle = v.startsWith("@") ? v.slice(1) : v;
  const bases: Record<string, string> = {
    Instagram: "https://instagram.com/",
    TikTok:    "https://tiktok.com/@",
    Kwai:      "https://kwai.com/@",
    YouTube:   "https://youtube.com/@",
    Facebook:  "https://facebook.com/",
  };
  return (bases[platform] ?? "https://instagram.com/") + handle;
}

/* ─── Step Indicator ─── */
function StepIndicator({ step }: { step: Step }) {
  const steps = [
    { key: "form",    label: "Dados" },
    { key: "pix",     label: "Pagamento" },
    { key: "success", label: "Confirmado" },
  ];
  const current = steps.findIndex((s) => s.key === step);

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i < current
                  ? "bg-success text-white"
                  : i === current
                  ? "bg-brand-gradient text-white"
                  : "bg-border text-gray-400"
              }`}
              style={i === current ? { background: "linear-gradient(135deg,#c60cff,#fd5949)" } : {}}
            >
              {i < current ? <Check size={14} /> : i + 1}
            </div>
            <span className={`text-xs mt-1 ${i === current ? "text-primary font-semibold" : "text-gray-400"}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-12 h-px mx-1 mb-4 ${i < current ? "bg-success" : "bg-border"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Order Summary ─── */
function OrderSummary({
  service,
  discount,
  couponName,
}: {
  service: ServiceInfo;
  discount: number;
  couponName: string;
}) {
  const discountAmount = (service.price * discount) / 100;
  const total = service.price - discountAmount;

  return (
    <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
      {/* Platform header */}
      <div className="h-2" style={{ background: service.platformGradient }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span
              className="text-xs font-semibold text-white px-2 py-0.5 rounded-full"
              style={{ background: service.platformGradient }}
            >
              {service.platform}
            </span>
            <h3 className="text-sm font-semibold text-gray-900 mt-2 leading-snug">
              {service.name}
            </h3>
            {service.quantity && (
              <p className="text-xs text-gray-400 mt-0.5">{service.quantity} unidades</p>
            )}
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-2 text-sm border-t border-border pt-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatBRL(service.price)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-success font-medium">
              <span className="flex items-center gap-1">
                <Tag size={12} />
                {couponName} ({discount}% OFF)
              </span>
              <span>−{formatBRL(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-gray-900 text-base border-t border-border pt-2">
            <span>Total</span>
            <span>{formatBRL(total)}</span>
          </div>
        </div>

        {/* Trust */}
        <div className="mt-4 flex flex-col gap-1.5">
          {[
            { icon: "⚡", text: "Entrega iniciada após confirmação" },
            { icon: "🔒", text: "Pagamento 100% seguro via PIX" },
            { icon: "♻️", text: "Garantia de reposição inclusa" },
          ].map((t) => (
            <div key={t.text} className="flex items-center gap-2 text-xs text-gray-500">
              <span>{t.icon}</span>
              <span>{t.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── CheckoutClient ─── */
export default function CheckoutClient() {
  const params = useSearchParams();

  /* Serviço a partir dos query params ou mock */
  const service: ServiceInfo = {
    id: Number(params.get("service")) || MOCK_SERVICE.id,
    name: params.get("name") ?? MOCK_SERVICE.name,
    platform: params.get("platform") ?? MOCK_SERVICE.platform,
    price: parseFloat(params.get("price") ?? String(MOCK_SERVICE.price)),
    originalPrice: params.get("originalPrice")
      ? parseFloat(params.get("originalPrice")!)
      : MOCK_SERVICE.originalPrice,
    quantity: params.get("qty") ?? MOCK_SERVICE.quantity,
    platformGradient:
      GRADIENTS[params.get("platform") ?? MOCK_SERVICE.platform] ??
      MOCK_SERVICE.platformGradient,
  };

  /* Steps */
  const [step, setStep] = useState<Step>("form");

  /* Form */
  const [email, setEmail]       = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [link, setLink]         = useState("");
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  /* Cupom */
  const [coupon, setCoupon] = useState<CouponState>({
    code: "", status: "idle", discount: 0, name: "", error: "",
  });

  /* PIX */
  const [pix, setPix] = useState<PixData | null>(null);
  const [countdown, setCountdown] = useState(PIX_DURATION);
  const [copied, setCopied]       = useState(false);
  const [polling, setPolling]     = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Countdown */
  useEffect(() => {
    if (step !== "pix") return;
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [step, countdown]);

  /* Polling de pagamento */
  const checkPayment = useCallback(async (txId: number) => {
    try {
      const res = await fetch(`/api/checkout/status/${txId}`);
      const json = await res.json();
      if (json.data?.status === 1) {
        clearInterval(pollingRef.current!);
        setStep("success");
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (step !== "pix" || !pix) return;
    pollingRef.current = setInterval(() => checkPayment(pix.transactionId), 3000);
    return () => clearInterval(pollingRef.current!);
  }, [step, pix, checkPayment]);

  /* ─── Validação do formulário ─── */
  function validate() {
    const e: Record<string, string> = {};
    if (!email.includes("@")) e.email = "E-mail inválido";
    if (whatsapp.replace(/\D/g, "").length < 10) e.whatsapp = "WhatsApp inválido (mínimo 10 dígitos)";
    if (!link.trim()) e.link = "Informe o @ do seu perfil";
    return e;
  }

  /* ─── Validar cupom ─── */
  async function handleCoupon() {
    if (!coupon.code.trim()) return;
    setCoupon((c) => ({ ...c, status: "loading", error: "" }));
    try {
      const res  = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon.code }),
      });
      const json = await res.json();
      if (json.success) {
        setCoupon((c) => ({
          ...c, status: "valid",
          discount: json.data.discount,
          name: json.data.name,
          error: "",
        }));
      } else {
        setCoupon((c) => ({ ...c, status: "invalid", error: json.message }));
      }
    } catch {
      setCoupon((c) => ({ ...c, status: "invalid", error: "Erro ao validar cupom" }));
    }
  }

  /* ─── Submeter checkout ─── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const normalizedLink = normalizeLink(link, service.platform);
      const res = await fetch("/api/checkout/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          link: normalizedLink,
          email,
          whatsapp: whatsapp.replace(/\D/g, ""),
          couponCode: coupon.status === "valid" ? coupon.code : undefined,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        setSubmitError(json.message ?? "Erro ao processar pedido");
        return;
      }
      setPix(json.data);
      setCountdown(PIX_DURATION);
      setStep("pix");
    } catch {
      setSubmitError("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ─── Copiar PIX ─── */
  async function handleCopy() {
    if (!pix) return;
    await navigator.clipboard.writeText(pix.pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  /* ─── Layouts ─── */
  const discountAmount = (service.price * coupon.discount) / 100;
  const total = service.price - discountAmount;

  /* ═════════════════════════════════════════════
     STEP 1 — FORMULÁRIO
  ═════════════════════════════════════════════ */
  if (step === "form") {
    return (
      <div className="max-w-5xl mx-auto w-full px-4 pt-8 pb-20">
        <StepIndicator step="form" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Formulário */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 flex flex-col gap-6">

            {/* Dados pessoais */}
            <section className="bg-white rounded-2xl border border-border shadow-card p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Seus dados</h2>
              <div className="flex flex-col gap-4">
                <Field label="E-mail *" error={errors.email}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className={inputClass(!!errors.email)}
                    autoComplete="email"
                  />
                </Field>
                <Field label="WhatsApp *" hint="Para receber atualizações do pedido" error={errors.whatsapp}>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className={inputClass(!!errors.whatsapp)}
                    autoComplete="tel"
                  />
                </Field>
              </div>
            </section>

            {/* @ do perfil */}
            <section className="bg-white rounded-2xl border border-border shadow-card p-5">
              <h2 className="font-semibold text-gray-900 mb-1">Perfil {service.platform}</h2>
              <p className="text-xs text-gray-400 mb-4">
                O perfil precisa estar <strong>público</strong>.
              </p>
              <Field label={`@ do seu ${service.platform} *`} error={errors.link}>
                <div className={`flex items-center rounded-xl border ${errors.link ? "border-red-300" : "border-border"} bg-white focus-within:border-primary transition-colors`}>
                  <span className="pl-4 pr-1 text-base font-semibold text-gray-400 select-none">@</span>
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value.replace(/^@+/, "").replace(/\s/g, ""))}
                    placeholder="seuusername"
                    className="flex-1 py-3 pr-4 text-sm bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
                    autoComplete="off"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                </div>
              </Field>
              {link.trim().length > 0 && (
                <div className="mt-3 flex items-center justify-between gap-3 bg-primary-light border border-border rounded-xl px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-normal mb-0.5 whitespace-nowrap">Verifique se é o perfil correto</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{normalizeLink(link, service.platform)}</p>
                  </div>
                  <a
                    href={normalizeLink(link, service.platform)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-xs font-semibold text-primary border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/5 transition-colors"
                  >
                    Verificar →
                  </a>
                </div>
              )}
            </section>

            {/* Cupom */}
            <section className="bg-white rounded-2xl border border-border shadow-card p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Cupom de desconto</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon.code}
                  onChange={(e) =>
                    setCoupon((c) => ({ ...c, code: e.target.value.toUpperCase(), status: "idle", error: "" }))
                  }
                  placeholder="SEUCUPOM"
                  className={`flex-1 ${inputClass(coupon.status === "invalid")}`}
                  disabled={coupon.status === "valid"}
                />
                <button
                  type="button"
                  onClick={
                    coupon.status === "valid"
                      ? () => setCoupon({ code: "", status: "idle", discount: 0, name: "", error: "" })
                      : handleCoupon
                  }
                  disabled={coupon.status === "loading" || !coupon.code.trim()}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-border text-gray-700 hover:bg-surface transition-colors disabled:opacity-50 flex-shrink-0"
                >
                  {coupon.status === "loading" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : coupon.status === "valid" ? (
                    "Remover"
                  ) : (
                    "Aplicar"
                  )}
                </button>
              </div>
              {coupon.status === "valid" && (
                <p className="mt-2 text-xs text-success flex items-center gap-1 font-medium">
                  <CheckCircle size={13} /> {coupon.name} — {coupon.discount}% de desconto aplicado!
                </p>
              )}
              {coupon.status === "invalid" && (
                <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={13} /> {coupon.error}
                </p>
              )}
            </section>

            {/* Erro geral */}
            {submitError && (
              <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 text-base font-bold text-white rounded-2xl bg-brand-gradient hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 shadow-brand min-h-[52px]"
            >
              {submitting ? (
                <><Loader2 size={20} className="animate-spin" /> Gerando PIX…</>
              ) : (
                <><Zap size={18} /> Gerar PIX — {formatBRL(total)}</>
              )}
            </button>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-2 lg:sticky lg:top-20">
            <OrderSummary
              service={service}
              discount={coupon.status === "valid" ? coupon.discount : 0}
              couponName={coupon.name}
            />
          </div>
        </div>
      </div>
    );
  }

  /* ═════════════════════════════════════════════
     STEP 2 — PIX
  ═════════════════════════════════════════════ */
  if (step === "pix" && pix) {
    const expired = countdown <= 0;

    return (
      <div className="max-w-lg mx-auto w-full px-4 pt-8 pb-20">
        <StepIndicator step="pix" />

        <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-border text-center">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-full mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Aguardando pagamento
            </div>
            <p className="text-gray-500 text-sm">
              Escaneie o QR Code ou copie o código PIX
            </p>
          </div>

          <div className="p-6">
            {/* QR Code */}
            {!expired && (
              <div className="flex justify-center mb-5">
                <div className="p-3 border-2 border-border rounded-2xl bg-white inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pix.qrCodeUrl}
                    alt="QR Code PIX"
                    width={200}
                    height={200}
                    className="block"
                  />
                </div>
              </div>
            )}

            {/* Countdown */}
            <div className={`flex items-center justify-center gap-2 text-sm font-semibold mb-4 ${expired ? "text-red-500" : "text-gray-700"}`}>
              <Clock size={15} />
              {expired ? "PIX expirado" : `Expira em ${formatCountdown(countdown)}`}
            </div>

            {/* Código PIX */}
            {!expired && (
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wide">
                  Código PIX Copia e Cola
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-surface border border-border rounded-xl px-3 py-2.5 text-xs text-gray-600 font-mono truncate">
                    {pix.pixCode}
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      copied
                        ? "bg-success text-white"
                        : "bg-primary text-white hover:opacity-90"
                    }`}
                    style={!copied ? { background: "linear-gradient(135deg,#c60cff,#fd5949)" } : {}}
                  >
                    {copied ? <><Check size={14} /> Copiado!</> : <><Copy size={14} /> Copiar</>}
                  </button>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between items-center py-3 border-t border-border text-sm">
              <span className="text-gray-500">Valor a pagar</span>
              <span className="font-bold text-lg text-gray-900">{formatBRL(pix.amount)}</span>
            </div>

            {/* Recarregar / Polling */}
            {expired ? (
              <button
                onClick={() => setStep("form")}
                className="w-full mt-3 py-3.5 text-sm font-semibold text-primary border border-primary rounded-xl hover:bg-primary-light transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={15} /> Voltar e tentar novamente
              </button>
            ) : (
              <button
                onClick={() => checkPayment(pix.transactionId)}
                disabled={polling}
                className="w-full mt-3 py-3.5 text-sm font-semibold text-gray-600 border border-border rounded-xl hover:bg-surface transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {polling
                  ? <><Loader2 size={14} className="animate-spin" /> Verificando…</>
                  : <><RefreshCw size={14} /> Já paguei, verificar agora</>
                }
              </button>
            )}
          </div>

          {/* Rodapé */}
          <div className="px-5 pb-4 text-center text-xs text-gray-400">
            O pagamento é verificado automaticamente. Não feche esta página.
          </div>
        </div>
      </div>
    );
  }

  /* ═════════════════════════════════════════════
     STEP 3 — SUCESSO
  ═════════════════════════════════════════════ */
  return (
    <div className="max-w-lg mx-auto w-full px-4 pt-8 pb-20">
      <StepIndicator step="success" />

      <div className="bg-white rounded-2xl border border-border shadow-card p-8 text-center">
        {/* Ícone */}
        <div
          className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-5"
          style={{ background: "linear-gradient(135deg,#0cc27e,#06a561)" }}
        >
          <CheckCircle size={40} className="text-white" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Pagamento confirmado!
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Seu pedido foi processado com sucesso. A entrega de{" "}
          <strong className="text-gray-800">{pix?.productName ?? service.name}</strong>{" "}
          será iniciada em breve.
        </p>

        {/* Info */}
        <div className="bg-surface rounded-xl p-4 text-left mb-6 flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Pedido</span>
            <span className="font-semibold text-gray-900">#{pix?.transactionId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Serviço</span>
            <span className="font-semibold text-gray-900 text-right max-w-[55%] leading-tight">{pix?.productName ?? service.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Valor pago</span>
            <span className="font-bold text-gray-900">{formatBRL(pix?.amount ?? total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Entrega estimada</span>
            <span className="font-semibold text-success">0 a 8 horas</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/meus-pedidos"
            className="w-full py-3.5 text-sm font-bold text-white rounded-xl flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#c60cff,#fd5949)" }}
          >
            Ver meu pedido
          </Link>
          <Link
            href="/"
            className="w-full py-3.5 text-sm font-semibold text-gray-600 border border-border rounded-xl hover:bg-surface transition-colors"
          >
            Voltar para a loja
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Field helper ─── */
function Field({
  label, hint, error, children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors min-h-[44px] ${
    hasError
      ? "border-red-300 bg-red-50 focus:border-red-400"
      : "border-border bg-white focus:border-primary"
  }`;
}
