import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  let response = NextResponse.next();

  // Rastreamento de Afiliado (Grava o cookie de 90 dias)
  const ref = searchParams.get("ref");
  if (ref) {
    response.cookies.set("affiliate_ref", ref, {
      maxAge: 90 * 24 * 60 * 60, // 90 dias
      path: "/",
      httpOnly: true, // mais seguro, não acessível via JS
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  // Protege todas as rotas /admin e /api/admin
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const session = await getSessionFromRequest(req);

    if (!session) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
      }
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Apenas ADMIN e SUPPORTER têm acesso ao painel de administração geral
    if (session.role === "CUSTOMER" || session.role === "AFFILIATE") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protege apenas as APIs privadas de afiliado (não o login/register/track-click)
  const isPrivateAffiliateApi =
    pathname.startsWith("/api/afiliados/dashboard") ||
    pathname.startsWith("/api/afiliados/payouts");

  if (pathname.startsWith("/afiliados/painel") || isPrivateAffiliateApi) {
    const session = await getSessionFromRequest(req);

    if (!session) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
      }
      const loginUrl = new URL("/afiliados/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Apenas AFFILIATE (e ADMIN para testar) têm acesso
    if (session.role !== "AFFILIATE" && session.role !== "ADMIN") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/afiliados", req.url));
    }
  }

  // Redireciona logins se já autenticado
  if (pathname === "/auth/login") {
    const session = await getSessionFromRequest(req);
    if (session && session.role !== "CUSTOMER" && session.role !== "AFFILIATE") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }
  if (pathname === "/afiliados/login" || pathname === "/afiliados/cadastro") {
    const session = await getSessionFromRequest(req);
    if (session && session.role === "AFFILIATE") {
      return NextResponse.redirect(new URL("/afiliados/painel", req.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes that don't need middleware, but we protect specific ones inside)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, svg, etc
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
