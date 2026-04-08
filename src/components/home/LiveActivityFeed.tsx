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

function randomDelay(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
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
  } catch { /* silently ignore */ }
}

export function LiveActivityFeed() {
  const [current, setCurrent] = useState<Activity | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showNext() {
    const next = randomItem();
    setCurrent(next);
    playNotificationSound();

    const displayTime = randomDelay(4000, 7000);
    dismissRef.current = setTimeout(() => {
      setCurrent(null);
      const waitTime = randomDelay(8000, 20000);
      timerRef.current = setTimeout(showNext, waitTime);
    }, displayTime);
  }

  useEffect(() => {
    timerRef.current = setTimeout(showNext, randomDelay(2000, 5000));
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (dismissRef.current) clearTimeout(dismissRef.current);
    };
  }, []);

  return (
    /* Canto inferior esquerdo — nunca conflita com header/announcement bar */
    <div
      className="fixed bottom-6 left-4 z-[9999] w-72 pointer-events-none"
      aria-live="polite"
      aria-label="Compras recentes"
    >
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: -80, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -60, scale: 0.95 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto"
          >
            {/* Card principal */}
            <div className="relative bg-white rounded-2xl overflow-hidden"
              style={{
                boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)",
              }}
            >
              {/* Barra colorida da plataforma no topo */}
              <div
                className="h-[3px] w-full"
                style={{ backgroundColor: current.platformColor }}
              />

              {/* Cabeçalho: ícone do app + nome + tempo */}
              <div className="flex items-center gap-2 px-3 pt-2 pb-1">
                <div className="w-5 h-5 rounded-[5px] bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
                    <path d="M7 4h10a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3zm5 3a4 4 0 100 8 4 4 0 000-8zm0 1.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm4.5-.75a.75.75 0 110 1.5.75.75 0 010-1.5z"/>
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex-1">
                  Picão Duro
                </span>
                <span className="text-[10px] text-gray-300 font-medium">agora</span>
              </div>

              {/* Corpo */}
              <div className="flex items-center gap-3 px-3 pb-3">
                {/* Ícone da plataforma */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${current.platformColor}22, ${current.platformColor}44)`,
                    border: `1.5px solid ${current.platformColor}33`,
                  }}
                >
                  {current.icon}
                </div>

                {/* Texto */}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-black text-gray-900 leading-snug">
                    {current.name}{" "}
                    <span className="font-normal text-gray-500 text-[11px]">de</span>{" "}
                    <span
                      className="font-bold"
                      style={{ color: current.platformColor }}
                    >
                      {current.city}
                    </span>
                  </p>
                  <p className="text-[11px] text-gray-500 leading-snug mt-0.5">
                    comprou{" "}
                    <span className="font-semibold text-gray-800">
                      {current.service}
                    </span>
                    <span
                      className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: current.platformColor }}
                    >
                      {current.platform}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
