# Storify — Security Audit

**Audit date:** 2026-07-24  
**Scope:** Repository code only. No penetration test against a live production project. Secrets were not printed.

---

## Severity summary

| Severity | Count (approx.) |
|----------|-----------------|
| Critical | 5 |
| High | 6 |
| Medium | 6 |
| Low | 4 |
| Informational | 3 |

---

## Critical

### C1 — Unauthenticated Stripe webhook accepts forged events

- **Evidence:** `app/api/webhook/route.ts` does `await req.json()` and trusts `body.type === "checkout.session.completed"`. No `stripe.webhooks.constructEvent`, no `STRIPE_WEBHOOK_SECRET`.
- **Impact:** Attacker can POST fake orders into `orders` and trigger side effects.
- **Status:** Broken / insecure

### C2 — Service-role APIs trust client-supplied `user_id` (IDOR)

- **Evidence:**  
  - `app/api/get-cart/route.ts`  
  - `app/api/save-cart/route.ts`  
  - `app/api/get-orders/route.ts`  
  All use `SUPABASE_SERVICE_ROLE_KEY` and accept `user_id` from query/body without verifying the caller.
- **Impact:** Read/write another user’s cart or orders if table exists and service role is configured.

### C3 — Unauthenticated order insert API

- **Evidence:** `app/api/save-order/route.ts` inserts into `orders` with no auth.
- **Impact:** Spam/fake orders; data pollution.

### C4 — Client-controlled Stripe line item prices

- **Evidence:** `app/api/checkout/route.ts` builds `price_data` from request `items` (`name`, `price`, `quantity`).
- **Impact:** Price manipulation (pay $0.01 for expensive products) if endpoint is reachable.

### C5 — Production build / webhook dependency failure hides broken payment pipeline

- **Evidence:** Missing `nodemailer` prevents `next build`; webhook cannot deploy.
- **Impact:** Cannot ship secure payment completion path as currently written.

---

## High

### H1 — Auth middleware does not enforce auth

- **Evidence:** `middleware.ts` explicitly allows cart/checkout without tokens (“temporary”).
- **Impact:** “Protected routes” are not protected.

### H2 — Session cookie / storage mismatch

- **Evidence:** Middleware and `/api/cart` expect `sb-access-token` cookies; auth page never sets them. Cart sync expects `localStorage.user`; never set.
- **Impact:** False sense of security; broken authenticated cart.

### H3 — Potential secret logging

- **Evidence:** `save-order` logs `{ url, key }` when env missing. Currently logs presence of values in object; dangerous pattern if values are truthy strings.
- **Impact:** Secret leakage via logs.

### H4 — No RLS policies in repository

- **Evidence:** No SQL/RLS files. Even if remote has RLS, service-role APIs bypass it.
- **Impact:** Defense-in-depth missing; hard to audit.

### H5 — Checkout requires login but cart/checkout middleware does not

- **Evidence:** Checkout `handleCheckout` redirects to auth; browsing checkout UI is open; fake card fields collect nothing but train bad habits.

### H6 — Error messages may leak internals

- **Evidence:** Several APIs return `err.message` to clients (`checkout`, cart routes, webhook).
- **Impact:** Information disclosure.

---

## Medium

### M1 — No rate limiting on auth or APIs

### M2 — No CSRF strategy documented for cookie-auth APIs (cookie path unused anyway)

### M3 — Open redirects not heavily present; cancel/success URLs from env — OK if `NEXT_PUBLIC_BASE_URL` controlled

### M4 — XSS: mostly React text interpolation; raw `slug` displayed — generally escaped. `dangerouslySetInnerHTML` not found.

### M5 — No input schema validation library (zod/etc.); ad-hoc checks only

### M6 — npm audit reports 8 high / 1 low vulnerabilities in dependency tree (snapshot at install)

---

## Low

### L1 — Privacy/Terms links are `href="#"`

### L2 — Console logging of login results / checkout raw responses in client

### L3 — Email webhook sends only to `EMAIL_USER` (ops inbox), not customer — privacy/ops smell

### L4 — `Math.random` in render (not security-critical)

---

## Informational

### I1 — Service role **not** shipped to browser via `NEXT_PUBLIC_*` (good)

### I2 — No file upload endpoints found

### I3 — No admin routes to mis-protect (because admin missing)

---

## AuthZ / role model

**Missing entirely.** No role claims, no merchant/admin separation, no RLS role policies in repo. Dashboard is “any logged-in user” in intent, but fetch is broken.

---

## Payment verification checklist

| Control | Present? |
|---------|----------|
| Stripe Checkout Session | Yes (scaffold) |
| Webhook signature verify | **No** |
| Idempotent order write | **No** |
| Server-side price authority | **No** |
| Payment status reconciliation | **No** |
| Refunds | **No** |

---

## Recommended security priority order (for Master Plan)

1. Fix webhook signature verification; remove/guard unauthenticated writes  
2. Replace user_id-from-client with verified session (`@supabase/ssr`)  
3. Server-side price lookup from trusted catalog  
4. Add RLS + stop using service role for user-scoped reads when possible  
5. Enforce middleware/auth redirects properly  
6. Add `.env.example` without secrets; never log keys  
7. Add rate limiting / bot protection for auth later
