"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // 🧹 Clear cart from localStorage
    localStorage.removeItem("cart");

    // optional: notify app
    window.dispatchEvent(new Event("cart-cleared"));

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
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#020617] text-white px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold mb-4">🎉 Payment Successful</h1>
        <p className="text-white/70 mb-6">
          Thank you for your purchase. Your order has been processed successfully. You will be redirected in {countdown} seconds.
        </p>

        <a
          href="/"
          className="inline-block bg-white text-black px-6 py-3 rounded-full font-medium"
        >
          Go back home
        </a>
      </div>
    </main>
  );
}