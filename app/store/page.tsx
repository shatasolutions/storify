"use client";

import { useState } from "react";
import { products } from "@/lib/products";
import Link from "next/link";

export default function StorePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || p.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[#020617] text-white px-6 py-32">
      <div className="max-w-6xl mx-auto">

        {/* 🔍 Search */}
        <input
          type="text"
          placeholder="Search products..."
          className="w-full mb-6 p-3 rounded-xl bg-white/5 border border-white/10 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* 🎯 Filters */}
        <div className="flex gap-3 mb-8">
          {["all", "build", "sell", "marketing", "payments"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full border ${
                category === cat
                  ? "bg-white text-black"
                  : "border-white/20 text-white/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 🧱 Products */}
        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              <h3 className="text-lg font-semibold">
                {product.name}
              </h3>
              <p className="text-white/60 mt-2">
                ${product.price}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}