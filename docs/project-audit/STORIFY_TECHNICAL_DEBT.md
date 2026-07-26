# Storify — Technical Debt & Duplication Report

**Audit date:** 2026-07-24  
**Rule for this audit:** Document only — do not delete yet.

---

## Duplicates

| Duplicate | Locations | Recommendation |
|-----------|-----------|----------------|
| Header+Footer layout chrome | `app/layout.tsx` (active) vs `components/Layout.tsx` (dead) | Keep root layout; remove unused Layout later |
| Supabase anon client | `lib/supabaseClient.ts` + inline in `app/auth/page.tsx` | Single shared client/module |
| Product detail concepts | `/product/[slug]` stub vs `/store/[slug]` detail | One canonical commerce detail route |
| Cart persistence APIs | `/api/cart` (`carts`) vs `/api/save-cart`+`/api/get-cart` (`cart`) | Pick one table + one API |
| Order write paths | webhook insert vs unused `/api/save-order` | Prefer webhook (+ optional authenticated admin) |
| Footer | `components/Footer.tsx` + homepage inline footer | One footer |
| TiltCard / motion card | `app/page.tsx` + `components/ProductCard.tsx` | Shared UI primitive |
| Homepage nav leftovers | `NavDropdown`, unused state in `app/page.tsx` mirroring Header | Delete dead homepage nav code |
| Package identity | npm name `ai-ecommerce-platform` vs brand Storify vs remote `shatasolutions/storify` | Align naming in Master Plan |

---

## Dead / unused code

| Item | Evidence |
|------|----------|
| `components/Layout.tsx` | No imports |
| `components/ProductCard.tsx` | No imports |
| `app/providers.tsx` | Not used in `layout.tsx`; `next-themes` effectively unused |
| `app/api/cart/route.ts` | No frontend callers |
| `app/api/save-order/route.ts` | No callers |
| `NavDropdown` in homepage | Defined, unused |
| `mobileOpen` / `solutionsOpen` on homepage | Unused state |
| `next-themes` dependency | Only referenced by unused Providers |

---

## Mock / hardcoded data

| Data | Location |
|------|----------|
| Products catalog (5 items) | `lib/products.ts` |
| Demo product | `app/demo/page.tsx` |
| Pricing plans | `app/pricing/page.tsx` |
| Checkout plan map | `app/checkout/page.tsx` `planDetails` |
| Marketing feature lists | `app/page.tsx`, Header mega-menu |
| Product image placeholders | store detail / demo |
| Privacy/Terms | `#` anchors |

---

## Hardcoded / fragile values

| Item | Location | Risk |
|------|----------|------|
| Stripe API version string `"2024-06-20"` | `api/checkout/route.ts` | TS error vs installed Stripe types expecting newer version |
| Default `NEXT_PUBLIC_BASE_URL` → `http://localhost:3000` | checkout route | Wrong success/cancel URLs in prod if env missing |
| Currency default `usd` | checkout route | OK but client-overridable |
| Email always to `EMAIL_USER` | webhook | Not customer confirmation |

---

## Legacy / temporary markers

| Marker | Location |
|--------|----------|
| “Temporary: allow access even if token missing” | `middleware.ts` |
| “We’ll connect real data next” | `app/product/[slug]/page.tsx` |
| Stock create-next-app README | `README.md` |
| Middleware → proxy deprecation warning | Next 16 build/dev logs |

**TODO/FIXME comments:** essentially none found via search (debt is structural, not annotated).

---

## Missing abstractions

1. Typed env validation (`zod` + server/client split)
2. Single Supabase server helper (anon vs service role)
3. Domain types for Product, CartItem, Order
4. Price authority service (DB/catalog → Stripe)
5. Auth session helper (`getUser()` server-side)
6. Error boundary / not-found pages
7. Shared form components with labels
8. API input validation schemas

---

## Missing tests

| Area | Status |
|------|--------|
| Unit tests | **0 files** |
| Integration tests | **0** |
| E2E | **0** |
| Coverage tooling | **0** |
| Test script in package.json | **Missing** |

High-value first tests (for backlog): cart reducer, checkout price authority, webhook signature rejection, auth gate.

---

## TypeScript / lint debt (verified)

### `npx tsc --noEmit` — FAIL (8 errors)

1. `cookies().get` not awaited — `app/api/cart/route.ts` (Next 15+/16 async cookies)
2. Stripe `apiVersion` type mismatch — `app/api/checkout/route.ts`
3. Missing module `nodemailer` — webhook
4. Missing `id` on `addToCart` — checkout plan effect (×2)
5. Extra `currency` prop — demo page
6. Missing `description` on product — `store/[slug]`

### `npm run lint` — FAIL (29 errors, 16 warnings)

Notable: impure `Math.random` in Header; explicit `any`; setState-in-effect on cart mounted flag; React Compiler memoization warnings in CartContext; `<a href="/">` on success page.

### `npm run build` — FAIL

Missing `nodemailer`.

---

## Cleanup recommendations (ordered, do not execute yet)

1. Unblock build (email dependency decision)
2. Fix TypeScript errors
3. Consolidate cart API + table
4. Consolidate product routes
5. Remove dead Layout/ProductCard/Providers **or** wire them intentionally
6. Deduplicate footer and homepage nav leftovers
7. Add `.env.example` + README for Storify
8. Introduce tests before expanding features
9. Align package name / GitHub org naming with product decision
