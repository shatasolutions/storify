

"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProductPage() {
  const { slug } = useParams();

  return (
    <main className="min-h-screen bg-[#020617] text-white px-6 py-32">
      <div className="max-w-5xl mx-auto">

        <Link href="/" className="text-white/60 text-sm mb-6 block">
          ← Back
        </Link>

        <h1 className="text-4xl font-bold mb-4 capitalize">
          {slug?.toString().replace(/-/g, " ")}
        </h1>

        <p className="text-white/60 mb-8">
          This is your dynamic product page. We’ll connect real data next.
        </p>

        <div className="bg-white/5 p-6 rounded-2xl">
          <p className="text-lg">Product slug:</p>
          <p className="text-cyan-400">{slug}</p>
        </div>

      </div>
    </main>
  );
}