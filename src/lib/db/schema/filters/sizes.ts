import { pgTable, uuid, varchar, integer } from "drizzle-orm/pg-core";

export const sizes = pgTable("sizes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 10 }).notNull(),
  slug: varchar("slug", { length: 10 }).notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type Size = typeof sizes.$inferSelect;
export type NewSize = typeof sizes.$inferInsert;

