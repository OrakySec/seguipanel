import { getSetting, getSettingBool } from "@/lib/settings";

/**
 * Envia uma mensagem de texto para um grupo do WhatsApp via Evolution API.
 * Usa as mesmas credenciais globais (evolution_api_url/token/instance).
 */
export async function sendEvolutionGroupMessage(groupJid: string, text: string) {
  const [url, token, instance] = await Promise.all([
    getSetting("evolution_api_url"),
    getSetting("evolution_api_token"),
    getSetting("evolution_instance"),
  ]);

  if (!url || !token || !instance) {
    console.warn("[Evolution] Configuração incompleta para envio ao grupo");
    return;
  }

  await fetch(`${url}/message/sendText/${instance}`, {
    method: "POST",
    headers: { apikey: token, "Content-Type": "application/json" },
    body: JSON.stringify({ number: groupJid, text }),
  }).catch((e) => console.error("[Evolution] Erro ao enviar para grupo:", e));
}

/**
 * Envia uma mensagem de texto diretamente para um número de WhatsApp (cliente).
 * Normaliza o número adicionando o código do Brasil (55) se necessário.
 */
export async function sendEvolutionMessage(phone: string, text: string) {
  const [url, token, instance] = await Promise.all([
    getSetting("evolution_api_url"),
    getSetting("evolution_api_token"),
    getSetting("evolution_instance"),
  ]);

  if (!url || !token || !instance) {
    console.warn("[Evolution] Configuração incompleta para envio ao usuário");
    return;
  }

  const digits     = phone.replace(/\D/g, "");
  const normalized = /^55\d{10,11}$/.test(digits) ? digits : `55${digits}`;

  await fetch(`${url}/message/sendText/${instance}`, {
    method: "POST",
    headers: { apikey: token, "Content-Type": "application/json" },
    body: JSON.stringify({ number: normalized, text }),
  }).catch((e) => console.error("[Evolution] Erro ao enviar para usuário:", e));
}

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
