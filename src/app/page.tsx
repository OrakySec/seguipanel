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
  Star
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FaqAccordion from "@/components/home/FaqAccordion";

export const metadata = {
  title: "Comprar Seguidores e Curtidas Reais | A partir de R$2,50",
  description: "Compre seguidores e curtidas brasileiras para Instagram, TikTok, Kwai, YouTube e Facebook. Entrega em minutos, 100% seguro, sem precisar de senha. A partir de R$2,50. Mais de 83.000 clientes satisfeitos desde 2017.",
  alternates: {
    canonical: "https://seguifacil.online"
  }
};

/* ─── Mock data ─── */
const platforms = [
  {
    name: "Instagram",
    slug: "instagram",
    description: "Seguidores, curtidas e visualizações de Reels",
    fromPrice: "R$2,50",
    gradient: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="28" height="28" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    )
  },
  {
    name: "TikTok",
    slug: "tiktok",
    description: "Seguidores, curtidas e visualizações de vídeos",
    fromPrice: "R$3,90",
    gradient: "linear-gradient(135deg, #010101 0%, #383838 100%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="28" height="28" aria-hidden>
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
      </svg>
    )
  },
  {
    name: "Kwai",
    slug: "kwai",
    description: "Seguidores e curtidas para crescer no Kwai",
    fromPrice: "R$4,50",
    gradient: "linear-gradient(135deg, #FF7000 0%, #FFAA00 100%)",
    icon: (
      <svg viewBox=".01 0 534.36 612.94" fill="white" width="28" height="32" aria-hidden>
        <path d="M410.2 40.86c-32.61 0-62.26 12.59-84.42 33.14-24.75-44.14-71.97-74-126.18-74-79.86 0-144.59 64.74-144.59 144.59s64.74 144.59 144.59 144.59c44.19 0 83.72-19.85 110.25-51.08 22.58 30.95 59.11 51.08 100.35 51.08 68.57 0 124.16-55.59 124.16-124.16s-55.59-124.16-124.16-124.16zm-210.6 190.17c-47.74 0-86.44-38.7-86.44-86.44s38.7-86.44 86.44-86.44 86.44 38.7 86.44 86.44-38.7 86.44-86.44 86.44zm210.6 0c-36.46 0-66.01-29.55-66.01-66.01s29.55-66.01 66.01-66.01 66.01 29.55 66.01 66.01-29.55 66.01-66.01 66.01z" />
        <path fillRule="evenodd" d="M427.49 314.33h-157.16c-47.66 0-88.02 31.21-101.8 74.3l-93.24-47.19a51.783 51.783 0 0 0-23.42-5.59c-28.64 0-51.86 23.22-51.86 51.86v152.22c0 8.07 1.88 16.03 5.5 23.24 12.84 25.61 44 35.96 69.61 23.13l93.66-46.95c13.99 42.72 54.16 73.59 101.56 73.59h157.16c59.02 0 106.87-47.85 106.87-106.87v-84.87c0-59.02-47.85-106.87-106.87-106.87zm-352.15 210.44c-6.91 3.36-15.28.58-18.79-6.3a14.2 14.2 0 0 1-1.54-6.43v-95.69c.14-7.69 6.42-13.88 14.14-13.88 2.2 0 4.38.52 6.35 1.5l87.95 44.16v31.7l-87.87 44.81-.24.12zm404.01-20.27v.88c-.48 29.1-24.22 52.55-53.44 52.55h-154.9c-29.1-.48-52.55-24.22-52.55-53.44v-82.61c.48-29.1 24.22-52.55 53.44-52.55h154.9c29.1.48 52.55 24.22 52.55 53.44z" />
      </svg>
    )
  },
  {
    name: "YouTube",
    slug: "youtube",
    description: "Inscritos, curtidas e visualizações de vídeos",
    fromPrice: "R$5,90",
    gradient: "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="28" height="28" aria-hidden>
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    )
  },
  {
    name: "Facebook",
    slug: "facebook",
    description: "Curtidas na página, seguidores e reações",
    fromPrice: "R$4,90",
    gradient: "linear-gradient(135deg, #1877F2 0%, #145DBF 100%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="28" height="28" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  }
];

const popularServices = [
  {
    platform: "Instagram",
    platformGradient: "linear-gradient(135deg, #f09433, #dc2743, #bc1888)",
    name: "Seguidores Brasileiros Instagram",
    description: "Seguidores reais com foto e posts, entrega gradual e natural",
    badges: ["Brasileiros", "Garantia 30 dias", "0–8h"],
    stars: 5,
    fromPrice: "R$8,90",
    href: "/comprar-seguidores-instagram"
  },
  {
    platform: "Instagram",
    platformGradient: "linear-gradient(135deg, #f09433, #dc2743, #bc1888)",
    name: "Curtidas Brasileiras Instagram",
    description: "Curtidas de contas brasileiras ativas, entrega em minutos",
    badges: ["Brasileiras", "Entrega Rápida", "0–2h"],
    stars: 5,
    fromPrice: "R$2,50",
    href: "/comprar-curtidas-instagram"
  },
  {
    platform: "TikTok",
    platformGradient: "linear-gradient(135deg, #010101, #383838)",
    name: "Seguidores TikTok",
    description: "Seguidores de qualidade, aumenta seu alcance no algoritmo",
    badges: ["Alta qualidade", "Reposição", "0–12h"],
    stars: 5,
    fromPrice: "R$3,90",
    href: "/comprar-seguidores-tiktok"
  },
  {
    platform: "Kwai",
    platformGradient: "linear-gradient(135deg, #FF7000, #FFAA00)",
    name: "Seguidores Kwai",
    description: "Seguidores para crescer no Kwai e monetizar mais rápido",
    badges: ["Alta qualidade", "Suporte 24/7", "0–24h"],
    stars: 4,
    fromPrice: "R$4,50",
    href: "/comprar-seguidores-kwai"
  }
];

const testimonials = [
  {
    name: "Juliana M.",
    role: "Empreendedora",
    platform: "Instagram",
    text: "Comprei seguidores brasileiros para minha loja e em menos de 8 horas já tinha recebido tudo. Meu perfil ganhou muito mais credibilidade. Super recomendo!",
    stars: 5,
    initial: "J",
    color: "#E1306C"
  },
  {
    name: "Camila S.",
    role: "Digital Influencer",
    platform: "Instagram",
    text: "As curtidas chegaram rapidíssimo, em menos de 10 minutos após o pagamento. A qualidade é excelente, são perfis brasileiros de verdade. Vou comprar de novo!",
    stars: 5,
    initial: "C",
    color: "#9b00e0"
  },
  {
    name: "Lucas R.",
    role: "Revendedor SMM",
    platform: "TikTok",
    text: "Uso o SeguiFacil há mais de 2 anos para revender para meus clientes. A qualidade é consistente e o suporte resolve qualquer problema rapidamente.",
    stars: 5,
    initial: "L",
    color: "#010101"
  },
  {
    name: "Renata A.",
    role: "Criadora de Conteúdo",
    platform: "Kwai",
    text: "Tive uma queda nos seguidores e acionei a garantia de reposição. Em menos de 24h o saldo já estava normalizado. Atendimento impecável!",
    stars: 5,
    initial: "R",
    color: "#FF7000"
  }
];

const faqs = [
  {
    question: "Os seguidores são reais?",
    answer: "Sim. Todos os nossos pacotes de seguidores brasileiros são compostos por perfis reais, com foto e publicações. Os pacotes mundiais utilizam perfis de qualidade variada. Nunca utilizamos bots automáticos nos pacotes premium — o crescimento é gradual e natural para não levantar suspeitas no algoritmo."
  },
  {
    question: "Quanto tempo leva para os seguidores chegarem?",
    answer: "O prazo varia conforme o pacote escolhido. Curtidas e seguidores mundiais geralmente chegam em 0 a 2 horas após a confirmação do pagamento. Seguidores brasileiros têm entrega de 0 a 8 horas. Alguns pacotes premium de entrega gradual podem levar até 24 horas para completar."
  },
  {
    question: "Preciso fornecer minha senha?",
    answer: "Não. O SeguiFacil nunca solicita sua senha. Basta informar o link ou @ do seu perfil público. Todas as entregas são realizadas de forma externa, sem acesso à sua conta."
  },
  {
    question: "É seguro para minha conta? Posso ser banido?",
    answer: "Nossos métodos são seguros e não violam os termos de uso das plataformas. Utilizamos técnicas graduais que simulam crescimento orgânico. Entretanto, nenhum serviço externo oferece garantia 100% — recomendamos sempre manter o perfil público durante a entrega."
  },
  {
    question: "Os seguidores podem cair depois?",
    answer: "Queda natural pode ocorrer com qualquer serviço de seguidores. Por isso, todos os nossos pacotes premium incluem garantia de reposição: se houver queda acima do limite contratado, repomos gratuitamente dentro do prazo de garantia (30 dias nos pacotes padrão, vitalícia nos pacotes Elite)."
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer: "Aceitamos PIX (aprovação instantânea), cartão de crédito e boleto bancário. O PIX é a forma mais rápida — após o pagamento, sua ordem é processada em menos de 5 minutos."
  },
  {
    question: "Posso comprar para qualquer plataforma?",
    answer: "Sim. Atendemos Instagram, TikTok, Kwai, YouTube e Facebook. Cada plataforma possui pacotes específicos e preços diferenciados a partir de R$2,50."
  },
  {
    question: "Como funciona a garantia de reposição?",
    answer: "Se após a entrega você perceber queda nos números, basta abrir um chamado no suporte informando o ID do pedido. Nossa equipe analisa e faz a reposição gratuitamente em até 72 horas dentro do período de garantia contratado."
  }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer
    }
  }))
};

/* ─── Seções ─── */
function AnnouncementBar() {
  const items = [
    "🔥 50% OFF em Seguidores Instagram",
    "⚡ 47% OFF em Seguidores TikTok",
    "🎯 49% OFF em Seguidores Kwai",
    "🎬 45% OFF em Inscritos YouTube",
    "👍 46% OFF em Curtidas Facebook",
    "🚀 Entrega a partir de 2 minutos",
    "🔒 100% Seguro — sem precisar de senha",
    "♻️ Garantia de reposição inclusa"
  ];
  const doubled = [...items, ...items];
  return (
    <div className="bg-brand-gradient py-2 overflow-hidden" role="marquee" aria-label="Promoções ativas">
      <div className="flex" style={{ width: "max-content" }}>
        <div className="animate-marquee flex gap-10 whitespace-nowrap">
          {doubled.map((item, i) => (
            <span key={i} className="text-white text-xs font-medium px-4">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="bg-white pt-16 pb-20 px-4 text-center relative overflow-hidden">
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(198,12,255,0.06) 0%, transparent 70%)" }}
        aria-hidden
      />
      <div className="max-w-4xl mx-auto relative">
        <div className="inline-flex items-center gap-3 bg-white border border-border rounded-full pl-2 pr-5 py-2 mb-8 shadow-card">
          <div className="flex -space-x-2.5 flex-shrink-0">
            {[
              { initial: "J", color: "#E1306C" },
              { initial: "C", color: "#9b00e0" },
              { initial: "L", color: "#FF7000" },
              { initial: "R", color: "#1877F2" }
            ].map((a, i) => (
              <div 
                key={i} 
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: a.color, zIndex: 4 - i }}
                aria-hidden
              >
                {a.initial}
              </div>
            ))}
          </div>
          <div className="w-px h-5 bg-border flex-shrink-0" aria-hidden />
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5" aria-label="5 estrelas">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="text-star" style={{ fontSize: 12 }} aria-hidden>★</span>
                ))}
              </div>
              <span className="text-xs text-gray-400">· desde 2017</span>
            </div>
            <p className="text-xs leading-tight text-gray-600 mt-0.5">
              <strong className="text-gray-900 font-semibold">83.327</strong> clientes satisfeitos
            </p>
          </div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 mb-5" style={{ fontFamily: "var(--font-heading)" }}>
          Compre <span className="text-brand-gradient">Seguidores e Curtidas</span>
          <br /> para suas Redes Sociais
        </h1>

        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Entrega em minutos, 100% seguro, sem precisar de senha.
          <br /> Seguidores brasileiros reais a partir de <strong className="text-gray-800">R$2,50</strong>.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {platforms.map((p) => (
            <Link 
              key={p.name}
              href={`/comprar-seguidores-${p.slug}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
              style={{ background: p.gradient }}
            >
              {p.icon}
              {p.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-400">
          {[
            { Icon: Zap, text: "Entrega em minutos" },
            { Icon: ShieldCheck, text: "Sem precisar de senha" },
            { Icon: RefreshCw, text: "Garantia de reposição" },
            { Icon: Headphones, text: "Suporte 24/7" }
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-1.5">
              <item.Icon size={14} className="text-primary" aria-hidden />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlatformCards() {
  return (
    <section className="bg-surface py-16 px-4" aria-labelledby="platforms-heading">
      <div className="max-w-7xl mx-auto">
        <h2 id="platforms-heading" className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3">Escolha sua Plataforma</h2>
        <p className="text-center text-gray-500 mb-10">Serviços disponíveis para as principais redes sociais do Brasil</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {platforms.map((p) => (
            <Link 
              key={p.name}
              href={`/comprar-seguidores-${p.slug}`}
              className="group flex flex-col rounded-2xl overflow-hidden border border-border bg-white shadow-card hover:shadow-brand hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center justify-center py-6" style={{ background: p.gradient }}>
                {p.icon}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{p.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed flex-1">{p.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">A partir de</span>
                  <span className="text-sm font-bold text-primary">{p.fromPrice}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { number: "01", title: "Escolha o serviço", description: "Selecione a plataforma, o tipo de serviço (seguidores, curtidas, visualizações) e o pacote que atende sua necessidade.", Icon: MousePointerClick },
    { number: "02", title: "Informe o link do perfil", description: "Digite o @ ou cole o link do seu perfil público. Não pedimos senha — apenas o endereço da sua conta.", Icon: AtSign },
    { number: "03", title: "Receba em minutos", description: "Após a confirmação do PIX, a entrega começa automaticamente. Acompanhe em tempo real pelo painel.", Icon: ArrowDownToLine }
  ];
  return (
    <section className="bg-white py-16 px-4" aria-labelledby="how-heading">
      <div className="max-w-5xl mx-auto">
        <h2 id="how-heading" className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3">Como Funciona?</h2>
        <p className="text-center text-gray-500 mb-14">Simples, rápido e seguro — 3 passos e seus seguidores chegam</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+2.5rem)] right-[calc(16.67%+2.5rem)] h-px bg-border z-0" aria-hidden />
          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center z-10">
              <div className="w-20 h-20 rounded-2xl bg-primary-light border border-border flex items-center justify-center mb-5 shadow-sm">
                <step.Icon size={32} className="text-primary" aria-hidden />
              </div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Passo {step.number}</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PopularServices() {
  return (
    <section className="bg-primary-light py-16 px-4" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-white text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-border mb-3">Mais Vendidos</span>
          <h2 id="services-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Serviços Mais Populares</h2>
          <p className="text-gray-500">Os pacotes mais escolhidos pelos nossos clientes</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularServices.map((s, i) => (
            <article key={i} className="bg-white rounded-2xl border border-border shadow-card flex flex-col overflow-hidden hover:shadow-brand hover:-translate-y-1 transition-all duration-200">
              <div className="h-1.5 w-full" style={{ background: s.platformGradient }} />
              <div className="p-5 flex flex-col flex-1">
                <span className="self-start text-xs font-semibold text-white px-2.5 py-1 rounded-full mb-3" style={{ background: s.platformGradient }}>{s.platform}</span>
                <h3 className="font-semibold text-gray-900 leading-snug mb-2 text-sm">{s.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed flex-1">{s.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
                  {s.badges.map((b) => (
                    <span key={b} className="text-xs bg-primary-light text-primary font-medium px-2 py-0.5 rounded-full">{b}</span>
                  ))}
                </div>
                <div className="flex gap-0.5 mb-4" aria-label={`${s.stars} estrelas`}>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span key={idx} className={idx < s.stars ? "text-star" : "text-gray-200"} style={{ fontSize: 13 }} aria-hidden>★</span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-xs text-gray-400">A partir de</p>
                    <p className="text-lg font-bold text-gray-900">{s.fromPrice}</p>
                  </div>
                  <Link href={s.href} className="px-4 py-2 text-sm font-semibold text-white rounded-full bg-brand-gradient hover:opacity-90 transition-opacity">Comprar</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/servicos" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-primary border border-primary rounded-full hover:bg-white transition-colors">
            Ver todos os serviços →
          </Link>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: "83.327+", label: "Clientes satisfeitos", Icon: Users },
    { value: "1.2M+", label: "Pedidos entregues", Icon: Package },
    { value: "7+", label: "Anos no mercado", Icon: Trophy },
    { value: "4.9", label: "Avaliação média", Icon: Star }
  ];
  return (
    <section className="bg-brand-gradient py-14 px-4" aria-label="Números do SeguiFacil">
      <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="flex justify-center mb-2" aria-hidden>
              <s.Icon size={28} className="text-white/70" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-1">{s.value}</div>
            <div className="text-sm text-white/80">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyUs() {
  const reasons = [
    { Icon: Zap, title: "Entrega Ultra Rápida", description: "Curtidas em menos de 2 minutos, seguidores em até 8 horas. Nenhum concorrente entrega mais rápido." },
    { Icon: ShieldCheck, title: "100% Seguro", description: "Nunca pedimos sua senha. Entrega externa via métodos seguros. Mais de 83.000 clientes sem nenhum banimento relatado." },
    { Icon: Users, title: "Seguidores Brasileiros", description: "Perfis reais do Brasil, com foto e publicações. Aumenta sua credibilidade e atrai mais seguidores orgânicos." },
    { Icon: RefreshCw, title: "Garantia de Reposição", description: "Se houver queda, repomos gratuitamente em até 72h. Pacotes Elite possuem garantia vitalícia." },
    { Icon: Headphones, title: "Suporte 24/7", description: "Atendimento humano via WhatsApp a qualquer hora. Respondemos em menos de 10 minutos durante horário comercial." },
    { Icon: CreditCard, title: "PIX Instantâneo", description: "Pague via PIX e o pedido é processado em segundos. Também aceitamos cartão de crédito e boleto." }
  ];
  return (
    <section className="bg-white py-16 px-4" aria-labelledby="why-heading">
      <div className="max-w-6xl mx-auto">
        <h2 id="why-heading" className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3">Por que escolher o SeguiFacil?</h2>
        <p className="text-center text-gray-500 mb-12">Referência no mercado brasileiro de SMM desde 2017</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r) => (
            <div key={r.title} className="flex gap-4 p-5 rounded-2xl border border-border bg-surface hover:border-primary hover:shadow-brand transition-all duration-200">
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center">
                <r.Icon size={20} className="text-primary" aria-hidden />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{r.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{r.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="bg-surface py-16 px-4" aria-labelledby="testimonials-heading">
      <div className="max-w-6xl mx-auto">
        <h2 id="testimonials-heading" className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3">O que nossos clientes dizem</h2>
        <p className="text-center text-gray-500 mb-10">Avaliações verificadas de clientes reais</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <figure key={i} className="bg-white rounded-2xl border border-border p-5 shadow-card flex flex-col" itemScope itemType="https://schema.org/Review">
              <div className="flex gap-0.5 mb-3" aria-label={`${t.stars} de 5 estrelas`}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span key={idx} className="text-star" style={{ fontSize: 14 }} aria-hidden>★</span>
                ))}
              </div>
              <blockquote className="text-sm text-gray-600 leading-relaxed flex-1 mb-4" itemProp="reviewBody">“{t.text}”</blockquote>
              <figcaption className="flex items-center gap-3">
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: t.color }}
                  aria-hidden
                >
                  {t.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900" itemProp="author">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role} · {t.platform}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="bg-white py-16 px-4" id="faq" aria-labelledby="faq-heading">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-3xl mx-auto">
        <h2 id="faq-heading" className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3">Perguntas Frequentes</h2>
        <p className="text-center text-gray-500 mb-10">Tudo o que você precisa saber antes de comprar</p>
        <div className="rounded-2xl border border-border bg-white shadow-card px-6">
          <FaqAccordion items={faqs} />
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="bg-primary-light py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Pronto para crescer nas redes sociais?</h2>
        <p className="text-gray-500 mb-8">Mais de 83.000 clientes já aceleraram seu crescimento com o SeguiFacil. Comece agora a partir de R$2,50.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/comprar-seguidores-instagram" className="px-7 py-3.5 text-sm font-semibold text-white rounded-full bg-brand-gradient hover:opacity-90 transition-opacity shadow-brand animate-pulse-glow">
            Comprar Seguidores Agora
          </Link>
          <Link href="#faq" className="px-7 py-3.5 text-sm font-semibold text-primary border border-primary rounded-full hover:bg-white transition-colors">
            Tirar dúvidas
          </Link>
        </div>
      </div>
    </section>
  );
}

function MobileStickyCta() {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden" aria-hidden>
      <Link href="/comprar-seguidores-instagram" className="flex items-center justify-center w-full py-4 text-sm font-bold text-white rounded-full bg-brand-gradient shadow-lg hover:opacity-90 transition-opacity">
        ⚡ Comprar Seguidores — a partir de R$2,50
      </Link>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <HeroSection />
        <PlatformCards />
        <HowItWorks />
        <PopularServices />
        <StatsSection />
        <WhyUs />
        <Testimonials />
        <FaqSection />
        <CtaBanner />
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
