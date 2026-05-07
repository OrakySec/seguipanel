import { prisma } from "./prisma";
import { unstable_cache } from "next/cache";

export async function getSetting(key: string, fallback = ""): Promise<string> {
  try {
    const setting = await prisma.setting.findUnique({ where: { key } });
    return setting?.value ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Fetch multiple settings in a single DB query (batch).
 * Returns a Map-like record keyed by the setting key.
 */
export const getSettingsBatch = unstable_cache(
  async (entries: Record<string, string>): Promise<Record<string, string>> => {
    const keys = Object.keys(entries);
    try {
      const rows = await prisma.setting.findMany({
        where: { key: { in: keys } },
      });
      const map = new Map(rows.map((r) => [r.key, r.value]));
      const result: Record<string, string> = {};
      for (const [key, fallback] of Object.entries(entries)) {
        result[key] = map.get(key) ?? fallback;
      }
      return result;
    } catch {
      return { ...entries };
    }
  },
  ["settings_batch"],
  { revalidate: 3600, tags: ["settings"] }
);

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
