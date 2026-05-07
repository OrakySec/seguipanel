"use client";

import dynamic from "next/dynamic";

const NavigationProgress = dynamic(
  () => import("./NavigationProgress").then((m) => m.NavigationProgress),
  { ssr: false }
);

export function NavigationProgressLazy() {
  return <NavigationProgress />;
}
