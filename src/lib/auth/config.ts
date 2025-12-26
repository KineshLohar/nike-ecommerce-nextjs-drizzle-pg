import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/src/lib/db";
import { v4 as uuidv4 } from 'uuid';

import * as schema from '@/src/lib/db/schema'
import { nextCookies } from "better-auth/next-js";

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET environment variable is not set");
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
      guest: schema.guest
    }
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // MVP: no verification
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7
    },
    // expiresIn: 60 * 60 * 24 * 7, // 7 days
    // updateAge: 60 * 60 * 24, // 1 day
  },
  cookies: {
    sessionToken: {
      name: "auth_session",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      }
    },
  },
  advanced: {
    database: {
      generateId: () => uuidv4()
    }
  },
  plugins: [nextCookies()]
});

export type Session = typeof auth.$Infer.Session;

