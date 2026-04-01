import { cookies } from "next/headers";
import { apiResponse } from "@/lib/utils";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("smm_token");
  return apiResponse({ success: true });
}
