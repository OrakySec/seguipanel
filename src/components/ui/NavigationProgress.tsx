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

  const isDone = progress === 100;

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center pointer-events-none"
      style={{
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        opacity: isDone ? 0 : 1,
        transition: "opacity 0.35s ease",
      }}
    >
      {/* Spinner */}
      <div className="relative mb-6">
        {/* Anel externo girando */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "9999px",
            border: "3px solid transparent",
            borderTopColor: "#7c4dff",
            borderRightColor: "#fb24b1",
            animation: "spin 0.75s linear infinite",
          }}
        />
        {/* Logo / ponto central */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #fb24b1, #7c4dff)",
            }}
          />
        </div>
      </div>

      {/* Barra de progresso */}
      <div
        style={{
          width: 200,
          height: 4,
          borderRadius: 9999,
          background: "rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(to right, #fb24b1, #7c4dff)",
            borderRadius: 9999,
            transition: "width 0.12s ease",
            boxShadow: "0 0 8px rgba(124,77,255,0.5)",
          }}
        />
      </div>

      {/* Keyframe via style tag */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
