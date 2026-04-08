"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

/**
 * Faz o upload de uma imagem e atualiza a chave logo_url
 */
export async function uploadLogo(formData: FormData) {
  try {
    const file = formData.get('logo') as File;
    if (!file) return { success: false, error: "Nenhum arquivo enviado." };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split('.').pop() || 'png';
    const filename = `logo-${Date.now()}.${ext}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');

    await mkdir(uploadDir, { recursive: true });
    
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const logoUrl = `/uploads/${filename}`;

    await prisma.setting.upsert({
      where: { key: 'logo_url' },
      update: { value: logoUrl },
      create: { key: 'logo_url', value: logoUrl }
    });

    revalidatePath("/");
    revalidatePath("/admin/configuracoes");
    
    return { success: true, url: logoUrl };
  } catch (error) {
    console.error("Erro no upload da logo:", error);
    return { success: false, error: "Erro ao processar o upload." };
  }
}

/**
 * Busca todas as configurações do banco e retorna como um objeto key-value
 */
export async function getSettings() {
  const settings = await prisma.setting.findMany();
  const settingsObj: Record<string, string> = {};
  
  settings.forEach((s: { key: string; value: string | null }) => {
    settingsObj[s.key] = s.value || "";
  });

  return settingsObj;
}

/**
 * Atualiza múltiplas configurações de uma vez (Upsert)
 */
export async function updateSettings(settings: Record<string, string>) {
  try {
    const operations = Object.entries(settings).map(([key, value]) => 
      prisma.setting.upsert({
        where: { key: String(key) },
        update: { value: String(value) },
        create: { key: String(key), value: String(value) }
      })
    );

    await prisma.$transaction(operations);

    revalidatePath("/admin/configuracoes");
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
    return { success: false, error: "Falha ao salvar as configurações." };
  }
}

/**
 * Busca todos os provedores de API
 */
export async function getApiProviders() {
  const providers = await prisma.apiProvider.findMany({
    orderBy: { name: "asc" }
  });

  return providers.map((p: any) => ({
    ...p,
    balance: p.balance ? Number(p.balance) : 0
  }));
}

/**
 * Cria ou atualiza um provedor de API
 */
export async function upsertApiProvider(id: number | null, data: any) {
  try {
    // Extrai só os campos do schema — evita erro do Prisma com campos extras (id, createdAt, etc)
    const clean = {
      name:   String(data.name   ?? "").trim(),
      url:    String(data.url    ?? "").trim(),
      apiKey: String(data.apiKey ?? "").trim(),
      type:   String(data.type   ?? "standard").trim(),
      status: data.status !== undefined ? Number(data.status) : 1,
    };

    if (!clean.name || !clean.url || !clean.apiKey) {
      return { success: false, error: "Nome, URL e API Key são obrigatórios." };
    }

    if (id) {
      await prisma.apiProvider.update({ where: { id }, data: clean });
    } else {
      await prisma.apiProvider.create({ data: clean });
    }
    revalidatePath("/admin/configuracoes");
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar provedor:", error);
    return { success: false, error: "Erro ao salvar provedor: " + String(error) };
  }
}

/**
 * Remove um provedor de API
 */
export async function deleteApiProvider(id: number) {
  try {
    // Verificamos se há serviços vinculados
    const serviceCount = await prisma.service.count({ where: { apiProviderId: id } });
    if (serviceCount > 0) {
      return { success: false, error: "Não é possível remover: existem serviços vinculados a este provedor." };
    }

    await prisma.apiProvider.delete({ where: { id } });
    revalidatePath("/admin/configuracoes");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao excluir provedor." };
  }
}

/**
 * Busca o saldo real no provedor (Consulta externa)
 */
export async function getProviderBalance(id: number) {
  try {
    const provider = await prisma.apiProvider.findUnique({ where: { id } });
    if (!provider) return { success: false, error: "Provedor não encontrado." };

    const url = `${provider.url.replace(/\/$/, "")}/?key=${provider.apiKey}&action=balance`;
    
    const response = await fetch(url, { method: "POST", cache: "no-store" });
    const data = await response.json();

    if (data.balance) {
      return { success: true, balance: data.balance, currency: data.currency || "USD" };
    }
    
    return { success: false, error: data.error || "Resposta inválida do provedor." };
  } catch (error) {
    return { success: false, error: "Erro de conexão com o provedor." };
  }
}
