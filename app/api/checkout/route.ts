import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, user_id } = body;

    // ✅ Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }
    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    // ✅ Build line items safely
    const line_items = items.map((item: any) => {
      if (!item.name || !item.price) {
        throw new Error("Invalid item data");
      }

      return {
        price_data: {
          currency: item.currency?.toLowerCase() || "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity ?? 1,
      };
    });

    // ✅ Use environment-based URLs (production safe)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",

      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/checkout`,

      // ✅ Add metadata (very important for production)
      metadata: {
        order_items: JSON.stringify(items),
        user_id: user_id,
      },
    });

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error("CHECKOUT ERROR:", err);

    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}