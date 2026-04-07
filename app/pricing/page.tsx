"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const router = useRouter();

  const plans = [
    {
      name: "Starter",
      price: yearly ? 19 : 29,
      desc: "For individuals getting started",
      features: ["1 Store", "Basic Analytics", "Email Support"],
    },
    {
      name: "Pro",
      price: yearly ? 49 : 69,
      desc: "For growing businesses",
      features: ["5 Stores", "Advanced Analytics", "Priority Support"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: yearly ? 99 : 129,
      desc: "For large scale operations",
      features: ["Unlimited Stores", "AI Automation", "Dedicated Manager"],
    },
  ];

  return (
    <main className="min-h-screen bg-[#020617] text-white px-6 py-32">
      <div className="max-w-6xl mx-auto text-center">

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-white/60 mb-10">
          Choose the plan that fits your business
        </p>
        <p className="text-white/50 max-w-xl mx-auto">
          One subscription. Access all tools. Scale your business without limits.
        </p>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <button
            onClick={() => setYearly(!yearly)}
            className="px-4 py-2 rounded-full border border-white/20 text-sm"
          >
            {yearly ? "Yearly (save 20%)" : "Monthly"}
          </button>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 border transition-all duration-300 hover:scale-[1.02] ${
                plan.popular
                  ? "border-cyan-400 bg-white/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              {plan.popular && (
                <span className="absolute top-4 right-4 text-xs bg-cyan-400 text-black px-3 py-1 rounded-full font-semibold">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-semibold mt-4">
                {plan.name}
              </h3>

              <p className="text-white/60 text-sm mt-2">
                {plan.desc}
              </p>

              <div className="text-5xl font-bold mt-8">
                ${plan.price}
                <span className="text-sm text-white/60">
                  /{yearly ? "yr" : "mo"}
                </span>
              </div>

              <div className="w-full h-px bg-white/10 my-6" />

              <ul className="space-y-3 text-sm text-white/70">
                {plan.features.map((f) => (
                  <li key={f}>✔ {f}</li>
                ))}
              </ul>

              <button
                onClick={() => router.push(`/checkout?plan=${plan.name.toLowerCase()}`)}
                className="mt-8 w-full bg-white text-black py-3 rounded-full font-semibold hover:scale-105 transition duration-300"
              >
                Start Subscription
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 text-left">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Everything included
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-white/70 text-sm">
            <div>✔ AI Automation Tools</div>
            <div>✔ Marketing System</div>
            <div>✔ Payment Processing</div>
            <div>✔ Analytics Dashboard</div>
            <div>✔ Unlimited Products</div>
            <div>✔ 24/7 Support</div>
          </div>
        </div>

      </div>
    </main>
  );
}