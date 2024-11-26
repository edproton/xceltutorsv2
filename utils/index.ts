import env from "@/env";
import { headers } from "next/headers";

export async function getRedirectUrl(path: string): Promise<URL> {
  const headersList = await headers();
  const origin =
    headersList.get("origin") ||
    headersList.get("x-forwarded-host") ||
    headersList.get("host");

  const prefix = env.NODE_ENV === "development" ? "http://" : "https://";

  const matchingDomain = env.NEXT_PUBLIC_APP_URL.find((domain) =>
    domain.includes(`${prefix}${origin}`)
  );

  if (!matchingDomain) {
    console.error("Invalid origin:", origin);
    throw new Error("Invalid origin");
  }

  return new URL(path, matchingDomain);
}
