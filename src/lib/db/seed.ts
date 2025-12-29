import { db } from "./index";
import * as schema from "./schema";
import { eq } from "drizzle-orm";
import { promises as fs } from "fs";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const STATIC = path.join(process.cwd(), "static");
const PUBLIC_SHOES_DIR = path.join(process.cwd(), "public", "shoes");

// Nike product data
const nikeProducts = [
  {
    name: "Nike Air Force 1 Mid '07",
    description:
      "The radiance lives on in the Nike Air Force 1 Mid '07, the basketball original that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash to make you shine.",
    category: "Sneakers",
    gender: "Men",
    price: 98.3,
    images: ["shoe-1.jpg"],
  },
  {
    name: "Nike Air Max 90",
    description:
      "Nothing as fly, nothing as comfortable, nothing as proven. The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle sole, stitched overlays and classic TPU accents.",
    category: "Sneakers",
    gender: "Men",
    price: 120.0,
    images: ["shoe-2.webp"],
  },
  {
    name: "Nike Dunk Low",
    description:
      "Created for the hardwood but taken to the streets, the '80s b-ball icon returns with perfectly sheened overlays and original university colors.",
    category: "Sneakers",
    gender: "Women",
    price: 100.0,
    images: ["shoe-3.webp"],
  },
  {
    name: "Nike Air Max 95",
    description:
      "The Nike Air Max 95 stays true to its OG running roots with the iconic layered design and visible Max Air cushioning.",
    category: "Sneakers",
    gender: "Men",
    price: 175.0,
    images: ["shoe-4.webp"],
  },
  {
    name: "Nike Blazer Mid '77",
    description:
      "In the '70s, Nike was the new shoe on the block. So new, in fact, we were still breaking into the basketball scene and testing prototypes on the feet of our local team.",
    category: "Sneakers",
    gender: "Unisex",
    price: 100.0,
    images: ["shoe-5.avif"],
  },
  {
    name: "Nike React Element 55",
    description:
      "The Nike React Element 55 brings comfort and style to your everyday journey.",
    category: "Running",
    gender: "Men",
    price: 130.0,
    images: ["shoe-6.avif"],
  },
  {
    name: "Nike Air Max 270",
    description:
      "The Nike Air Max 270 delivers visible cushioning under every step.",
    category: "Running",
    gender: "Men",
    price: 150.0,
    images: ["shoe-7.avif"],
  },
  {
    name: "Nike Court Vision Low",
    description:
      "The Nike Court Vision Low takes '80s-inspired style and gives it a modern update.",
    category: "Lifestyle",
    gender: "Women",
    price: 75.0,
    images: ["shoe-8.avif"],
  },
  {
    name: "Nike Air Zoom Pegasus 40",
    description:
      "Your workhorse with wings is back. The Nike Air Zoom Pegasus 40 returns with a redesigned midfoot band for a more secure fit.",
    category: "Running",
    gender: "Men",
    price: 120.0,
    images: ["shoe-9.avif"],
  },
  {
    name: "Nike Air VaporMax 2023",
    description:
      "The Nike Air VaporMax 2023 brings revolutionary cushioning to your run.",
    category: "Running",
    gender: "Women",
    price: 180.0,
    images: ["shoe-10.avif"],
  },
  {
    name: "Nike SB Dunk Low",
    description:
      "The Nike SB Dunk Low brings skate style to the streets with durable materials and classic design.",
    category: "Skateboarding",
    gender: "Unisex",
    price: 110.0,
    images: ["shoe-11.avif"],
  },
  {
    name: "Nike Air Max 97",
    description:
      "The Nike Air Max 97 keeps a sneakerhead favorite going strong with the same design that brought you full-length visible cushioning.",
    category: "Sneakers",
    gender: "Men",
    price: 170.0,
    images: ["shoe-12.avif"],
  },
  {
    name: "Nike Free RN 5.0",
    description:
      "The Nike Free RN 5.0 brings natural flexibility to your run with a lightweight, breathable design.",
    category: "Running",
    gender: "Women",
    price: 100.0,
    images: ["shoe-13.avif"],
  },
  {
    name: "Nike Cortez",
    description:
      "The Nike Cortez stays true to its '72 roots with the iconic wedge sole and Swoosh design.",
    category: "Lifestyle",
    gender: "Unisex",
    price: 70.0,
    images: ["shoe-14.avif"],
  },
  {
    name: "Nike Air Max 720",
    description:
      "The Nike Air Max 720 delivers the tallest Air unit yet for maximum cushioning.",
    category: "Sneakers",
    gender: "Men",
    price: 180.0,
    images: ["shoe-15.avif"],
  },
];

const colors = [
  { name: "Black", slug: "black", hexCode: "#000000" },
  { name: "White", slug: "white", hexCode: "#FFFFFF" },
  { name: "Red", slug: "red", hexCode: "#FF0000" },
  { name: "Blue", slug: "blue", hexCode: "#0000FF" },
  { name: "Gray", slug: "gray", hexCode: "#808080" },
  { name: "Green", slug: "green", hexCode: "#008000" },
  { name: "Orange", slug: "orange", hexCode: "#FFA500" },
  { name: "Pink", slug: "pink", hexCode: "#FFC0CB" },
];

const sizes = [
  { name: "6", slug: "6", sortOrder: 1 },
  { name: "6.5", slug: "6-5", sortOrder: 2 },
  { name: "7", slug: "7", sortOrder: 3 },
  { name: "7.5", slug: "7-5", sortOrder: 4 },
  { name: "8", slug: "8", sortOrder: 5 },
  { name: "8.5", slug: "8-5", sortOrder: 6 },
  { name: "9", slug: "9", sortOrder: 7 },
  { name: "9.5", slug: "9-5", sortOrder: 8 },
  { name: "10", slug: "10", sortOrder: 9 },
  { name: "10.5", slug: "10-5", sortOrder: 10 },
  { name: "11", slug: "11", sortOrder: 11 },
  { name: "11.5", slug: "11-5", sortOrder: 12 },
  { name: "12", slug: "12", sortOrder: 13 },
];

const genders = [
  { label: "Men", slug: "men" },
  { label: "Women", slug: "women" },
  { label: "Unisex", slug: "unisex" },
];

async function ensureDirectoryExists(dirPath: string) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`✓ Created directory: ${dirPath}`);
  }
}

async function copyImage(sourcePath: string, destPath: string): Promise<string> {
  try {
    await fs.copyFile(sourcePath, destPath);
    const relativePath = `/uploads/${path.basename(destPath)}`;
    console.log(`  ✓ Copied image: ${path.basename(sourcePath)}`);
    return relativePath;
  } catch (error) {
    console.error(`✗ Failed to copy ${sourcePath}:`, error);
    throw error;
  }
}

async function seed() {
  try {
    console.log("🌱 Starting database seed...\n");

    // Ensure public/uploads directory exists
    await ensureDirectoryExists(UPLOADS_DIR);

    // Seed Genders
    console.log("📝 Seeding genders...");
    const insertedGenders = await db
      .insert(schema.genders)
      .values(genders)
      .returning();
    console.log(`✓ Inserted ${insertedGenders.length} genders\n`);

    // Seed Colors
    console.log("📝 Seeding colors...");
    const insertedColors = await db
      .insert(schema.colors)
      .values(colors)
      .returning();
    console.log(`✓ Inserted ${insertedColors.length} colors\n`);

    // Seed Sizes
    console.log("📝 Seeding sizes...");
    const insertedSizes = await db
      .insert(schema.sizes)
      .values(sizes)
      .returning();
    console.log(`✓ Inserted ${insertedSizes.length} sizes\n`);

    // Seed Brand (Nike)
    console.log("📝 Seeding brands...");
    const [nikeBrand] = await db
      .insert(schema.brands)
      .values({
        name: "Nike",
        slug: "nike",
        logoUrl: null,
      })
      .returning();
    console.log(`✓ Inserted brand: ${nikeBrand.name}\n`);

    // Seed Categories
    console.log("📝 Seeding categories...");
    const categoryMap = new Map<string, string>();
    const uniqueCategories = Array.from(
      new Set(nikeProducts.map((p) => p.category))
    );
    const insertedCategories = (await db
      .insert(schema.categories)
      .values(
        uniqueCategories.map((cat) => ({
          name: cat,
          slug: cat.toLowerCase().replace(/\s+/g, "-"),
        }))
      )
      .returning()) as (typeof schema.categories.$inferSelect)[];
    insertedCategories.forEach((cat) => {
      categoryMap.set(cat.name, cat.id);
    });
    console.log(`✓ Inserted ${insertedCategories.length} categories\n`);

    // Seed Collections
    console.log("📝 Seeding collections...");
    const [summerCollection] = await db
      .insert(schema.collections)
      .values({
        name: "Summer '25",
        slug: "summer-25",
      })
      .returning();
    console.log(`✓ Inserted collection: ${summerCollection.name}\n`);

    // Seed Products and Variants
    console.log("📝 Seeding products and variants...");
    const genderMap = new Map<string, string>();
    insertedGenders.forEach((g) => {
      genderMap.set(g.label, g.id);
    });

    const colorMap = new Map<string, string>();
    insertedColors.forEach((c) => {
      colorMap.set(c.name.toLowerCase(), c.id);
    });

    const sizeMap = new Map<string, string>();
    insertedSizes.forEach((s) => {
      sizeMap.set(s.name, s.id);
    });

    let productCount = 0;
    let variantCount = 0;
    let imageCount = 0;

    for (const productData of nikeProducts) {
      try {
        // Create product
        const products = (await db
          .insert(schema.products)
          .values({
            name: productData.name,
            description: productData.description,
            categoryId: categoryMap.get(productData.category)!,
            genderId: genderMap.get(productData.gender)!,
            brandId: nikeBrand.id,
            isPublished: true,
          })
          .returning()) as (typeof schema.products.$inferSelect)[];

        const [product] = products;


        productCount++;

        // Create variants with random colors and sizes
        const productColors = [
          insertedColors[Math.floor(Math.random() * insertedColors.length)],
          insertedColors[Math.floor(Math.random() * insertedColors.length)],
        ];
        const productSizes = insertedSizes.slice(0, 6); // Use first 6 sizes

        const variantIds: string[] = [];

        for (const color of productColors) {
          for (const size of productSizes) {
            const sku = `NIKE-${product.name
              .replace(/\s+/g, "-")
              .toUpperCase()}-${color.slug.toUpperCase()}-${size.slug.toUpperCase()}`;
            const variants = (await db
              .insert(schema.variants)
              .values({
                productId: product.id,
                sku,
                price: productData.price.toString(),
                salePrice:
                  Math.random() > 0.7
                    ? (productData.price * 0.8).toFixed(2)
                    : null,
                colorId: color.id,
                sizeId: size.id,
                inStock: Math.floor(Math.random() * 50) + 10,
                weight: (Math.random() * 0.5 + 0.3).toFixed(2),
                dimensions: {
                  length: Math.floor(Math.random() * 10) + 25,
                  width: Math.floor(Math.random() * 5) + 10,
                  height: Math.floor(Math.random() * 5) + 10,
                },
              })
              .returning()) as (typeof schema.variants.$inferSelect)[];

            const [variant] = variants;

            variantIds.push(variant.id);
            variantCount++;
          }
        }

        // Set default variant
        await db
          .update(schema.products)
          .set({ defaultVariantId: variantIds[0] })
          .where(eq(schema.products.id, product.id));

        // Copy and create product images
        for (let i = 0; i < productData.images.length; i++) {
          const imageFile = productData.images[i];
          const sourcePath = path.join(PUBLIC_SHOES_DIR, imageFile);
          try {
            const destFileName = `${product.id}-${i + 1}${path.extname(imageFile)}`;
            const destPath = path.join(UPLOADS_DIR, destFileName);
            const imageUrl = await copyImage(sourcePath, destPath);
            await db.insert(schema.productImages).values({
              productId: product.id,
              variantId: variantIds[0], // Associate with first variant
              url: imageUrl,
              sortOrder: i,
              isPrimary: i === 0,
            });
            imageCount++;
          } catch (error) {
            console.error(
              `✗ Failed to process image ${imageFile} for product ${product.name}:`,
              error
            );
          }
        }

        // Add product to collection (randomly)
        if (Math.random() > 0.5) {
          await db.insert(schema.productCollections).values({
            productId: product.id,
            collectionId: summerCollection.id,
          });
        }

        console.log(`✓ Created product: ${product.name}`);
      } catch (error) {
        console.error(
          `✗ Failed to create product ${productData.name}:`,
          error
        );
      }
    }

    console.log(`\n✅ Seed completed successfully!`);
    console.log(`   - Products: ${productCount}`);
    console.log(`   - Variants: ${variantCount}`);
    console.log(`   - Images: ${imageCount}`);
  } catch (error) {
    console.error("✗ Seed failed:", error);
    throw error;
  }
}

// Run seed if called directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log("\n🎉 Database seeded successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Seed failed:", error);
      process.exit(1);
    });
}

export default seed;

