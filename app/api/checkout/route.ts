import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { AuthError, requireUser } from "@/lib/auth";
import { priceCheckoutLines } from "@/lib/catalog";
import { getBaseUrl, requireStripeSecret } from "@/lib/env";
import { logError, logInfo } from "@/lib/logger";

const bodySchema = z.object({
  lines: z
    .array(
      z.object({
        id: z.string().min(1),
        quantity: z.number().int().min(1).max(99),
        kind: z.enum(["product", "plan"]).optional(),
      })
    )
    .min(1),
});

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const parsed = bodySchema.parse(await req.json());
    const priced = priceCheckoutLines(parsed.lines);

    const stripe = new Stripe(requireStripeSecret(), {
      apiVersion: "2026-03-25.dahlia",
    });

    const baseUrl = getBaseUrl();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        order_lines: JSON.stringify(
          priced.lines.map((l) => ({
            id: l.id,
            name: l.name,
            quantity: l.quantity,
            unit_amount_minor: l.unitAmountMinor,
            currency: l.currency,
            kind: l.kind,
          }))
        ),
        total_minor: String(priced.totalMinor),
        currency: priced.currency,
      },
      line_items: priced.lines.map((line) => ({
        quantity: line.quantity,
        price_data: {
          currency: line.currency,
          unit_amount: line.unitAmountMinor,
          product_data: { name: line.name },
        },
      })),
    });

    logInfo("checkout_session_created", {
      userId: user.id,
      sessionId: session.id,
      totalMinor: priced.totalMinor,
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      totalMinor: priced.totalMinor,
      currency: priced.currency,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Server error";
    logError("checkout_failed", { error: message });
    const status =
      /Unknown product|Unknown plan|Invalid quantity|Mixed currencies|No line/i.test(
        message
      )
        ? 400
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
