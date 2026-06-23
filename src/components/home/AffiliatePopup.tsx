"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ArrowRight, Zap, DollarSign, Users } from "lucide-react";

const STORAGE_KEY = "affiliate_popup_dismissed";
const POPUP_DELAY_MS = 4000; // Aparece após 4 segundos

export function AffiliatePopup({ commissionRate = 10 }: { commissionRate?: number }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Só mostra se nunca foi dispensado nessa sessão
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setExiting(true);
    sessionStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => setVisible(false), 350);
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          exiting ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
        aria-hidden
      />

      {/* Modal */}
      <div
        className={`fixed z-[1000] bottom-0 left-0 right-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md w-full transition-all duration-350 ${
          exiting
            ? "opacity-0 translate-y-8 sm:translate-y-[-40%]"
            : "opacity-100 translate-y-0 sm:-translate-y-1/2"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="affiliate-popup-title"
      >
        <div className="bg-slate-900 sm:rounded-3xl overflow-hidden shadow-2xl">
          {/* Green top bar */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-400 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-white" fill="white" />
              <span className="text-white font-black text-sm tracking-wide uppercase">
                Oportunidade exclusiva
              </span>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Fechar popup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-7 py-8">
            {/* Headline */}
            <h2
              id="affiliate-popup-title"
              className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3"
            >
              Ganhe até{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
                R$200 por dia
              </span>{" "}
              vendendo nossos serviços.
            </h2>

            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Sem produto, sem estoque, sem investimento. Só compartilhe seu link
              e receba <strong className="text-white">{commissionRate}% de comissão</strong> a cada venda — caindo direto no seu PIX.
            </p>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-3 mb-7">
              {[
                { icon: <DollarSign className="w-4 h-4 text-emerald-400" />, value: `${commissionRate}%`, label: "Comissão" },
                { icon: <Users className="w-4 h-4 text-blue-400" />, value: "90 dias", label: "Cookie" },
                { icon: <Zap className="w-4 h-4 text-amber-400" />, value: "PIX", label: "Saque" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/5 rounded-xl p-3 text-center border border-white/10"
                >
                  <div className="flex justify-center mb-1">{s.icon}</div>
                  <div className="text-white font-black text-sm">{s.value}</div>
                  <div className="text-slate-500 text-[10px] font-medium">{s.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/afiliados/cadastro"
              onClick={handleClose}
              className="flex items-center justify-center gap-2 w-full h-14 rounded-2xl text-base font-black text-slate-900 bg-gradient-to-r from-emerald-400 to-green-300 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-emerald-500/30"
            >
              Quero ser Afiliado <ArrowRight className="w-5 h-5" />
            </Link>

            <button
              onClick={handleClose}
              className="w-full mt-3 text-xs text-slate-600 hover:text-slate-400 transition-colors py-2"
            >
              Não, obrigado
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
