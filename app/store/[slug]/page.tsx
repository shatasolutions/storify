"use client";

import { getProduct } from "@/lib/catalog";
import { useCart } from "@/context/CartContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const { addToCart } = useCart();
  const product = getProduct(slug);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product not found</h1>
          <Link href="/store" className="text-cyan-300">
            Back to Store
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white px-6 py-32">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        <div className="bg-white/5 rounded-2xl h-[400px] flex items-center justify-center text-white/40">
          Product Image
        </div>

        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-white/60 mb-4"
          >
            ← Back
          </button>

          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-white/60 mb-6">
            {product.description ||
              "Premium commerce capability for your store."}
          </p>
          <p className="text-2xl font-semibold mb-8">${product.priceMajor}</p>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.priceMajor,
                })
              }
              className="bg-white text-black px-6 py-3 rounded-full font-medium"
            >
              Add to Cart
            </button>
            <Link
              href="/cart"
              className="px-6 py-3 border border-white/20 rounded-full"
            >
              Go to Cart
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
