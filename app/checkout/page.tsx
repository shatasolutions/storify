"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CheckoutPage() {
  const { items, clearCart, addToCart } = useCart();
  const router = useRouter();

  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan");

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const planDetails: Record<string, { name: string; price: number }> = {
    starter: { name: "Starter", price: 29 },
    pro: { name: "Pro", price: 69 },
    enterprise: { name: "Enterprise", price: 129 },
  };

  const plan = selectedPlan ? planDetails[selectedPlan] : null;
  const selectedPlanKey = selectedPlan ?? null;

  useEffect(() => {
    if (!selectedPlanKey) return;

    const details = planDetails[selectedPlanKey];
    if (!details) return;

    const desiredName = details.name + " Plan";

    // If the same plan is already in cart, do nothing
    const existingPlan = items.find((i) => i.name.includes("Plan"));
    if (existingPlan && existingPlan.name === desiredName) {
      return;
    }

    // Keep non-plan items
    const nonPlanItems = items.filter((i) => !i.name.includes("Plan"));

    // Reset cart ONLY if there was a different plan present
    if (existingPlan) {
      clearCart();
      nonPlanItems.forEach((item) => {
        addToCart({ name: item.name, price: item.price });
      });
    }

    // Add selected plan (once)
    addToCart({ name: desiredName, price: details.price });
  }, [selectedPlanKey]);

  // split items (memoized)
  const planItems = useMemo(
    () => items.filter((item) => item.name.includes("Plan")),
    [items]
  );

  const productItems = useMemo(
    () => items.filter((item) => !item.name.includes("Plan")),
    [items]
  );

  // totals (memoized)
  const subscriptionTotal = useMemo(
    () =>
      planItems.reduce(
        (sum, item) => sum + item.price * (item.quantity ?? 1),
        0
      ),
    [planItems]
  );

  const oneTimeTotal = useMemo(
    () =>
      productItems.reduce(
        (sum, item) => sum + item.price * (item.quantity ?? 1),
        0
      ),
    [productItems]
  );

  const total = subscriptionTotal + oneTimeTotal;

  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    try {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user) {
        alert("You must be logged in");
        router.push("/auth");
        return;
      }

      localStorage.setItem("checkout_cart", JSON.stringify(items));

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items, user_id: user.id }),
      });

      const text = await response.text();
      console.log("RAW RESPONSE:", text);

      if (!response.ok) {
        console.error("Checkout API Error:", text);
        alert(`Checkout failed: ${text}`);
        throw new Error("Checkout failed");
      }

      const responseData = JSON.parse(text);
      console.log("SUCCESS:", responseData);

      // If Stripe URL exists → redirect
      if (responseData.url) {
        window.location.href = responseData.url;
        return;
      }

      // Otherwise show success (your current API)
      alert("Order placed successfully ✅");

    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed ❌");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white px-6 py-32">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">

        {/* LEFT - FORM */}
        <div>
          <h1 className="text-3xl font-semibold mb-6">Checkout</h1>

          <div className="space-y-4">
            <input placeholder="Full Name" className="w-full p-3 rounded-lg bg-white/10 outline-none" />
            <input placeholder="Email" className="w-full p-3 rounded-lg bg-white/10 outline-none" />
            <input placeholder="Card Number" className="w-full p-3 rounded-lg bg-white/10 outline-none" />

            <div className="flex gap-4">
              <input placeholder="MM/YY" className="w-full p-3 rounded-lg bg-white/10 outline-none" />
              <input placeholder="CVC" className="w-full p-3 rounded-lg bg-white/10 outline-none" />
            </div>
          </div>
        </div>

        {/* RIGHT - SUMMARY */}
        <div className="bg-white/5 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {/* Subscription */}
          {planItems.length > 0 && (
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wide text-white/50 mb-2">Subscription</p>
              <div className="space-y-3">
                {mounted && planItems.map((item, index) => (
                  <div key={`plan-${index}`} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity ?? 1}</span>
                    <span>${item.price * (item.quantity ?? 1)} / mo</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* One-time products */}
          {productItems.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wide text-white/50 mb-2">One-time</p>
              <div className="space-y-3">
                {mounted && productItems.map((item, index) => (
                  <div key={`prod-${index}`} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity ?? 1}</span>
                    <span>${item.price * (item.quantity ?? 1)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-white/10 pt-4 space-y-3">

            {/* Due today */}
            <div className="flex justify-between text-sm">
              <span>Due today</span>
              <span className="font-medium">
                {mounted ? `$${oneTimeTotal}` : "$0"}
              </span>
            </div>

            {/* Subscription */}
            {subscriptionTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span>Subscription (monthly)</span>
                <span className="font-medium">
                  {mounted ? `$${subscriptionTotal}` : "$0"} / mo
                </span>
              </div>
            )}

            {/* Grand total (optional visual emphasis) */}
            <div className="flex justify-between text-base font-semibold pt-3 border-t border-white/10">
              <span>Total</span>
              <span>{mounted ? `$${total}` : "$0"}</span>
            </div>

          </div>

          <button
            onClick={handleCheckout}
            className="mt-6 w-full bg-white text-black py-3 rounded-full font-medium"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>

      </div>
    </main>
  );
}