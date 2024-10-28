"use server";

import PocketBase from "pocketbase";
import { actionClient } from "@/lib/safe-action";
import { env } from "@/env/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const pb = new PocketBase(env.NEXT_PUBLIC_PB);

export const loadOAuthProviders = actionClient.action(async () => {
  const oauthMethods = await pb.collection("users").listAuthMethods();

  return oauthMethods;
});

export async function handleOAuthRedirect(formData: FormData) {
  const providerJson = formData.get("provider") as string;
  const provider = JSON.parse(providerJson);

  // Construct the auth URL server-side
  const authUrl = new URL(provider.authUrl);
  authUrl.searchParams.set(
    "redirect_uri",
    `${env.NEXT_PUBLIC_APP_URL}/api/auth/${provider.name}/callback`
  );

  // Set the cookie server-side
  (
    await // Set the cookie server-side
    cookies()
  ).set(`${provider.name}_verifier`, provider.codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  // Redirect to the constructed OAuth provider URL
  redirect(authUrl.toString());
}
