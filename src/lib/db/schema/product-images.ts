import { pgTable, uuid, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { products } from "./products";
import { variants } from "./variants";
import z from "zod";

export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").references(() => variants.id, {
    onDelete: "cascade",
  }),
  url: varchar("url", { length: 500 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isPrimary: boolean("is_primary").notNull().default(false),
});

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
  variant: one(variants, {
    fields: [productImages.variantId],
    references: [variants.id],
  }),
}));

export const insertProductImageSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional().nullable(),
  url: z.string().min(1),
  sortOrder: z.number().int().optional(),
  isPrimary: z.boolean().optional(),
});

export const selectProductImageSchema = insertProductImageSchema.extend({
  id: z.string().uuid(),
});

export type InsertProductImage = z.infer<typeof insertProductImageSchema>;
export type SelectProductImage = z.infer<typeof selectProductImageSchema>;

