"use client";

/**
 * Wrapper para AnimatedPopularServices.
 * Sem framer-motion → pode ser SSR; mantemos dynamic apenas para code-splitting.
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
