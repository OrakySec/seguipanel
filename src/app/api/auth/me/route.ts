import { getSessionFromCookies } from "@/lib/auth";
import { apiResponse, apiError } from "@/lib/utils";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) return apiError("Não autenticado", 401);
  return apiResponse({ user: session });
}
