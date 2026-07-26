import { describe, expect, it } from "vitest";
import { cartReducer } from "@/context/CartContext";
import { priceCheckoutLines } from "@/lib/catalog";
import { lineTotalMinor, toMinorUnits } from "@/lib/money";

describe("cartReducer", () => {
  it("merges duplicate ids by increasing quantity", () => {
    const state = cartReducer([], {
      type: "ADD",
      payload: { id: "a", name: "A", price: 10 },
    });
    const next = cartReducer(state, {
      type: "ADD",
      payload: { id: "a", name: "A", price: 10 },
    });
    expect(next).toEqual([{ id: "a", name: "A", price: 10, quantity: 2 }]);
  });

  it("clears cart", () => {
    const state = [
      { id: "a", name: "A", price: 10, quantity: 1 },
    ];
    expect(cartReducer(state, { type: "CLEAR" })).toEqual([]);
  });
});

describe("money", () => {
  it("converts major to minor units", () => {
    expect(toMinorUnits(12.34)).toEqual({ amountMinor: 1234, currency: "usd" });
  });

  it("computes line totals", () => {
    expect(lineTotalMinor(12900, 2)).toBe(25800);
  });
});

describe("priceCheckoutLines", () => {
  it("prices products from authoritative catalog", () => {
    const result = priceCheckoutLines([
      { id: "ai-commerce-engine", quantity: 2 },
    ]);
    expect(result.totalMinor).toBe(12900 * 2);
    expect(result.lines[0]?.unitAmountMinor).toBe(12900);
  });

  it("rejects unknown products (price tamper / invalid id)", () => {
    expect(() =>
      priceCheckoutLines([{ id: "fake-sku", quantity: 1 }])
    ).toThrow(/Unknown product/);
  });

  it("rejects invalid plan ids", () => {
    expect(() =>
      priceCheckoutLines([{ id: "plan-nope", quantity: 1, kind: "plan" }])
    ).toThrow(/Unknown plan/);
  });

  it("prices known plans", () => {
    const result = priceCheckoutLines([
      { id: "plan-pro", quantity: 1, kind: "plan" },
    ]);
    expect(result.totalMinor).toBe(6900);
  });
});
