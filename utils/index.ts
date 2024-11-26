import env from "@/env";
import { headers } from "next/headers";

export async function getRedirectUrl(path: string): Promise<URL> {
  const headersList = await headers();

  const rawOrigin =
    headersList.get("origin") ||
    headersList.get("x-forwarded-host") ||
    headersList.get("host");

  if (!rawOrigin) {
    console.error("No origin found in headers");
    throw new Error("Missing origin header");
  }

  // Normalize the origin to remove http:// or https://
  const origin = rawOrigin.replace(/^https?:\/\//, "").trim();

  // Find a matching domain in the NEXT_PUBLIC_APP_URL array
  const matchingDomain = env.NEXT_PUBLIC_APP_URL.find((domain) => {
    const normalizedDomain = domain.replace(/^https?:\/\//, "").trim();
    const matches = normalizedDomain.includes(origin);

    return matches;
  });

  if (!matchingDomain) {
    console.error("No matching domain found for origin:", origin);
    throw new Error("Invalid origin");
  }

  const redirectUrl = new URL(path, matchingDomain);

  return redirectUrl;
}
