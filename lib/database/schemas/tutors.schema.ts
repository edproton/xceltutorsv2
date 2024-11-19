import { jsonb, pgPolicy, pgTable, uuid } from "drizzle-orm/pg-core";
import { profilesTable } from ".";
import { authenticatedRole, serviceRole } from "drizzle-orm/supabase";
import { sql } from "drizzle-orm";

interface TutorMetadata {
  bio: {
    full: string;
    short: string;
    session: string;
  };
  tags: string[];
  degree: string;
  grades: {
    grade: string;
    level: string;
    subject: string;
  }[];
  university: string;
  completed_lessons: number;
}

export const tutorsTable = pgTable(
  "tutors",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    profile_id: uuid("profile_id")
      .notNull()
      .references(() => profilesTable.id),
    metadata: jsonb("metadata").$type<TutorMetadata>(),
  },
  (table) => [
    pgPolicy("Only service role can insert new tutors", {
      for: "insert",
      to: serviceRole,
      using: sql`true`,
      withCheck: sql`true`,
    }),

    pgPolicy("Only service role can delete tutors", {
      for: "delete",
      to: serviceRole,
      using: sql`true`,
    }),

    pgPolicy("Only service role can update all tutor fields", {
      for: "update",
      to: serviceRole,
      using: sql`true`,
      withCheck: sql`true`,
    }),

    pgPolicy("Only authenticated tutors can update their own metadata", {
      for: "update",
      to: authenticatedRole,
      using: sql`${table.id} = auth.uid()`,
      withCheck: sql`${table.id} = auth.uid() AND jsonb_typeof(${table.metadata}) = 'object'`,
    }),

    pgPolicy("All authenticated users can view tutors", {
      for: "select",
      to: authenticatedRole,
      using: sql`true`,
    }),
  ]
).enableRLS();
