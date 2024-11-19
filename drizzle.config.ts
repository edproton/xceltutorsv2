import { defineConfig } from "drizzle-kit";
import env from "./env";

export default defineConfig({
  schema: "./lib/database/schemas",
  out: "./supabase/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  schemaFilter: ["public"],
  verbose: true,
  strict: true,
});
