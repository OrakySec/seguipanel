"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Carregamos os componentes pesados apenas no cliente para não pesar no First Input Delay (FID/INP)
// e reduzir o tempo de execução da thread principal durante a hidratação inicial.
const Testimonials = dynamic(() => import("./TestimonialsDeferred"), { 
  ssr: false,
  loading: () => <div className="h-96 bg-gray-50 animate-pulse rounded-3xl" />
});

const FaqSection = dynamic(() => import("./FaqSectionDeferred"), { 
  ssr: false,
  loading: () => <div className="h-96 bg-gray-50 animate-pulse rounded-3xl" />
});

export function DeferredHomeContent() {
  return (
    <>
      <Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse" />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse" />}>
        <FaqSection />
      </Suspense>
    </>
  );
}
