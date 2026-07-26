import { describe, expect, it, vi, beforeEach } from "vitest";

/**
 * Route-level webhook behavior with mocked admin client.
 * Signature validity is proven in stripe-webhook.crypto.test.ts;
 * this suite proves HTTP outcomes for invalid signature and idempotent duplicates.
 */

const insertCalls: unknown[] = [];
const upsertCalls: unknown[] = [];

vi.mock("@/lib/env", () => ({
  requireStripeSecret: () => "sk_test_dummy",
  requireStripeWebhookSecret: () => "whsec_test_phase01_storify",
}));

vi.mock("@/lib/logger", () => ({
  logInfo: vi.fn(),
  logWarn: vi.fn(),
  logError: vi.fn(),
}));

const existingIds = new Set<string>();

vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: () => ({
    from: (table: string) => ({
      select: () => ({
        eq: (_col: string, id: string) => ({
          maybeSingle: async () => ({
            data: existingIds.has(id) ? { id } : null,
            error: null,
          }),
        }),
      }),
      insert: async (row: { id: string }) => {
        insertCalls.push({ table, row });
        if (existingIds.has(row.id)) {
          return { error: { code: "23505", message: "duplicate" } };
        }
        existingIds.add(row.id);
        return { error: null };
      },
      upsert: async (row: unknown, opts?: unknown) => {
        upsertCalls.push({ table, row, opts });
        return { error: null };
      },
      delete: () => ({
        eq: async () => ({ error: null }),
      }),
    }),
  }),
}));

vi.mock("stripe", () => {
  class StripeMock {
    webhooks = {
      constructEvent: (raw: string, sig: string, secret: string) => {
        if (!sig || sig === "bad") {
          throw new Error("Invalid signature");
        }
        if (secret !== "whsec_test_phase01_storify") {
          throw new Error("bad secret");
        }
        return JSON.parse(raw);
      },
    };
  }
  return { default: StripeMock };
});

describe("POST /api/webhook route", () => {
  beforeEach(() => {
    insertCalls.length = 0;
    upsertCalls.length = 0;
    existingIds.clear();
    vi.resetModules();
  });

  it("rejects missing signature", async () => {
    const { POST } = await import("@/app/api/webhook/route");
    const res = await POST(
      new Request("http://localhost/api/webhook", {
        method: "POST",
        body: "{}",
      })
    );
    expect(res.status).toBe(400);
  });

  it("rejects invalid signature", async () => {
    const { POST } = await import("@/app/api/webhook/route");
    const res = await POST(
      new Request("http://localhost/api/webhook", {
        method: "POST",
        headers: { "stripe-signature": "bad" },
        body: JSON.stringify({ id: "evt_x", type: "checkout.session.completed", data: { object: {} } }),
      })
    );
    expect(res.status).toBe(400);
  });

  it("processes valid event and ignores replay", async () => {
    const { POST } = await import("@/app/api/webhook/route");
    const body = JSON.stringify({
      id: "evt_ok_1",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_ok_1",
          metadata: {
            user_id: "user-a",
            order_lines: "[]",
            total_minor: "12900",
            currency: "usd",
          },
          amount_total: 12900,
          currency: "usd",
        },
      },
    });

    const first = await POST(
      new Request("http://localhost/api/webhook", {
        method: "POST",
        headers: { "stripe-signature": "t=1,v1=ok" },
        body,
      })
    );
    expect(first.status).toBe(200);
    const firstJson = await first.json();
    expect(firstJson.received).toBe(true);

    const replay = await POST(
      new Request("http://localhost/api/webhook", {
        method: "POST",
        headers: { "stripe-signature": "t=1,v1=ok" },
        body,
      })
    );
    expect(replay.status).toBe(200);
    const replayJson = await replay.json();
    expect(replayJson.duplicate).toBe(true);
  });
});
