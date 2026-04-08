"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Activity = {
  id: number;
  name: string;
  city: string;
  service: string;
  platform: string;
  platformColor: string;
  icon: string;
};

const POOL: Omit<Activity, "id">[] = [
  { name: "Lucas R.", city: "São Paulo", service: "1.000 Seguidores", platform: "Instagram", platformColor: "#E1306C", icon: "📸" },
  { name: "Mariana S.", city: "Rio de Janeiro", service: "500 Curtidas", platform: "TikTok", platformColor: "#010101", icon: "🎵" },
  { name: "Felipe O.", city: "Belo Horizonte", service: "2.000 Seguidores", platform: "Instagram", platformColor: "#E1306C", icon: "📸" },
  { name: "Camila A.", city: "Curitiba", service: "1.000 Seguidores", platform: "TikTok", platformColor: "#010101", icon: "🎵" },
  { name: "Rafael M.", city: "Fortaleza", service: "5.000 Visualizações", platform: "YouTube", platformColor: "#FF0000", icon: "▶️" },
  { name: "Juliana P.", city: "Recife", service: "500 Seguidores", platform: "Kwai", platformColor: "#FF6B00", icon: "🎬" },
  { name: "Thiago B.", city: "Salvador", service: "1.000 Curtidas", platform: "Instagram", platformColor: "#E1306C", icon: "📸" },
  { name: "Ana C.", city: "Manaus", service: "2.000 Seguidores", platform: "Instagram", platformColor: "#E1306C", icon: "📸" },
  { name: "Bruno L.", city: "Porto Alegre", service: "500 Seguidores", platform: "Facebook", platformColor: "#1877F2", icon: "👍" },
  { name: "Fernanda G.", city: "Brasília", service: "3.000 Seguidores", platform: "Instagram", platformColor: "#E1306C", icon: "📸" },
  { name: "Diego N.", city: "Goiânia", service: "1.000 Seguidores", platform: "TikTok", platformColor: "#010101", icon: "🎵" },
  { name: "Isabela F.", city: "Florianópolis", service: "500 Curtidas", platform: "Instagram", platformColor: "#E1306C", icon: "📸" },
  { name: "Pedro H.", city: "Natal", service: "10.000 Visualizações", platform: "YouTube", platformColor: "#FF0000", icon: "▶️" },
  { name: "Letícia M.", city: "Maceió", service: "2.000 Curtidas", platform: "TikTok", platformColor: "#010101", icon: "🎵" },
  { name: "Carlos V.", city: "Belém", service: "1.000 Seguidores", platform: "Instagram", platformColor: "#E1306C", icon: "📸" },
  { name: "Beatriz A.", city: "São Luís", service: "500 Seguidores", platform: "TikTok", platformColor: "#010101", icon: "🎵" },
  { name: "Rodrigo T.", city: "Teresina", service: "3.000 Seguidores", platform: "Instagram", platformColor: "#E1306C", icon: "📸" },
  { name: "Amanda O.", city: "João Pessoa", service: "1.000 Curtidas", platform: "Instagram", platformColor: "#E1306C", icon: "📸" },
  { name: "Gabriel S.", city: "Aracaju", service: "500 Seguidores", platform: "Kwai", platformColor: "#FF6B00", icon: "🎬" },
  { name: "Larissa C.", city: "Campo Grande", service: "2.000 Seguidores", platform: "TikTok", platformColor: "#010101", icon: "🎵" },
  { name: "Vinícius R.", city: "Cuiabá", service: "5.000 Curtidas", platform: "Instagram", platformColor: "#E1306C", icon: "📸" },
  { name: "Priscila N.", city: "Porto Velho", service: "1.000 Seguidores", platform: "Facebook", platformColor: "#1877F2", icon: "👍" },
  { name: "Eduardo B.", city: "Macapá", service: "3.000 Visualizações", platform: "YouTube", platformColor: "#FF0000", icon: "▶️" },
  { name: "Tatiane L.", city: "Boa Vista", service: "500 Curtidas", platform: "TikTok", platformColor: "#010101", icon: "🎵" },
  { name: "Henrique F.", city: "Palmas", service: "1.000 Seguidores", platform: "Instagram", platformColor: "#E1306C", icon: "📸" },
  { name: "Natália V.", city: "Vitória", service: "2.000 Seguidores", platform: "Instagram", platformColor: "#E1306C", icon: "📸" },
  { name: "Gustavo M.", city: "Campinas", service: "500 Seguidores", platform: "TikTok", platformColor: "#010101", icon: "🎵" },
  { name: "Aline P.", city: "Santos", service: "1.000 Curtidas", platform: "Instagram", platformColor: "#E1306C", icon: "📸" },
  { name: "Marcos D.", city: "Ribeirão Preto", service: "5.000 Seguidores", platform: "Instagram", platformColor: "#E1306C", icon: "📸" },
  { name: "Patrícia E.", city: "Uberlândia", service: "500 Seguidores", platform: "Kwai", platformColor: "#FF6B00", icon: "🎬" },
  { name: "Renato C.", city: "Sorocaba", service: "2.000 Curtidas", platform: "TikTok", platformColor: "#010101", icon: "🎵" },
  { name: "Simone A.", city: "Londrina", service: "1.000 Seguidores", platform: "Facebook", platformColor: "#1877F2", icon: "👍" },
  { name: "André K.", city: "Joinville", service: "10.000 Visualizações", platform: "YouTube", platformColor: "#FF0000", icon: "▶️" },
  { name: "Cíntia R.", city: "Caxias do Sul", service: "3.000 Seguidores", platform: "Instagram", platformColor: "#E1306C", icon: "📸" },
  { name: "Maurício T.", city: "Pelotas", service: "500 Curtidas", platform: "Instagram", platformColor: "#E1306C", icon: "📸" },
  { name: "Vanessa O.", city: "Mogi das Cruzes", service: "1.000 Seguidores", platform: "TikTok", platformColor: "#010101", icon: "🎵" },
];

let idCounter = 0;
let lastIndex = -1;

function randomItem(): Activity {
  let index: number;
  do {
    index = Math.floor(Math.random() * POOL.length);
  } while (index === lastIndex);
  lastIndex = index;
  return { ...POOL[index], id: ++idCounter };
}

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const t = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.type = "sine";
    osc2.type = "sine";

    osc1.frequency.setValueAtTime(880, t);
    osc1.frequency.exponentialRampToValueAtTime(1100, t + 0.08);
    osc2.frequency.setValueAtTime(1320, t + 0.1);
    osc2.frequency.exponentialRampToValueAtTime(1100, t + 0.2);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc1.start(t);
    osc1.stop(t + 0.12);
    osc2.start(t + 0.1);
    osc2.stop(t + 0.35);

    setTimeout(() => ctx.close(), 500);
  } catch {
    // silently ignore if Web Audio is not available
  }
}

// Random between min and max ms
function randomDelay(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function LiveActivityFeed() {
  const [current, setCurrent] = useState<Activity | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showNext() {
    const next = randomItem();
    setCurrent(next);
    playNotificationSound();

    // Fica visível por tempo aleatório entre 4s e 7s
    const displayTime = randomDelay(4000, 7000);
    dismissRef.current = setTimeout(() => {
      setCurrent(null);
      // Intervalo aleatório entre 8s e 20s antes da próxima
      const waitTime = randomDelay(8000, 20000);
      timerRef.current = setTimeout(showNext, waitTime);
    }, displayTime);
  }

  useEffect(() => {
    // Primeira aparece após 2s a 5s
    const firstDelay = randomDelay(2000, 5000);
    timerRef.current = setTimeout(showNext, firstDelay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (dismissRef.current) clearTimeout(dismissRef.current);
    };
  }, []);

  return (
    // top-[88px] garante que fica logo abaixo do header sticky (h-20 = 80px)
    <div
      className="fixed top-[88px] left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-xs pointer-events-none"
      aria-live="polite"
      aria-label="Compras recentes"
    >
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: -24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-white/97 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden pointer-events-auto"
          >
            {/* Topo estilo iOS: app name + tempo */}
            <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-[4px] bg-brand-gradient flex items-center justify-center">
                  <span className="text-[8px]">🛒</span>
                </div>
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                  Picão Duro
                </span>
              </div>
              <span className="text-[10px] text-gray-400">agora</span>
            </div>

            {/* Corpo da notificação */}
            <div className="flex items-center gap-3 px-3 pb-3 pt-0.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ backgroundColor: current.platformColor + "18" }}
              >
                {current.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-gray-900 leading-tight">
                  {current.name}{" "}
                  <span className="font-normal text-gray-500">de</span>{" "}
                  <span style={{ color: current.platformColor }} className="font-semibold">
                    {current.city}
                  </span>
                </p>
                <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                  comprou{" "}
                  <span className="font-semibold text-gray-800">
                    {current.service} {current.platform}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
