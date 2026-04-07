"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Activity = {
  id: number;
  name: string;
  city: string;
  service: string;
  platform: string;
  emoji: string;
  minutesAgo: number;
};

const POOL: Omit<Activity, "id" | "minutesAgo">[] = [
  { name: "Lucas R.", city: "São Paulo", service: "1.000 Seguidores", platform: "Instagram", emoji: "🔥" },
  { name: "Mariana S.", city: "Rio de Janeiro", service: "500 Curtidas", platform: "TikTok", emoji: "💜" },
  { name: "Felipe O.", city: "Belo Horizonte", service: "2.000 Seguidores", platform: "Instagram", emoji: "⚡" },
  { name: "Camila A.", city: "Curitiba", service: "1.000 Seguidores", platform: "TikTok", emoji: "🚀" },
  { name: "Rafael M.", city: "Fortaleza", service: "5.000 Visualizações", platform: "YouTube", emoji: "🎯" },
  { name: "Juliana P.", city: "Recife", service: "500 Seguidores", platform: "Kwai", emoji: "✨" },
  { name: "Thiago B.", city: "Salvador", service: "1.000 Curtidas", platform: "Instagram", emoji: "🔥" },
  { name: "Ana C.", city: "Manaus", service: "2.000 Seguidores", platform: "Instagram", emoji: "💫" },
  { name: "Bruno L.", city: "Porto Alegre", service: "500 Seguidores", platform: "Facebook", emoji: "⭐" },
  { name: "Fernanda G.", city: "Brasília", service: "3.000 Seguidores", platform: "Instagram", emoji: "🎉" },
  { name: "Diego N.", city: "Goiânia", service: "1.000 Seguidores", platform: "TikTok", emoji: "💎" },
  { name: "Isabela F.", city: "Florianópolis", service: "500 Curtidas", platform: "Instagram", emoji: "🌟" },
];

let idCounter = 0;

function randomItem(): Activity {
  const base = POOL[Math.floor(Math.random() * POOL.length)];
  return { ...base, id: ++idCounter, minutesAgo: Math.floor(Math.random() * 5) + 1 };
}

export function LiveActivityFeed() {
  const [items, setItems] = useState<Activity[]>(() => [
    { ...POOL[0], id: ++idCounter, minutesAgo: 1 },
    { ...POOL[3], id: ++idCounter, minutesAgo: 3 },
  ]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const next = randomItem();
      setItems((prev) => [next, ...prev].slice(0, 3));
    }, 8000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 -mt-4 mb-8 space-y-2" aria-live="polite" aria-label="Compras recentes">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-border rounded-2xl px-4 py-3 shadow-sm"
          >
            <span className="text-lg flex-shrink-0" aria-hidden>{item.emoji}</span>
            <p className="text-xs text-gray-700 font-medium leading-tight flex-1">
              <span className="font-bold text-gray-900">{item.name}</span>
              {" de "}
              <span className="text-primary font-semibold">{item.city}</span>
              {" comprou "}
              <span className="font-bold text-gray-900">{item.service} {item.platform}</span>
            </p>
            <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap flex-shrink-0">
              há {item.minutesAgo}min
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
