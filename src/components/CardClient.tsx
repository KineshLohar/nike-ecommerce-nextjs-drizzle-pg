"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/src/store/cart";
import {
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart,
} from "@/src/lib/actions/cart";
import { isAuthenticated } from "../lib/auth/utils";

export default function CartClient() {
    const {
        items,
        isLoading,
        setItems,
        setLoading,
    } = useCartStore();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    /* ----------------------------------------
     * Hydrate cart on first load
     * -------------------------------------- */

    useEffect(() => {
        const checkLogin = async () => {
            const isLoggedIn = await isAuthenticated();
            setIsLoggedIn(isLoggedIn)
        };
        checkLogin()
    }, [])

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const data = await getCart();
                setItems(data);
            } finally {
                setLoading(false);
            }
        })();
    }, [setItems, setLoading]);

    if (!isLoading && items.length === 0) {
        return (
            <EmptyCart />
        );
    }

    const subtotal = items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
    );

    const onQuantityChange = async (itemId: string, qty: number) => {
        useCartStore.getState().setLoading(true);

        const updated = await updateCartItem(itemId, qty);

        useCartStore.getState().setItems(updated);

        useCartStore.getState().setLoading(false);
    };

    const onRemove = async (itemId: string) => {
        const updated = await removeCartItem(itemId);
        useCartStore.getState().setItems(updated);
    };


    return (
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
            {/* ---------------- Items ---------------- */}
            <div className="space-y-6">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex gap-4 rounded-lg border border-light-300 p-4"
                    >
                        <div className="relative h-24 w-24 overflow-hidden rounded-md bg-light-200">
                            <Image
                                src={item.imageUrl || "/shoes/shoe-1.jpg"}
                                alt={item.productName}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex flex-1 flex-col justify-between">
                            <div>
                                <h3 className="text-body-medium text-dark-900">
                                    {item.productName}
                                </h3>
                                <p className="text-caption text-dark-700">
                                    {item.color} · {item.size}
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                {/* Quantity */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            onQuantityChange(item.id, item.quantity - 1)
                                        }
                                        // disabled={item.quantity <= 1}
                                        className="rounded border border-light-300 p-1"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>

                                    <span className="w-6 text-center text-body">
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            onQuantityChange(item.id, item.quantity + 1)
                                        }
                                        className="rounded border border-light-300 p-1"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Price + remove */}
                                <div className="flex items-center gap-4">
                                    <span className="text-body-medium text-dark-900">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </span>

                                    <button
                                        onClick={() => onRemove(item.id)}
                                        className="text-dark-700 hover:text-dark-900"
                                        aria-label="Remove item"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {items.length > 0 && (
                    <button
                        onClick={() => clearCart()}
                        className="text-caption text-dark-700 underline"
                    >
                        Clear cart
                    </button>
                )}
            </div>

            {/* ---------------- Summary ---------------- */}
            <aside className="h-fit rounded-lg border border-light-300 p-6">
                <h2 className="mb-4 text-body-medium text-dark-900">
                    Order Summary
                </h2>

                <div className="flex justify-between text-body">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="mt-6 space-y-3">
                    <Link
                        href={isLoggedIn ? `/checkout` : '/sign-in'}
                        className="flex w-full items-center justify-center gap-2 rounded-md bg-dark-900 px-4 py-3 text-light-100 transition hover:bg-dark-800"
                    >
                        <ShoppingBag className="h-5 w-5" />
                        Checkout
                    </Link>

                    <Link
                        href="/products"
                        className="block text-center text-caption text-dark-700 underline"
                    >
                        Continue shopping
                    </Link>
                </div>
            </aside>
        </section>
    );
}

function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-light-300 p-12 text-center">
            <ShoppingBag className="h-10 w-10 text-dark-700" />
            <p className="text-body text-dark-700">
                Your cart is empty.
            </p>
            <Link
                href="/products"
                className="rounded-md bg-dark-900 px-4 py-2 text-light-100"
            >
                Start shopping
            </Link>
        </div>
    );
}
