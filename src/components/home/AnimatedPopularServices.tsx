"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { stripHtml } from "@/lib/utils";

// Gera um número de vendas "dessa semana" pseudo-aleatório mas estável por serviço
function weeklySales(seed: number) {
  return 80 + ((seed * 37 + 13) % 120);
}

export function AnimatedPopularServices({ services }: { services: any[] }) {
  if (services.length === 0) return null;

  return (
    <section className="bg-white py-24 px-4 overflow-hidden" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block glass-2026 text-primary text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6 border border-primary/10">Destaques Da Semana</span>
          <h2 id="services-heading" className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">Mais Vendidos</h2>
          <p className="text-gray-500 text-lg">Os pacotes favoritos da nossa comunidade de elite.</p>
        </div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 },
            },
          }}
        >
          {services.map((s, i) => {
            // Calcula preço original (preço atual × fator de desconto simulado)
            const currentPrice = parseFloat(String(s.price).replace(/[^0-9,]/g, "").replace(",", ".")) || 0;
            const discountPct = [50, 47, 49, 45][i % 4];
            const originalPrice = currentPrice > 0 ? (currentPrice / (1 - discountPct / 100)).toFixed(2).replace(".", ",") : null;
            const sales = weeklySales(i + 1);

            return (
              <motion.article
                key={i}
                variants={{
                  hidden: { y: 30 },
                  visible: { y: 0 },
                }}
                className="glass-card-2026 flex flex-col rounded-[2.5rem] p-3 shadow-premium group"
              >
                <div className="bg-white rounded-[2rem] p-6 flex flex-col flex-1 shadow-sm transition-transform duration-500 group-hover:scale-[1.02]">
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className="text-[10px] font-black text-white px-3 py-1 rounded-full uppercase tracking-widest"
                      style={{ background: s.platformGradient }}
                    >
                      {s.platform}
                    </span>
                    {/* Badge % OFF */}
                    {discountPct > 0 && (
                      <span className="text-[10px] font-black text-white bg-red-500 px-2.5 py-1 rounded-full uppercase tracking-widest">
                        {discountPct}% OFF
                      </span>
                    )}
                  </div>

                  <div className="flex gap-0.5 mb-4" aria-label={`${s.stars} estrelas`}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <span key={idx} className={idx < s.stars ? "text-star" : "text-gray-100"} style={{ fontSize: 10 }} aria-hidden>★</span>
                    ))}
                  </div>

                  <h3 className="font-bold text-gray-900 leading-tight mb-3 text-base tracking-tight">{s.name}</h3>
                  <div
                    className="text-xs text-gray-400 leading-relaxed flex-1 font-medium italic prose prose-sm prose-p:my-0"
                    dangerouslySetInnerHTML={{ __html: `"${stripHtml(s.description)}"` }}
                  />

                  <div className="flex flex-wrap gap-2 mt-4 mb-5">
                    {s.badges.slice(0, 2).map((b: string) => (
                      <span key={b} className="text-[9px] font-black bg-gray-50 text-gray-400 border border-gray-100 px-2.5 py-1 rounded-lg uppercase tracking-wider">{b}</span>
                    ))}
                  </div>

                  {/* Escassez social */}
                  <p className="text-[10px] font-bold text-orange-500 mb-4">
                    🔥 {sales} vendidos essa semana
                  </p>

                  <div className="pt-5 border-t border-gray-50 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-0.5">Total</p>
                      {originalPrice && (
                        <p className="text-xs font-bold text-gray-300 line-through leading-none mb-0.5">
                          R$ {originalPrice}
                        </p>
                      )}
                      <p className="text-2xl font-black text-gray-900 tracking-tighter">{s.price}</p>
                    </div>
                    <Link
                      href={s.href}
                      className="btn-tactile w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all"
                      style={{ background: s.platformGradient }}
                      aria-label={`Comprar ${s.name}`}
                    >
                      <SocialIcon slug={s.platform} size={20} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        <div className="text-center mt-16">
          <Link href="/servicos" className="btn-tactile inline-flex items-center gap-3 px-10 py-5 text-sm font-black text-gray-900 bg-white border-2 border-gray-900 rounded-3xl shadow-premium hover:bg-gray-900 hover:text-white transition-all">
            EXPLORAR TODO O CATÁLOGO
          </Link>
        </div>
      </div>
    </section>
  );
}
