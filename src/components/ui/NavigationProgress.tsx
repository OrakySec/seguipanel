"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPathRef = useRef(pathname);

  const clear = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const start = () => {
    clear();
    setProgress(0);
    setVisible(true);
    let p = 0;
    intervalRef.current = setInterval(() => {
      // Cresce rápido até 70%, depois devagar até 90%
      p += p < 70 ? 8 : p < 90 ? 1.5 : 0;
      if (p >= 90) p = 90;
      setProgress(p);
    }, 120);
  };

  const finish = () => {
    clear();
    setProgress(100);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 400);
  };

  // Dispara ao clicar em qualquer link interno
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel") || href.startsWith("#")) return;
      start();
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Conclui quando o pathname muda (navegação terminou)
  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname;
      finish();
    }
  }, [pathname]);

  // Cleanup no unmount
  useEffect(() => () => clear(), []);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[99999] h-[3px] pointer-events-none"
      style={{ background: "transparent" }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(to right, #fb24b1, #7c4dff, #ff616d)",
          transition: progress === 100 ? "width 0.1s ease" : "width 0.12s ease",
          boxShadow: "0 0 10px rgba(124, 77, 255, 0.6)",
        }}
      />
    </div>
  );
}
