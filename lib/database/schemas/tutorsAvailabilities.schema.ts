import { boolean, pgEnum, pgTable, uuid } from "drizzle-orm/pg-core";
import { tutorsTable } from ".";
import { tutorsAvailabilitiesTablePolicies } from "./tutorsAvailabilities.policies";

export const weekdaysEnum = pgEnum("weekdays", [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

export const tutorsAvailabilitiesTable = pgTable(
  "tutors_availabilities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tutor_id: uuid("tutor_id")
      .notNull()
      .references(() => tutorsTable.id),
    weekday: weekdaysEnum().notNull(),
    morning: boolean("morning").default(false).notNull(),
    afternoon: boolean("afternoon").default(false).notNull(),
    evening: boolean("evening").default(false).notNull(),
  },
  () => [...tutorsAvailabilitiesTablePolicies]
).enableRLS();
