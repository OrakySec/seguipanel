"use client";

import { useState, useEffect, useRef } from "react";

/* ── Tipos ─────────────────────────────────────────────────────────── */

export type FeedService = {
  serviceName:   string;
  platform:      string;
  platformSlug:  string;
  platformColor: string;
  platformBg:    string;
};

type Activity = {
  id:            number;
  name:          string;
  city:          string;
  serviceName:   string;
  platform:      string;
  platformColor: string;
  platformBg:    string;
};

/* ── Dados fake ────────────────────────────────────────────────────── */

const NAMES = [
  "Lucas R.", "Mariana S.", "Felipe O.", "Camila A.", "Rafael M.",
  "Juliana P.", "Thiago B.", "Ana C.", "Bruno L.", "Fernanda G.",
  "Diego N.", "Isabela F.", "Pedro H.", "Letícia M.", "Carlos V.",
  "Beatriz A.", "Rodrigo T.", "Amanda O.", "Gabriel S.", "Larissa C.",
  "Vinícius R.", "Priscila N.", "Eduardo B.", "Tatiane L.", "Henrique F.",
  "Natália V.", "Gustavo M.", "Aline P.", "Marcos D.", "Patrícia E.",
  "Renato C.", "Simone A.", "André K.", "Cíntia R.", "Maurício T.",
  "Vanessa O.", "Leandro F.", "Jéssica M.", "Fábio S.", "Carolina B.",
];

const CITIES = [
  "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Fortaleza",
  "Salvador", "Porto Alegre", "Manaus", "Recife", "Brasília", "Goiânia",
  "Belém", "Guarulhos", "Campinas", "São Luís", "São Gonçalo", "Maceió",
  "Duque de Caxias", "Natal", "Teresina", "Campo Grande", "São Bernardo",
  "João Pessoa", "Nova Iguaçu", "Aracaju", "Santo André", "Ribeirão Preto",
  "Jaboatão", "Osasco", "Uberlândia", "Sorocaba", "Contagem", "Niterói",
  "Cuiabá", "Aracaju", "Joinville", "Londrina", "Caxias do Sul", "Florianópolis",
];

/* ── Estilos CSS Inline para Animação ─── */
const styles = `
  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(100%); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideOutLeft {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(-10px); }
  }
  .activity-enter {
    animation: slideInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .activity-exit {
    animation: slideOutLeft 0.3s ease-in forwards;
  }
`;

export function LiveActivityFeed({ services }: { services: FeedService[] }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const idCounter = useRef(0);

  // Inicializa o feed
  useEffect(() => {
    if (services.length === 0) return;

    // Gera 1 inicial
    const initial = generateActivity(services);
    setActivities([initial]);

    // Intervalo para adicionar novos
    const interval = setInterval(() => {
      const newActivity = generateActivity(services);
      setActivities(prev => {
        // Mantém apenas os 3 últimos para não inflar o DOM
        const next = [newActivity, ...prev].slice(0, 3);
        return next;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [services]);

  function generateActivity(sources: FeedService[]): Activity {
    const source = sources[Math.floor(Math.random() * sources.length)];
    const name   = NAMES[Math.floor(Math.random() * NAMES.length)];
    const city   = CITIES[Math.floor(Math.random() * CITIES.length)];
    
    idCounter.current += 1;
    
    return {
      id:            idCounter.current,
      name,
      city,
      serviceName:   source.serviceName,
      platform:      source.platform,
      platformColor: source.platformColor,
      platformBg:    source.platformBg,
    };
  }

  if (services.length === 0) return null;

  return (
    <div className="bg-gray-50 border-b border-gray-100 overflow-hidden py-2 hidden sm:block">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 relative">
        <div className="flex items-center gap-4 h-full">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 border-r border-gray-200 pr-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Atividade Ao Vivo
          </div>

          <div className="flex-1 relative h-full overflow-hidden">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className={`absolute inset-0 flex items-center gap-2 text-[11px] font-medium text-gray-600 ${index === 0 ? 'activity-enter' : 'activity-exit opacity-0 pointer-events-none'}`}
              >
                <span className="font-bold text-gray-900">{activity.name}</span>
                de <span className="font-bold text-gray-900">{activity.city}</span>
                acabou de comprar
                <span 
                  className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight"
                  style={{ color: activity.platformColor, backgroundColor: activity.platformBg }}
                >
                  {activity.serviceName}
                </span>
                para o <span className="font-bold" style={{ color: activity.platformColor }}>{activity.platform}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
