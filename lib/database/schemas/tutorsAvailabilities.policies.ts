import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";
import { authenticatedRole } from "drizzle-orm/supabase";

export const tutorsAvailabilitiesTablePolicies = [
  pgPolicy(
    "Only authenticated tutors can insert their own availability records.",
    {
      for: "insert",
      to: authenticatedRole,
      using: sql`tutors_availabilities.tutor_id = auth.uid()`,
      withCheck: sql`tutors_availabilities.tutor_id = auth.uid()`,
    }
  ),

  pgPolicy(
    "Only authenticated tutors can update their own availability records.",
    {
      for: "update",
      to: authenticatedRole,
      using: sql`tutors_availabilities.tutor_id = auth.uid()`,
      withCheck: sql`tutors_availabilities.tutor_id = auth.uid()`,
    }
  ),

  pgPolicy(
    "Only authenticated tutors can delete their own availability records.",
    {
      for: "delete",
      to: authenticatedRole,
      using: sql`tutors_availabilities.tutor_id = auth.uid()`,
    }
  ),

  pgPolicy("Authenticated users can view availability records.", {
    for: "select",
    to: authenticatedRole,
    using: sql`true`,
  }),
];
