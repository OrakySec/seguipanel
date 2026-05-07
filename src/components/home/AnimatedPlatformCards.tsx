"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { stripHtml } from "@/lib/utils";

export function AnimatedPlatformCards({ platforms }: { platforms: any[] }) {
  if (platforms.length === 0) return null;

  return (
    <section className="bg-[#fafafa] py-12 sm:py-20 px-4" aria-labelledby="platforms-heading">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 id="platforms-heading" className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">Onde você quer crescer?</h2>
          <p className="text-gray-500 sm:text-lg text-sm">Selecione a rede social e acelere seu perfil hoje.</p>
        </div>
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {platforms.filter(p => p.urlSlug).map((p) => (
            <motion.div
              key={p.name}
              variants={{
                hidden: { y: 15 },
                visible: { y: 0 }
              }}
            >
              <Link 
                href={`/comprar-seguidores-${p.urlSlug}`}
                className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-premium hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full"
              >
                <div className="aspect-[16/10] flex items-center justify-center relative overflow-hidden" style={{ background: p.gradient }}>
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                  <SocialIcon slug={p.urlSlug} size={42} className="text-white drop-shadow-md group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 mb-1.5 text-base">{p.name}</h3>
                  <div 
                    className="text-[11px] text-gray-500 leading-relaxed flex-1 font-medium prose prose-sm prose-p:my-0"
                    dangerouslySetInnerHTML={{ __html: stripHtml(p.description || "Planos reais e seguros.") }}
                  />
                  <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">A partir de</span>
                    <span className="text-sm font-bold text-primary-dark">{p.fromPrice}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
