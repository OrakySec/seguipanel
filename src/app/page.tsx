export const revalidate = 60;

import { Suspense } from "react";
import Link from "next/link";
import {
  Zap,
  ShieldCheck,
  Users,
  RefreshCw,
  Headphones,
  CreditCard,
  MousePointerClick,
  AtSign,
  ArrowDownToLine,
  Package,
  Trophy,
  Star,
  CheckCircle2,
  BadgeCheck,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getActiveSocialNetworks, getBestSellerServices, getActivityFeedServices } from "@/lib/catalog";
import { AestheticHero } from "@/components/home/AestheticHero";
import { AnimatedPlatformCardsClient } from "@/components/home/AnimatedPlatformCardsClient";
import { AnimatedPopularServicesClient } from "@/components/home/AnimatedPopularServicesClient";
import { LiveActivityFeedClient } from "@/components/home/LiveActivityFeedClient";
import { getSettingsBatch } from "@/lib/settings";
import type { Metadata } from "next";
import { DeferredHomeContent } from "@/components/home/DeferredHomeContent";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettingsBatch({
    website_title: "Comprar Seguidores Brasileiros e Curtidas Reais | A partir de R$2,50",
    website_desc: "Compre seguidores e curtidas brasileiras para Instagram, TikTok, Kwai, YouTube e Facebook. Entrega em minutos, 100% seguro, sem precisar de senha. A partir de R$2,50. Mais de 83.000 clientes satisfeitos desde 2017.",
  });

  return {
    title: settings.website_title,
    description: settings.website_desc,
    alternates: { canonical: "https://seguifacil.com" },
  };
}

/* ─── Countdown helper (client) ─── */
function AnnouncementBar() {
  const items = [
    "🔥 50% OFF em Seguidores Instagram",
    "⚡ 47% OFF em Seguidores TikTok",
    "🎯 49% OFF em Seguidores Kwai",
    "🎬 45% OFF em Inscritos YouTube",
    "👍 46% OFF em Curtidas Facebook",
    "🚀 Entrega a partir de 2 minutos",
    "🔒 100% Seguro — sem precisar de senha",
    "♻️ Garantia de reposição inclusa",
  ];
  const doubled = [...items, ...items];
  return (
    <div className="bg-brand-gradient py-2 overflow-hidden" role="marquee" aria-label="Promoções ativas">
      <div className="flex" style={{ width: "max-content" }}>
        <div className="animate-ticker flex gap-10 whitespace-nowrap">
          {doubled.map((item, i) => (
            <span key={i} className="text-white text-xs font-medium px-4">{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroSection({ platforms }: { platforms: any[] }) {
  return (
    <section className="pt-4 pb-16 px-4 text-center relative overflow-hidden">
      <div className="mesh-container" aria-hidden />
      <AestheticHero platforms={platforms} />
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { number: "01", title: "Escolha o serviço", description: "Selecione a plataforma e o pacote ideal para seu objetivo.", Icon: MousePointerClick },
    { number: "02", title: "Informe o perfil", description: "Sem senha — apenas o link ou @ do seu perfil público.", Icon: AtSign },
    { number: "03", title: "Receba em minutos", description: "PIX confirmado? Entrega automática inicia em menos de 5 min.", Icon: ArrowDownToLine },
  ];
  return (
    <section className="bg-white py-24 px-4 overflow-hidden" aria-labelledby="how-heading">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-primary-dark font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Processo Inteligente</span>
          <h2 id="how-heading" className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Como Comprar Seguidores com Segurança em 3 Passos
          </h2>
          <p className="text-gray-500 text-lg">Simples, rápido e 100% seguro. Sem senha, sem complicação.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-gray-100 z-0" aria-hidden />
          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center z-10 group">
              <div className="w-24 h-24 rounded-[2rem] bg-white border border-gray-100 flex items-center justify-center mb-6 shadow-premium group-hover:scale-110 transition-transform duration-500 glass-2026">
                <step.Icon size={36} className="text-primary" aria-hidden />
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Passo {step.number}</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-[240px]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: "83.327+", label: "Clientes", Icon: Users },
    { value: "847K+", label: "Pedidos", Icon: Package },
    { value: "7+", label: "Anos", Icon: Trophy },
    { value: "4.9★", label: "Avaliação", Icon: Star },
  ];
  return (
    <section className="bg-[#0a0a0c] py-24 px-4 relative overflow-hidden" aria-label="Números do SeguiFacil">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full opacity-50" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full opacity-30" />
      
      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center text-white relative z-10">
        {stats.map((s) => (
          <div key={s.label} className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2">
            <div className="flex justify-center mb-5" aria-hidden>
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-gradient transition-all duration-500">
                <s.Icon size={24} className="text-white group-hover:text-white" />
              </div>
            </div>
            <div className="text-4xl sm:text-5xl font-black mb-2 tracking-tighter bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              {s.value}
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-primary transition-colors">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyUs() {
  const reasons = [
    { Icon: Zap, title: "Entrega em Minutos", description: "94,3% dos pedidos de curtidas entregues em menos de 60 minutos após o PIX." },
    { Icon: ShieldCheck, title: "Jamais Pedimos Senha", description: "100% externo. Entrega realizada sem acesso à sua conta. Zero risco." },
    { Icon: Users, title: "Seguidores Brasileiros Reais", description: "Perfis reais com fotos, publicações e atividade — não bots ou contas vazias." },
    { Icon: RefreshCw, title: "Garantia de Reposição", description: "Houve queda? Repomos gratuitamente em até 72h dentro do prazo contratado." },
    { Icon: Headphones, title: "Suporte Humano 24h", description: "Atendimento real via WhatsApp. Resposta média de 15 minutos, qualquer hora." },
    { Icon: CreditCard, title: "PIX Instantâneo", description: "Pagamento PIX aprovado e pedido iniciado em menos de 5 minutos." },
  ];
  return (
    <section className="bg-[#fafafa] py-28 px-4" aria-labelledby="why-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 id="why-heading" className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Por que o SeguiFacil é o Mais Seguro para Comprar Seguidores no Brasil?
          </h2>
          <p className="text-gray-500 text-lg">Referência no mercado SMM brasileiro desde 2017. 83.000+ clientes satisfeitos.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r) => (
            <div key={r.title} className="glass-card-2026 p-8 rounded-3xl group shadow-premium hover:bg-white">
              <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mb-6 shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <r.Icon size={24} className="group-hover:text-white transition-colors" aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{r.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{r.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OriginalDataSection() {
  return (
    <section className="bg-white py-16 px-4 border-y border-gray-100" aria-labelledby="data-heading">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-primary-dark font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Dados Proprietários</span>
        <h2 id="data-heading" className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 tracking-tight">
          Números Reais de 7 Anos de Operação
        </h2>
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mb-10">
          Analisamos os <strong>847.000+ pedidos processados desde 2017</strong>. A taxa média de entrega completa
          nos primeiros 60 minutos é de <strong>94,3%</strong> para pacotes de curtidas.
          Para seguidores brasileiros, <strong>87,2% das entregas são completadas em até 6 horas</strong>.
          Nossa taxa de retenção de seguidores após 30 dias é de <strong>91,7%</strong> nos pacotes premium —
          acima da média do mercado SMM brasileiro de 74%.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: "94,3%", label: "Curtidas entregues em 1h" },
            { value: "87,2%", label: "Seguidores BR em até 6h" },
            { value: "91,7%", label: "Retenção após 30 dias" },
            { value: "4,9/5", label: "Satisfação verificada" },
          ].map((d) => (
            <div key={d.label} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="text-2xl sm:text-3xl font-black text-primary mb-1 tracking-tighter">{d.value}</div>
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{d.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GuaranteeSection() {
  const guarantees = [
    {
      Icon: RefreshCw,
      title: "Reposição em 72h",
      desc: "Se houver queda após a entrega, repomos gratuitamente em até 72 horas — sem questionamentos.",
    },
    {
      Icon: ShieldCheck,
      title: "Sem Risco de Senha",
      desc: "Nunca solicitamos acesso à sua conta. Entrega 100% externa e segura em todos os serviços.",
    },
    {
      Icon: BadgeCheck,
      title: "7 Anos de Mercado",
      desc: "Operamos desde 2017. Nossa longevidade é a maior prova de confiabilidade do mercado SMM brasileiro.",
    },
    {
      Icon: CheckCircle2,
      title: "Suporte Até Resolver",
      desc: "Problemas? Nossa equipe fica disponível até que seu pedido seja 100% entregue e aprovado.",
    },
  ];
  return (
    <section className="bg-primary/5 py-20 px-4 border-y border-primary/10" aria-labelledby="guarantee-heading">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-primary-dark font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Compra Protegida</span>
          <h2 id="guarantee-heading" className="text-2xl sm:text-4xl font-black text-gray-900 mb-3 tracking-tight">
            Garantia Total em Todos os Pedidos
          </h2>
          <p className="text-gray-600">Compre sem medo. Se não entregar, devolvemos ou repomos.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {guarantees.map((g) => (
            <div key={g.title} className="flex gap-5 bg-white rounded-2xl p-7 border border-primary/10 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <g.Icon size={22} className="text-primary" aria-hidden />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{g.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function CtaBanner() {
  return (
    <section className="bg-primary-light py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Pronto para crescer nas redes sociais?
        </h2>
        <p className="text-gray-500 mb-8">
          Mais de 83.000 clientes já aceleraram seu crescimento com o SeguiFacil. Comece agora a partir de R$2,50.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/comprar-seguidores-instagram"
            className="px-7 py-3.5 text-sm font-semibold text-white rounded-full bg-brand-gradient hover:opacity-90 transition-opacity shadow-brand animate-pulse-glow"
          >
            Comprar Seguidores Agora
          </Link>
          <Link
            href="#faq"
            className="px-7 py-3.5 text-sm font-semibold text-primary-dark border-2 border-primary-dark rounded-full hover:bg-primary-dark hover:text-white transition-colors"
          >
            Tirar dúvidas
          </Link>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  // Fetch platforms once. Header will also use the cached result.
  const platforms = await getActiveSocialNetworks();

  return (
    <>
      <AnnouncementBar />
      <Header />
      
      {/* O Feed de atividade carrega em background (streaming) */}
      <Suspense fallback={<div className="h-12 bg-gray-50 animate-pulse" />}>
        <ActivityFeedWrapper />
      </Suspense>
      
      <main className="overflow-x-hidden">
        <HeroSection platforms={platforms} />
        
        <Suspense fallback={<div className="h-64 bg-gray-50 animate-pulse" />}>
          <PlatformCardsWrapper platforms={platforms} />
        </Suspense>

        <HowItWorks />

        <Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse" />}>
          <PopularServicesWrapper />
        </Suspense>

        <StatsSection />
        <OriginalDataSection />
        <WhyUs />
        <GuaranteeSection />
        <DeferredHomeContent />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}

// Novos wrappers para permitir o streaming
async function ActivityFeedWrapper() {
  const feedServices = await getActivityFeedServices();
  return <LiveActivityFeedClient services={feedServices} />;
}

async function PlatformCardsWrapper({ platforms }: { platforms: any[] }) {
  return <AnimatedPlatformCardsClient platforms={platforms} />;
}

async function PopularServicesWrapper() {
  const bestSellers = await getBestSellerServices();
  return <AnimatedPopularServicesClient services={bestSellers} />;
}
