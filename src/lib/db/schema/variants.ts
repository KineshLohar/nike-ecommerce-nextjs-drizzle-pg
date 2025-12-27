import { pgTable, uuid, varchar, numeric, integer, real, jsonb, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { products } from "./products";
import { colors } from "./filters/colors";
import { sizes } from "./filters/sizes";
import { cartItems } from "./cart-items";
import { orderItems } from "./order-items";
import z from "zod";

export const variants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  salePrice: numeric("sale_price", { precision: 10, scale: 2 }),
  colorId: uuid("color_id")
    .notNull()
    .references(() => colors.id, { onDelete: "restrict" }),
  sizeId: uuid("size_id")
    .notNull()
    .references(() => sizes.id, { onDelete: "restrict" }),
  inStock: integer("in_stock").notNull().default(0),
  weight: real("weight"), // in kg
  dimensions: jsonb("dimensions"), // { length, width, height } in cm
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const variantsRelations = relations(variants, ({ one, many }) => ({
  product: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
  color: one(colors, {
    fields: [variants.colorId],
    references: [colors.id],
  }),
  size: one(sizes, {
    fields: [variants.sizeId],
    references: [sizes.id],
  }),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
}));

export const insertVariantSchema = z.object({
  productId: z.string().uuid(),
  sku: z.string().min(1),
  price: z.string(),
  salePrice: z.string().optional().nullable(),
  colorId: z.string().uuid(),
  sizeId: z.string().uuid(),
  inStock: z.number().int().nonnegative().optional(),
  weight: z.number().optional().nullable(),
  dimensions: z
    .object({
      length: z.number(),
      width: z.number(),
      height: z.number(),
    })
    .partial()
    .optional()
    .nullable(),
  createdAt: z.date().optional(),
});

export const selectVariantSchema = insertVariantSchema.extend({
  id: z.string().uuid(),
});

export type InsertVariant = z.infer<typeof insertVariantSchema>;
export type SelectVariant = z.infer<typeof selectVariantSchema>;

