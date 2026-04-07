"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity } = useCart();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
        <p className="text-white/70">Loading cart...</p>
      </main>
    );
  }

  const total = items.reduce(
    (sum, item) => sum + item.price * (item.quantity ?? 1),
    0
  );

  return (
    <main className="min-h-screen bg-[#020617] text-white px-6 py-32">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">Your Cart</h1>

        {items.length === 0 ? (
          <p className="text-white/60">Your cart is empty</p>
        ) : (
          <div className="space-y-6">

            {items.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex justify-between items-center bg-white/5 p-4 rounded-xl"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-white/60">
                    ${item.price} × {item.quantity ?? 1}
                  </p>
                </div>

                <div className="flex items-center gap-4">

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, (item.quantity ?? 1) - 1)}
                      className="px-2 py-1 bg-white/10 rounded"
                    >
                      -
                    </button>

                    <span>{item.quantity ?? 1}</span>

                    <button
                      onClick={() => updateQuantity(item.id, (item.quantity ?? 1) + 1)}
                      className="px-2 py-1 bg-white/10 rounded"
                    >
                      +
                    </button>
                  </div>

                  <p>${item.price * (item.quantity ?? 1)}</p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 text-sm"
                  >
                    Remove
                  </button>

                </div>
              </div>
            ))}

            <div className="flex justify-between mt-10 text-xl font-semibold">
              <span>Total</span>
              <span>${total}</span>
            </div>

            <Link
              href="/checkout"
              className="block mt-6 text-center bg-white text-black py-3 rounded-full"
            >
              Checkout
            </Link>

          </div>
        )}

      </div>
    </main>
  );
}