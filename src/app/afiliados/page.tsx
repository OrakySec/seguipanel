import Link from "next/link";
import {
  CheckCircle,
  DollarSign,
  Target,
  ArrowRight,
  Share2,
  TrendingUp,
  Clock,
  Zap,
  Users,
  ShieldCheck,
  BarChart3,
  Smartphone,
  Globe,
  MessageCircle,
} from "lucide-react";
import { getSettingsBatch } from "@/lib/settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programa de Afiliados | Ganhe Dinheiro Indicando",
  description:
    "Cadastre-se gratuitamente no programa de afiliados e ganhe comissões em dinheiro real por cada cliente que você indicar. Saque via PIX a qualquer momento.",
};

export default async function AffiliatesLandingPage() {
  const settings = await getSettingsBatch({
    website_name: "SeguiFacil",
    affiliate_commission_rate: "10",
  });

  const siteName = settings.website_name;
  const commissionRate = Number(settings.affiliate_commission_rate || 10);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="logo-text">
            {siteName}
          </Link>
          <div className="flex gap-3">
            <Link
              href="/afiliados/login"
              className="hidden sm:inline-flex items-center justify-center px-5 h-10 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 transition-all"
            >
              Fazer Login
            </Link>
            <Link
              href="/afiliados/cadastro"
              className="inline-flex items-center justify-center gap-2 px-5 h-10 rounded-xl text-sm font-bold text-white bg-brand-gradient shadow-brand hover:brightness-110 active:scale-95 transition-all"
            >
              Criar Conta Grátis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 px-4">
        {/* Background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-sm font-bold">
            <Zap className="w-4 h-4" /> Programa de Parceiros — Cadastro 100% Gratuito
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Ganhe até{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
              R$200 por dia
            </span>{" "}
            <br className="hidden md:block" />
            indicando o {siteName}
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Compartilhe seu link exclusivo. Cada pessoa que comprar através dele
            gera <strong className="text-white">{commissionRate}% de comissão</strong> direto no
            seu saldo — sem limite de ganhos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/afiliados/cadastro"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-10 h-14 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-green-400 shadow-lg shadow-emerald-500/30 hover:brightness-110 active:scale-95 transition-all"
            >
              Quero ser Afiliado <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/afiliados/login"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 h-14 rounded-2xl text-lg font-semibold text-slate-300 border border-slate-600 hover:border-slate-400 hover:text-white transition-all"
            >
              Já tenho conta
            </Link>
          </div>

          {/* Social proof mini */}
          <div className="flex items-center justify-center gap-6 pt-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Cadastro gratuito
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Sem burocracia
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Saque via PIX
            </span>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-emerald-600 py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-white">
          {[
            { value: `${commissionRate}%`, label: "Comissão por venda" },
            { value: "R$ 10", label: "Mínimo para saque" },
            { value: "90 dias", label: "Duração do cookie" },
            { value: "Imediato", label: "Crédito na conta" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-black">{s.value}</div>
              <div className="text-xs text-emerald-100 font-medium mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-primary">Como Funciona</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              3 passos para começar a ganhar
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <Users className="w-8 h-8 text-primary" />,
                title: "Crie sua conta",
                desc: "Cadastro grátis em menos de 2 minutos. Você recebe um link único de afiliado na hora.",
              },
              {
                step: "02",
                icon: <Share2 className="w-8 h-8 text-emerald-500" />,
                title: "Divulgue seu link",
                desc: "Compartilhe no WhatsApp, Instagram, TikTok, grupos ou onde sua audiência estiver.",
              },
              {
                step: "03",
                icon: <DollarSign className="w-8 h-8 text-amber-500" />,
                title: "Receba em PIX",
                desc: `A cada venda gerada pelo seu link, você ganha ${commissionRate}% do valor. Saque quando quiser!`,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:-translate-y-1 transition-transform"
              >
                <span className="absolute top-6 right-6 text-5xl font-black text-slate-50 select-none">
                  {item.step}
                </span>
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculadora de ganhos */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-primary">Calculadora de Ganhos</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Quanto você pode ganhar?
            </h2>
            <p className="text-slate-500 mt-3">Veja o potencial real com apenas algumas indicações por dia.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                label: "Iniciante",
                daily: 3,
                avgTicket: 25,
                color: "blue",
                desc: "3 vendas/dia de R$25",
              },
              {
                label: "Intermediário",
                daily: 8,
                avgTicket: 40,
                color: "emerald",
                desc: "8 vendas/dia de R$40",
                highlight: true,
              },
              {
                label: "Avançado",
                daily: 20,
                avgTicket: 60,
                color: "purple",
                desc: "20 vendas/dia de R$60",
              },
            ].map((tier) => {
              const dailyEarning = (tier.daily * tier.avgTicket * commissionRate) / 100;
              const monthlyEarning = dailyEarning * 30;
              return (
                <div
                  key={tier.label}
                  className={`rounded-3xl p-8 border-2 ${
                    tier.highlight
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-slate-100 bg-slate-50"
                  } relative`}
                >
                  {tier.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                      Mais popular
                    </span>
                  )}
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{tier.label}</p>
                  <p className="text-sm text-slate-500 mb-6">{tier.desc}</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Por dia</span>
                      <span className="font-black text-slate-900 text-lg">
                        R$ {dailyEarning.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                      <span className="text-sm text-slate-600">Por mês</span>
                      <span className="font-black text-2xl text-emerald-600">
                        R$ {monthlyEarning.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            * Estimativas com base em uma taxa de {commissionRate}% de comissão. Resultados reais variam conforme audiência e dedicação.
          </p>
        </div>
      </section>

      {/* Benefícios detalhados */}
      <section className="py-24 px-4 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Por que ser afiliado do {siteName}?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
                title: "Mercado em crescimento explosivo",
                desc: "O mercado de SMM cresce mais de 30% ao ano no Brasil. Cada vez mais pessoas e empresas compram seguidores e curtidas — e você lucra com isso.",
              },
              {
                icon: <Target className="w-6 h-6 text-blue-400" />,
                title: "Cookie de 90 dias garantido",
                desc: "Se alguém clicar no seu link hoje e comprar daqui a 3 meses, a comissão ainda é sua. Sem letras miúdas, sem surpresas.",
              },
              {
                icon: <Clock className="w-6 h-6 text-amber-400" />,
                title: "Comissão creditada em minutos",
                desc: "Assim que o pedido do cliente é concluído, a comissão cai automaticamente no seu saldo. Zero espera, zero burocracia.",
              },
              {
                icon: <Smartphone className="w-6 h-6 text-purple-400" />,
                title: "Painel completo no celular",
                desc: "Acompanhe cliques, vendas e saldo em tempo real pelo painel mobile-first. Tudo na palma da mão.",
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
                title: "Produto que se vende sozinho",
                desc: "Nossos clientes já converteram mais de 83.000 vendas. Você indica uma plataforma reconhecida, confiável e com ótima reputação.",
              },
              {
                icon: <Globe className="w-6 h-6 text-pink-400" />,
                title: "Divulgue em qualquer canal",
                desc: "WhatsApp, Instagram, TikTok, YouTube, grupos, blog — não importa onde sua audiência está, seu link funciona.",
              },
            ].map((b) => (
              <div
                key={b.title}
                className="flex gap-5 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  {b.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">{b.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para quem é ideal */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Para quem é esse programa?
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { emoji: "📱", label: "Criadores de conteúdo" },
              { emoji: "💼", label: "Influenciadores digitais" },
              { emoji: "🎯", label: "Gestores de tráfego" },
              { emoji: "🧑‍💻", label: "Freelancers de marketing" },
              { emoji: "👥", label: "Donos de grupos e comunidades" },
              { emoji: "🏪", label: "Agências de social media" },
            ].map((p) => (
              <div
                key={p.label}
                className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <span className="text-3xl">{p.emoji}</span>
                <span className="font-bold text-slate-800">{p.label}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-500 mt-8 text-sm">
            Não importa o tamanho da sua audiência — o que importa é começar. Muitos dos nossos melhores afiliados começaram com menos de 500 seguidores.
          </p>
        </div>
      </section>

      {/* FAQ rápido */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Dúvidas frequentes</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "Preciso pagar alguma taxa para participar?",
                a: "Não. O cadastro é 100% gratuito e não há nenhuma mensalidade ou taxa de adesão.",
              },
              {
                q: "Quando recebo minha comissão?",
                a: "A comissão é creditada automaticamente no seu saldo assim que o pedido do cliente é concluído. Você pode sacar a qualquer momento com saldo mínimo de R$ 10,00.",
              },
              {
                q: "Como funciona o cookie de 90 dias?",
                a: "Quando alguém clica no seu link de afiliado, um cookie de rastreamento é salvo por 90 dias. Se essa pessoa comprar em qualquer momento dentro desse período, a comissão é 100% sua.",
              },
              {
                q: "Posso divulgar para qualquer pessoa?",
                a: `Sim! Você pode compartilhar seu link em qualquer canal: WhatsApp, redes sociais, blog, YouTube, grupos — sem restrições. Quanto mais você divulga, mais ganha.`,
              },
              {
                q: "Como é feito o pagamento?",
                a: "Exclusivamente via PIX, de forma rápida e segura. Você cadastra sua chave PIX no painel e solicita o saque quando quiser.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-900 list-none hover:text-primary transition-colors">
                  {faq.q}
                  <svg
                    className="flex-shrink-0 w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 to-green-500 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-1/4 text-8xl">💸</div>
          <div className="absolute bottom-4 right-1/4 text-8xl">🚀</div>
        </div>
        <div className="max-w-2xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
            Comece a ganhar hoje mesmo
          </h2>
          <p className="text-emerald-100 mb-8 text-lg leading-relaxed">
            Cadastro em menos de 2 minutos. Sem cartão de crédito,
            sem mensalidade — só ganhos.
          </p>
          <Link
            href="/afiliados/cadastro"
            className="inline-flex items-center justify-center gap-2 px-12 h-16 rounded-2xl text-xl font-black text-emerald-700 bg-white shadow-xl hover:-translate-y-1 active:scale-95 transition-all"
          >
            Criar minha conta grátis <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-emerald-200 mt-5 text-sm">
            Já tem uma conta?{" "}
            <Link href="/afiliados/login" className="underline font-bold text-white hover:text-emerald-100">
              Faça login aqui
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
