import { check, numeric, pgTable, uuid } from "drizzle-orm/pg-core";
import { levelsTable, tutorsTable } from ".";
import { sql } from "drizzle-orm";
import { tutorsServicesTablePolicies } from "./tutorsServices.policies";

export const tutorsServicesTable = pgTable(
  "tutors_services",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tutor_id: uuid("tutor_id")
      .notNull()
      .references(() => tutorsTable.id),
    level_id: uuid("level_id")
      .notNull()
      .references(() => levelsTable.id),
    price: numeric("price", { precision: 4, scale: 2 }).notNull(),
  },
  (table) => [
    check("price_check", sql`${table.price} > 5 AND ${table.price} < 100`),
    ...tutorsServicesTablePolicies,
  ]
).enableRLS();

export type InsertTutorsServices = typeof tutorsServicesTable.$inferInsert;
export type SelectTutorsServices = typeof tutorsServicesTable.$inferSelect;
