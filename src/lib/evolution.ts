import { getSetting, getSettingBool } from "@/lib/settings";

export type MsgStep = { text: string; delayAfter: number };
export type MsgFlow = { active?: boolean; initialDelay: number; messages: MsgStep[] };

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function applyVars(text: string, vars: Record<string, string>) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? "");
}

/**
 * Envia um fluxo de mensagens WhatsApp via Evolution API.
 * Fire-and-forget — chamar com .catch() externamente.
 */
export async function sendEvolutionFlow(
  phone: string,
  flowKey: string,
  vars: Record<string, string>
) {
  const active = await getSettingBool("evolution_active");
  if (!active) {
    console.warn("[Evolution] Envio desativado (evolution_active=0)");
    return;
  }

  const [url, token, instance, flowJson] = await Promise.all([
    getSetting("evolution_api_url"),
    getSetting("evolution_api_token"),
    getSetting("evolution_instance"),
    getSetting(flowKey),
  ]);

  if (!url || !token || !instance || !flowJson) {
    console.warn("[Evolution] Configuração incompleta — url/token/instance/flow ausentes para chave:", flowKey);
    return;
  }

  let flow: MsgFlow;
  try {
    flow = JSON.parse(flowJson) as MsgFlow;
  } catch {
    console.error("[Evolution] JSON inválido na chave", flowKey);
    return;
  }

  if (flow.active === false) {
    console.log("[Evolution] Fluxo", flowKey, "está inativo — mensagem não enviada");
    return;
  }

  if (!flow.messages?.length) {
    console.warn("[Evolution] Fluxo", flowKey, "não tem mensagens configuradas");
    return;
  }

  // Normaliza número: adiciona código do Brasil (55) se ausente
  const normalizedPhone = /^55\d{10,11}$/.test(phone) ? phone : `55${phone}`;

  if (flow.initialDelay > 0) await sleep(flow.initialDelay * 1000);

  for (let i = 0; i < flow.messages.length; i++) {
    const msg  = flow.messages[i];
    const text = applyVars(msg.text, vars);

    await fetch(`${url}/message/sendText/${instance}`, {
      method: "POST",
      headers: { apikey: token, "Content-Type": "application/json" },
      body: JSON.stringify({ number: normalizedPhone, text }),
    }).catch((e) => console.error(`[Evolution] msg ${i}:`, e));

    if (msg.delayAfter > 0 && i < flow.messages.length - 1) {
      await sleep(msg.delayAfter * 1000);
    }
  }
}
