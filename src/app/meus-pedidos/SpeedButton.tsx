"use client";

import { useState, useEffect } from "react";
import { Zap, AlertCircle, Loader2, CheckCircle2, Clock, Lock, X } from "lucide-react";

function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function useCountdown(targetMs: number) {
  const [remaining, setRemaining] = useState(() => Math.max(0, targetMs - Date.now()));
  useEffect(() => {
    if (remaining <= 0) return;
    const t = setInterval(() => {
      const left = Math.max(0, targetMs - Date.now());
      setRemaining(left);
      if (left === 0) clearInterval(t);
    }, 1000);
    return () => clearInterval(t);
  }, [targetMs]);
  return remaining;
}

function SpeedSuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-muted hover:text-foreground transition-colors"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-5">
          <Zap size={32} className="text-amber-500" />
        </div>
        <h2 className="text-xl font-jakarta font-extrabold text-foreground mb-2">
          Agilidade Solicitada!
        </h2>
        <p className="text-sm text-muted font-medium leading-relaxed mb-6">
          Recebemos sua solicitação de agilidade. Nossa equipe irá acelerar a entrega do seu pedido em até:
        </p>
        <div className="w-full bg-amber-500/5 border border-amber-500/20 rounded-2xl px-6 py-4 flex items-center justify-center gap-3 mb-6">
          <Clock size={20} className="text-amber-600 shrink-0" />
          <span className="text-2xl font-jakarta font-extrabold text-amber-600">24 horas</span>
        </div>
        <p className="text-xs text-muted font-medium mb-6">
          Você pode acompanhar o status do pedido a qualquer momento nesta página.
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-amber-500 text-white font-extrabold rounded-2xl shadow-md hover:scale-[1.02] transition-transform"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}

export function SpeedButton({
  orderId,
  email,
  createdAt,
  speedRequestedAt,
  intervalDays,
  lockHours,
}: {
  orderId: number;
  email: string;
  createdAt: string;
  speedRequestedAt: string | null;
  intervalDays: number;
  lockHours: number;
}) {
  // Countdown do lock inicial após criação
  const lockMs = lockHours * 3600 * 1000;
  const lockUnlocksAt = new Date(createdAt).getTime() + lockMs;
  const lockRemaining = useCountdown(lockUnlocksAt);

  // Countdown do intervalo entre solicitações
  const intervalMs = intervalDays * 86400 * 1000;
  const intervalUnlocksAt = speedRequestedAt
    ? new Date(speedRequestedAt).getTime() + intervalMs
    : 0;
  const intervalRemaining = useCountdown(intervalUnlocksAt);

  const [requestState, setRequestState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleClick = async () => {
    setRequestState("loading");
    try {
      const res = await fetch(`/api/orders/${orderId}/speed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setRequestState("success");
        setShowModal(true);
      } else {
        setRequestState("error");
        setErrorMsg(data.error || "Erro ao solicitar agilidade.");
      }
    } catch {
      setRequestState("error");
      setErrorMsg("Erro de conexão.");
    }
  };

  // 1. Lock inicial
  if (lockRemaining > 0) {
    return (
      <div
        title={`Disponível em ${formatCountdown(lockRemaining)}`}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-xl text-xs font-bold cursor-not-allowed select-none"
      >
        <Lock size={13} />
        Agilidade em {formatCountdown(lockRemaining)}
      </div>
    );
  }

  // 2. Intervalo entre solicitações ainda ativo
  if (intervalRemaining > 0 || requestState === "success") {
    const timeLeft = intervalRemaining;
    return (
      <>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-bold select-none">
          <CheckCircle2 size={13} className="shrink-0" />
          <span>
            Agilidade solicitada
            {timeLeft > 0 && (
              <span className="text-amber-500 font-medium ml-1">
                · próxima em {formatCountdown(timeLeft)}
              </span>
            )}
          </span>
        </div>
        {showModal && <SpeedSuccessModal onClose={() => setShowModal(false)} />}
      </>
    );
  }

  // 3. Erro
  if (requestState === "error") {
    return (
      <div className="flex items-center gap-2 text-red-500 text-sm font-bold">
        <AlertCircle size={16} /> {errorMsg}
      </div>
    );
  }

  // 4. Botão normal
  return (
    <>
      <button
        onClick={handleClick}
        disabled={requestState === "loading"}
        className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-600 rounded-xl text-xs font-bold hover:bg-amber-500/20 transition-all disabled:opacity-50"
      >
        {requestState === "loading"
          ? <Loader2 size={14} className="animate-spin" />
          : <Zap size={14} />}
        Solicitar Agilidade
      </button>
      {showModal && <SpeedSuccessModal onClose={() => setShowModal(false)} />}
    </>
  );
}
