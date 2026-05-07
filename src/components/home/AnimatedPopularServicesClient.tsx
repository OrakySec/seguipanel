"use client";

/**
 * Wrapper client-only para AnimatedPopularServices.
 * ssr: false aqui é permitido pois este é um Client Component.
 * Mantém framer-motion fora do bundle crítico (LCP/TBT).
 */

import dynamic from "next/dynamic";

const Services = dynamic(
  () => import("./AnimatedPopularServices").then((m) => m.AnimatedPopularServices),
  {
    ssr: false,
    loading: () => (
      <div
        className="bg-white py-24 px-4"
        aria-hidden="true"
        style={{ minHeight: 400 }}
      />
    ),
  }
);

export function AnimatedPopularServicesClient({ services }: { services: any[] }) {
  return <Services services={services} />;
}
