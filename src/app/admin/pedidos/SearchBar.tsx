"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useCallback } from "react";

export default function SearchBar() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.trim();
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (val) {
          params.set("q", val);
        } else {
          params.delete("q");
        }
        router.replace(`/admin/pedidos?${params.toString()}`);
      }, 400);
    },
    [router, searchParams]
  );

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
      <input
        type="text"
        defaultValue={searchParams.get("q") ?? ""}
        onChange={handleChange}
        placeholder="Buscar por #ID ou e-mail..."
        className="pl-12 pr-4 h-12 bg-card border border-border rounded-2xl text-sm focus:ring-4 focus:ring-primary/5 outline-none transition-all w-72 font-bold"
      />
    </div>
  );
}
