import { pgTable, uuid, varchar, integer } from "drizzle-orm/pg-core";
import { variants } from "../variants";
import { relations } from "drizzle-orm";
import z from "zod";

export const sizes = pgTable("sizes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 10 }).notNull(),
  slug: varchar("slug", { length: 10 }).notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
});


export const sizesRelations = relations(sizes, ({ many }) => ({
  variants: many(variants),
}));

export const insertSizeSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  sortOrder: z.number().int(),
});
export const selectSizeSchema = insertSizeSchema.extend({
  id: z.string().uuid(),
});
export type InsertSize = z.infer<typeof insertSizeSchema>;
export type SelectSize = z.infer<typeof selectSizeSchema>;

