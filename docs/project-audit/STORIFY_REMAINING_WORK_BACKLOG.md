# Storify — Remaining Work Backlog

**Audit date:** 2026-07-24  
**Source of truth:** Repository evidence from this audit.  
**Do not treat as implementation permission** — use for Master Plan prioritization.

Complexity: S (<0.5d) | M (1–3d) | L (1–2w) | XL (multi-week)  
Risk: Low | Medium | High | Critical

---

## P0 — Critical blockers

### P0-1 Fix production build (nodemailer)

- **Problem:** `next build` fails; webhook cannot compile.
- **Evidence:** `app/api/webhook/route.ts` imports `nodemailer`; not in `package.json`.
- **Recommended solution:** Either add `nodemailer` + types, or remove email from webhook and use a later email provider.
- **Dependencies:** None
- **Acceptance criteria:** `npm run build` succeeds on clean install.
- **Complexity:** S  
- **Risk:** Critical (blocks deploy)  
- **Related files:** `app/api/webhook/route.ts`, `package.json`

### P0-2 Add documented environment contract

- **Problem:** No `.env.example`; missing env crashes auth/checkout/dashboard at module init.
- **Evidence:** Smoke test 500 `supabaseUrl is required`; no env files in repo.
- **Recommended solution:** Add `.env.example` with names only; lazy-init clients with clear errors; update README.
- **Dependencies:** Owner provides real values privately.
- **Acceptance criteria:** Fresh clone documents required vars; app boots with helpful error UI when unset.
- **Complexity:** S  
- **Risk:** High  
- **Related files:** `.env.example` (new), `lib/supabaseClient.ts`, `app/auth/page.tsx`, `app/api/checkout/route.ts`, `README.md`

### P0-3 Secure Stripe webhook

- **Problem:** Forged events can create orders.
- **Evidence:** No `constructEvent` / webhook secret in `app/api/webhook/route.ts`.
- **Recommended solution:** Raw body + `STRIPE_WEBHOOK_SECRET`; verify signature; idempotent upsert by `session.id`.
- **Dependencies:** P0-1; Stripe dashboard webhook config.
- **Acceptance criteria:** Unsigned requests rejected; duplicate events do not duplicate orders.
- **Complexity:** M  
- **Risk:** Critical  
- **Related files:** `app/api/webhook/route.ts`

### P0-4 Eliminate IDOR on cart/order APIs

- **Problem:** Service role + client `user_id` allows cross-user access.
- **Evidence:** `get-cart`, `save-cart`, `get-orders`.
- **Recommended solution:** Derive user from verified session (`@supabase/ssr`); ignore client user_id; add RLS.
- **Dependencies:** Auth session architecture decision.
- **Acceptance criteria:** Cannot read/write another user’s cart/orders with only their UUID.
- **Complexity:** M  
- **Risk:** Critical  
- **Related files:** `app/api/get-cart/route.ts`, `app/api/save-cart/route.ts`, `app/api/get-orders/route.ts`, `middleware.ts`

### P0-5 Server-side price authority for checkout

- **Problem:** Client sends prices to Stripe session.
- **Evidence:** `app/api/checkout/route.ts` maps `item.price` from body.
- **Recommended solution:** Lookup products by id from trusted catalog/DB; compute amounts server-side.
- **Dependencies:** Product source of truth (static OK short-term).
- **Acceptance criteria:** Tampered prices ignored; session amounts match catalog.
- **Complexity:** M  
- **Risk:** Critical  
- **Related files:** `app/api/checkout/route.ts`, `lib/products.ts`

### P0-6 Create initial Supabase schema in repo

- **Problem:** No migrations; tables assumed.
- **Evidence:** No `supabase/` or SQL files; code references `cart`/`carts`/`orders`.
- **Recommended solution:** Add Supabase migrations for single cart model + orders (+ profiles optional); document apply steps.
- **Dependencies:** Owner Supabase project.
- **Acceptance criteria:** Schema versioned; local/remote apply path documented; app matches schema.
- **Complexity:** M  
- **Risk:** Critical  
- **Related files:** new `supabase/migrations/*`

---

## P1 — Core product completion

### P1-1 Consolidate product routes

- **Problem:** Store links to stub `/product/[slug]`; real ATC page is `/store/[slug]`.
- **Evidence:** `app/store/page.tsx`, dual page files.
- **Recommended solution:** Canonical `/store/[slug]` for commerce; either remove stub or reserve `/product/*` for marketing feature pages only with clear IA.
- **Dependencies:** None
- **Acceptance criteria:** Catalog → detail → add to cart works without stubs.
- **Complexity:** S  
- **Risk:** Medium  
- **Related files:** `app/store/page.tsx`, `app/store/[slug]/page.tsx`, `app/product/[slug]/page.tsx`, `components/Header.tsx`

### P1-2 Consolidate cart persistence

- **Problem:** Dual APIs/tables; auth never syncs.
- **Evidence:** `cart` vs `carts`; `localStorage.user` never set.
- **Recommended solution:** One API, one table; sync from real session; guest localStorage merge on login.
- **Dependencies:** P0-4, P0-6
- **Acceptance criteria:** Logged-in cart persists across devices; guest cart survives refresh.
- **Complexity:** M  
- **Risk:** High  
- **Related files:** `context/CartContext.tsx`, cart API routes, auth page

### P1-3 Fix auth session architecture

- **Problem:** Cookies expected but unset; no logout; duplicate clients.
- **Evidence:** `middleware.ts`, auth page, `/api/cart`.
- **Recommended solution:** Adopt `@supabase/ssr` cookie pattern; single client helpers; logout; protect dashboard.
- **Dependencies:** P0-2
- **Acceptance criteria:** Middleware can truly gate routes; dashboard loads session server-side or via verified client.
- **Complexity:** L  
- **Risk:** High  
- **Related files:** `middleware.ts`, `lib/supabaseClient.ts`, `app/auth/page.tsx`, new server client helpers

### P1-4 Fix dashboard ↔ orders contract

- **Problem:** Bearer sent; `user_id` required; empty/error orders.
- **Evidence:** `app/dashboard/page.tsx` vs `app/api/get-orders/route.ts`.
- **Recommended solution:** Session-derived user in API; return orders for that user.
- **Dependencies:** P0-4, P1-3
- **Acceptance criteria:** After paid webhook, user sees their order list.
- **Complexity:** S  
- **Risk:** High  
- **Related files:** dashboard + get-orders

### P1-5 Checkout UX honesty

- **Problem:** Fake card form while Stripe Checkout is used; plan add missing `id`.
- **Evidence:** `app/checkout/page.tsx` TS errors + unused inputs.
- **Recommended solution:** Remove fake PCI fields; show “Continue to Stripe”; fix plan line items with stable ids; wrap `useSearchParams` in Suspense if required.
- **Dependencies:** P0-5
- **Acceptance criteria:** No fake card fields; plan + products checkout without TS errors.
- **Complexity:** S  
- **Risk:** Medium  
- **Related files:** `app/checkout/page.tsx`

### P1-6 Success cart clear

- **Problem:** localStorage removed but React cart may restore.
- **Evidence:** `app/success/page.tsx` vs CartProvider effects.
- **Recommended solution:** Call `clearCart()` via shared event or success client using context; clear DB cart already in webhook.
- **Dependencies:** P1-2
- **Acceptance criteria:** After success, cart UI empty without full remount race.
- **Complexity:** S  
- **Risk:** Medium  
- **Related files:** `app/success/page.tsx`, `context/CartContext.tsx`

### P1-7 Fix dead navigation links

- **Problem:** `/services` 404; Get Started inert; many stub product links.
- **Evidence:** Header + smoke test 404.
- **Recommended solution:** Remove or implement `/services`; wire CTAs; limit menu to real routes.
- **Dependencies:** Product IA decision
- **Acceptance criteria:** No primary nav 404s.
- **Complexity:** S  
- **Risk:** Medium  
- **Related files:** `components/Header.tsx`, `app/page.tsx`

### P1-8 Typecheck + lint green

- **Problem:** `tsc` and eslint fail.
- **Evidence:** command results in audit.
- **Recommended solution:** Fix errors listed in technical debt doc; CI gate.
- **Dependencies:** P0-1, P1-5
- **Acceptance criteria:** `tsc --noEmit` and `npm run lint` exit 0.
- **Complexity:** M  
- **Risk:** Medium  
- **Related files:** multiple

---

## P2 — Quality and reliability

### P2-1 Remove / quarantine dead code

- Layout.tsx, unused ProductCard or wire it, unused Providers, unused APIs, homepage NavDropdown.
- **Complexity:** S | **Risk:** Low  
- **Related files:** `components/*`, `app/providers.tsx`, `app/page.tsx`, dead API routes

### P2-2 Add not-found / error / loading UI

- **Complexity:** S | **Risk:** Low  
- **Related files:** `app/not-found.tsx`, `app/error.tsx`, `loading.tsx`

### P2-3 Deduplicate footer

- **Complexity:** S | **Risk:** Low  
- **Related files:** `app/page.tsx`, `components/Footer.tsx`

### P2-4 Introduce automated tests

- Cart reducer, checkout price authority, webhook reject unsigned, route smoke.
- **Complexity:** M | **Risk:** Medium  
- **Related files:** new `*.test.ts`, CI

### P2-5 CI pipeline

- install → lint → tsc → build on PR.
- **Complexity:** S | **Risk:** Medium  
- **Related files:** `.github/workflows/ci.yml`

### P2-6 Header a11y + impure render fix

- aria-expanded; precompute particle positions; logo link.
- **Complexity:** S | **Risk:** Low  
- **Related files:** `components/Header.tsx`

---

## P3 — Advanced product features

### P3-1 Real product catalog in database

- Images, SEO fields, status, categories.
- **Complexity:** L | **Risk:** Medium

### P3-2 Merchant product CRUD

- Create/edit/delete, inventory basics.
- **Complexity:** L | **Risk:** High

### P3-3 Order detail + statuses + fulfillment

- **Complexity:** L | **Risk:** Medium

### P3-4 Customer account area

- Profile, addresses, order history beyond stub dashboard.
- **Complexity:** L | **Risk:** Medium

### P3-5 Real subscriptions (if pricing is SaaS)

- Stripe Billing mode vs one-time; yearly toggle consistency.
- **Complexity:** L | **Risk:** High  
- **Owner decision required**

### P3-6 Tax / shipping / discounts

- Currently absent.
- **Complexity:** XL | **Risk:** High

---

## P4 — AI and differentiation

### P4-1 Define AI MVP scope

- **Problem:** Branding claims AI without implementation.
- **Evidence:** No AI SDKs/keys/routes.
- **Recommended solution:** Pick 1–2: product description generation, merchant copilot, or storefront chat — with cost controls.
- **Dependencies:** Core commerce stable (P0–P1)
- **Acceptance criteria:** Documented AI feature with provider, prompts, limits, eval.
- **Complexity:** L–XL | **Risk:** High  
- **Related files:** TBD new modules

### P4-2 Implement chosen AI feature behind feature flag

- **Complexity:** L | **Risk:** High

### P4-3 Usage metering / safety

- **Complexity:** M | **Risk:** Medium

---

## P5 — Production operations and scale

### P5-1 Error tracking + structured logs

### P5-2 Backups / migration runbooks

### P5-3 Performance budgets (landing motion weight)

### P5-4 Rate limiting / bot protection

### P5-5 Multi-tenant stores architecture (if platform vision)

- **Owner decision:** single-brand store vs Shopify-like multi-store platform.
- **Complexity:** XL | **Risk:** Critical to product direction

---

## Suggested dependency graph

```
P0-1 build ─┬─► P0-3 webhook secure
P0-2 env ───┼─► P1-3 auth SSR ─► P0-4 IDOR fix ─► P1-2 cart ─► P1-4 dashboard
P0-6 schema ┘                      └─► P1-6 success clear
P0-5 prices ─► P1-5 checkout UX
P1-1 routes + P1-7 nav (parallel)
P1-8 quality gates ─► P2-5 CI ─► P2-4 tests
P3* after P1 stable
P4* after P3 core commerce
P5 continuous
```
