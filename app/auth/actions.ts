"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { type Provider } from "@supabase/supabase-js";
import { getRedirectUrl } from "@/utils";

export async function signInWithOAuth(formData: FormData) {
  const provider = formData.get("provider") as Provider;
  const client = await createClient();

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
