"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { type Provider } from "@supabase/supabase-js";
import { headers } from "next/headers";
import env from "@/env";
import { getRedirectUrl } from "@/utils";

export async function signInWithOAuth(formData: FormData) {
  const provider = formData.get("provider") as Provider;
  const client = await createClient();

  const headersList = await headers();
  // Get the origin from the request headers
  const origin = headersList.get("origin");

  // Check if the origin is in the list of allowed domains
  if (
    !origin ||
    !env.NEXT_PUBLIC_APP_URL.some((domain) => origin.startsWith(domain))
  ) {
    console.error("Invalid origin:", origin);
    throw new Error("Invalid origin");
  }

  const redirectUrl = getRedirectUrl("/auth/callback");
  const { data, error } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${redirectUrl}`,
    },
  });

  if (error) {
    console.error("error", error);
    return;
  }

  if (data.url) {
    redirect(data.url);
  }
}
