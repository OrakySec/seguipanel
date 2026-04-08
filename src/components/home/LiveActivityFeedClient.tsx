"use client";

/**
 * Wrapper client-only para LiveActivityFeed.
 * Usar dynamic com ssr:false aqui (Client Component) é permitido —
 * a restrição só existe em Server Components.
 * Isso garante que ZERO HTML seja emitido pelo servidor,
 * eliminando qualquer possibilidade de hydration mismatch.
 */

import dynamic from "next/dynamic";
import type { FeedService } from "./LiveActivityFeed";

const Feed = dynamic(
  () => import("./LiveActivityFeed").then((m) => m.LiveActivityFeed),
  { ssr: false }
);

export function LiveActivityFeedClient({
  services,
}: {
  services: FeedService[];
}) {
  return <Feed services={services} />;
}
