"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        const user = session?.user;

        if (!user) {
          router.push("/auth");
          return;
        }

        const res = await fetch("/api/get-orders", {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.log("Failed to fetch orders:", errorText);
          setOrders([]);
          return;
        }

        const responseData = await res.json();
        setOrders(responseData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [router]);

  return (
    <main className="min-h-screen bg-[#020617] text-white p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white/5 p-4 rounded-xl">
              <p>{order.created_at}</p>
              <p>Total: ${order.total}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}