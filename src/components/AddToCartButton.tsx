"use client";

import { useState } from "react";
import { addCartItem } from "@/src/lib/actions/cart";
import { useCartStore } from "@/src/store/cart";

export default function AddToCartButton({
  productVariantId,
}: {
  productVariantId: string;
}) {
  const [loading, setLoading] = useState(false);
  const setItems = useCartStore((s) => s.setItems);

  async function handleClick() {
    if (loading) return;

    try {
      setLoading(true);
      const items = await addCartItem(productVariantId, 1);
      setItems(items);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="mt-4 rounded-lg border border-dark-900 px-4 py-2 text-body font-medium text-dark-900 transition hover:bg-dark-900 hover:text-light-100 disabled:opacity-50"
    >
      {loading ? "Adding…" : "Add to Cart"}
    </button>
  );
}
