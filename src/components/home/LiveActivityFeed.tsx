"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Activity = {
  id: number;
  name: string;
  city: string;
  service: string;
  quantity: string;
  platform: string;
  platformColor: string;
  platformBg: string;
};

const POOL: Omit<Activity, "id">[] = [
  { name: "Lucas R.", city: "São Paulo",        quantity: "1.247", service: "seguidores",        platform: "Instagram", platformColor: "#E1306C", platformBg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" },
  { name: "Mariana S.", city: "Rio de Janeiro", quantity: "873",   service: "curtidas",          platform: "TikTok",    platformColor: "#010101", platformBg: "#010101" },
  { name: "Felipe O.", city: "Belo Horizonte",  quantity: "2.500", service: "seguidores",        platform: "Instagram", platformColor: "#E1306C", platformBg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" },
  { name: "Camila A.", city: "Curitiba",        quantity: "1.100", service: "seguidores",        platform: "TikTok",    platformColor: "#010101", platformBg: "#010101" },
  { name: "Rafael M.", city: "Fortaleza",       quantity: "5.320", service: "visualizações",     platform: "YouTube",   platformColor: "#FF0000", platformBg: "#FF0000" },
  { name: "Juliana P.", city: "Recife",         quantity: "640",   service: "seguidores",        platform: "Kwai",      platformColor: "#FF6B00", platformBg: "#FF6B00" },
  { name: "Thiago B.", city: "Salvador",        quantity: "1.050", service: "curtidas",          platform: "Instagram", platformColor: "#E1306C", platformBg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" },
  { name: "Ana C.", city: "Manaus",             quantity: "2.190", service: "seguidores",        platform: "Instagram", platformColor: "#E1306C", platformBg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" },
  { name: "Bruno L.", city: "Porto Alegre",     quantity: "530",   service: "seguidores",        platform: "Facebook",  platformColor: "#1877F2", platformBg: "#1877F2" },
  { name: "Fernanda G.", city: "Brasília",      quantity: "3.400", service: "seguidores",        platform: "Instagram", platformColor: "#E1306C", platformBg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" },
  { name: "Diego N.", city: "Goiânia",          quantity: "980",   service: "seguidores",        platform: "TikTok",    platformColor: "#010101", platformBg: "#010101" },
  { name: "Isabela F.", city: "Florianópolis",  quantity: "720",   service: "curtidas",          platform: "Instagram", platformColor: "#E1306C", platformBg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" },
  { name: "Pedro H.", city: "Natal",            quantity: "10.200","service": "visualizações",   platform: "YouTube",   platformColor: "#FF0000", platformBg: "#FF0000" },
  { name: "Letícia M.", city: "Maceió",         quantity: "2.370", service: "curtidas",          platform: "TikTok",    platformColor: "#010101", platformBg: "#010101" },
  { name: "Carlos V.", city: "Belém",           quantity: "1.560", service: "seguidores",        platform: "Instagram", platformColor: "#E1306C", platformBg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" },
  { name: "Beatriz A.", city: "São Luís",       quantity: "490",   service: "seguidores",        platform: "TikTok",    platformColor: "#010101", platformBg: "#010101" },
  { name: "Rodrigo T.", city: "Teresina",       quantity: "3.100", service: "seguidores",        platform: "Instagram", platformColor: "#E1306C", platformBg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" },
  { name: "Amanda O.", city: "João Pessoa",     quantity: "1.230", service: "curtidas",          platform: "Instagram", platformColor: "#E1306C", platformBg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" },
  { name: "Gabriel S.", city: "Aracaju",        quantity: "550",   service: "seguidores",        platform: "Kwai",      platformColor: "#FF6B00", platformBg: "#FF6B00" },
  { name: "Larissa C.", city: "Campo Grande",   quantity: "1.890", service: "seguidores",        platform: "TikTok",    platformColor: "#010101", platformBg: "#010101" },
  { name: "Vinícius R.", city: "Cuiabá",        quantity: "4.750", service: "curtidas",          platform: "Instagram", platformColor: "#E1306C", platformBg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" },
  { name: "Priscila N.", city: "Porto Velho",   quantity: "1.973", service: "visualizações",     platform: "YouTube",   platformColor: "#FF0000", platformBg: "#FF0000" },
  { name: "Eduardo B.", city: "Macapá",         quantity: "3.210", service: "visualizações",     platform: "YouTube",   platformColor: "#FF0000", platformBg: "#FF0000" },
  { name: "Tatiane L.", city: "Boa Vista",      quantity: "660",   service: "curtidas",          platform: "TikTok",    platformColor: "#010101", platformBg: "#010101" },
  { name: "Henrique F.", city: "Palmas",        quantity: "1.340", service: "seguidores",        platform: "Instagram", platformColor: "#E1306C", platformBg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" },
  { name: "Natália V.", city: "Vitória",        quantity: "2.080", service: "seguidores",        platform: "Instagram", platformColor: "#E1306C", platformBg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" },
  { name: "Gustavo M.", city: "Campinas",       quantity: "780",   service: "seguidores",        platform: "TikTok",    platformColor: "#010101", platformBg: "#010101" },
  { name: "Aline P.", city: "Santos",           quantity: "1.420", service: "curtidas",          platform: "Instagram", platformColor: "#E1306C", platformBg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" },
  { name: "Marcos D.", city: "Ribeirão Preto",  quantity: "5.600", service: "seguidores",        platform: "Instagram", platformColor: "#E1306C", platformBg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" },
  { name: "Patrícia E.", city: "Uberlândia",    quantity: "430",   service: "seguidores",        platform: "Kwai",      platformColor: "#FF6B00", platformBg: "#FF6B00" },
  { name: "Renato C.", city: "Sorocaba",        quantity: "2.640", service: "curtidas",          platform: "TikTok",    platformColor: "#010101", platformBg: "#010101" },
  { name: "Simone A.", city: "Londrina",        quantity: "910",   service: "seguidores",        platform: "Facebook",  platformColor: "#1877F2", platformBg: "#1877F2" },
  { name: "André K.", city: "Joinville",        quantity: "12.500","service": "visualizações",   platform: "YouTube",   platformColor: "#FF0000", platformBg: "#FF0000" },
  { name: "Cíntia R.", city: "Caxias do Sul",   quantity: "3.780", service: "seguidores",        platform: "Instagram", platformColor: "#E1306C", platformBg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" },
  { name: "Maurício T.", city: "Pelotas",       quantity: "560",   service: "curtidas",          platform: "Instagram", platformColor: "#E1306C", platformBg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" },
  { name: "Vanessa O.", city: "Mogi das Cruzes",quantity: "1.180", service: "seguidores",        platform: "TikTok",    platformColor: "#010101", platformBg: "#010101" },
];

let idCounter = 0;
let lastIndex = -1;

function randomItem(): Activity {
  let index: number;
  do { index = Math.floor(Math.random() * POOL.length); } while (index === lastIndex);
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

/* Ícones SVG por plataforma */
function PlatformIcon({ platform, bg }: { platform: string; bg: string }) {
  return (
    <div
      className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
      style={{ background: bg }}
    >
      {platform === "Instagram" && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="6" fill="white" fillOpacity="0"/>
          <path d="M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 1.5a3 3 0 110 6 3 3 0 010-6zm4.75-2.25a1 1 0 110 2 1 1 0 010-2z" fill="white"/>
          <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="white" strokeWidth="1.5" fill="none"/>
        </svg>
      )}
      {platform === "TikTok" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
        </svg>
      )}
      {platform === "YouTube" && (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.5 5 12 5 12 5s-4.5 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.2.9C6.4 19 12 19 12 19s4.5 0 7-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.7 14.5V9l5.5 2.8-5.5 2.7z"/>
        </svg>
      )}
      {platform === "Facebook" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.32l-.53 3.5h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/>
        </svg>
      )}
      {platform === "Kwai" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
        </svg>
      )}
    </div>
  );
}

export function LiveActivityFeed() {
  const [current, setCurrent] = useState<Activity | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showNext() {
    const next = randomItem();
    setCurrent(next);
    playNotificationSound();

    dismissRef.current = setTimeout(() => {
      setCurrent(null);
      timerRef.current = setTimeout(showNext, randomDelay(8000, 20000));
    }, randomDelay(4000, 7000));
  }

  useEffect(() => {
    timerRef.current = setTimeout(showNext, randomDelay(2000, 5000));
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (dismissRef.current) clearTimeout(dismissRef.current);
    };
  }, []);

  return (
    /*
     * top-20 = 80px = altura exata do header sticky (h-20).
     * A notificação sempre aparece logo abaixo do header após qualquer scroll.
     * No carregamento inicial (announcement bar visível), ela pode sobrepor
     * levemente, mas o 1º intervalo aleatório (2-5s) dá tempo pro usuário scrollar.
     */
    <div
      className="fixed top-20 inset-x-0 z-40 flex justify-center px-4 pointer-events-none"
      aria-live="polite"
      aria-label="Compras recentes"
    >
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm pointer-events-auto"
          >
            <div
              className="bg-white rounded-2xl px-3 py-3 flex items-center gap-3"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.07)" }}
            >
              {/* Ícone da plataforma */}
              <PlatformIcon platform={current.platform} bg={current.platformBg} />

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                {/* Linha 1: plataforma + "Agora" */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-gray-400">
                    {current.platform}
                  </span>
                  <span className="text-[11px] text-gray-400 flex-shrink-0">Agora</span>
                </div>
                {/* Linha 2: nome */}
                <p className="text-[13px] font-bold text-gray-900 leading-tight mt-0.5">
                  {current.name} <span className="font-normal text-gray-500">de {current.city}</span>
                </p>
                {/* Linha 3: ação */}
                <p className="text-[12px] text-gray-500 leading-tight mt-0.5">
                  Comprou{" "}
                  <span className="font-bold text-gray-800">
                    {current.quantity} {current.service}
                  </span>
                  {" "}para seu {current.platform}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
