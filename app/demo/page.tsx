"use client";

import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { getProduct } from "@/lib/catalog";

export default function DemoPage() {
  const { addToCart } = useCart();
  const product = getProduct("ai-commerce-engine")!;

  return (
    <main className="min-h-screen bg-[#020617] text-white px-6 py-32">
      <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-2">
        <div className="flex h-[400px] items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20">
          <span className="text-5xl font-bold text-white/70">AI</span>
        </div>

        <div>
          <h1 className="text-4xl font-semibold">{product.name}</h1>
          <p className="mt-4 leading-7 text-white/60">{product.description}</p>
          <div className="mt-6 text-2xl font-bold">${product.priceMajor}</div>

          <motion.button
            type="button"
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: product.priceMajor,
              })
            }
            whileTap={{ scale: 0.95 }}
            className="mt-8 w-full rounded-full bg-white text-black py-3 font-medium hover:scale-105 transition"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </main>
  );
}
