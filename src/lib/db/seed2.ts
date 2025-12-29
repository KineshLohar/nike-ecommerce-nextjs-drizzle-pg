import { db } from "./index"
import * as schema from "./schema"
import { eq } from "drizzle-orm"
import { promises as fs } from "fs"
import path from "path"

/* -------------------------------------------------- */
/* PATHS */
/* -------------------------------------------------- */

const SHOES_DIR = path.join(process.cwd(), "public", "shoes")
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads")

/* -------------------------------------------------- */
/* STATIC DATA */
/* -------------------------------------------------- */

const GENDERS = [
  { label: "Men", slug: "men" },
  { label: "Women", slug: "women" },
  { label: "Unisex", slug: "unisex" },
]

const COLORS = [
  { name: "Black", slug: "black", hexCode: "#000000" },
  { name: "White", slug: "white", hexCode: "#FFFFFF" },
  { name: "Red", slug: "red", hexCode: "#FF0000" },
  { name: "Green", slug: "green", hexCode: "#008000" },
]

const SIZES = [
  { name: "7", slug: "7", sortOrder: 1 },
  { name: "8", slug: "8", sortOrder: 2 },
  { name: "9", slug: "9", sortOrder: 3 },
  { name: "10", slug: "10", sortOrder: 4 },
]

const PRODUCTS = [
  { name: "Nike Air Force 1 Low", gender: "Men", category: "Sneakers", price: 110, image: "shoe-1.jpg" },
  { name: "Nike Air Max 90", gender: "Men", category: "Sneakers", price: 120, image: "shoe-2.webp" },
  { name: "Nike Dunk Low Retro", gender: "Women", category: "Sneakers", price: 100, image: "shoe-3.webp" },
  { name: "Nike Air Max 95", gender: "Men", category: "Sneakers", price: 175, image: "shoe-4.webp" },
  { name: "Nike Blazer Mid '77", gender: "Unisex", category: "Lifestyle", price: 100, image: "shoe-5.avif" },
  { name: "Nike React Element 55", gender: "Men", category: "Running", price: 130, image: "shoe-6.avif" },
  { name: "Nike Air Max 270", gender: "Men", category: "Running", price: 150, image: "shoe-7.avif" },
  { name: "Nike Court Vision Low", gender: "Women", category: "Lifestyle", price: 75, image: "shoe-8.avif" },
  { name: "Nike Air Zoom Pegasus 40", gender: "Men", category: "Running", price: 120, image: "shoe-9.avif" },
  { name: "Nike VaporMax 2023", gender: "Women", category: "Running", price: 180, image: "shoe-10.avif" },
  { name: "Nike SB Dunk Low", gender: "Unisex", category: "Skateboarding", price: 110, image: "shoe-11.avif" },
  { name: "Nike Air Max 97", gender: "Men", category: "Sneakers", price: 170, image: "shoe-12.avif" },
  { name: "Nike Free RN 5.0", gender: "Women", category: "Running", price: 100, image: "shoe-13.avif" },
  { name: "Nike Cortez Classic", gender: "Unisex", category: "Lifestyle", price: 70, image: "shoe-14.avif" },
  { name: "Nike Air Max 720", gender: "Men", category: "Sneakers", price: 180, image: "shoe-15.avif" },
]

/* -------------------------------------------------- */
/* HELPERS */
/* -------------------------------------------------- */

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true })
}

async function copyImage(filename: string, productId: string) {
  const ext = path.extname(filename)
  const src = path.join(SHOES_DIR, filename)
  const dest = path.join(UPLOADS_DIR, `${productId}${ext}`)
  await fs.copyFile(src, dest)
  return `/uploads/${productId}${ext}`
}

/* -------------------------------------------------- */
/* SEED */
/* -------------------------------------------------- */

async function seed() {
  console.log("🌱 Starting full seed...\n")
  await ensureDir(UPLOADS_DIR)

  /* ---------- GENDERS ---------- */
  const insertedGenders = await db.insert(schema.genders).values(GENDERS).returning()
  const genderMap = Object.fromEntries(insertedGenders.map(g => [g.label, g.id]))

  /* ---------- COLORS ---------- */
  const insertedColors = await db.insert(schema.colors).values(COLORS).returning()

  /* ---------- SIZES ---------- */
  const insertedSizes = await db.insert(schema.sizes).values(SIZES).returning()

  /* ---------- BRAND ---------- */
  const [nikeBrand] = await db
    .insert(schema.brands)
    .values({ name: "Nike", slug: "nike", logoUrl: null })
    .returning()

  /* ---------- CATEGORIES ---------- */
  const uniqueCategories = [...new Set(PRODUCTS.map(p => p.category))]
  const insertedCategories = (await db
    .insert(schema.categories)
    .values(
      uniqueCategories.map(c => ({
        name: c,
        slug: c.toLowerCase().replace(/\s+/g, "-"),
      }))
    )
    .returning()) as (typeof schema.categories.$inferSelect)[];

  const categoryMap = Object.fromEntries(insertedCategories.map(c => [c.name, c.id]))

  /* ---------- COLLECTION ---------- */
  const [summerCollection] = await db
    .insert(schema.collections)
    .values({ name: "Summer '25", slug: "summer-25" })
    .returning()

  /* ---------- PRODUCTS + VARIANTS + IMAGES ---------- */
  for (const item of PRODUCTS) {
    const products = (await db
      .insert(schema.products)
      .values({
        name: item.name,
        description: `${item.name} premium Nike footwear.`,
        brandId: nikeBrand.id,
        categoryId: categoryMap[item.category],
        genderId: genderMap[item.gender],
        isPublished: true,
      })
      .returning()) as (typeof schema.products.$inferSelect)[];

    const [product] = products;


    const variants = (await db
      .insert(schema.variants)
      .values({
        productId: product.id,
        sku: `NIKE-${product.id.slice(0, 8)}`,
        price: item.price.toString(),
        salePrice: null,
        colorId: insertedColors[0].id,
        sizeId: insertedSizes[0].id,
        inStock: 30,
        weight: "0.5",
        dimensions: { length: 30, width: 12, height: 10 },
      })
      .returning()) as (typeof schema.variants.$inferSelect)[];

    const [variant] = variants;


    await db
      .update(schema.products)
      .set({ defaultVariantId: variant.id })
      .where(eq(schema.products.id, product.id))

    const imageUrl = await copyImage(item.image, product.id)

    await db.insert(schema.productImages).values({
      productId: product.id,
      variantId: variant.id,
      url: imageUrl,
      sortOrder: 0,
      isPrimary: true,
    })

    await db.insert(schema.productCollections).values({
      productId: product.id,
      collectionId: summerCollection.id,
    })

    console.log(`✓ Seeded product: ${item.name}`)
  }

  console.log("\n✅ Database seeded successfully!")
}

/* -------------------------------------------------- */
/* RUN */
/* -------------------------------------------------- */

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}

export default seed
