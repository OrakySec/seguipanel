"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

/* ─── Types ─── */
export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

/* ─── Context ─── */
interface ToastContextValue {
  toast: (type: ToastType, title: string, description?: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de <ToastProvider>");
  return ctx;
}

/* ─── Provider + Toaster ─── */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback((type: ToastType, title: string, description?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, title, description }]);
  }, []);

  const remove = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitives.Provider swipeDirection="right" duration={4000}>
        {children}

        {toasts.map((t) => (
          <ToastPrimitives.Root
            key={t.id}
            onOpenChange={(open) => { if (!open) remove(t.id); }}
            className={`
              group pointer-events-auto relative flex w-full max-w-sm items-start gap-3
              rounded-2xl border p-4 shadow-xl
              data-[state=open]:animate-in data-[state=closed]:animate-out
              data-[swipe=end]:animate-out data-[state=closed]:fade-out-80
              data-[state=closed]:slide-out-to-right-full
              data-[state=open]:slide-in-from-bottom-full
              transition-all duration-300
              ${t.type === "success" ? "bg-white border-green-100" : ""}
              ${t.type === "error"   ? "bg-white border-red-100"   : ""}
              ${t.type === "info"    ? "bg-white border-blue-100"  : ""}
            `}
          >
            {/* Icon */}
            <div className={`mt-0.5 flex-shrink-0 rounded-xl p-2
              ${t.type === "success" ? "bg-green-50 text-green-600" : ""}
              ${t.type === "error"   ? "bg-red-50 text-red-500"     : ""}
              ${t.type === "info"    ? "bg-blue-50 text-blue-500"   : ""}
            `}>
              {t.type === "success" && <CheckCircle2 size={18} />}
              {t.type === "error"   && <XCircle size={18} />}
              {t.type === "info"    && <Info size={18} />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <ToastPrimitives.Title className="text-sm font-bold text-gray-900 leading-snug">
                {t.title}
              </ToastPrimitives.Title>
              {t.description && (
                <ToastPrimitives.Description className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                  {t.description}
                </ToastPrimitives.Description>
              )}
            </div>

            {/* Close */}
            <ToastPrimitives.Close className="flex-shrink-0 rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <X size={14} />
            </ToastPrimitives.Close>
          </ToastPrimitives.Root>
        ))}

        <ToastPrimitives.Viewport className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 w-full max-w-sm" />
      </ToastPrimitives.Provider>
    </ToastContext.Provider>
  );
}
