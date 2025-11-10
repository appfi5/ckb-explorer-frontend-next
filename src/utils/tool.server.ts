import type { Theme } from "@/components/Theme";
import { cookies } from "next/headers";
import "server-only"


export async function getThemeFromCookie() {
  const theme = (await cookies()).get("NEXT_THEME")?.value as Theme ?? "light";
  return theme;
}