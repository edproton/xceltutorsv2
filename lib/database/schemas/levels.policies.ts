import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";
import { authenticatedRole, supabaseAuthAdminRole } from "drizzle-orm/supabase";

export const levelsTablePolicies = [
  pgPolicy(
    "Only admins are allowed to insert new records into the levels table.",
    {
      for: "insert",
      to: supabaseAuthAdminRole,
      using: sql`true`,
    }
  ),

  pgPolicy(
    "Only admins are allowed to update existing records in the levels table.",
    {
      for: "update",
      to: supabaseAuthAdminRole,
      using: sql`true`,
    }
  ),

  pgPolicy("Only admins are allowed to delete records from the levels table.", {
    for: "delete",
    to: supabaseAuthAdminRole,
    using: sql`true`,
  }),

  pgPolicy(
    "Authenticated users are allowed to view records in the levels table.",
    {
      for: "select",
      to: authenticatedRole,
      using: sql`true`,
    }
  ),
];
