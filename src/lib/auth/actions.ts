"use server";

import { db } from "@/src/lib/db";
import { guest } from "@/src/lib/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ZodError } from "zod";
import { auth } from "./config";
import { signInSchema, signUpSchema } from "./validations";

const GUEST_SESSION_COOKIE = "guest_session";
const GUEST_SESSION_EXPIRY_DAYS = 7;

/**
 * Create or get guest session
 */
export async function createGuestSession(): Promise<string> {
  const cookieStore = await cookies();
  const existingGuestToken = cookieStore.get(GUEST_SESSION_COOKIE)?.value;

  if (existingGuestToken) {
    // Verify guest session exists and is valid
    const [guestSession] = await db
      .select()
      .from(guest)
      .where(
        and(
          eq(guest.sessionToken, existingGuestToken),
          gt(guest.expiresAt, new Date())
        )
      )
      .limit(1);

    if (guestSession) {
      return existingGuestToken;
    }
  }

  // Create new guest session
  const sessionToken = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + GUEST_SESSION_EXPIRY_DAYS);

  await db.insert(guest).values({
    sessionToken,
    expiresAt,
  });

  cookieStore.set(GUEST_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * GUEST_SESSION_EXPIRY_DAYS,
  });

  return sessionToken;
}

/**
 * Get current guest session token
 */
export async function getGuestSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const guestToken = cookieStore.get(GUEST_SESSION_COOKIE)?.value;

  if (!guestToken) {
    return null;
  }

  // Verify guest session exists and is valid
  const [guestSession] = await db
    .select()
    .from(guest)
    .where(
      and(
        eq(guest.sessionToken, guestToken),
        gt(guest.expiresAt, new Date())
      )
    )
    .limit(1);

  return guestSession ? guestToken : null;
}

/**
 * Sign up a new user
 */
export async function signUp(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name")?.toString(),
      email: formData.get("email")?.toString(),
      password: formData.get("password")?.toString(),
    };

    const validatedData = signUpSchema.parse(rawData);

    const session = await auth.api.signUpEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name || "",
      },
    });

    if (!session) {
      return {
        ok: false,
        error: "Failed to create account. Please try again.",
      };
    }

    // Migrate guest cart to user account
    await mergeGuestCartWithUserCart(session.user.id);

    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        ok: false,
        error: error.issues.map(e => e.message).join(", "),
      };
    }
    if (error instanceof Error) {
      return {
        ok: false,
        error: error.message || "Failed to create account. Please try again.",
      };
    }
    return {
      ok: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(formData: FormData) {
  try {
    const rawData = {
      email: formData.get("email")?.toString(),
      password: formData.get("password")?.toString(),
    };

    const validatedData = signInSchema.parse(rawData);

    const session = await auth.api.signInEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
      },
    });

    if (!session) {
      return {
        ok: false,
        error: "Invalid email or password.",
      };
    }

    // Migrate guest cart to user account
    await mergeGuestCartWithUserCart(session.user.id);

    revalidatePath("/");

    return { ok: true };
  } catch (error) {
    console.log("ERROR- [SIGNIN]", error);

    if (error instanceof ZodError) {
      return {
        ok: false,
        error: error.issues.map(e => e.message).join(", "),
      };
    }

    if (error instanceof Error) {
      return {
        ok: false,
        error: error.message || "Invalid email or password.",
      };
    }
    return {
      ok: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    await auth.api.signOut({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    revalidatePath("/");
    return { success: true };
  } catch {
    return {
      error: "Failed to sign out. Please try again.",
    };
  }
}

/**
 * Get current session
 */
export async function getSession() {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });
    return session;
  } catch {
    return null;
  }
}

/**
 * Merge guest cart with user cart
 * This function will be implemented when cart schema is created
 * @param userId - The user ID to merge the guest cart with
 */
async function mergeGuestCartWithUserCart(userId: string): Promise<void> {
  // userId will be used when cart schema is implemented
  void userId;
  const cookieStore = await cookies();
  const guestToken = cookieStore.get(GUEST_SESSION_COOKIE)?.value;

  if (!guestToken) {
    return;
  }

  try {
    // TODO: Implement cart migration logic when cart schema is ready
    // Example:
    // 1. Get guest cart items using guestToken
    // 2. Get user cart items using userId
    // 3. Merge items (combine quantities for same products)
    // 4. Update user cart
    // 5. Delete guest cart

    // Remove guest session after migration
    await db.delete(guest).where(eq(guest.sessionToken, guestToken));
    cookieStore.delete(GUEST_SESSION_COOKIE);
  } catch (error) {
    // Log error but don't fail the auth process
    console.error("Failed to merge guest cart:", error);
  }
}

