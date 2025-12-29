// ColorSwatches.tsx
"use client";

import { Check } from "lucide-react";
import { useVariantStore } from "@/src/store/variant";
import type { FullProduct } from "@/src/lib/actions/product";

type Props = {
  productId: string;
  variants: FullProduct["variants"];
};

export default function ColorSwatches({ productId, variants }: Props) {
  const setSelected = useVariantStore((s) => s.setSelected);
  const selected = useVariantStore((s) => s.getSelected(productId, 0));

  // unique colors (IMPORTANT)
  const colors = Array.from(
    new Map(
      variants
        .filter(v => v.color)
        .map(v => [v.color!.id, v.color!])
    ).values()
  );

  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((c, index) => {
        const isActive = selected === index;
        return (
          <button
            key={c.id}
            onClick={() => setSelected(productId, index)}
            className={`relative h-10 w-10 rounded-full border
              ${isActive ? "ring-2 ring-dark-900" : "border-light-300"}
            `}
            style={{ backgroundColor: c.hexCode }}
            aria-label={c.name}
          >
            {isActive && (
              <Check className="absolute inset-0 m-auto h-4 w-4 text-white" />
            )}
          </button>
        );
      })}
    </div>
  );
}
