import env from "@/env";
import { headers } from "next/headers";

export async function getRedirectUrl(path: string): Promise<URL> {
  const headersList = await headers();

  // Log the incoming headers for debugging
  console.log("Incoming headers:", {
    origin: headersList.get("origin"),
    "x-forwarded-host": headersList.get("x-forwarded-host"),
    host: headersList.get("host"),
  });

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
  console.log("Normalized origin:", origin);

  const prefix = env.NODE_ENV === "development" ? "http://" : "https://";
  console.log("Environment and prefix:", {
    environment: env.NODE_ENV,
    prefix,
  });

  console.log("Configured app URLs:", env.NEXT_PUBLIC_APP_URL);

  // Find a matching domain in the NEXT_PUBLIC_APP_URL array
  const matchingDomain = env.NEXT_PUBLIC_APP_URL.find((domain) => {
    const normalizedDomain = domain.replace(/^https?:\/\//, "").trim();
    const matches = normalizedDomain.includes(origin);
    console.log(
      `Checking domain: ${domain} | Normalized: ${normalizedDomain} | Matches: ${matches}`
    );
    return matches;
  });

  if (!matchingDomain) {
    console.error("No matching domain found for origin:", origin);
    throw new Error("Invalid origin");
  }

  console.log("Matching domain found:", matchingDomain);

  const redirectUrl = new URL(path, matchingDomain);
  console.log("Redirect URL:", redirectUrl.toString());

  return redirectUrl;
}
