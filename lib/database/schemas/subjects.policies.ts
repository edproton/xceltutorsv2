import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";
import { authenticatedRole, supabaseAuthAdminRole } from "drizzle-orm/supabase";

export const subjectsTablePolicies = [
  pgPolicy("Only admins can insert new subjects.", {
    for: "insert",
    to: supabaseAuthAdminRole,
    using: sql`true`,
  }),

  pgPolicy("Only admins can update existing subjects.", {
    for: "update",
    to: supabaseAuthAdminRole,
    using: sql`true`,
  }),

  pgPolicy("Only admins can delete subjects.", {
    for: "delete",
    to: supabaseAuthAdminRole,
    using: sql`true`,
  }),

  pgPolicy("Only authenticated users can view subjects.", {
    for: "select",
    to: authenticatedRole,
    using: sql`true`,
  }),
];
