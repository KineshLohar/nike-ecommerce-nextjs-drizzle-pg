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

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

