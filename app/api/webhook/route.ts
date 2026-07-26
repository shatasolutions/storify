import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireStripeSecret, requireStripeWebhookSecret } from "@/lib/env";
import { logError, logInfo, logWarn } from "@/lib/logger";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripe = new Stripe(requireStripeSecret(), {
    apiVersion: "2026-03-25.dahlia",
  });

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      requireStripeWebhookSecret()
    );
  } catch (err) {
    logWarn("webhook_signature_invalid", {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  // Idempotency: skip if event already processed
  const { data: existing } = await admin
    .from("stripe_events")
    .select("id")
    .eq("id", event.id)
    .maybeSingle();

  if (existing) {
    logInfo("webhook_duplicate_ignored", { eventId: event.id, type: event.type });
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id || session.client_reference_id;
    if (!userId) {
      logError("webhook_missing_user", { sessionId: session.id, eventId: event.id });
      return NextResponse.json({ error: "Missing user" }, { status: 400 });
    }

    let items: unknown[] = [];
    try {
      items = session.metadata?.order_lines
        ? JSON.parse(session.metadata.order_lines)
        : [];
    } catch {
      items = [];
    }

    const totalMinor =
      Number(session.metadata?.total_minor) ||
      (typeof session.amount_total === "number" ? session.amount_total : 0);
    const currency =
      session.metadata?.currency || session.currency || "usd";

    // Insert event first to claim idempotency key
    const { error: eventError } = await admin.from("stripe_events").insert({
      id: event.id,
      type: event.type,
      payload: { session_id: session.id },
    });

    if (eventError) {
      // Unique violation = already processed
      if (eventError.code === "23505") {
        return NextResponse.json({ received: true, duplicate: true });
      }
      logError("webhook_event_insert_failed", { error: eventError.message });
      return NextResponse.json({ error: "Event persist failed" }, { status: 500 });
    }

    // Upsert order by stripe_session_id
    const { error: orderError } = await admin.from("orders").upsert(
      {
        user_id: userId,
        items,
        total_minor: totalMinor,
        currency,
        status: "paid",
        stripe_session_id: session.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "stripe_session_id" }
    );

    if (orderError) {
      logError("webhook_order_upsert_failed", {
        error: orderError.message,
        sessionId: session.id,
      });
      return NextResponse.json({ error: "Order persist failed" }, { status: 500 });
    }

    await admin.from("carts").delete().eq("user_id", userId);

    logInfo("webhook_order_paid", {
      eventId: event.id,
      sessionId: session.id,
      userId,
      totalMinor,
    });
  } else {
    // Record ignored event types for audit without side effects
    await admin.from("stripe_events").upsert({
      id: event.id,
      type: event.type,
      payload: {},
    });
    logInfo("webhook_event_ignored", { eventId: event.id, type: event.type });
  }

  return NextResponse.json({ received: true });
}
