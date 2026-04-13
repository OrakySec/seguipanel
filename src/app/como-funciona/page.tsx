export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft, ShoppingCart, Zap, Shield, RefreshCw, CheckCircle2, MessageCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSetting } from "@/lib/settings";

export default async function ComoFuncionaPage() {
  const siteName = await getSetting("site_name", "SeguiFacil");
  const whatsapp = await getSetting("whatsapp_number", "5511999999999");

  const steps = [
    {
      icon: ShoppingCart,
      step: "01",
      title: "Escolha o serviço",
      description:
        "Navegue pelos nossos serviços de seguidores e curtidas para Instagram, TikTok, Kwai, YouTube e Facebook. Selecione a quantidade que deseja e clique em Comprar.",
    },
    {
      icon: Zap,
      step: "02",
      title: "Faça o pagamento via PIX",
      description:
        "Após preencher o link do seu perfil e seu e-mail, você receberá um QR Code PIX. O pagamento é confirmado automaticamente em segundos — sem cartão, sem cadastro.",
    },
    {
      icon: CheckCircle2,
      step: "03",
      title: "Entrega automática",
      description:
        "Assim que o pagamento é confirmado, seu pedido entra em processamento imediato. A entrega começa em minutos e é feita de forma gradual e segura.",
    },
    {
      icon: Shield,
      step: "04",
      title: "Acompanhe pelo e-mail",
      description:
        "Você receberá atualizações por e-mail. Também pode consultar o status do pedido a qualquer momento em /meus-pedidos usando o e-mail da compra.",
    },
  ];

  const faqs = [
    {
      q: "Preciso informar minha senha?",
      a: "Não. Nunca pedimos sua senha. Basta informar o link público do seu perfil.",
    },
    {
      q: "O perfil precisa ser público?",
      a: "Sim. Para receber seguidores e curtidas, seu perfil precisa estar público no momento da entrega.",
    },
    {
      q: "Em quanto tempo começa a entrega?",
      a: "Em geral a entrega inicia em alguns minutos após a confirmação do pagamento. Para grandes quantidades pode levar até 24 horas.",
    },
    {
      q: "Os seguidores são reais?",
      a: "Trabalhamos com seguidores de qualidade provenientes de tráfego real. A retenção varia conforme o serviço escolhido.",
    },
    {
      q: "O que acontece se cair depois?",
      a: "Oferecemos reposição para pedidos elegíveis. Consulte os detalhes em /meus-pedidos.",
    },
    {
      q: "Quais formas de pagamento são aceitas?",
      a: "Aceitamos PIX como forma principal de pagamento — rápido, seguro e sem taxas extras.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-white border-b border-brand/10 py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
              Simples & Seguro
            </span>
            <h1 className="text-4xl font-jakarta font-extrabold text-foreground mb-4">
              Como Funciona
            </h1>
            <p className="text-muted font-medium text-lg leading-relaxed">
              Comprar seguidores e curtidas no {siteName} é rápido, seguro e sem complicação.
              Veja o processo completo em 4 passos.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-16 px-6 bg-surface">
          <div className="max-w-3xl mx-auto space-y-6">
            {steps.map(({ icon: Icon, step, title, description }) => (
              <div key={step} className="bg-white rounded-[28px] border border-brand/10 shadow-card p-8 flex gap-6 items-start">
                <div className="shrink-0 w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Icon size={24} className="text-primary" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1 block">
                    Passo {step}
                  </span>
                  <h2 className="text-lg font-jakarta font-extrabold text-foreground mb-2">{title}</h2>
                  <p className="text-sm text-muted leading-relaxed font-medium">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-jakarta font-extrabold text-foreground mb-8 text-center">
              Perguntas Frequentes
            </h2>
            <div className="space-y-4">
              {faqs.map(({ q, a }) => (
                <div key={q} className="bg-surface rounded-2xl border border-brand/10 p-6">
                  <p className="font-extrabold text-foreground mb-2">{q}</p>
                  <p className="text-sm text-muted font-medium leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-surface">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white rounded-[32px] border border-brand/10 shadow-card p-10">
              <h2 className="text-2xl font-jakarta font-extrabold text-foreground mb-3">
                Pronto para começar?
              </h2>
              <p className="text-muted font-medium mb-8">
                Escolha seu serviço e receba em minutos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-gradient text-white font-extrabold rounded-2xl shadow-brand hover:scale-[1.02] transition-transform"
                >
                  <ShoppingCart size={18} /> Ver Serviços
                </Link>
                <Link
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-surface border border-brand/10 text-foreground font-extrabold rounded-2xl hover:bg-white transition-colors"
                >
                  <MessageCircle size={18} /> Falar com Suporte
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
