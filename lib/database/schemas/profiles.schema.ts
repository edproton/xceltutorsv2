import { pgSchema, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { profilesTablePolicies } from "./profiles.policies";

const authSchema = pgSchema("auth");

export const usersTable = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const profilesTable = pgTable(
  "profiles",
  {
    id: uuid("id")
      .primaryKey()
      .notNull()
      .references(() => usersTable.id),
    avatar_url: text("avatar_url").notNull(),
    name: text("name").notNull(),
  },
  () => [profilesTablePolicies]
).enableRLS();

export type InsertUser = typeof profilesTable.$inferInsert;
export type SelectUser = typeof profilesTable.$inferSelect;
