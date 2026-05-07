"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

/**
 * Pequena ilha client. Emite valor inicial no SSR para evitar CLS,
 * só passa a oscilar depois que o JS hidrata.
 */
export function HeroViewerCount() {
  const [count, setCount] = useState(254);

  useEffect(() => {
    setCount(Math.floor(Math.random() * (310 - 190 + 1)) + 190);

    let timer: ReturnType<typeof setTimeout>;
    const scheduleNext = () => {
      const delay = Math.floor(Math.random() * (12_000 - 5_000 + 1)) + 5_000;
      timer = setTimeout(() => {
        setCount((prev) => {
          const delta = Math.floor(Math.random() * 7) - 3;
          return Math.min(320, Math.max(180, prev + delta));
        });
        scheduleNext();
      }, delay);
    };
    scheduleNext();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-2 bg-white/80 border border-border rounded-full px-4 py-2 shadow-sm">
        <span className="relative flex h-2 w-2" aria-hidden>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <Eye size={13} className="text-gray-400" aria-hidden />
        <span className="text-[11px] font-bold text-gray-500">
          <span className="text-gray-900" suppressHydrationWarning>
            {count}
          </span>{" "}
          pessoas visualizando agora
        </span>
      </div>
    </div>
  );
}
