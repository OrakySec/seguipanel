export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import CheckoutClient from "./CheckoutClient";
import { getSetting } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Checkout — Finalize seu pedido",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const siteName = await getSetting("site_name", "SeguiFacil");
  const whatsappNumber = await getSetting("whatsapp_number", "558193886173");

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      {/* Header minimalista dinâmico */}
      <header className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-jakarta font-extrabold text-xl tracking-tight text-brand-gradient">
            {siteName}
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-muted font-bold uppercase tracking-wider">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-success">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Compra 100% segura
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <CheckoutClient whatsappNumber={whatsappNumber} />
      </main>
    </div>
  );
}
