"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationProgress() {
  const pathname   = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible,  setVisible]  = useState(false);
  const timerRef    = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPathRef = useRef(pathname);

  const clear = () => {
    if (timerRef.current)    clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const start = () => {
    clear();
    setProgress(0);
    setVisible(true);
    let p = 0;
    intervalRef.current = setInterval(() => {
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
    }, 450);
  };

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

  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname;
      finish();
    }
  }, [pathname]);

  useEffect(() => () => clear(), []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 99999,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(to right, #c60cff, #fd5949)",
          borderRadius: "0 9999px 9999px 0",
          transition: "width 0.12s ease",
          boxShadow: "0 0 8px rgba(198,12,255,0.5)",
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
