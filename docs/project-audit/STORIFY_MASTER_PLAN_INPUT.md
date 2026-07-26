# Storify — Master Plan Input

**Purpose:** Enable a new engineer or AI agent to write a complete implementation Master Plan **without** prior chat history.  
**Audit date:** 2026-07-24  
**Constraint reminder:** Do not create duplicate pages, headers, layouts, routes, APIs, or tables while implementing. Consolidate first.

---

## Confirmed product vision (from repo + stated intent)

Storify is meant to become a **custom AI-powered e-commerce / commerce platform** (Shopify-inspired marketing IA + real checkout).  

**What the repo actually is today:** a Next.js marketing site with a thin commerce prototype (static products, localStorage cart, Stripe Checkout scaffold, Supabase auth UI, minimal orders dashboard).

**Unresolved vision fork (owner must decide):**

1. **Single-store brand commerce** for one merchant (Storify sells products), or  
2. **Multi-tenant platform** (merchants create stores — closer to Shopify), or  
3. **SaaS subscription** to platform tools (pricing page suggests this) **plus** a demo storefront.

These three are partially mixed in UI today (pricing plans + demo store + platform mega-menu).

---

## Current verified state (short)

| Fact | Evidence |
|------|----------|
| Next.js 16 App Router, React 19, Tailwind 4, Framer Motion | `package.json`, `app/` |
| npm package manager | `package-lock.json` |
| Branch `main`, 2 commits | git log |
| Remote `shatasolutions/storify` | `git remote -v` (differs from user-stated `adminshata/storify`) |
| One active Header via root layout | `app/layout.tsx` |
| Build **fails** | missing `nodemailer` |
| Typecheck/lint **fail** | see technical debt |
| No tests, no CI, no `.env.example`, no Supabase migrations | repo scan |
| No real AI | no AI SDKs/routes |
| No admin/merchant CRUD | no routes |

---

## Completed scope (keep / preserve)

Preserve and build upon:

1. **Visual brand direction** — dark cyan/purple glass aesthetic on landing + header  
2. **Root layout composition** — single Header + Footer + CartProvider  
3. **CartContext reducer** — qty merge, 300ms add debounce, localStorage  
4. **Stripe Checkout Session creation pattern** — metadata with `user_id` + items JSON (but secure it)  
5. **Auth UI** — email/password login & signup against Supabase  
6. **Static product seed** as interim catalog (`lib/products.ts`) until DB ready  
7. **Page padding pattern** (`py-32`) for fixed header clearance  

---

## Incomplete scope

- Auth session → middleware / cart / dashboard wiring  
- Stripe webhook (email dep, no signature, no idempotency)  
- Orders dashboard  
- Product detail completeness (images, descriptions, SEO)  
- Pricing/yearly vs checkout plan mapping  
- Header mega-menu linked to real features  
- Mobile parity for Products menu  

---

## Missing scope

- Database migrations + RLS  
- Merchant/admin tooling  
- Real AI features  
- Variants, inventory, tax, shipping, discounts, refunds  
- Customer account management  
- Logout, password reset, OAuth  
- Tests, CI, monitoring  
- Privacy/Terms pages  
- `/services` page or removal  

---

## Architecture decisions that should be **preserved**

| Decision | Why |
|----------|-----|
| App Router only | Already exclusive; do not add Pages Router |
| Single root Header in `app/layout.tsx` | Avoid historical double-header bugs |
| Client CartProvider for snappy UX | Keep, but sync to server carefully |
| Stripe Checkout (hosted) over on-site card fields | Fake card form should be removed, not completed |
| Service role **only** on server routes | Never expose via `NEXT_PUBLIC_*` |
| TypeScript strict | Fix errors rather than loosening |

---

## Architecture decisions that should be **changed**

| Current | Change to |
|---------|-----------|
| Module-level `createClient` throwing without env | Lazy/safe init + `.env.example` |
| Dual cart tables/APIs | One table + one API |
| Dual product detail routes for commerce | Canonical `/store/[slug]` |
| Cookie names without `@supabase/ssr` | Proper SSR cookie session |
| Webhook raw JSON | Signed Stripe webhook |
| Client-trusted prices | Server catalog prices |
| Unused Layout/Providers/ProductCard | Delete or intentionally adopt — not both patterns |
| Middleware “temporary allow” | Real auth gates where required |
| `save-order` unauthenticated | Remove or protect; prefer webhook as source of paid orders |
| Pricing as subscription UI + Stripe `mode: payment` | Align product model (one-time vs Billing) |

---

## Areas requiring consolidation

1. **Headers/layouts** — keep `components/Header.tsx` + root layout; retire `components/Layout.tsx`  
2. **Footers** — one footer component  
3. **Product routes** — commerce vs marketing feature pages  
4. **Cart APIs/tables** — `cart` XOR `carts`  
5. **Supabase clients** — one browser helper, one server helper, one admin helper  
6. **Homepage dead nav** — remove leftovers that invite a second header  

---

## Features that should **not** be duplicated

- Do **not** add another Header component for Products menu  
- Do **not** create a second cart context  
- Do **not** add parallel `/shop` if `/store` exists  
- Do **not** add Prisma alongside Supabase without explicit decision  
- Do **not** implement on-site card collection while using Stripe Checkout  
- Do **not** add AI SDKs until commerce P0/P1 is stable  

---

## Canonical routes (recommended)

| Purpose | Path |
|---------|------|
| Home | `/` |
| Auth | `/auth` |
| Catalog | `/store` |
| Product detail | `/store/[slug]` |
| Cart | `/cart` |
| Checkout | `/checkout` |
| Success | `/success` |
| Pricing | `/pricing` |
| Customer orders | `/dashboard` (or later `/account/orders`) |
| Demo (optional) | `/demo` → prefer alias to a store product |

Marketing feature pages (if kept): `/product/[feature]` **must not** be confused with sellable SKUs.

API:

| Purpose | Path |
|---------|------|
| Create checkout | `POST /api/checkout` |
| Stripe webhook | `POST /api/webhook` |
| Cart | `GET/POST /api/cart` (session-auth) **or** secured save/get — not both |

---

## Canonical components

| Role | Canonical |
|------|-----------|
| Header | `components/Header.tsx` only |
| Footer | `components/Footer.tsx` only |
| Cart state | `context/CartContext.tsx` |
| Product card | Adopt `components/ProductCard.tsx` **or** store page cards — pick one |
| Supabase browser | `lib/supabaseClient.ts` (auth page should import it) |
| Supabase server/admin | New `lib/supabase/server.ts` + `lib/supabase/admin.ts` (to create) |

---

## Canonical header recommendation

1. Only render Header from `app/layout.tsx`  
2. Logo → `/`; Get Started → `/auth` or onboarding  
3. Nav limited to working routes: Platform, Store, Pricing, Cart, Demo (optional), Sign In / Account  
4. Products mega-menu either:  
   - **A)** marketing-only links clearly labeled, or  
   - **B)** removed until features exist  
5. Add Account + Logout when auth works  
6. Mobile: simple links + accordion; do not mount 900px desktop mega-menu on small screens  
7. Never nest Header inside page components  

---

## Canonical data model recommendation

Minimum v1:

```
auth.users
profiles (id PK/FK, role, display_name, created_at, updated_at)
products (id, slug UNIQUE, name, description, price_cents, currency, category, status, image_url, created_at, updated_at)
carts (user_id PK/FK, items jsonb, updated_at)  -- OR normalized cart_items
orders (
  id, user_id FK, stripe_session_id UNIQUE,
  amount_total_cents, currency, status,
  items jsonb, created_at, updated_at
)
```

Rules:

- Prefer **one** cart table name  
- Orders created primarily from **verified webhook**  
- RLS: users read/write own cart; read own orders; products public read for `status=active`  
- Service role only for webhook inserts / admin  

---

## Security requirements for Master Plan

Must include:

1. Stripe webhook signature verification  
2. No client-trusted prices  
3. Session-derived user ids on cart/order APIs  
4. RLS policies shipped in migrations  
5. No service role in client bundles  
6. No secret logging  
7. Auth gates for dashboard (and optionally checkout)  
8. Remove or lock down `/api/save-order`  

---

## Testing requirements

Minimum gate before calling features “done”:

- Unit: cart reducer; price authority  
- API: webhook rejects bad signatures; checkout ignores price tampering  
- Smoke: route list returns expected status with test env  
- Manual: full purchase path in Stripe test mode  

CI: `lint` + `tsc` + `build` on every PR.

---

## Deployment requirements

- Vercel (or chosen host) with Node version pinned  
- Env vars from checklist in `STORIFY_DEPLOYMENT_READINESS.md`  
- Supabase migrations applied before traffic  
- Stripe webhook endpoint registered  
- `NEXT_PUBLIC_BASE_URL` = production origin  
- Build must pass  

---

## Suggested implementation phases

### Phase 0 — Stabilize (P0)

Unblock build; env contract; schema migrations; secure webhook; secure APIs; server prices.

### Phase 1 — Commerce vertical slice (P1)

Auth SSR; one cart path; canonical product routes; checkout UX; success clear; dashboard orders; nav fixes; green tsc/lint.

### Phase 2 — Harden (P2)

Dead code cleanup; error/404 pages; tests; CI; header a11y.

### Phase 3 — Merchant & catalog depth (P3)

DB products; images; merchant CRUD; order statuses; account area; decide subscriptions.

### Phase 4 — AI differentiation (P4)

Only after Phase 1–2 stable; one AI MVP with cost controls.

### Phase 5 — Operations (P5)

Monitoring, backups, rate limits, performance, multi-tenant decision execution.

**Dependencies:** Phase N generally depends on Phase N−1 for P0–P2. P4 must not start before P1 complete. P3 can partially overlap late P2.

---

## External decisions required from the owner

1. **Product shape:** single store vs multi-tenant platform vs SaaS tools?  
2. **Pricing truth:** one-time SKUs, subscriptions, or both?  
3. **GitHub canonical remote:** `adminshata/storify` vs `shatasolutions/storify`?  
4. **Supabase project:** create new vs reuse existing (share project ref privately, not in git)  
5. **Stripe account mode** and whether webhook email is required at MVP  
6. **Keep Shopify-like mega-menu** as marketing chrome or simplify to real features?  
7. **AI MVP choice** (descriptions vs assistant vs storefront chat) and budget  
8. **Package rename** from `ai-ecommerce-platform` to `storify`?  

---

## Questions that cannot be answered from the repository

1. Does a remote Supabase project already contain `cart`/`carts`/`orders`? With what RLS?  
2. Are Stripe/Supabase keys configured anywhere outside this clone?  
3. Is there production/staging Vercel already linked?  
4. Was historical double-header bug fixed only by luck of root layout, or are other branches elsewhere? (Only `main` exists remotely.)  
5. Intended legal entity / Privacy/Terms content  
6. Whether “Enterprise” pricing is real commercial packaging  
7. Original local folder `ai-ecommerce-platform` — any unmerged work outside this git remote?  

---

## Inputs to copy into Master Plan “Definition of Done” (MVP)

A commerce MVP is done when:

1. Build/lint/typecheck pass in CI  
2. User can sign up/login/logout  
3. User can browse `/store`, open `/store/[slug]`, add to cart, checkout via Stripe test mode  
4. Webhook verifies signatures and creates exactly one order  
5. Dashboard shows that order  
6. Cart is empty after success (UI + DB)  
7. Prices cannot be tampered via API  
8. Schema + RLS live in repo  
9. No primary nav 404s  
10. No second header/footer regressions  

AI features are **explicitly out of MVP** unless owner elevates them after the above.
