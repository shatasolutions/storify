

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { user_id, items } = await req.json();

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from("cart")
      .upsert(
        [{ user_id, items, updated_at: new Date().toISOString() }],
        { onConflict: "user_id" }
      );

    if (error) {
      console.error("Save cart error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Save cart exception:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}