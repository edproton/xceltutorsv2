"use server";

import { actionClient } from "@/lib/safe-action";
import { credentialsLoginSchema } from "./schema";
import { createClient } from "@/lib/supabase/server";
import { returnValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";

export const loginWithCredentials = actionClient
  .schema(credentialsLoginSchema)
  .action(async ({ parsedInput }) => {
    const { email, password } = parsedInput;

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.code === "invalid_credentials") {
        returnValidationErrors(credentialsLoginSchema, {
          email: {
            _errors: ["Invalid email or password"],
          },
        });
      }

      if (error.code === "email_not_confirmed") {
        returnValidationErrors(credentialsLoginSchema, {
          email: {
            _errors: ["Email not confirmed"],
          },
        });
      }

      console.error(error);
      throw new Error("Invalid email or password");
    }

    redirect("/dashboard");
  });
