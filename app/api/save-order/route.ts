export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";


export async function POST(req: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      console.error("Missing Supabase env vars", { url, key });
      return NextResponse.json({ error: "Server config error" }, { status: 500 });
    }

    const supabase = createClient(url, key);
    const body = await req.json();
    const { items, total } = body;
    console.log("SAVE ORDER BODY:", body);

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    const finalTotal =
      typeof total === "number"
        ? total
        : items.reduce(
            (sum: number, item: any) => sum + item.price * (item.quantity || 1),
            0
          );

    const { data, error } = await supabase.from("orders").insert([
      {
        items,
        total: finalTotal,
      },
    ]);

    console.log("SUPABASE INSERT DATA:", data);
    console.log("SUPABASE INSERT ERROR:", error);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("SAVE ORDER FATAL ERROR:", err);
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}