import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "..");

function read(rel: string) {
  return readFileSync(path.join(root, rel), "utf8");
}

describe("Phase 01 security source contracts", () => {
  it("webhook verifies Stripe signatures", () => {
    const src = read("app/api/webhook/route.ts");
    expect(src).toContain("constructEvent");
    expect(src).toContain("stripe-signature");
    expect(src).toContain("stripe_events");
  });

  it("checkout prices from catalog not client amounts", () => {
    const src = read("app/api/checkout/route.ts");
    expect(src).toContain("priceCheckoutLines");
    expect(src).not.toMatch(/unit_amount:\s*body/);
    expect(src).toContain("requireUser");
  });

  it("cart API derives identity from session", () => {
    const src = read("app/api/cart/route.ts");
    expect(src).toContain("requireUser");
    expect(src).not.toMatch(/user_id.*body/);
  });

  it("save-order is retired", () => {
    const src = read("app/api/save-order/route.ts");
    expect(src).toMatch(/410/);
  });

  it("admin client is server-only", () => {
    const src = read("lib/supabase/admin.ts");
    expect(src).toContain("server-only");
  });

  it("migration enables RLS on carts and orders", () => {
    const sql = read("supabase/migrations/202607260001_phase01_baseline.sql");
    expect(sql).toContain("enable row level security");
    expect(sql).toContain("carts_select_own");
    expect(sql).toContain("orders_select_own");
    expect(sql).toContain("stripe_events_deny_all");
  });
});
