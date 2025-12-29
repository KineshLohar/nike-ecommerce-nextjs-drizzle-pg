import { create } from "zustand";

/* ----------------------------------------
 * Types
 * -------------------------------------- */

export type CartItem = {
  id: string;                // cart_items.id
  productVariantId: string;  // product_variants.id

  productId?: string;
  productName: string;

  imageUrl?: string | null;

  color?: string | null;
  size?: string | null;

  price: number;             // price per unit
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isLoading: boolean;

  /* Derived */
  totalItems: number;
  subtotal: number;

  /* Actions */
  setItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clear: () => void;

  setLoading: (loading: boolean) => void;
};

/* ----------------------------------------
 * Store
 * -------------------------------------- */

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,

  /* -------- Derived values -------- */
  get totalItems() {
    return get().items.reduce((sum, i) => sum + i.quantity, 0);
  },

  get subtotal() {
    return get().items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
  },

  /* -------- Actions -------- */
  setItems: (items) =>
    set({
      items,
    }),

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find(
        (i) => i.productVariantId === item.productVariantId
      );

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productVariantId === item.productVariantId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }

      return {
        items: [...state.items, item],
      };
    }),

  updateItemQuantity: (itemId, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.id !== itemId)
          : state.items.map((i) =>
              i.id === itemId ? { ...i, quantity } : i
            ),
    })),

  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== itemId),
    })),

  clear: () =>
    set({
      items: [],
    }),

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),
}));
