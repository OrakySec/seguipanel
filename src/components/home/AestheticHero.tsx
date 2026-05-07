"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Zap, ShieldCheck, RefreshCw, Headphones, Eye, Star, X } from "lucide-react";

function useViewerCount() {
  const [count, setCount] = useState(() => Math.floor(Math.random() * (310 - 190 + 1)) + 190);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const scheduleNext = () => {
      const delay = Math.floor(Math.random() * (12_000 - 5_000 + 1)) + 5_000;
      timer = setTimeout(() => {
        setCount(prev => {
          const delta = Math.floor(Math.random() * 7) - 3;
          return Math.min(320, Math.max(180, prev + delta));
        });
        scheduleNext();
      }, delay);
    };
    scheduleNext();
    return () => clearTimeout(timer);
  }, []);
  return count;
}

function PlatformModal({
  platforms,
  onClose,
}: {
  platforms: any[];
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    // Impede scroll do body enquanto modal está aberto
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[99999] flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Card */}
        <motion.div
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          initial={{ opacity: 0, scale: 0.93, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header do modal */}
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
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0 ml-4"
              aria-label="Fechar"
            >
              <X size={16} className="text-gray-600" />
            </button>
          </div>

          {/* Lista de plataformas */}
          <div className="px-4 pb-6 grid grid-cols-1 gap-2">
            {platforms.filter((p) => p.urlSlug).map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={`/comprar-seguidores-${p.urlSlug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 px-4 py-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
                >
                  {/* Ícone da plataforma */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: p.gradient }}
                  >
                    <SocialIcon slug={p.urlSlug} size={22} className="text-white" />
                  </div>

                  {/* Texto */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      A partir de {p.fromPrice}
                    </p>
                  </div>

                  {/* Seta */}
                  <div className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="text-gray-400 group-hover:text-white">
                      <path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

export function AestheticHero({ platforms }: { platforms: any[] }) {
  const viewers = useViewerCount();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="hero-entrance max-w-4xl mx-auto relative z-10">
        {/* Badge social proof */}
        {/* Badge social proof premium (ESTILO FORÇADO VIA INLINE PARA PRECISÃO) */}
        <div 
          className="inline-flex items-center bg-white/70 rounded-full px-6 py-1.5 mb-8 transition-all duration-500 hover:scale-105"
          style={{ 
            border: '1.2px solid #ece4ff',
            boxShadow: '0 8px 30px rgba(124, 77, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            gap: '12px'
          }}
        >
          <div className="flex flex-shrink-0">
            {[
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=70&w=64&h=64&auto=format,compress&fit=crop",
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=70&w=64&h=64&auto=format,compress&fit=crop",
              "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=70&w=64&h=64&auto=format,compress&fit=crop",
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=70&w=64&h=64&auto=format,compress&fit=crop"
            ].map((img, i) => (
              <div
                key={`avatar-force-${i}`}
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  minWidth: '32px', 
                  minHeight: '32px',
                  borderRadius: '9999px',
                  border: '2px solid white',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  zIndex: i,
                  marginLeft: i === 0 ? 0 : '-12px',
                  position: 'relative'
                }}
              >
                <img src={img} alt="Cliente" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <p className="text-xs font-bold tracking-tight whitespace-nowrap">
            <span style={{ 
              background: 'linear-gradient(to right, #fb24b1, #7c4dff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent'
            }}>
              Mais de 83.327 clientes satisfeitos
            </span>
          </p>
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-[86px] font-black text-gray-900 tracking-tight leading-[0.95] mb-6">
          Compre Seguidores
          <br /> Para Suas
          <span className="font-script-stylized">
            Redes sociais
          </span>
        </h1>

        {/* Parágrafo GEO anchor — logo após o h1 para SEO e alinhamento SSR/client */}
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
          O SeguiFacil é a plataforma SMM brasileira com mais de 83.000 clientes atendidos desde 2017.
          Seguidores reais com entrega automática e garantia de reposição.
        </p>

        {/* CTA principal */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-lg font-black text-white bg-brand-gradient shadow-brand hover:opacity-90 active:scale-95 transition-all animate-pulse-glow cursor-pointer"
          >
            <Zap size={22} aria-hidden /> Comprar Seguidores Agora
          </button>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex flex-wrap justify-center items-center gap-3">
            <span>✓ Entrega em minutos</span>
            <span>✓ PIX</span>
            <span>✓ Garantia inclusa</span>
          </p>
        </div>

        {/* Subtítulo e Promo */}
        <div className="mb-8 text-center">
          <p className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
            Entrega rápida, 100% seguro, sem senha.
          </p>
          <p className="text-lg text-gray-600 font-medium">
            Pacotes a partir de <span className="text-gray-900 font-bold">R$2,50</span>.
          </p>
        </div>



        {/* Botões de plataforma */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {platforms.filter((p) => p.urlSlug).map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/comprar-seguidores-${p.urlSlug}`}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold bg-white border border-gray-200 text-gray-800 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all"
              >
                <SocialIcon slug={p.urlSlug} size={18} />
                {p.name}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-6">
          {[
            { Icon: Zap,          text: "Entrega em Minutos"      },
            { Icon: ShieldCheck,  text: "Sem Senha"               },
            { Icon: RefreshCw,    text: "Garantia de Reposição"   },
            { Icon: Headphones,   text: "Suporte 24h"             },
            { Icon: Star,         text: "4.9/5 · 12.400 Avaliações" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                <item.Icon size={14} className="text-primary" aria-hidden />
              </div>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Contador de visitantes */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 bg-white/80 border border-border rounded-full px-4 py-2 shadow-sm">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <Eye size={13} className="text-gray-400" aria-hidden />
            <span className="text-[11px] font-bold text-gray-500">
              <span className="text-gray-900" suppressHydrationWarning={true}>{viewers}</span> pessoas visualizando agora
            </span>
          </div>
        </div>
      </div>

      {/* Modal de seleção de plataforma */}
      {modalOpen && (
        <PlatformModal
          platforms={platforms}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
