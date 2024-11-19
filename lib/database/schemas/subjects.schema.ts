import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { subjectsTablePolicies } from "./subjects.policies";

export const subjectsTable = pgTable(
  "subjects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
  },
  () => [...subjectsTablePolicies]
).enableRLS();
