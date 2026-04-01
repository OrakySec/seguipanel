import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSetting } from "@/lib/settings";
import { apiError, apiResponse } from "@/lib/utils";
import bcrypt from "bcryptjs";

const checkoutSchema = z.object({
  serviceId: z.number().int().positive(),
  link: z.string().url("URL inválida").min(1),
  email: z.string().email("E-mail inválido"),
  whatsapp: z.string().min(8, "WhatsApp inválido"),
  couponCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message);
    }

    const { serviceId, link, email, whatsapp, couponCode } = parsed.data;

    // 1. Buscar serviço
    const service = await prisma.service.findFirst({
      where: { id: serviceId, status: 1 },
    });
    if (!service) return apiError("Serviço não encontrado ou inativo");

    // 2. Validar e aplicar cupom
    let finalPrice = Number(service.price);
    let discountApplied = 0;
    let couponId: number | undefined;

    if (couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: { code: couponCode, isActive: true },
      });
      if (!coupon) return apiError("Cupom inválido ou inativo");
      if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
        return apiError("Cupom atingiu o limite de uso");
      }
      discountApplied = Number(coupon.value);
      finalPrice = finalPrice - (finalPrice * discountApplied) / 100;
      couponId = coupon.id;
    }

    if (finalPrice <= 0) return apiError("Valor inválido");

    // 3. Criar ou buscar usuário (cliente não precisa de senha)
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          whatsapp,
          role: "CUSTOMER",
          status: 1,
          historyIp: req.headers.get("x-forwarded-for") ?? "",
        },
      });
    }

    // 4. Buscar token PushinPay das configurações
    const apiToken = await getSetting("api_token_pushinpay");
    const baseUrl = await getSetting("pushinpay_base_url", "https://api.pushinpay.com.br");

    if (!apiToken) return apiError("Gateway de pagamento não configurado", 503);

    // 5. Chamar API PushinPay
    const valueInCents = Math.round(finalPrice * 100);
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/pushinpay`;

    const pixResponse = await fetch(`${baseUrl}/api/pix/cashIn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        value: valueInCents,
        webhook_url: webhookUrl,
        split_rules: [],
      }),
    });

    const pixData = await pixResponse.json();

    const ppId: string =
      pixData?.data?.id ?? pixData?.id ?? null;
    const pixCode: string =
      pixData?.data?.qr_code ?? pixData?.data?.emv ?? pixData?.qr_code ?? pixData?.emv ?? null;

    if (!ppId || !pixCode) {
      console.error("[CHECKOUT] PushinPay response:", pixData);
      return apiError("Erro ao gerar PIX. Tente novamente.", 502);
    }

    // 6. Criar TransactionLog (status=0 pendente, order_id null)
    const transaction = await prisma.transactionLog.create({
      data: {
        userId: user.id,
        paymentType: "pushinpay",
        transactionId: ppId,
        orderDetails: {
          serviceId,
          link,
          email,
          whatsapp,
          couponCode: couponCode ?? null,
          discountApplied,
        },
        amount: finalPrice,
        status: 0,
      },
    });

    // 7. Incrementar uso do cupom
    if (couponId) {
      await prisma.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    // 8. Retornar dados para o frontend renderizar o modal PIX
    return apiResponse({
      transactionId: transaction.id,
      pixCode,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCode)}`,
      amount: finalPrice,
      productName: service.name,
    });
  } catch (err) {
    console.error("[CHECKOUT PROCESS]", err);
    return apiError("Erro interno do servidor", 500);
  }
}
