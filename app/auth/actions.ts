"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { type Provider } from "@supabase/supabase-js";
import env from "@/env";

export async function signInWithOAuth(formData: FormData) {
  const provider = formData.get("provider") as Provider;
  const client = await createClient();

  const { data, error } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback`,
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
