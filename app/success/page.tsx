"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const [countdown, setCountdown] = useState(5);
  const [status, setStatus] = useState<"pending" | "confirmed" | "unverified">(
    sessionId ? "pending" : "unverified"
  );

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!sessionId) return;
      try {
        const res = await fetch("/api/checkout/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        if (cancelled) return;
        if (res.ok) {
          clearCart();
          localStorage.removeItem("cart");
          window.dispatchEvent(new Event("cart-cleared"));
          setStatus("confirmed");
        } else {
          setStatus("unverified");
        }
      } catch {
        if (!cancelled) setStatus("unverified");
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [sessionId, clearCart]);

  useEffect(() => {
    if (status !== "confirmed") return;

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [router, status]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#020617] text-white px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold mb-4">
          {status === "confirmed"
            ? "Payment Successful"
            : status === "pending"
              ? "Confirming payment…"
              : "Payment not verified"}
        </h1>
        <p className="text-white/70 mb-6">
          {status === "confirmed"
            ? `Thank you. Payment was verified with Stripe. Final order records are confirmed via webhooks. Redirecting in ${countdown}s.`
            : status === "pending"
              ? "Verifying your Stripe checkout session…"
              : "Open this page from a completed Stripe Checkout session while signed in. Cart is only cleared after server verification."}
        </p>

        <Link
          href="/"
          className="inline-block bg-white text-black px-6 py-3 rounded-full font-medium"
        >
          Go back home
        </Link>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
          Loading...
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
