import Link from "next/link";
import { CheckCircle, DollarSign, Target, ArrowRight } from "lucide-react";
import { getSettingsBatch } from "@/lib/settings";

export default async function AffiliatesLandingPage() {
  const settings = await getSettingsBatch({
    website_name: "SeguiFacil",
  });

  const siteName = settings.website_name;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar simplificada */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="logo-text">
            {siteName}
          </Link>
          <div className="flex gap-3">
            <Link
              href="/afiliados/login"
              className="inline-flex items-center justify-center px-5 h-10 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 transition-all"
            >
              Fazer Login
            </Link>
            <Link
              href="/afiliados/cadastro"
              className="inline-flex items-center justify-center px-5 h-10 rounded-xl text-sm font-bold text-white bg-brand-gradient shadow-brand hover:brightness-110 active:scale-95 transition-all"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <span className="inline-flex items-center justify-center px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold tracking-wide uppercase">
            Programa de Parceria
          </span>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Indique o {siteName} e <br />
            <span className="text-brand-gradient">Ganhe Dinheiro</span>
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Faça parte do nosso programa de afiliados e ganhe comissões atrativas por cada cliente que você indicar. Transforme sua audiência em uma fonte de renda.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/afiliados/cadastro"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 h-14 rounded-xl text-lg font-bold text-white bg-brand-gradient shadow-brand hover:brightness-110 active:scale-95 transition-all"
            >
              Quero ser Afiliado <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/afiliados/login"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 h-14 rounded-xl text-lg font-bold text-slate-700 border-2 border-slate-200 bg-white hover:bg-slate-50 transition-all"
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<DollarSign className="w-8 h-8 text-emerald-500" />}
              title="Altas Comissões"
              description="Ganhe uma porcentagem de tudo que o cliente comprar. Quanto mais ele gasta, mais você ganha."
            />
            <FeatureCard
              icon={<Target className="w-8 h-8 text-primary" />}
              title="Cookie de 90 Dias"
              description="Se o usuário clicar no seu link e comprar em até 90 dias, a comissão é sua. Sem letras miúdas."
            />
            <FeatureCard
              icon={<CheckCircle className="w-8 h-8 text-blue-500" />}
              title="Saques via PIX"
              description="Atingiu o saldo mínimo de apenas R$ 10,00? Solicite o saque e receba direto no seu PIX."
            />
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-24 bg-slate-900 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Pronto para começar a faturar?
        </h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto text-lg">
          O cadastro leva menos de 1 minuto e a aprovação é imediata. Comece a divulgar seu link agora mesmo!
        </p>
        <Link
          href="/afiliados/cadastro"
          className="inline-flex items-center justify-center px-10 h-14 rounded-xl text-lg font-bold text-white bg-primary hover:bg-primary/90 active:scale-95 transition-all"
        >
          Criar Conta Gratuita
        </Link>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:-translate-y-1 transition-transform">
      <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
