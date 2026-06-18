import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

const registerSchema = z.object({
  firstName: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  whatsapp: z.string().min(8, "WhatsApp inválido"),
  pixKey: z.string().min(3, "Chave PIX obrigatória"),
  affiliateCode: z.string()
    .min(3, "Código de afiliado deve ter no mínimo 3 caracteres")
    .regex(/^[a-zA-Z0-9_-]+$/, "Código só pode conter letras, números, _ e -"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { firstName, email, password, whatsapp, pixKey, affiliateCode } = parsed.data;

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      if (existingUser.role !== "CUSTOMER") {
        return NextResponse.json({ error: "E-mail já está em uso" }, { status: 400 });
      }
      
      // Se for um CUSTOMER, podemos atualizar ele para AFFILIATE ou rejeitar. Vamos rejeitar e pedir login.
      return NextResponse.json({ error: "E-mail já cadastrado como cliente. Por favor, contate o suporte para virar afiliado." }, { status: 400 });
    }

    // Verificar se código de afiliado já existe
    const existingCode = await prisma.user.findUnique({ where: { affiliateCode } });
    if (existingCode) {
      return NextResponse.json({ error: "Esse código de afiliado já está em uso" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        email,
        password: hashedPassword,
        whatsapp,
        pixKey,
        affiliateCode,
        role: "AFFILIATE",
        status: 1,
        historyIp: req.headers.get("x-forwarded-for") ?? "",
      },
    });

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set("smm_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        affiliateCode: user.affiliateCode,
      },
    });
  } catch (err) {
    console.error("[AFFILIATE REGISTER]", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
