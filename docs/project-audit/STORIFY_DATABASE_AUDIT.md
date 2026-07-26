# Storify — Database & Supabase Audit

**Audit date:** 2026-07-24  
**Critical finding:** There is **no** `supabase/`, `sql/`, `prisma/`, migration, seed, RLS, Edge Function, or generated Database type file in this repository.

Schema exists only as **implied by application code**. Remote Supabase project state is **externally unverified**.

---

## Supabase architecture (as coded)

| Client | Path | Key used | Runtime |
|--------|------|----------|---------|
| Shared anon | `lib/supabaseClient.ts` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Imported by client pages |
| Inline anon | `app/auth/page.tsx` | Same public pair | Auth page only (duplicate) |
| Service role (per request) | `get-cart`, `save-cart`, `get-orders`, `save-order`, `webhook` | `SUPABASE_SERVICE_ROLE_KEY` | Route Handlers |
| Service role / anon fallback | `app/api/cart/route.ts` | Service role **or** anon | Module singleton |

**Not present:** `@supabase/ssr`, cookie-based server client, middleware session refresh, typed `createClient<Database>()`.

---

## Environment dependencies (names only)

| Variable | Client/Server | Required for |
|----------|---------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Both (public) | All Supabase usage |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + optional API fallback | Auth UI, shared client |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Cart/order APIs, webhook |

No `.env`, `.env.local`, or `.env.example` in workspace at audit time (`.gitignore` ignores `.env*`).

---

## Migration inventory

| Item | Status |
|------|--------|
| Supabase CLI config | Missing |
| SQL migrations | Missing |
| Seed files | Missing |
| Generated types | Missing |
| Storage buckets | Not referenced |
| Edge Functions | Not present |
| DB webhooks / triggers | Not in repo |
| Realtime | Not used |

---

## Table inventory (code-implied)

### `cart`

| Field | Purpose | Evidence |
|-------|---------|----------|
| Purpose | Persist authenticated cart JSON | `save-cart`, `get-cart`, webhook delete |
| Columns used | `user_id`, `items`, `updated_at` | upsert/select/delete |
| Migration | **None in repo** | — |
| RLS | Unknown (remote); APIs use service role → bypass | — |
| Relation to users | `user_id` assumed = auth user id | — |
| CRUD in app | Create/Update via upsert; Read; Delete on webhook | — |
| Mocked? | Client cart is localStorage; DB path effectively unused without `localStorage.user` | — |
| Production-ready? | **No** | Missing schema, RLS, auth on API |

### `carts`

| Field | Purpose | Evidence |
|-------|---------|----------|
| Purpose | Alternate cart table | `app/api/cart/route.ts` only |
| Columns used | `user_id`, `items`, `updated_at` | upsert/select |
| Migration | None | — |
| Called by UI? | **No** | Dead path |
| Production-ready? | **No** | Duplicate concept of `cart` |

### `orders`

| Field | Purpose | Evidence |
|-------|---------|----------|
| Purpose | Store completed purchases | webhook insert; get-orders; save-order |
| Columns used | `items`, `total`, `user_id` (webhook), `id`, `created_at` (dashboard UI) | — |
| Migration | None | — |
| Inconsistencies | `save-order` omits `user_id`; webhook includes it | — |
| Production-ready? | **No** | No status, payment_intent, idempotency key, line-item normalization |

### Products / merchants / profiles / etc.

**Not referenced** in Supabase calls. Products live in `lib/products.ts`.

---

## Auth usage

| Capability | Present? | Evidence |
|------------|----------|----------|
| `signInWithPassword` | Yes | `app/auth/page.tsx` |
| `signUp` | Yes | same |
| `onAuthStateChange` | Yes | redirects to `/` |
| `getSession` | Yes | dashboard, checkout |
| `signOut` | **No** | — |
| OAuth | **No** | — |
| Password reset | **No** | — |
| Cookie session for middleware | **Broken** | Cookies `sb-access-token` / `sb-refresh-token` expected but never set in app code |
| `localStorage.user` for cart APIs | **Broken** | Never written on login |

---

## Data model gaps (recommended for Master Plan)

Minimum production schema (recommendation only — **not implemented**):

1. `profiles` (id → auth.users, role: customer|merchant|admin)
2. `products` (merchant_id, slug, name, description, price_cents, status, images)
3. `product_variants` (optional)
4. `carts` **or** `cart_items` (pick one model) with RLS
5. `orders` + `order_items` with Stripe session id unique constraint
6. `stores` if multi-tenant merchant vision is real

Also needed: RLS policies, indexes on `user_id`/`slug`, unique constraints, seed demo products.

---

## Security concerns (database-related)

| Issue | Severity | Evidence |
|-------|----------|----------|
| Service role used to serve client-supplied `user_id` | **Critical** | `get-cart`, `save-cart`, `get-orders` |
| No RLS definitions in repo | **High** | Missing SQL |
| `cart` vs `carts` split | **Medium** | Dual tables |
| `save-order` unauthenticated insert | **Critical** | No auth check |
| Logging env key presence object | **High** | `save-order` `console.error("Missing...", { url, key })` — risk of secret leakage if mis-edited |
| Anon fallback for cart API | **Medium** | `api/cart/route.ts` |

---

## Mismatch summary

| Code expects | Repo provides |
|--------------|---------------|
| Tables `cart`, `carts`, `orders` | Nothing |
| Unique `cart.user_id` for upsert onConflict | Unverified |
| Cookie auth tokens | Not written by auth flow |
| Dashboard Bearer auth | API ignores Authorization header |
| Product catalog in DB | Static TS array |

**Verdict:** Supabase is **partially integrated in application code** but **not production-ready**. Database work is a P0 prerequisite for any real commerce completion.
