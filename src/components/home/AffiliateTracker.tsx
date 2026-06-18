"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

export function AffiliateTracker() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const tracked = useRef(false);

  useEffect(() => {
    if (ref && !tracked.current) {
      tracked.current = true;
      
      // Só registra o clique uma vez por sessão na view do cliente
      fetch("/api/public/affiliate/track-click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ref }),
      }).catch((e) => console.error("Error tracking affiliate click", e));
    }
  }, [ref]);

  return null;
}
