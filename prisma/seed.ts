import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // ─── Admin padrão ───────────────────────────────
  const existing = await prisma.user.findUnique({
    where: { email: "admin@admin.com" },
  });

  if (!existing) {
    const hash = await bcrypt.hash("admin123", 12);
    await prisma.user.create({
      data: {
        email: "admin@admin.com",
        password: hash,
        role: "ADMIN",
        firstName: "Admin",
        status: 1,
      },
    });
    console.log("✅ Admin criado: admin@admin.com / admin123");
  } else {
    console.log("ℹ️  Admin já existe");
  }

  // ─── Settings padrão ────────────────────────────
  const defaults: Record<string, string> = {
    // Site
    website_name: "SeguiFacil",
    website_title: "SeguiFacil - Seguidores e Curtidas",
    website_desc: "Compre seguidores e curtidas para Instagram e TikTok",
    website_keywords: "comprar seguidores, curtidas, instagram, tiktok",
    enable_https: "1",
    is_maintenance_mode: "0",
    default_home_page: "home",
    default_per_page: "20",
    // Moeda
    currency_symbol: "R$",
    currency_code: "BRL",
    currency_decimal: "2",
    currency_decimal_separator: ",",
    currency_thousand_separator: ".",
    auto_rounding_x_decimal_places: "2",
    new_currecry_rate: "1",
    default_price_percentage_increase: "0",
    // Pagamentos
    is_active_pushinpay: "1",
    api_token_pushinpay: "",
    pushinpay_base_url: "https://api.pushinpay.com.br",
    pushinpay_value_in_cents: "1",
    // Marketing
    google_tag_manager_id: "",
    google_ads_conversion_id: "",
    google_ads_conversion_label: "",
    google_analytics_id: "",
    ga4_api_secret: "",
    facebook_pixel_id: "",
    facebook_access_token: "",
    facebook_test_event_code: "",
    // Email
    email_from: "noreply@seguifacil.com",
    email_name: "SeguiFacil",
    email_protocol_type: "smtp",
    smtp_server: "",
    smtp_port: "587",
    smtp_username: "",
    smtp_password: "",
    smtp_encryption: "tls",
    // Notificações
    enable_new_order_notification_send_to_customer: "1",
    enable_new_order_notification_send_to_admin: "1",
    new_order_notification_send_to_customer_subject: "Seu pedido foi criado!",
    new_order_notification_send_to_customer_content:
      "Olá! Seu pedido foi criado com sucesso e está sendo processado.",
    new_order_notification_send_to_admin_subject: "Novo pedido recebido",
    new_order_notification_send_to_admin_content:
      "Um novo pedido foi criado no sistema.",
    order_status_change_notification_subject: "Status do seu pedido atualizado",
    order_status_change_notification_content:
      "O status do seu pedido foi atualizado para: {{status}}",
    // Recuperação de senha
    email_password_recovery_subject: "Recuperação de senha",
    email_password_recovery_content:
      "Clique no link para redefinir sua senha: {{link}}",
    // Segurança
    enable_goolge_recapcha: "0",
    csrf_token_name: "csrf_token",
    // Funcionalidades
    is_active_orders: "1",
    is_active_order_history: "1",
    is_active_coupon_api: "1",
    // Contato
    contact_email: "",
    contact_tel: "",
    contact_work_hour: "",
    // Social
    social_instagram_link: "",
    social_facebook_link: "",
    social_twitter_link: "",
    social_youtube_link: "",
    social_pinterest_link: "",
    social_tumblr_link: "",
    // Conteúdo
    terms_content: "<p>Termos de uso do sistema.</p>",
    policy_content: "<p>Política de privacidade do sistema.</p>",
    embed_head_javascript: "",
    embed_javascript: "",
    enable_notification_popup: "0",
    notification_popup_content: "",
  };

  let created = 0;
  for (const [key, value] of Object.entries(defaults)) {
    await prisma.setting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
    created++;
  }

  console.log(`✅ ${created} configurações padrão criadas/verificadas`);

  // ─── Rede social exemplo ─────────────────────────
  const igExists = await prisma.socialNetwork.findFirst({
    where: { urlSlug: "instagram" },
  });
  if (!igExists) {
    const ig = await prisma.socialNetwork.create({
      data: {
        name: "Instagram",
        urlSlug: "instagram",
        sortOrder: 1,
        status: 1,
      },
    });
    const cat = await prisma.category.create({
      data: {
        socialNetworkId: ig.id,
        name: "Seguidores",
        sortOrder: 1,
        status: 1,
      },
    });
    await prisma.service.create({
      data: {
        categoryId: cat.id,
        name: "1.000 Seguidores Instagram",
        description: "Seguidores de alta qualidade com garantia.",
        price: 9.9,
        quantity: "1000",
        minOrder: 100,
        maxOrder: 10000,
        addType: "MANUAL",
        status: 1,
      },
    });
    console.log("✅ Dados de exemplo: Instagram + Seguidores criados");
  }

  console.log("🎉 Seed concluído!");
}

main()
  .catch((e) => {
    console.error("❌ Seed falhou:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
