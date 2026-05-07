"use client";

/**
 * Wrapper client-only para AnimatedPlatformCards.
 * ssr: false aqui é permitido pois este é um Client Component.
 * Mantém framer-motion fora do bundle crítico (LCP/TBT).
 */

import dynamic from "next/dynamic";

const Cards = dynamic(
  () => import("./AnimatedPlatformCards").then((m) => m.AnimatedPlatformCards),
  {
    ssr: false,
    loading: () => (
      <div
        className="bg-[#fafafa] py-12 sm:py-20 px-4"
        aria-hidden="true"
        style={{ minHeight: 280 }}
      />
    ),
  }
);

export function AnimatedPlatformCardsClient({ platforms }: { platforms: any[] }) {
  return <Cards platforms={platforms} />;
}
