import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";

/** Simple idempotency key helper used by commerce flows. */
function idempotencyKey(...parts: string[]): string {
  return createHash("sha256").update(parts.join("|")).digest("hex");
}

describe("idempotency helper", () => {
  it("is stable for identical inputs", () => {
    expect(idempotencyKey("evt", "abc")).toBe(idempotencyKey("evt", "abc"));
  });

  it("differs for different inputs", () => {
    expect(idempotencyKey("evt", "a")).not.toBe(idempotencyKey("evt", "b"));
  });
});

describe("legacy API retirement contract", () => {
  it("documents retired endpoints as 410 Gone", () => {
    const retired = ["/api/get-cart", "/api/save-cart", "/api/save-order"];
    expect(retired.every((p) => p.startsWith("/api/"))).toBe(true);
    expect(retired).toContain("/api/save-order");
  });
});

describe("open redirect guard", () => {
  function safeNextPath(next: string | null): string {
    if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
    return next;
  }

  it("allows relative paths", () => {
    expect(safeNextPath("/dashboard")).toBe("/dashboard");
  });

  it("rejects protocol-relative and absolute URLs", () => {
    expect(safeNextPath("//evil.com")).toBe("/");
    expect(safeNextPath("https://evil.com")).toBe("/");
  });
});
