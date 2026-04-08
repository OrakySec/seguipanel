export const dynamic = "force-dynamic";

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
import FaqAccordion from "@/components/home/FaqAccordion";
import { getActiveSocialNetworks, getBestSellerServices, getActivityFeedServices } from "@/lib/catalog";
import { AestheticHero } from "@/components/home/AestheticHero";
import { AnimatedPlatformCards } from "@/components/home/AnimatedPlatformCards";
import { AnimatedPopularServices } from "@/components/home/AnimatedPopularServices";
import { LiveActivityFeedClient } from "@/components/home/LiveActivityFeedClient";

export const metadata = {
  title: "Comprar Seguidores Brasileiros e Curtidas Reais | A partir de R$2,50",
  description: "Compre seguidores e curtidas brasileiras para Instagram, TikTok, Kwai, YouTube e Facebook. Entrega em minutos, 100% seguro, sem precisar de senha. A partir de R$2,50. Mais de 83.000 clientes satisfeitos desde 2017.",
  alternates: {
    canonical: "https://seguifacil.online",
  },
};

const testimonials = [
  {
    name: "Juliana M.",
    role: "Empreendedora",
    city: "São Paulo",
    platform: "Instagram",
    text: "Saí de 847 para 3.200 seguidores em menos de 6 horas. Minha loja virtual teve 34% mais visitas na semana seguinte. Melhor investimento que fiz para o meu negócio.",
    stars: 5,
    initial: "J",
    color: "#E1306C",
  },
  {
    name: "Camila S.",
    role: "Digital Influencer",
    city: "Rio de Janeiro",
    platform: "TikTok",
    text: "Comprei 2.000 curtidas às 22h e às 22h47 já estava tudo entregue. Meu vídeo saiu da estagnação e chegou a 48.000 visualizações orgânicas nos 3 dias seguintes.",
    stars: 5,
    initial: "C",
    color: "#9b00e0",
  },
  {
    name: "Lucas R.",
    role: "Revendedor SMM",
    city: "Belo Horizonte",
    platform: "Instagram",
    text: "Revendo para clientes há 2 anos pelo SeguiFacil. Taxa de entrega acima de 97%, suporte responde em menos de 15 minutos. Margem de lucro consistente todo mês.",
    stars: 5,
    initial: "L",
    color: "#010101",
  },
  {
    name: "Renata A.",
    role: "Criadora de Conteúdo",
    city: "Curitiba",
    platform: "Kwai",
    text: "Tive queda de 400 seguidores após uma atualização do Kwai. Acionei a garantia e em 18 horas repuseram tudo gratuitamente. Esse suporte não existe em nenhum outro lugar.",
    stars: 5,
    initial: "R",
    color: "#FF7000",
  },
];

const faqs = [
  {
    question: "Os seguidores do SeguiFacil são reais?",
    answer: "Sim. Nos pacotes brasileiros, todos os seguidores são perfis reais com foto, publicações e atividade recente — não utilizamos bots automatizados. Nossa taxa de entrega de perfis autênticos nos pacotes premium é de 94,3%, verificada nos últimos 847.000 pedidos processados desde 2017. Os pacotes mundiais utilizam uma mistura de perfis de qualidade variada, com custo menor. O crescimento é sempre gradual e natural para não alertar o algoritmo das plataformas."
  },
  {
    question: "Quanto tempo leva para os seguidores chegarem?",
    answer: "O prazo varia conforme o pacote: curtidas e seguidores mundiais chegam em 0 a 2 horas após a confirmação do PIX. Seguidores brasileiros têm entrega de 0 a 8 horas, sendo que 87,2% são completadas em até 6 horas. Pacotes premium com entrega gradual levam até 24 horas para preservar o crescimento orgânico. Após confirmar o pagamento via PIX, nosso sistema inicia o processamento automaticamente em menos de 5 minutos."
  },
  {
    question: "Preciso fornecer minha senha para comprar?",
    answer: "Não. O SeguiFacil jamais solicita sua senha ou qualquer acesso à sua conta. Todo o processo é 100% externo: você informa apenas o link público ou o @ do perfil. Nossa tecnologia localiza o perfil publicamente e inicia a entrega sem nenhum acesso às suas credenciais. Isso é um requisito inegociável de segurança que mantemos desde 2017."
  },
  {
    question: "É seguro para minha conta? Posso ser banido?",
    answer: "Nossos métodos simulam crescimento orgânico gradual e não violam os termos técnicos das plataformas. Utilizamos entregas escalonadas para que o crescimento não seja detectado como artificial. Em 7 anos e mais de 83.000 clientes atendidos, não registramos nenhum caso de banimento vinculado aos nossos serviços premium. Recomendamos manter o perfil público durante a entrega e nunca pedir mais de 5.000 seguidores por dia para preservar a naturalidade."
  },
  {
    question: "Os seguidores podem cair depois? Como funciona a garantia?",
    answer: "Queda natural é normal em qualquer serviço SMM e ocorre quando as plataformas fazem limpezas periódicas de perfis. Por isso todos os nossos pacotes premium incluem garantia de reposição: se houver queda acima do tolerado, repomos gratuitamente em até 72 horas dentro do prazo contratado (30 dias nos planos padrão, garantia vitalícia nos planos Elite). Basta abrir um chamado no suporte informando o ID do pedido."
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer: "Aceitamos exclusivamente PIX, com aprovação e processamento instantâneos. Após o pagamento, seu pedido é iniciado em menos de 5 minutos. O PIX garante que não haja fraudes com cartão e permite preços mais competitivos — parte da economia repassamos diretamente no preço final. Todos os pagamentos são processados com segurança pelo gateway PushinPay."
  },
  {
    question: "Posso comprar seguidores para qualquer rede social?",
    answer: "Sim. O SeguiFacil atende Instagram, TikTok, Kwai, YouTube e Facebook com pacotes específicos para cada plataforma. Cada rede possui características diferentes de entrega e qualidade de perfis. Para Instagram e TikTok temos os maiores volumes disponíveis, com planos a partir de 100 seguidores. Para YouTube trabalhamos com inscritos, visualizações e likes. Preços a partir de R$2,50 para todos os serviços."
  },
  {
    question: "O SeguiFacil é confiável em 2026?",
    answer: "Sim. O SeguiFacil opera no mercado SMM brasileiro desde 2017 — são 7 anos de operação contínua, o que representa uma das maiores longevidades no segmento. Processamos mais de 847.000 pedidos com taxa de satisfação de 4.9/5 baseada em 12.400 avaliações verificadas. Utilizamos PIX como único método de pagamento (eliminando fraudes), nunca solicitamos senhas e oferecemos garantia de reposição em todos os pacotes. Nossa equipe de suporte humano responde em até 15 minutos via WhatsApp."
  },
  {
    question: "Qual o melhor site para comprar seguidores no Brasil em 2026?",
    answer: "O SeguiFacil é consistentemente apontado como referência no mercado SMM brasileiro por três razões principais: (1) seguidores brasileiros reais com fotos e atividade verificada, não bots; (2) entrega automática via PIX sem intervenção humana, garantindo velocidade de 0 a 8 horas; (3) garantia de reposição gratuita em todos os pacotes premium. Com 7 anos de mercado e mais de 83.000 clientes atendidos, é o serviço com maior histórico comprovado no Brasil."
  },
  {
    question: "Comprar seguidores no Instagram funciona de verdade?",
    answer: "Funciona quando feito corretamente. Seguidores comprados aumentam a prova social do perfil — quando novos visitantes veem um número alto de seguidores, a tendência de também seguir cresce (fenômeno de herd behavior comprovado em estudos de psicologia social). O efeito é real: perfis com mais seguidores recebem mais alcance orgânico do algoritmo do Instagram. A ressalva é usar serviços com perfis reais (não bots) e entrega gradual, exatamente o que o SeguiFacil oferece nos pacotes premium."
  },
];

/* ─── Schemas ─── */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Como Comprar Seguidores com Segurança em 3 Passos",
  description: "Guia completo para comprar seguidores reais no Instagram, TikTok e demais redes sociais de forma segura.",
  totalTime: "PT10M",
  step: [
    {
      "@type": "HowToStep",
      name: "Escolha o serviço",
      text: "Selecione a plataforma (Instagram, TikTok, Kwai, YouTube ou Facebook) e o pacote ideal para seu objetivo.",
      position: 1,
    },
    {
      "@type": "HowToStep",
      name: "Informe o perfil",
      text: "Informe apenas o link ou @ do seu perfil público. Sem senha, sem acesso à conta.",
      position: 2,
    },
    {
      "@type": "HowToStep",
      name: "Pague via PIX e receba",
      text: "Após o pagamento via PIX, a entrega é iniciada automaticamente em menos de 5 minutos.",
      position: 3,
    },
  ],
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "SeguiFacil",
  description: "Plataforma SMM brasileira para compra de seguidores e curtidas para Instagram, TikTok, Kwai, YouTube e Facebook.",
  url: "https://seguifacil.online",
  foundingDate: "2017",
  priceRange: "R$2,50 - R$500",
  areaServed: { "@type": "Country", name: "Brasil" },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "12400",
    bestRating: "5",
    worstRating: "1",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Serviços SMM Brasil",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Comprar Seguidores Instagram" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Comprar Seguidores TikTok" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Comprar Curtidas Instagram" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Comprar Seguidores Kwai" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Comprar Inscritos YouTube" } },
    ],
  },
  sameAs: [
    "https://www.instagram.com/seguifacil",
    "https://www.tiktok.com/@seguifacil",
  ],
};

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
      <div className="mesh-container">
        <div className="mesh-ball mesh-ball-1" />
        <div className="mesh-ball mesh-ball-2" />
        <div className="mesh-ball mesh-ball-3" />
      </div>
      <div className="absolute inset-0 pointer-events-none bg-white/40 backdrop-blur-[2px]" aria-hidden />
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
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Processo Inteligente</span>
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
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Passo {step.number}</span>
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
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-primary transition-colors">
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
        <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Dados Proprietários</span>
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
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{d.label}</div>
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
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Compra Protegida</span>
          <h2 id="guarantee-heading" className="text-2xl sm:text-4xl font-black text-gray-900 mb-3 tracking-tight">
            Garantia Total em Todos os Pedidos
          </h2>
          <p className="text-gray-500">Compre sem medo. Se não entregar, devolvemos ou repomos.</p>
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

function Testimonials() {
  return (
    <section className="bg-surface py-16 px-4" aria-labelledby="testimonials-heading">
      <div className="max-w-6xl mx-auto">
        <h2 id="testimonials-heading" className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3">
          O que nossos clientes dizem
        </h2>
        <p className="text-center text-gray-500 mb-10">Resultados reais de clientes verificados</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="bg-white rounded-2xl border border-border p-5 shadow-card flex flex-col"
              itemScope
              itemType="https://schema.org/Review"
            >
              <div className="flex gap-0.5 mb-3" aria-label={`${t.stars} de 5 estrelas`}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span key={idx} className="text-star" style={{ fontSize: 14 }} aria-hidden>★</span>
                ))}
              </div>
              <blockquote className="text-sm text-gray-600 leading-relaxed flex-1 mb-4" itemProp="reviewBody">
                "{t.text}"
              </blockquote>
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
                  <p className="text-xs text-gray-400">{t.role} · {t.city} · {t.platform}</p>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <div className="max-w-3xl mx-auto">
        <h2 id="faq-heading" className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3">
          Perguntas Frequentes
        </h2>
        <p className="text-center text-gray-500 mb-10">
          Tudo o que você precisa saber antes de comprar seguidores
        </p>
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
            className="px-7 py-3.5 text-sm font-semibold text-primary border border-primary rounded-full hover:bg-white transition-colors"
          >
            Tirar dúvidas
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5581933886173"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform"
      style={{ backgroundColor: "#25D366" }}
      aria-label="Falar no WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="white" width="28" height="28" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  );
}

export default async function HomePage() {
  const platforms    = await getActiveSocialNetworks();
  const bestSellers  = await getBestSellerServices();
  const feedServices = await getActivityFeedServices();

  return (
    <>
      <AnnouncementBar />
      <Header />
      <LiveActivityFeedClient services={feedServices} />
      <main className="overflow-x-hidden">
        <HeroSection platforms={platforms} />
        <AnimatedPlatformCards platforms={platforms} />
        <HowItWorks />
        <AnimatedPopularServices services={bestSellers} />
        <StatsSection />
        <OriginalDataSection />
        <WhyUs />
        <GuaranteeSection />
        <Testimonials />
        <FaqSection />
        <CtaBanner />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
