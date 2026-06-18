import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import Link from "next/link";
import { Home, DollarSign, ExternalLink } from "lucide-react";

export default async function AffiliateDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromCookies();

  if (!session || (session.role !== "AFFILIATE" && session.role !== "ADMIN")) {
    redirect("/afiliados/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <Link href="/afiliados/painel" className="logo-text text-xl">
            AFILIADOS
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavLink href="/afiliados/painel" icon={<Home className="w-5 h-5" />} label="Visão Geral" />
          <NavLink href="/afiliados/painel/saques" icon={<DollarSign className="w-5 h-5" />} label="Meus Saques" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Voltar ao Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-primary font-medium text-sm transition-colors"
    >
      <span className="text-slate-400">{icon}</span>
      {label}
    </Link>
  );
}
