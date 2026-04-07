

"use client";

import { products } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === slug);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product not found</h1>
          <Link href="/store" className="text-blue-400">Back to Store</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white px-6 py-32">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">

        {/* LEFT - IMAGE */}
        <div className="bg-white/5 rounded-2xl h-[400px] flex items-center justify-center text-white/40">
          Product Image
        </div>

        {/* RIGHT - DETAILS */}
        <div>
          <button
            onClick={() => router.back()}
            className="text-sm text-white/60 mb-4"
          >
            ← Back
          </button>

          <h1 className="text-4xl font-bold mb-4">
            {product.name}
          </h1>

          <p className="text-white/60 mb-6">
            {product.description}
          </p>

          <p className="text-2xl font-semibold mb-8">
            ${product.price}
          </p>

          <div className="flex gap-4">
            <button
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
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

          {/* EXTRA SECTION */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-3">What you get</h3>
            <ul className="text-white/60 space-y-2 text-sm">
              <li>✔ Full automation system</li>
              <li>✔ Scalable architecture</li>
              <li>✔ Lifetime updates</li>
            </ul>
          </div>

        </div>

      </div>
    </main>
  );
}