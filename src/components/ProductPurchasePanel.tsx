"use client";

import { useState, useMemo } from "react";
import { ShoppingBag, Heart } from "lucide-react";
import { useVariantStore } from "@/src/store/variant";
import { addCartItem } from "@/src/lib/actions/cart";
import SizePicker from "./SizePicker";
import ColorSwatches from "./ColorSwatches";
import type { FullProduct } from "@/src/lib/actions/product";
import { useCartStore } from "../store/cart";

type Props = {
    productId: string;
    variants: FullProduct["variants"];
};

export default function ProductPurchasePanel({ productId, variants }: Props) {
    const selectedColorIndex = useVariantStore((s) =>
        s.getSelected(productId, 0)
    );

    const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);

    const cartItems = useCartStore((s) => s.items);


    /* -----------------------------------
     * Resolve selected COLOR (correctly)
     * ----------------------------------- */
    const colors = useMemo(() => {
        return Array.from(
            new Map(
                variants
                    .filter(v => v.color)
                    .map(v => [v.color!.id, v.color!])
            ).values()
        );
    }, [variants]);

    const selectedColorId = colors[selectedColorIndex]?.id ?? null;

    /* -----------------------------------
     * Available sizes for selected color
     * ----------------------------------- */
    const availableSizes = useMemo(() => {
        if (!selectedColorId) return [];

        return variants
            .filter(v => v.color?.id === selectedColorId)
            .map(v => ({
                id: v.size!.id,
                name: v.size!.name,
                inStock: v.inStock,
            }));
    }, [variants, selectedColorId]);

    /* -----------------------------------
     * Resolve FINAL variant
     * ----------------------------------- */
    const selectedVariant = useMemo(() => {
        if (!selectedColorId || !selectedSizeId) return null;

        return variants.find(
            v =>
                v.color?.id === selectedColorId &&
                v.size?.id === selectedSizeId &&
                v.inStock
        );
    }, [variants, selectedColorId, selectedSizeId]);

    const onAddToCart = async () => {
        if (!selectedVariant) return;

        // 1. Set loading (optional UX)
        useCartStore.getState().setLoading(true);

        // 2. Call server action
        const updatedCart = await addCartItem(selectedVariant.id, 1);

        // 3. Sync Zustand store
        useCartStore.getState().setItems(updatedCart);

        // 4. Stop loading
        useCartStore.getState().setLoading(false);
    };

    const isInCart = useMemo(() => {
        if (!selectedVariant) return false;
      
        return cartItems.some(
          (item) => item.productVariantId === selectedVariant.id
        );
      }, [cartItems, selectedVariant]);
      


    return (
        <div className="flex flex-col gap-6">
            <ColorSwatches productId={productId} variants={variants} />

            <SizePicker
                sizes={availableSizes}
                selectedSizeId={selectedSizeId}
                onChange={setSelectedSizeId}
            />

            <button
                onClick={onAddToCart}
                disabled={!selectedVariant || isInCart}
                className="flex items-center justify-center gap-2 rounded-full bg-dark-900 px-6 py-4 text-light-100 disabled:opacity-50"
            >
                <ShoppingBag className="h-5 w-5" />
                {!isInCart ? "Add to Bag" : "Already in Bag!"}
            </button>

            <button className="flex items-center justify-center gap-2 rounded-full border border-light-300 px-6 py-4">
                <Heart className="h-5 w-5" />
                Favorite
            </button>
        </div>
    );
}
