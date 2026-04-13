"use client";

import { useState } from "react";
import { RefreshCw, AlertCircle, Loader2, CheckCircle2, Clock, X } from "lucide-react";

function RefillSuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Card */}
      <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-muted hover:text-foreground transition-colors"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-5">
          <CheckCircle2 size={32} className="text-green-500" />
        </div>

        <h2 className="text-xl font-jakarta font-extrabold text-foreground mb-2">
          Solicitação Enviada!
        </h2>
        <p className="text-sm text-muted font-medium leading-relaxed mb-6">
          Recebemos sua solicitação de reposição. Nossa equipe irá processar e repor os itens em até:
        </p>

        {/* Prazo destaque */}
        <div className="w-full bg-primary/5 border border-primary/20 rounded-2xl px-6 py-4 flex items-center justify-center gap-3 mb-6">
          <Clock size={20} className="text-primary shrink-0" />
          <span className="text-2xl font-jakarta font-extrabold text-primary">72 horas</span>
        </div>

        <p className="text-xs text-muted font-medium mb-6">
          Você pode acompanhar o status do pedido a qualquer momento nesta página.
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 bg-brand-gradient text-white font-extrabold rounded-2xl shadow-brand hover:scale-[1.02] transition-transform"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}

export function RefillButton({ orderId, email }: { orderId: number; email: string }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleClick = async () => {
    setState("loading");
    try {
      const res = await fetch(`/api/orders/${orderId}/refill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setState("success");
        setShowModal(true);
      } else {
        setState("error");
        setErrorMsg(data.error || "Erro ao solicitar reposição.");
      }
    } catch {
      setState("error");
      setErrorMsg("Erro de conexão.");
    }
  };

  if (state === "error") {
    return (
      <div className="flex items-center gap-2 text-red-500 text-sm font-bold">
        <AlertCircle size={16} /> {errorMsg}
      </div>
    );
  }

  if (state === "success") {
    return (
      <>
        <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
          <CheckCircle2 size={16} /> Reposição solicitada!
        </div>
        {showModal && <RefillSuccessModal onClose={() => setShowModal(false)} />}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={state === "loading"}
        className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-all disabled:opacity-50"
      >
        {state === "loading"
          ? <Loader2 size={14} className="animate-spin" />
          : <RefreshCw size={14} />}
        Solicitar Reposição
      </button>
      {showModal && <RefillSuccessModal onClose={() => setShowModal(false)} />}
    </>
  );
}
