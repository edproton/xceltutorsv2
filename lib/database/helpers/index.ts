import { sql, RawBuilder } from "kysely";

export function jsonb<T>(value: T): RawBuilder<T> {
  return sql`CAST(${JSON.stringify(value)} AS JSONB)`;
}
