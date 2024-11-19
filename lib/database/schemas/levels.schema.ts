import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { subjectsTable } from "./subjects.schema";
import { levelsTablePolicies } from "./levels.policies";

export const levelsTable = pgTable(
  "levels",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    subjectId: uuid("subject_id")
      .references(() => subjectsTable.id)
      .notNull(),
  },
  () => [...levelsTablePolicies]
).enableRLS();
