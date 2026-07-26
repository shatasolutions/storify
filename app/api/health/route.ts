import { NextResponse } from "next/server";

/** Lightweight readiness probe — no secrets, no DB required. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "storify",
    phase: "01",
    time: new Date().toISOString(),
  });
}
