import { pgTable, uuid, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { categories } from "./categories";
import { genders } from "./filters/genders";
import { brands } from "./filters/brands";
import { variants } from "./variants";
import { productImages } from "./product-images";
import { reviews } from "./reviews";
import { wishlists } from "./wishlists";
import { productCollections } from "./product-collections";
import z from "zod";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "restrict" }),
  genderId: uuid("gender_id")
    .notNull()
    .references(() => genders.id, { onDelete: "restrict" }),
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "restrict" }),
  isPublished: boolean("is_published").notNull().default(false),
  defaultVariantId: uuid("default_variant_id").references(() => variants.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  gender: one(genders, {
    fields: [products.genderId],
    references: [genders.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  defaultVariant: one(variants, {
    fields: [products.defaultVariantId],
    references: [variants.id],
  }),
  variants: many(variants),
  images: many(productImages),
  reviews: many(reviews),
  wishlists: many(wishlists),
  collections: many(productCollections),
}));

export const insertProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  categoryId: z.string().uuid().optional().nullable(),
  genderId: z.string().uuid().optional().nullable(),
  brandId: z.string().uuid().optional().nullable(),
  isPublished: z.boolean().optional(),
  defaultVariantId: z.string().uuid().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const selectProductSchema = insertProductSchema.extend({
  id: z.string().uuid(),
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type SelectProduct = z.infer<typeof selectProductSchema>;

