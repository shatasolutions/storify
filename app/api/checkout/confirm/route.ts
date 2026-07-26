import { NextResponse } from "next/server";
import Stripe from "stripe";
import { AuthError, requireUser } from "@/lib/auth";
import { requireStripeSecret } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logError, logInfo } from "@/lib/logger";

/**
 * Confirms a checkout session server-side before allowing cart clear.
 * Success-page navigation alone is not payment proof.
 */
export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = (await req.json()) as { sessionId?: string };
    const sessionId = body.sessionId?.trim();
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    const stripe = new Stripe(requireStripeSecret(), {
      apiVersion: "2026-03-25.dahlia",
    });
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const owner =
      session.metadata?.user_id || session.client_reference_id || null;
    if (!owner || owner !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed", paymentStatus: session.payment_status },
        { status: 409 }
      );
    }

    const supabase = await createSupabaseServerClient();
    await supabase.from("carts").delete().eq("user_id", user.id);

    logInfo("checkout_confirmed", {
      userId: user.id,
      sessionId,
      paymentStatus: session.payment_status,
    });

    return NextResponse.json({
      confirmed: true,
      sessionId,
      paymentStatus: session.payment_status,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    logError("checkout_confirm_failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ error: "Confirm failed" }, { status: 500 });
  }
}
