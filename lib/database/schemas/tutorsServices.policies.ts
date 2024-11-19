import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";
import { authenticatedRole } from "drizzle-orm/supabase";

export const tutorsServicesTablePolicies = [
  pgPolicy("Only authenticated tutors can insert their own service records.", {
    for: "insert",
    to: authenticatedRole,
    using: sql`tutors_services.tutor_id = auth.uid()`,
    withCheck: sql`tutors_services.tutor_id = auth.uid()`,
  }),

  pgPolicy("Only authenticated tutors can update their own service records.", {
    for: "update",
    to: authenticatedRole,
    using: sql`tutors_services.tutor_id = auth.uid()`,
    withCheck: sql`tutors_services.tutor_id = auth.uid()`,
  }),

  pgPolicy("Only authenticated tutors can delete their own service records.", {
    for: "delete",
    to: authenticatedRole,
    using: sql`tutors_services.tutor_id = auth.uid()`,
  }),

  pgPolicy("Authenticated users can view all service records.", {
    for: "select",
    to: authenticatedRole,
    using: sql`true`,
  }),
];
