import { NextResponse } from "next/server";
import { AuthError, requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logError } from "@/lib/logger";

export async function GET() {
  try {
    const user = await requireUser();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("orders")
      .select("id, items, total_minor, currency, status, created_at, stripe_session_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      logError("orders_list_failed", { error: error.message, userId: user.id });
      return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
    }

    return NextResponse.json({ orders: data ?? [] });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
