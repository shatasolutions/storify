"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Order = {
  id: string;
  created_at: string;
  total_minor: number;
  currency: string;
  status: string;
};

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (!data.session?.user) {
          router.push("/auth?next=/dashboard");
          return;
        }

        const res = await fetch("/api/get-orders");
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setError(body.error || "Failed to load orders");
          setOrders([]);
          return;
        }

        const responseData = await res.json();
        setOrders(responseData.orders || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [router]);

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white p-6 pt-32">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm rounded-full border border-white/10 px-4 py-2"
          >
            Log out
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : orders.length === 0 ? (
          <p>
            No orders yet.{" "}
            <Link href="/store" className="text-cyan-300 underline">
              Browse the store
            </Link>
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white/5 p-4 rounded-xl">
                <p className="text-white/60 text-sm">{order.created_at}</p>
                <p className="capitalize">Status: {order.status}</p>
                <p>
                  Total: {(order.total_minor / 100).toFixed(2)}{" "}
                  {order.currency?.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
