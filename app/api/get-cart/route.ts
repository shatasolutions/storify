import { NextResponse } from "next/server";

/** Retired — use GET/POST /api/cart with session auth. */
export async function GET() {
  return NextResponse.json(
    { error: "Gone. Use GET /api/cart" },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "Gone. Use POST /api/cart" },
    { status: 410 }
  );
}
