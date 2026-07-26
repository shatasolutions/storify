import { NextResponse } from "next/server";

/** Retired — use POST /api/cart with session auth. */
export async function POST() {
  return NextResponse.json(
    { error: "Gone. Use POST /api/cart" },
    { status: 410 }
  );
}
