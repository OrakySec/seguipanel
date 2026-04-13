"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function RefillButton({ orderId, email }: { orderId: number; email: string }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

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
        setMsg("Reposição solicitada! Responderemos em breve.");
      } else {
        setState("error");
        setMsg(data.error || "Erro ao solicitar reposição.");
      }
    } catch {
      setState("error");
      setMsg("Erro de conexão.");
    }
  };

  if (state === "success") {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
        <CheckCircle2 size={16} /> {msg}
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex items-center gap-2 text-red-500 text-sm font-bold">
        <AlertCircle size={16} /> {msg}
      </div>
    );
  }

  return (
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
  );
}
