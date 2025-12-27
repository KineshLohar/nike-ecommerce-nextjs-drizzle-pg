import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { products } from "../products";
import z from "zod";

export const genders = pgTable("genders", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: varchar("label", { length: 50 }).notNull(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
});


export const gendersRelations = relations(genders, ({ many }) => ({
  products: many(products),
}));

export const insertGenderSchema = z.object({
  label: z.string().min(1),
  slug: z.string().min(1),
});
export const selectGenderSchema = insertGenderSchema.extend({
  id: z.string().uuid(),
});
export type InsertGender = z.infer<typeof insertGenderSchema>;
export type SelectGender = z.infer<typeof selectGenderSchema>;
