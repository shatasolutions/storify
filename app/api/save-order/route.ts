import { NextResponse } from "next/server";

/**
 * Retired — unauthenticated order insert is forbidden.
 * Orders are created only via verified Stripe webhooks.
 */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Gone. Orders are created by signed Stripe webhooks only.",
    },
    { status: 410 }
  );
}
