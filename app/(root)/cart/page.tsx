import CartClient from "@/src/components/CardClient";
import { Suspense } from "react";

export default function CartPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-heading-2 text-dark-900">Your Cart</h1>

      {/* Client-side cart logic isolated */}
      <Suspense fallback={<CartSkeleton />}>
        <CartClient />
      </Suspense>
    </main>
  );
}

/* ----------------------------------------
 * Skeleton (SSR-safe)
 * -------------------------------------- */
function CartSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="flex gap-4 rounded-lg border border-light-300 p-4"
        >
          <div className="h-24 w-24 rounded-md bg-light-200 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/2 bg-light-200 animate-pulse" />
            <div className="h-3 w-1/3 bg-light-200 animate-pulse" />
            <div className="h-4 w-24 bg-light-200 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
