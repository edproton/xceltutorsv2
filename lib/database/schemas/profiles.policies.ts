import { pgPolicy } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { authenticatedRole } from "drizzle-orm/supabase";

export const profilesTablePolicies = [
  pgPolicy("Only the user can update their own profile.", {
    for: "update",
    to: authenticatedRole,
    using: sql`profiles.id = auth.uid()`,
    withCheck: sql`profiles.id = auth.uid()`,
  }),

  pgPolicy("Users can view their own profile.", {
    for: "select",
    to: authenticatedRole,
    using: sql`profiles.id = auth.uid()`,
  }),
];
