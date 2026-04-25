"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "As estratégias são seguras para meu perfil?",
    a: "Sim. Trabalhamos com metodologias que respeitam os limites das plataformas digitais, sem bots, scripts automatizados ou qualquer prática que comprometa a integridade da sua conta.",
  },
  {
    q: "Quando começo a ver os resultados?",
    a: "Muitos clientes relatam resultados visíveis nos primeiros minutos após a confirmação. O prazo pode variar conforme o volume e a plataforma escolhida.",
  },
  {
    q: "Preciso fornecer minha senha?",
    a: "Nunca. Nossas soluções atuam externamente, sem precisar de acesso às suas credenciais. Basta informar o link ou @ do seu perfil.",
  },
  {
    q: "Isso funciona para qualquer nicho?",
    a: "Sim. Atendemos criadores de conteúdo, empresas, profissionais liberais, influenciadores e qualquer pessoa que queira ampliar sua presença digital.",
  },
  {
    q: "Como é feito o pagamento?",
    a: "O pagamento é realizado de forma rápida e segura via PIX. Após a confirmação, o processamento é iniciado automaticamente.",
  },
  {
    q: "E se houver queda nos resultados?",
    a: "Oferecemos garantia de reposição. Caso haja variação no volume entregue dentro do período de garantia, realizamos a reposição sem custo adicional.",
  },
];

export default function GrowthFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((item, i) => (
        <div
          key={i}
          className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 text-left"
          >
            <span className="text-sm font-bold text-gray-900 pr-4">{item.q}</span>
            <ChevronDown
              size={18}
              className={`shrink-0 text-gray-400 transition-transform ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <div className="px-6 pb-4 text-sm text-gray-500 leading-relaxed">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
