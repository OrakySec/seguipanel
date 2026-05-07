"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Zap, X } from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";

interface Platform {
  name: string;
  urlSlug?: string;
  gradient?: string;
  fromPrice?: string;
}

function PlatformModal({
  platforms,
  onClose,
}: {
  platforms: Platform[];
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 250);
  }

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center px-4"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        className="absolute inset-0 bg-black/50"
        style={{ backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
        onClick={handleClose}
      />

      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{
          transform: visible
            ? "scale(1) translateY(0)"
            : "scale(0.95) translateY(16px)",
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              Onde você quer crescer?
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Escolha a rede social para começar
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0 ml-4"
            aria-label="Fechar"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        <div className="px-4 pb-6 grid grid-cols-1 gap-2">
          {platforms
            .filter((p): p is Required<Pick<Platform, "urlSlug">> & Platform => Boolean(p.urlSlug))
            .map((p) => (
              <Link
                key={p.name}
                href={`/comprar-seguidores-${p.urlSlug}`}
                onClick={handleClose}
                className="flex items-center gap-4 px-4 py-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: p.gradient }}
                >
                  <SocialIcon slug={p.urlSlug} size={22} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-500">
                    A partir de {p.fromPrice}
                  </p>
                </div>
                <div className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all flex-shrink-0">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="currentColor"
                    className="text-gray-400 group-hover:text-white"
                  >
                    <path
                      d="M4.5 2.5L8 6l-3.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function HeroCtaButton({ platforms }: { platforms: Platform[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-lg font-black text-white bg-brand-gradient shadow-brand hover:opacity-90 active:scale-95 transition-all animate-pulse-glow cursor-pointer"
      >
        <Zap size={22} aria-hidden /> Comprar Seguidores Agora
      </button>
      {open && (
        <PlatformModal platforms={platforms} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
