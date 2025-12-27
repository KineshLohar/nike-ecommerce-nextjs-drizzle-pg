import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { products } from "../products";
import { relations } from "drizzle-orm";
import z from "zod";

export const brands = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  logoUrl: varchar("logo_url", { length: 500 }),
});

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const insertBrandSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  logoUrl: z.string().url().optional().nullable(),
});
export const selectBrandSchema = insertBrandSchema.extend({
  id: z.string().uuid(),
});
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type SelectBrand = z.infer<typeof selectBrandSchema>;
