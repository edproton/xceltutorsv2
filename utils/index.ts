import env from "@/env";

export function getRedirectUrl(path: string): URL {
  // Get the current origin
  const currentOrigin =
    typeof window !== "undefined" ? window.location.origin : null;

  // Find the matching domain from NEXT_PUBLIC_APP_URL
  const matchingDomain = env.NEXT_PUBLIC_APP_URL.find((domain) =>
    currentOrigin ? currentOrigin.startsWith(domain) : false
  );

  // If no matching domain is found, use the first domain in the array
  const baseUrl = matchingDomain || env.NEXT_PUBLIC_APP_URL[0];

  // Construct the full URL
  return new URL(path, baseUrl);
}
