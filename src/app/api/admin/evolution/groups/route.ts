import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { getSetting } from "@/lib/settings";

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const [url, token, instance] = await Promise.all([
    getSetting("evolution_api_url"),
    getSetting("evolution_api_token"),
    getSetting("evolution_instance"),
  ]);

  if (!url || !token || !instance) {
    return NextResponse.json({ error: "Evolution API não configurada" }, { status: 400 });
  }

  try {
    const res = await fetch(`${url}/group/fetchAllGroups/${instance}?getParticipants=false`, {
      headers: { apikey: token },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Erro ao buscar grupos" }, { status: 502 });
    }

    const data = await res.json();
    const groups = Array.isArray(data)
      ? data.map((g: any) => ({ id: g.id, subject: g.subject }))
      : [];

    return NextResponse.json({ groups });
  } catch (e) {
    return NextResponse.json({ error: "Erro de conexão com Evolution API" }, { status: 502 });
  }
}
