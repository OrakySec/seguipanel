import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError } from "@/lib/utils";

const schema = z.object({
  code: z.string().min(1, "Código obrigatório"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const coupon = await prisma.coupon.findFirst({
      where: { code: parsed.data.code, isActive: true },
    });

    if (!coupon) return apiError("Cupom inválido ou inativo");
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return apiError("Cupom expirado");
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return apiError("Cupom atingiu o limite de uso");
    }

    return apiResponse({
      valid: true,
      discount: Number(coupon.value),
      name: coupon.name,
    }, "Cupom validado com sucesso");
  } catch {
    return apiError("Erro ao validar cupom", 500);
  }
}
