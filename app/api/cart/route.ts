import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logError } from "@/lib/logger";

const cartItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  quantity: z.number().int().min(1).max(99),
});

const saveSchema = z.object({
  items: z.array(cartItemSchema),
});

export async function GET() {
  try {
    const user = await requireUser();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("carts")
      .select("items")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      logError("cart_get_failed", { error: error.message, userId: user.id });
      return NextResponse.json({ error: "Failed to load cart" }, { status: 500 });
    }

    return NextResponse.json({ items: data?.items ?? [] });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    logError("cart_get_exception", { error: String(err) });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = saveSchema.parse(await req.json());
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.from("carts").upsert(
      {
        user_id: user.id,
        items: body.items,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) {
      logError("cart_save_failed", { error: error.message, userId: user.id });
      return NextResponse.json({ error: "Failed to save cart" }, { status: 500 });
    }

    return NextResponse.json({ success: true, items: body.items });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid cart payload" }, { status: 400 });
    }
    logError("cart_save_exception", { error: String(err) });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await requireUser();
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("carts").delete().eq("user_id", user.id);
    if (error) {
      return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
