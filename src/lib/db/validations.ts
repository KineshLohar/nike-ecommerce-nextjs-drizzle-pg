import { z } from "zod";

// Filter Validations
export const genderSchema = z.object({
  label: z.string().min(1).max(50),
  slug: z.string().min(1).max(50),
});

export const colorSchema = z.object({
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50),
  hexCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color code"),
});

export const sizeSchema = z.object({
  name: z.string().min(1).max(10),
  slug: z.string().min(1).max(10),
  sortOrder: z.number().int().min(0).default(0),
});

export const brandSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  logoUrl: z.string().url().max(500).optional(),
});

// Category Validations
export const categorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  parentId: z.string().uuid().optional(),
});

// Product Validations
export const productSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  genderId: z.string().uuid(),
  brandId: z.string().uuid(),
  isPublished: z.boolean().default(false),
  defaultVariantId: z.string().uuid().optional(),
});

// Variant Validations
export const variantSchema = z.object({
  productId: z.string().uuid(),
  sku: z.string().min(1).max(100),
  price: z.number().positive(),
  salePrice: z.number().positive().optional(),
  colorId: z.string().uuid(),
  sizeId: z.string().uuid(),
  inStock: z.number().int().min(0).default(0),
  weight: z.number().positive().optional(),
  dimensions: z
    .object({
      length: z.number().positive(),
      width: z.number().positive(),
      height: z.number().positive(),
    })
    .optional(),
});

// Product Image Validations
export const productImageSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  url: z.string().url().max(500),
  sortOrder: z.number().int().min(0).default(0),
  isPrimary: z.boolean().default(false),
});

// Collection Validations
export const collectionSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
});

// Address Validations
export const addressTypeEnum = z.enum(["billing", "shipping"]);
export const addressSchema = z.object({
  userId: z.string().uuid(),
  type: addressTypeEnum,
  line1: z.string().min(1).max(255),
  line2: z.string().max(255).optional(),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(20),
  isDefault: z.boolean().default(false),
});

// Cart Validations
export const cartSchema = z.object({
  userId: z.string().uuid().optional(),
  guestId: z.string().uuid().optional(),
});

export const cartItemSchema = z.object({
  cartId: z.string().uuid(),
  productVariantId: z.string().uuid(),
  quantity: z.number().int().positive().default(1),
});

// Order Validations
export const orderStatusEnum = z.enum([
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
]);
export const orderSchema = z.object({
  userId: z.string().uuid(),
  status: orderStatusEnum.default("pending"),
  totalAmount: z.number().positive(),
  shippingAddressId: z.string().uuid(),
  billingAddressId: z.string().uuid(),
});

export const orderItemSchema = z.object({
  orderId: z.string().uuid(),
  productVariantId: z.string().uuid(),
  quantity: z.number().int().positive(),
  priceAtPurchase: z.number().positive(),
});

// Payment Validations
export const paymentMethodEnum = z.enum(["stripe", "paypal", "cod"]);
export const paymentStatusEnum = z.enum(["initiated", "completed", "failed"]);
export const paymentSchema = z.object({
  orderId: z.string().uuid(),
  method: paymentMethodEnum,
  status: paymentStatusEnum.default("initiated"),
  paidAt: z.date().optional(),
  transactionId: z.string().max(255).optional(),
});

// Review Validations
export const reviewSchema = z.object({
  productId: z.string().uuid(),
  userId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

// Wishlist Validations
export const wishlistSchema = z.object({
  userId: z.string().uuid(),
  productId: z.string().uuid(),
});

// Coupon Validations
export const discountTypeEnum = z.enum(["percentage", "fixed"]);
export const couponSchema = z.object({
  code: z.string().min(1).max(50),
  discountType: discountTypeEnum,
  discountValue: z.number().positive(),
  expiresAt: z.date(),
  maxUsage: z.number().int().positive().default(1),
  usedCount: z.number().int().min(0).default(0),
});

