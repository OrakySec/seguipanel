import nodemailer from "nodemailer";
import { getSetting } from "./settings";

type OrderLike = {
  id: number;
  link: string | null;
  quantity: string | null;
  charge: { toString(): string } | number | string;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ─── Transporter ─── */
async function createTransporter() {
  const host     = await getSetting("smtp_host");
  const port     = parseInt(await getSetting("smtp_port", "587"));
  const user     = await getSetting("smtp_user");
  const pass     = await getSetting("smtp_password");
  const secure   = port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

/* ─── Base ─── */
export async function sendEmail(to: string, subject: string, html: string) {
  const siteName  = await getSetting("site_name", "SeguiFacil");
  const fromEmail = (await getSetting("smtp_from_email", "noreply@seguifacil.com")).replace(/[\r\n]/g, "");
  const fromName  = (await getSetting("smtp_from_name", siteName)).replace(/[\r\n]/g, "");

  const transporter = await createTransporter();
  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    html,
  });
}

/* ─── Layout base ─── */
function layout(title: string, body: string, siteName: string) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f7f8fa;font-family:Arial,Helvetica,sans-serif;color:#111111;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f8fa;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.06);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#c60cff,#fd5949);padding:24px 32px;">
            <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">${siteName}</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr><td style="padding:32px;">${body}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #e5d9fa;text-align:center;font-size:12px;color:#888888;">
            &copy; ${new Date().getFullYear()} ${siteName}<br/>
            Você recebeu este e-mail porque realizou uma compra em nossa plataforma.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function infoRow(label: string, value: string) {
  return `<tr>
    <td style="padding:6px 0;font-size:14px;color:#888888;">${label}</td>
    <td style="padding:6px 0;font-size:14px;font-weight:600;color:#111111;text-align:right;">${value}</td>
  </tr>`;
}

/* ─── Template: Pedido confirmado ─── */
function orderConfirmedHtml(order: any, serviceName: string, siteName: string) {
  const body = `
    <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111111;">Pagamento confirmado! ✅</p>
    <p style="margin:0 0 24px;font-size:15px;color:#555555;">
      Seu pedido foi recebido e a entrega será iniciada em breve. Não é necessário fazer nada — avisaremos quando concluir.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f8fa;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
      ${infoRow("Pedido nº", `#${order.id}`)}
      ${infoRow("Serviço", escapeHtml(serviceName))}
      ${infoRow("Perfil", escapeHtml(order.link ?? "—"))}
      ${infoRow("Total pago", `R$ ${Number(order.charge).toFixed(2).replace(".", ",")}`)}
    </table>
    <p style="margin:0;font-size:13px;color:#888888;">
      Equipe ${siteName}
    </p>`;
  return layout(`Pedido confirmado — ${siteName}`, body, siteName);
}

/* ─── Template: Pedido concluído ─── */
function orderCompletedHtml(order: OrderLike, siteName: string) {
  const body = `
    <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111111;">Pedido concluído! 🎉</p>
    <p style="margin:0 0 24px;font-size:15px;color:#555555;">
      A entrega do seu pedido foi finalizada com sucesso.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f8fa;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
      ${infoRow("Pedido nº", `#${order.id}`)}
      ${infoRow("Perfil", escapeHtml(order.link ?? "—"))}
      ${infoRow("Quantidade", escapeHtml(order.quantity ?? "—"))}
    </table>
    <p style="margin:0;font-size:13px;color:#888888;">
      Obrigado por confiar no ${siteName}! Volte quando precisar de mais seguidores ou curtidas.
    </p>`;
  return layout(`Pedido concluído — ${siteName}`, body, siteName);
}

/* ─── Template: Pedido cancelado ─── */
function orderFailedHtml(order: OrderLike, siteName: string) {
  const body = `
    <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111111;">Problema na entrega</p>
    <p style="margin:0 0 24px;font-size:15px;color:#555555;">
      Houve um problema com o pedido <strong>#${order.id}</strong>. Nossa equipe já foi notificada e entrará em contato.
    </p>
    <p style="margin:0;font-size:13px;color:#888888;">
      Fale conosco via WhatsApp para resolvermos rapidinho.
    </p>`;
  return layout(`Atenção ao seu pedido — ${siteName}`, body, siteName);
}

/* ─── Template: Pedido parcial (> 5% entregue, sem reembolso) ─── */
function orderPartialHtml(order: OrderLike, siteName: string) {
  const body = `
    <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111111;">Pedido entregue parcialmente</p>
    <p style="margin:0 0 24px;font-size:15px;color:#555555;">
      Seu pedido <strong>#${order.id}</strong> foi processado parcialmente pelo fornecedor.
      Uma parte significativa da entrega foi concluída.
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:#555555;">
      Isso pode acontecer quando o perfil está com configurações de privacidade que limitam a entrega.
      Verifique se o seu perfil está público e entre em contato com nosso suporte se precisar de ajuda.
    </p>
    <p style="margin:0;font-size:13px;color:#888888;">
      Fale conosco via WhatsApp para mais informações.
    </p>`;
  return layout(`Pedido #${order.id} — entrega parcial — ${siteName}`, body, siteName);
}

/* ─── Substituição de variáveis ─── */
function applyVars(text: string, vars: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`);
}

/* ─── Funções públicas ─── */
export async function sendOrderConfirmedEmail(
  to: string,
  order: any,
  serviceName: string
) {
  const siteName      = await getSetting("site_name", "SeguiFacil");
  const customSubject = await getSetting("email_confirmed_subject", "");
  const customBody    = await getSetting("email_confirmed_body", "");

  const vars: Record<string, string> = {
    orderId:  String(order.id),
    email:    to,
    link:     order.link ?? "",
    valor:    `R$ ${Number(order.charge).toFixed(2).replace(".", ",")}`,
    servico:  serviceName,
    siteName,
  };

  const subject = customSubject
    ? applyVars(customSubject, vars)
    : `✅ Pedido #${order.id} confirmado — ${siteName}`;
  const html = customBody
    ? applyVars(customBody, vars)
    : orderConfirmedHtml(order, serviceName, siteName);

  await sendEmail(to, subject, html);
}

export async function sendOrderCompletedEmail(to: string, order: OrderLike) {
  const siteName      = await getSetting("site_name", "SeguiFacil");
  const customSubject = await getSetting("email_completed_subject", "");
  const customBody    = await getSetting("email_completed_body", "");

  const vars: Record<string, string> = {
    orderId:    String(order.id),
    link:       order.link ?? "",
    quantidade: order.quantity ?? "",
    siteName,
  };

  const subject = customSubject
    ? applyVars(customSubject, vars)
    : `🎉 Pedido #${order.id} entregue — ${siteName}`;
  const html = customBody
    ? applyVars(customBody, vars)
    : orderCompletedHtml(order, siteName);

  await sendEmail(to, subject, html);
}

export async function sendOrderFailedEmail(to: string, order: OrderLike) {
  const siteName      = await getSetting("site_name", "SeguiFacil");
  const customSubject = await getSetting("email_failed_subject", "");
  const customBody    = await getSetting("email_failed_body", "");

  const vars: Record<string, string> = {
    orderId: String(order.id),
    siteName,
  };

  const subject = customSubject
    ? applyVars(customSubject, vars)
    : `⚠️ Problema no pedido #${order.id} — ${siteName}`;
  const html = customBody
    ? applyVars(customBody, vars)
    : orderFailedHtml(order, siteName);

  await sendEmail(to, subject, html);
}

export async function sendOrderPartialEmail(to: string, order: OrderLike) {
  const siteName      = await getSetting("site_name", "SeguiFacil");
  const customSubject = await getSetting("email_partial_subject", "");
  const customBody    = await getSetting("email_partial_body", "");

  const vars: Record<string, string> = {
    orderId: String(order.id),
    siteName,
  };

  const subject = customSubject
    ? applyVars(customSubject, vars)
    : `⚠️ Pedido #${order.id} entregue parcialmente — ${siteName}`;
  const html = customBody
    ? applyVars(customBody, vars)
    : orderPartialHtml(order, siteName);

  await sendEmail(to, subject, html);
}
