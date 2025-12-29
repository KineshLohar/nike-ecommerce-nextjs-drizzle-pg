"use server";

import { db } from "@/src/lib/db";
import {
  carts,
  cartItems,
  products,
  productImages,
  variants,
  guest,
} from "@/src/lib/db/schema";
import { and, eq } from "drizzle-orm";
import {
  getSession,
  getGuestSession,
  createGuestSession,
} from "@/src/lib/auth/actions";

/* -------------------------------------------------------
 * Types (matches cart.store.ts)
 * ----------------------------------------------------- */

export type CartItemDTO = {
  id: string;
  productVariantId: string;
  productName: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
};

/* -------------------------------------------------------
 * Resolve cart identity (user / guest)
 * ----------------------------------------------------- */

async function resolveCartIdentity() {
  const session = await getSession();

  if (session?.user) {
    return {
      userId: session.user.id,
      guestId: null as string | null,
    };
  }

  let guestToken = await getGuestSession();
  if (!guestToken) { 
    guestToken = await createGuestSession();
  }

  const guestRow = await db.query.guest.findFirst({
    where: eq(guest.sessionToken, guestToken),
  });

  if (!guestRow) {
    throw new Error("Guest session exists but guest row not found");
  }


  return {
    userId: null,
    guestId: guestRow.id,
  };
}

/* -------------------------------------------------------
 * Get or create cart
 * ----------------------------------------------------- */

async function getOrCreateCart() {
  const { userId, guestId } = await resolveCartIdentity();

  let cart = await db.query.carts.findFirst({
    where: userId
      ? eq(carts.userId, userId)
      : eq(carts.guestId, guestId!),
  });

  if (!cart) {
    const [created] = await db
      .insert(carts)
      .values({
        userId,
        guestId: guestId,
      })
      .returning();

    cart = created;
  }

  return cart;
}

/* -------------------------------------------------------
 * Fetch cart items
 * ----------------------------------------------------- */

export async function getCart(): Promise<CartItemDTO[]> {
  const cart = await getOrCreateCart();

  const rows = await db
    .select({
      id: cartItems.id,
      productVariantId: cartItems.productVariantId,
      quantity: cartItems.quantity,
      price: variants.price,
      productName: products.name,
      imageUrl: productImages.url,
    })
    .from(cartItems)
    .innerJoin(variants, eq(variants.id, cartItems.productVariantId))
    .innerJoin(products, eq(products.id, variants.productId))
    .leftJoin(
      productImages,
      and(
        eq(productImages.productId, products.id),
        eq(productImages.isPrimary, true)
      )
    )
    .where(eq(cartItems.cartId, cart.id));

  return rows.map((r) => ({
    id: r.id,
    productVariantId: r.productVariantId,
    productName: r.productName,
    imageUrl: r.imageUrl,
    price: Number(r.price),
    quantity: r.quantity,
  }));
}

/* -------------------------------------------------------
 * Add item to cart
 * ----------------------------------------------------- */

export async function addCartItem(
  productVariantId: string,
  quantity = 1
): Promise<CartItemDTO[]> {
  const cart = await getOrCreateCart();

  const existing = await db.query.cartItems.findFirst({
    where: and(
      eq(cartItems.cartId, cart.id),
      eq(cartItems.productVariantId, productVariantId)
    ),
  });

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({
      cartId: cart.id,
      productVariantId,
      quantity,
    });
  }

  return getCart();
}

/* -------------------------------------------------------
 * Update cart item quantity
 * ----------------------------------------------------- */

export async function updateCartItem(
  cartItemId: string,
  quantity: number
): Promise<CartItemDTO[]> {
  if (quantity <= 0) {
    return removeCartItem(cartItemId);
  }

  await db
    .update(cartItems)
    .set({ quantity })
    .where(eq(cartItems.id, cartItemId));

  return getCart();
}

/* -------------------------------------------------------
 * Remove item from cart
 * ----------------------------------------------------- */

export async function removeCartItem(
  cartItemId: string
): Promise<CartItemDTO[]> {
  await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
  return getCart();
}

/* -------------------------------------------------------
 * Clear cart
 * ----------------------------------------------------- */

export async function clearCart(): Promise<CartItemDTO[]> {
  const cart = await getOrCreateCart();
  await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
  return [];
}
