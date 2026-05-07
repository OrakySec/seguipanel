import Link from "next/link";
import { Zap, ShieldCheck, RefreshCw, Headphones, Star } from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { HeroAvatars } from "./HeroAvatars";
import { HeroViewerCount } from "./HeroViewerCount";
import { HeroCtaButton } from "./HeroCtaButton";

interface Platform {
  name: string;
  urlSlug?: string;
  gradient?: string;
  fromPrice?: string;
}

/**
 * Server Component. Toda a marcação estática (incluindo o H1 — LCP)
 * é entregue no HTML inicial, sem aguardar JS. As partes dinâmicas
 * são pequenas ilhas client (HeroCtaButton e HeroViewerCount).
 */
export function AestheticHero({ platforms }: { platforms: Platform[] }) {
  return (
    <div className="max-w-4xl mx-auto relative z-10">
      {/* Badge social proof - Pode animar sutilmente */}
      <div
        className="hero-entrance inline-flex items-center bg-white/85 rounded-full px-6 py-1.5 mb-8"
        style={{
          border: "1.2px solid #ece4ff",
          boxShadow: "0 8px 30px rgba(124, 77, 255, 0.12)",
          gap: "12px",
        }}
      >
        <HeroAvatars />
        <p className="text-xs font-bold tracking-tight whitespace-nowrap">
          <span
            style={{
              background: "linear-gradient(to right, #fb24b1, #7c4dff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Mais de 83.327 clientes satisfeitos
          </span>
        </p>
      </div>

      {/* H1 - LCP: SEM ANIMAÇÃO para carregar instantaneamente */}
      <h1 className="text-5xl sm:text-7xl lg:text-[86px] font-black text-gray-900 tracking-tight leading-[0.95] mb-6">
        Compre Seguidores
        <br /> Para Suas
        <span className="font-script-stylized">Redes sociais</span>
      </h1>

      <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
        O SeguiFacil é a plataforma SMM brasileira com mais de 83.000 clientes
        atendidos desde 2017. Seguidores reais com entrega automática e garantia
        de reposição.
      </p>

      {/* CTA principal */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <HeroCtaButton platforms={platforms} />
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex flex-wrap justify-center items-center gap-3">
          <span>✓ Entrega em minutos</span>
          <span>✓ PIX</span>
          <span>✓ Garantia inclusa</span>
        </p>
      </div>

      {/* Subtítulo e Promo */}
      <div className="mb-8 text-center">
        <p className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
          Entrega rápida, 100% seguro, sem senha.
        </p>
        <p className="text-lg text-gray-600 font-medium">
          Pacotes a partir de{" "}
          <span className="text-gray-900 font-bold">R$2,50</span>.
        </p>
      </div>

      {/* Botões de plataforma */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {platforms
          .filter((p): p is Required<Pick<Platform, "urlSlug">> & Platform => Boolean(p.urlSlug))
          .map((p) => (
            <Link
              key={p.name}
              href={`/comprar-seguidores-${p.urlSlug}`}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold bg-white border border-gray-200 text-gray-800 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              <SocialIcon slug={p.urlSlug} size={18} />
              {p.name}
            </Link>
          ))}
      </div>

      {/* Trust bar */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-6">
        {[
          { Icon: Zap, text: "Entrega em Minutos" },
          { Icon: ShieldCheck, text: "Sem Senha" },
          { Icon: RefreshCw, text: "Garantia de Reposição" },
          { Icon: Headphones, text: "Suporte 24h" },
          { Icon: Star, text: "4.9/5 · 12.400 Avaliações" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
              <item.Icon size={14} className="text-primary" aria-hidden />
            </div>
            <span>{item.text}</span>
          </div>
        ))}
      </div>

      <HeroViewerCount />
    </div>
  );
}
