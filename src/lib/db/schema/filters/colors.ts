import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const colors = pgTable("colors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  hexCode: varchar("hex_code", { length: 7 }).notNull(), // #RRGGBB format
});

export type Color = typeof colors.$inferSelect;
export type NewColor = typeof colors.$inferInsert;

