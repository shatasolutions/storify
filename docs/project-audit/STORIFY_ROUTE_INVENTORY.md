# Storify — Route Inventory

**Router:** Next.js App Router (`app/`). No `pages/` directory.  
**Smoke test date:** 2026-07-24 against `npm run dev` on `127.0.0.1:3000` with **no** `.env` present.

Status codes reflect that environment. With valid env, auth/checkout/dashboard/API behavior may change; marked accordingly.

---

## Page routes

| Route | File | Purpose | Auth required? | Role | Data source | Linked from UI? | Complete? | Reachable? | Redirects? | Placeholder? | Duplicate? | Notes |
|-------|------|---------|----------------|------|-------------|-----------------|-----------|------------|------------|---------------|------------|-------|
| `/` | `app/page.tsx` | Marketing landing | No | — | Static | Header “Platform” | Partial | **200** | No | Partial CTAs | Has own footer + root Footer | Strongest page |
| `/auth` | `app/auth/page.tsx` | Login/signup | Public | — | Supabase Auth | Header Sign In | Partial | **500** without env | To `/` on session | No | Inline supabase client duplicates `lib/supabaseClient` | Externally blocked locally |
| `/dashboard` | `app/dashboard/page.tsx` | “My Orders” | Client gate → `/auth` | customer (implicit) | `/api/get-orders` | **Not linked in Header** | Incomplete | **500** without env | To `/auth` if no session | Empty state | — | Dead-ish route (unlinked); API contract broken |
| `/store` | `app/store/page.tsx` | Catalog | No | — | `lib/products.ts` | Header Store | Partial | **200** | No | Search/filter local | Links to `/product/...` not `/store/...` | |
| `/store/[slug]` | `app/store/[slug]/page.tsx` | Product detail + ATC | No | — | `lib/products.ts` | Barely (back links) | Partial | **200** | No | Image placeholder | Conflicts with `/product/[slug]` | Not used by store list |
| `/product/[slug]` | `app/product/[slug]/page.tsx` | Marketing product stub | No | — | slug string only | Header mega-menu, store list, homepage | Mocked | **200** | No | Explicit placeholder copy | Duplicates detail concept | No add-to-cart |
| `/cart` | `app/cart/page.tsx` | Cart | Soft middleware (non-enforcing) | — | CartContext | Header Cart | Partial | **200** | No | No | — | Middleware logs “allowing access” |
| `/checkout` | `app/checkout/page.tsx` | Checkout + plan param | Soft middleware; page requires login for Stripe | — | Cart + Supabase session | Cart link; Pricing | Incomplete | **500** without env | To `/auth` if no user on Place Order | Fake card fields | — | Fake PCI form unused |
| `/pricing` | `app/pricing/page.tsx` | Plans | No | — | Hardcoded plans | Header Pricing | Partial | **200** | To `/checkout?plan=` | Yearly UI mismatch | — | Stripe mode is one-time payment |
| `/demo` | `app/demo/page.tsx` | Demo product ATC | No | — | Hardcoded | Header Demo | Partial | **200** | No | Hardcoded | Overlaps store product id | TS error on currency prop |
| `/success` | `app/success/page.tsx` | Post-payment | No | — | localStorage clear | Stripe success_url | Partial | **200** | Home after 5s | No | — | Cart React state may remain |
| `/services` | **MISSING** | Linked as Commerce Tools | — | — | — | Header Solutions + mobile | Missing | **404** | — | — | — | Dead link |

**Not found:** `/admin`, `/merchant`, account settings, order detail, cancel page, privacy/terms pages, collections, search page, not-found/error/loading special files.

---

## API routes

| Route | File | Methods | Purpose | Auth | Data | Linked/called? | Complete? | Smoke (no env) | Issues |
|-------|------|---------|---------|------|------|----------------|-----------|----------------|--------|
| `/api/checkout` | `app/api/checkout/route.ts` | POST | Create Stripe Checkout Session | Requires `user_id` in body (not verified) | Stripe | `checkout/page.tsx` | Partial | **500** missing Stripe key | Trusts client prices; module-level Stripe init |
| `/api/webhook` | `app/api/webhook/route.ts` | POST | Handle checkout.session.completed | **None** (no signature) | `orders`, `cart` | Stripe (intended) | Broken | **500** missing nodemailer | Build blocker; insecure |
| `/api/cart` | `app/api/cart/route.ts` | GET/POST | Cookie-auth cart using table `carts` | Cookie `sb-access-token` | `carts` | **No frontend callers found** | Incomplete | **500** missing supabase URL | Dead API path; cookies never set by auth |
| `/api/save-cart` | `app/api/save-cart/route.ts` | POST | Upsert cart by `user_id` | **None** (trusts body) | `cart` | `CartContext` | Incomplete | **400** missing user_id | IDOR; auth never sets localStorage.user |
| `/api/get-cart` | `app/api/get-cart/route.ts` | GET | Fetch cart by `user_id` | **None** | `cart` | `CartContext` | Incomplete | **400** missing user_id | IDOR |
| `/api/save-order` | `app/api/save-order/route.ts` | POST | Insert order | **None** | `orders` | **No callers found** | Incomplete | **500** missing env | Logs env presence object; no user_id |
| `/api/get-orders` | `app/api/get-orders/route.ts` | GET | List orders by `user_id` | **None** (query param) | `orders` | Dashboard (wrong contract) | Broken | **400** without user_id; **500** with user_id+no env | Dashboard sends Bearer only |

---

## Special App Router files

| File | Present? | Notes |
|------|----------|-------|
| `app/layout.tsx` | Yes | Global Header/Footer/CartProvider |
| `app/globals.css` | Yes | Tailwind v4; body font Arial; light CSS vars conflict with dark layout |
| `app/providers.tsx` | Yes (unused) | ThemeProvider not wired |
| `loading.tsx` | No | — |
| `error.tsx` | No | — |
| `not-found.tsx` | No | Default Next 404 used (`/services`) |
| Nested layouts | No | — |
| Server Actions | No | — |

---

## Middleware

| File | Matcher | Behavior | Verdict |
|------|---------|----------|---------|
| `middleware.ts` | `/checkout/:path*`, `/cart/:path*` | Checks cookies; **does not redirect**; logs temporary allow | Soft stub — not protection |

Next.js 16 warns middleware convention is deprecated in favor of “proxy”.

---

## Link graph issues (high priority)

1. Store list → `/product/{id}` (stub) instead of `/store/{id}` (detail + cart)
2. Header Products mega-menu → many `/product/{slug}` stubs (no commerce)
3. Header Solutions → `/services` (**404**)
4. Header “Get Started” button → **no href** (non-functional)
5. Homepage `PrimaryButton` → **no navigation**
6. `/dashboard` exists but is **not in main nav**
7. Mobile “Solutions” is `href="#"`

---

## Canonical route recommendation (for Master Plan — do not implement yet)

| Concept | Canonical path | Deprecate |
|---------|----------------|-----------|
| Catalog | `/store` | — |
| Product detail | `/store/[slug]` | `/product/[slug]` as commerce detail (keep only if marketing feature pages need a different pattern) |
| Cart | `/cart` | — |
| Checkout | `/checkout` | — |
| Success | `/success` | — |
| Auth | `/auth` | — |
| Customer orders | `/dashboard` or rename `/account/orders` | — |
| Pricing | `/pricing` | — |
| Demo | `/demo` or fold into store product | Decide |
| Services | either create `/services` or remove links | — |

### Canonical cart API

Prefer **one** of:

- Authenticated `/api/cart` with real session cookies, table `carts`, **or**
- `/api/save-cart` + `/api/get-cart` with verified session, table `cart`

Not both.
