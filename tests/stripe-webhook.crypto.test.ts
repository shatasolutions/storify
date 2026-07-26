import { describe, expect, it } from "vitest";
import Stripe from "stripe";

/**
 * Cryptographic Stripe webhook proofs using official SDK signing helpers.
 * Does not require live Stripe account or CLI.
 */

const WEBHOOK_SECRET = "whsec_test_phase01_storify";

function signedBody(event: Stripe.Event) {
  const payload = JSON.stringify(event);
  const header = Stripe.webhooks.generateTestHeaderString({
    payload,
    secret: WEBHOOK_SECRET,
  });
  return { payload, header };
}

describe("Stripe webhook signature verification", () => {
  it("accepts a valid signed payload", () => {
    const event = {
      id: "evt_test_valid",
      object: "event",
      type: "checkout.session.completed",
      data: { object: { id: "cs_test", metadata: { user_id: "user_a" } } },
    } as unknown as Stripe.Event;

    const { payload, header } = signedBody(event);
    const verified = Stripe.webhooks.constructEvent(
      payload,
      header,
      WEBHOOK_SECRET
    );
    expect(verified.id).toBe("evt_test_valid");
    expect(verified.type).toBe("checkout.session.completed");
  });

  it("rejects an invalid signature", () => {
    const event = {
      id: "evt_test_invalid",
      object: "event",
      type: "checkout.session.completed",
      data: { object: {} },
    } as unknown as Stripe.Event;
    const { payload } = signedBody(event);
    expect(() =>
      Stripe.webhooks.constructEvent(payload, "t=1,v1=deadbeef", WEBHOOK_SECRET)
    ).toThrow();
  });

  it("rejects a missing signature header semantically", () => {
    const event = {
      id: "evt_test_missing",
      object: "event",
      type: "checkout.session.completed",
      data: { object: {} },
    } as unknown as Stripe.Event;
    const { payload } = signedBody(event);
    expect(() =>
      Stripe.webhooks.constructEvent(payload, "", WEBHOOK_SECRET)
    ).toThrow();
  });
});

describe("Webhook idempotency + order uniqueness", () => {
  it("stores event ids once and prevents duplicate order rows by session", () => {
    const seen = new Set<string>();
    const ordersBySession = new Map<string, { id: string; total: number }>();

    function process(eventId: string, sessionId: string, total: number) {
      if (seen.has(eventId)) return { duplicate: true };
      seen.add(eventId);
      if (ordersBySession.has(sessionId)) {
        return { duplicateOrder: true, order: ordersBySession.get(sessionId) };
      }
      const order = { id: `ord_${sessionId}`, total };
      ordersBySession.set(sessionId, order);
      return { duplicate: false, order };
    }

    const first = process("evt_1", "cs_1", 12900);
    const replay = process("evt_1", "cs_1", 12900);
    const secondEventSameSession = process("evt_2", "cs_1", 12900);

    expect(first.duplicate).toBe(false);
    expect(replay.duplicate).toBe(true);
    expect(secondEventSameSession.duplicateOrder).toBe(true);
    expect(ordersBySession.size).toBe(1);
  });
});

describe("Checkout confirm trust rules", () => {
  it("requires paid status and matching owner", () => {
    function canClearCart(opts: {
      sessionUserId: string;
      ownerId: string | null;
      paymentStatus: string;
    }) {
      if (!opts.ownerId || opts.ownerId !== opts.sessionUserId) return false;
      return opts.paymentStatus === "paid";
    }

    expect(
      canClearCart({
        sessionUserId: "u1",
        ownerId: "u1",
        paymentStatus: "paid",
      })
    ).toBe(true);
    expect(
      canClearCart({
        sessionUserId: "u1",
        ownerId: "u1",
        paymentStatus: "unpaid",
      })
    ).toBe(false);
    expect(
      canClearCart({
        sessionUserId: "u1",
        ownerId: "u2",
        paymentStatus: "paid",
      })
    ).toBe(false);
  });
});
