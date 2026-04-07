import { NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { apiError, apiResponse } from "@/lib/utils";
import { cookies } from "next/headers";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message);
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        status: true,
        firstName: true,
      },
    });

    if (!user || !user.password) {
      return apiError("E-mail ou senha incorretos", 401);
    }

    if (user.status !== 1) {
      return apiError("Conta inativa. Entre em contato com o suporte.", 403);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return apiError("E-mail ou senha incorretos", 401);
    }

    if (user.role === "CUSTOMER") {
      return apiError("Acesso não autorizado ao painel", 403);
    }

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

    return apiResponse({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        historyIp: req.headers.get("x-forwarded-for") ?? "",
      },
    }, "Login realizado com sucesso");
  } catch (err) {
    console.error("[AUTH LOGIN]", err);
    return apiError("Erro interno do servidor", 500);
  }
}
