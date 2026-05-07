"use client";

import { useState, useEffect, useRef } from "react";

const toastStyles = `
@keyframes toastEnter {
  0% { opacity: 0; transform: translateY(-20px) scale(0.97); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes toastExit {
  0% { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-10px) scale(0.97); }
}
.toast-anim-enter {
  animation: toastEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.toast-anim-exit {
  animation: toastExit 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
`;

/* ── Tipos ─────────────────────────────────────────────────────────── */

export type FeedService = {
  serviceName:   string;
  platform:      string;
  platformSlug:  string;
  platformColor: string;
  platformBg:    string;
};

type Activity = {
  id:            number;
  name:          string;
  city:          string;
  serviceName:   string;
  platform:      string;
  platformColor: string;
  platformBg:    string;
};

/* ── Dados fake de identidade ───────────────────────────────────────── */

const NAMES = [
  "Lucas R.", "Mariana S.", "Felipe O.", "Camila A.", "Rafael M.",
  "Juliana P.", "Thiago B.", "Ana C.", "Bruno L.", "Fernanda G.",
  "Diego N.", "Isabela F.", "Pedro H.", "Letícia M.", "Carlos V.",
  "Beatriz A.", "Rodrigo T.", "Amanda O.", "Gabriel S.", "Larissa C.",
  "Vinícius R.", "Priscila N.", "Eduardo B.", "Tatiane L.", "Henrique F.",
  "Natália V.", "Gustavo M.", "Aline P.", "Marcos D.", "Patrícia E.",
  "Renato C.", "Simone A.", "André K.", "Cíntia R.", "Maurício T.",
  "Vanessa O.", "Leandro F.", "Jéssica M.", "Fábio S.", "Carolina B.",
];

const CITIES = [
  "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Fortaleza",
  "Recife", "Salvador", "Manaus", "Porto Alegre", "Brasília",
  "Goiânia", "Florianópolis", "Natal", "Maceió", "Belém",
  "São Luís", "Teresina", "João Pessoa", "Aracaju", "Campo Grande",
  "Cuiabá", "Porto Velho", "Macapá", "Boa Vista", "Palmas",
  "Vitória", "Campinas", "Santos", "Ribeirão Preto", "Uberlândia",
  "Sorocaba", "Londrina", "Joinville", "Caxias do Sul", "Pelotas",
];

/* ── Helpers ────────────────────────────────────────────────────────── */

let idCounter  = 0;
let lastSvcIdx = -1;
let lastNameIdx = -1;
let lastCityIdx = -1;

function pick<T>(arr: T[], lastIdx: number): { value: T; index: number } {
  let idx: number;
  do { idx = Math.floor(Math.random() * arr.length); } while (idx === lastIdx);
  return { value: arr[idx], index: idx };
}

function randomDelay(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildActivity(services: FeedService[]): Activity {
  const svc  = pick(services, lastSvcIdx);
  const name = pick(NAMES,    lastNameIdx);
  const city = pick(CITIES,   lastCityIdx);
  lastSvcIdx  = svc.index;
  lastNameIdx = name.index;
  lastCityIdx = city.index;
  return {
    id:            ++idCounter,
    name:          name.value,
    city:          city.value,
    serviceName:   svc.value.serviceName,
    platform:      svc.value.platform,
    platformColor: svc.value.platformColor,
    platformBg:    svc.value.platformBg,
  };
}

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const t = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.connect(gain); osc2.connect(gain); gain.connect(ctx.destination);
    osc1.type = "sine"; osc2.type = "sine";
    osc1.frequency.setValueAtTime(880, t);
    osc1.frequency.exponentialRampToValueAtTime(1100, t + 0.08);
    osc2.frequency.setValueAtTime(1320, t + 0.1);
    osc2.frequency.exponentialRampToValueAtTime(1100, t + 0.2);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc1.start(t); osc1.stop(t + 0.12);
    osc2.start(t + 0.1); osc2.stop(t + 0.35);
    setTimeout(() => ctx.close(), 500);
  } catch { /* ignore */ }
}

/* ── Ícone SVG por plataforma ────────────────────────────────────────── */

function PlatformIcon({ platform, bg }: { platform: string; bg: string }) {
  const slug = platform.toLowerCase();
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: bg }}
    >
      {slug === "instagram" && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 1.5a3 3 0 110 6 3 3 0 010-6zm4.75-2.25a1 1 0 110 2 1 1 0 010-2z" fill="white"/>
          <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="white" strokeWidth="1.5" fill="none"/>
        </svg>
      )}
      {slug === "tiktok" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
        </svg>
      )}
      {slug === "youtube" && (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.5 5 12 5 12 5s-4.5 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.2.9C6.4 19 12 19 12 19s4.5 0 7-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.7 14.5V9l5.5 2.8-5.5 2.7z"/>
        </svg>
      )}
      {slug === "facebook" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.32l-.53 3.5h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/>
        </svg>
      )}
      {slug === "kwai" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
        </svg>
      )}
      {!["instagram","tiktok","youtube","facebook","kwai"].includes(slug) && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      )}
    </div>
  );
}

/* ── Componente principal ────────────────────────────────────────────── */

export function LiveActivityFeed({ services }: { services: FeedService[] }) {
  const [mounted,   setMounted]   = useState(false);
  const [current,   setCurrent]   = useState<Activity | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [topOffset, setTopOffset] = useState(120);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Garante render apenas no cliente — elimina qualquer hydration mismatch
  useEffect(() => { setMounted(true); }, []);

  // Posiciona dinamicamente abaixo do header sticky
  useEffect(() => {
    const update = () => {
      const header = document.querySelector("header");
      if (header) setTopOffset(header.getBoundingClientRect().bottom + 8);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function showNext() {
    if (!services.length) return;
    setCurrent(buildActivity(services));
    setIsExiting(false);
    playNotificationSound();
    dismissRef.current = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setCurrent(null);
        timerRef.current = setTimeout(showNext, randomDelay(8000, 20000));
      }, 400); // Wait for the exit animation to complete
    }, randomDelay(4000, 7000));
  }

  useEffect(() => {
    if (!services.length) return;
    timerRef.current = setTimeout(showNext, randomDelay(2000, 5000));
    return () => {
      if (timerRef.current)  clearTimeout(timerRef.current);
      if (dismissRef.current) clearTimeout(dismissRef.current);
    };
  }, [services]);

  // Always render the same container on server + client first render.
  // Only show content after mount to avoid any hydration mismatch.
  return (
    <div
      className="fixed left-4 sm:left-6 right-4 sm:right-auto pointer-events-none"
      style={{
        top: topOffset,
        zIndex: 2147483647,
        isolation: "isolate",
        transform: "translateZ(0)",
        willChange: "transform",
        display: mounted && services.length > 0 ? undefined : "none",
      }}
      aria-live="polite"
      aria-label="Compras recentes"
      suppressHydrationWarning
    >
      <style dangerouslySetInnerHTML={{ __html: toastStyles }} />
      {current && (
        <div
          key={current.id}
          className={`w-full max-w-sm pointer-events-auto ${isExiting ? 'toast-anim-exit' : 'toast-anim-enter'}`}
        >
          <div
            className="bg-white rounded-2xl px-3 py-3 flex items-center gap-3"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.07)" }}
          >
            <PlatformIcon platform={current.platform} bg={current.platformBg} />

            <div className="flex-1 min-w-0">
              {/* plataforma + "Agora" */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-gray-500">
                  {current.platform}
                </span>
                <span className="text-[11px] text-gray-500 flex-shrink-0">Agora</span>
              </div>
              {/* nome */}
              <p className="text-[13px] font-bold text-gray-900 leading-tight mt-0.5">
                {current.name}{" "}
                <span className="font-normal text-gray-500">de {current.city}</span>
              </p>
              {/* serviço */}
              <p className="text-[12px] text-gray-500 leading-tight mt-0.5">
                Comprou{" "}
                <span className="font-bold text-gray-800">{current.serviceName}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
