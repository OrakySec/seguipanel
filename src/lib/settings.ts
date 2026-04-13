import { prisma } from "./prisma";

export async function getSetting(key: string, fallback = ""): Promise<string> {
  try {
    const setting = await prisma.setting.findUnique({ where: { key } });
    return setting?.value ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getSettingBool(key: string, fallback = false): Promise<boolean> {
  const val = await getSetting(key, fallback ? "1" : "0");
  return val === "1" || val === "true";
}

export async function updateSetting(key: string, value: string): Promise<void> {
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function updateSettings(data: Record<string, string>): Promise<void> {
  await Promise.all(
    Object.entries(data).map(([key, value]) => updateSetting(key, value))
  );
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const settings = await prisma.setting.findMany();
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}
