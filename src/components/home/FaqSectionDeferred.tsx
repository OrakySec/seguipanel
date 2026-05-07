"use client";

import FaqAccordion from "./FaqAccordion";

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
  url: "https://seguifacil.com",
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

export default function FaqSection() {
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
