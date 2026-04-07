import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.type === "checkout.session.completed") {
      const session = body.data.object;
      const items = session.metadata?.order_items
        ? JSON.parse(session.metadata.order_items)
        : [];

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { error } = await supabase.from("orders").insert([
        {
          items,
          total: session.amount_total ? session.amount_total / 100 : 0,
          user_id: session.metadata?.user_id || null,
        },
      ]);

      if (error) {
        console.error("DB ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log("Order saved from webhook ✅");

      // 🧹 Clear user's cart from database
      try {
        if (session?.metadata?.user_id) {
          await supabase
            .from("cart")
            .delete()
            .eq("user_id", session.metadata.user_id);

          console.log("Cart cleared from DB ✅");
        }
      } catch (clearErr) {
        console.error("Cart clear error:", clearErr);
      }

      // 📧 Send email
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: "🧾 New Order Received",
          html: `
            <h2>New Order</h2>
            <p><strong>Total:</strong> $${session.amount_total / 100}</p>
            <pre>${JSON.stringify(items, null, 2)}</pre>
          `,
        });

        console.log("Email sent ✅");
      } catch (emailErr) {
        console.error("Email error:", emailErr);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error FULL:", err);
    return NextResponse.json({ error: err?.message || "Webhook error" }, { status: 500 });
  }
}