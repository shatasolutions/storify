"use client";

import { useCart } from "@/context/CartContext";
import { Suspense, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function useIsClient() {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
          <p className="text-white/70">Loading checkout...</p>
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const { items, clearCart, addToCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan");
  const mounted = useIsClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedPlan) return;
    const planId = selectedPlan.toLowerCase();
    if (!["starter", "pro", "enterprise"].includes(planId)) return;

    const desiredId = `plan-${planId}`;
    const existingPlan = items.find((i) => i.id.startsWith("plan-"));
    if (existingPlan?.id === desiredId) return;

    const nonPlanItems = items.filter((i) => !i.id.startsWith("plan-"));
    if (existingPlan) {
      clearCart();
      nonPlanItems.forEach((item) =>
        addToCart({ id: item.id, name: item.name, price: item.price })
      );
    }

    const labels: Record<string, { name: string; price: number }> = {
      starter: { name: "Starter Plan", price: 29 },
      pro: { name: "Pro Plan", price: 69 },
      enterprise: { name: "Enterprise Plan", price: 129 },
    };
    const details = labels[planId]!;
    addToCart({ id: desiredId, name: details.name, price: details.price });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional one-shot plan sync
  }, [selectedPlan]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0),
    [items]
  );

  async function handleCheckout() {
    try {
      setLoading(true);
      setError(null);
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      if (!data.session?.user) {
        router.push("/auth?next=/checkout");
        return;
      }

      const lines = items.map((item) => ({
        id: item.id,
        quantity: item.quantity ?? 1,
        kind: item.id.startsWith("plan-")
          ? ("plan" as const)
          : ("product" as const),
      }));

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Checkout failed");
      }

      if (payload.url) {
        window.location.href = payload.url;
        return;
      }
      throw new Error("Missing Stripe checkout URL");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#020617] text-white px-6 py-32">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-2">Checkout</h1>
        <p className="text-white/60 mb-8">
          You will complete payment securely on Stripe. Card details are never
          collected on this page.
        </p>

        <div className="bg-white/5 p-6 rounded-2xl space-y-3">
          {items.length === 0 ? (
            <p className="text-white/60">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity ?? 1}
                </span>
                <span>${item.price * (item.quantity ?? 1)}</span>
              </div>
            ))
          )}

          <div className="flex justify-between text-base font-semibold pt-3 border-t border-white/10">
            <span>Estimated total</span>
            <span>${total}</span>
          </div>
          <p className="text-xs text-white/45">
            Final amount is calculated on the server from the product catalog.
          </p>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="button"
            disabled={loading || items.length === 0}
            onClick={handleCheckout}
            className="mt-4 w-full bg-white text-black py-3 rounded-full font-medium disabled:opacity-50"
          >
            {loading ? "Redirecting..." : "Continue to Stripe"}
          </button>
        </div>
      </div>
    </main>
  );
}
