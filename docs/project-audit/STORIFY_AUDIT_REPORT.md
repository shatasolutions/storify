# Storify — Complete Project Audit Report

**Date:** 2026-07-24  
**Branch:** `main` @ `920c142`  
**Remote observed:** `https://github.com/shatasolutions/storify.git`  
**Auditor mode:** Evidence-only; no feature implementation; no fixes; no commits.

This report consolidates findings from all files in `docs/project-audit/`. A new engineer should start here, then use `STORIFY_MASTER_PLAN_INPUT.md` to draft the Master Plan.

---

## 1. Executive verdict

Storify today is a **polished marketing frontend** with a **partial e-commerce prototype**. It is **not** an AI platform yet, **not** production-ready, and **cannot currently pass `next build`**.

| Metric | Estimate | Confidence |
|--------|----------|------------|
| Overall completion | **~28%** | High |
| Production readiness | **~8%** | High |

---

## 2. What the product can do today

### Without credentials (verified HTTP smoke)

| Works | Does not work |
|-------|----------------|
| `/` marketing page | `/auth` 500 (missing Supabase URL) |
| `/store` catalog (static) | `/checkout` 500 |
| `/product/[slug]` stubs | `/dashboard` 500 |
| `/store/[slug]` detail UI | `/services` 404 |
| `/cart` localStorage cart | `/api/checkout` 500 (no Stripe key) |
| `/pricing`, `/demo`, `/success` | `/api/webhook` 500 (missing nodemailer) |

### Intended with credentials (code present, not end-to-end verified)

- Email/password auth via Supabase  
- Stripe Checkout Session redirect  
- Webhook order insert + cart delete + email  
- Dashboard order list (but API contract currently broken)

---

## 3. Architecture overview

```
Next.js 16 App Router
├── app/layout.tsx          Header + Footer + CartProvider
├── Marketing               app/page.tsx
├── Commerce UI             store, cart, checkout, success, demo, pricing
├── Auth UI                 app/auth/page.tsx
├── Dashboard               orders list only
├── API                     checkout, webhook, cart×3, orders×2
├── lib/products.ts         hardcoded catalog
├── context/CartContext.tsx localStorage cart
└── middleware.ts           non-enforcing stub on /cart,/checkout
```

**Stack:** React 19, Tailwind 4, Framer Motion, `@supabase/supabase-js`, Stripe, Lucide.  
**Missing:** tests, CI, vercel.json, supabase migrations, AI SDKs, admin.

---

## 4. Route inventory (summary)

**Pages:** `/`, `/auth`, `/dashboard`, `/store`, `/store/[slug]`, `/product/[slug]`, `/cart`, `/checkout`, `/pricing`, `/demo`, `/success`  
**Missing linked:** `/services`  
**APIs:** `/api/checkout`, `/api/webhook`, `/api/cart`, `/api/save-cart`, `/api/get-cart`, `/api/save-order`, `/api/get-orders`

Full detail: `STORIFY_ROUTE_INVENTORY.md`.

---

## 5. Feature status highlights

| Area | Status |
|------|--------|
| Marketing site | Strong UI, incomplete CTAs |
| Auth | UI exists; session integration broken; no logout |
| Catalog | Mocked (`lib/products.ts`) |
| Product detail | Split stub vs real ATC page |
| Cart | Local OK; server sync effectively dead |
| Checkout | Stripe scaffold + fake card form + type errors |
| Payments webhook | Broken dependency + no signature verify |
| Dashboard | Broken fetch contract |
| Admin/Merchant | Missing |
| AI | Branding only |

Full matrix: `STORIFY_FEATURE_INVENTORY.md`.

---

## 6. Header / layout findings

- **One active Header** via `app/layout.tsx` → `components/Header.tsx` (good).  
- **Dangerous unused duplicate:** `components/Layout.tsx` also renders Header/Footer.  
- **Double footer on homepage.**  
- **Dead links:** `/services`, inert Get Started, many `/product/*` stubs.  
- Historical multi-header bugs are **not currently active**, but leftovers invite regression.  
- Canonical recommendation: keep single Header; simplify menu to real routes.

Full detail: `STORIFY_UI_UX_AUDIT.md`.

---

## 7. Supabase / database findings

- **No migrations, RLS, seeds, or generated types in repo.**  
- Code assumes tables: `cart`, `carts`, `orders`.  
- Dual cart table names are a schema conflict.  
- Service role used in APIs with client-supplied `user_id` → **IDOR**.  
- Auth never sets cookies/`localStorage.user` that other layers expect.

Full detail: `STORIFY_DATABASE_AUDIT.md`.

---

## 8. Environment variables (names only)

Required / referenced:

- `NEXT_PUBLIC_SUPABASE_URL`  
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
- `SUPABASE_SERVICE_ROLE_KEY`  
- `STRIPE_SECRET_KEY`  
- `NEXT_PUBLIC_BASE_URL`  
- `EMAIL_USER`, `EMAIL_PASS`  

Not implemented but needed: `STRIPE_WEBHOOK_SECRET`.

No `.env.example`. No env files present in this workspace at audit time.

---

## 9. Critical bugs (verified)

1. **`npm run build` fails** — missing `nodemailer`  
2. **`npx tsc --noEmit` fails** — 8 errors (async cookies, Stripe API version, cart ids, product description, nodemailer types)  
3. **`npm run lint` fails** — 29 errors  
4. **Auth/checkout/dashboard crash** without Supabase env at module evaluation  
5. **Dashboard cannot load orders** — sends Bearer; API requires `user_id` query param  
6. **Store list links to stub product pages** instead of ATC detail  
7. **Success page cart clear incomplete** vs React cart state  
8. **Checkout plan `addToCart` missing `id`** (TS + runtime risk)  
9. **`/services` 404** linked from header  

---

## 10. Critical security findings

1. Stripe webhook accepts unsigned JSON events  
2. Cart/order APIs trust client `user_id` with service role  
3. `/api/save-order` unauthenticated insert  
4. Checkout trusts client-provided prices  
5. Middleware does not enforce auth  

Full detail: `STORIFY_SECURITY_AUDIT.md`.

---

## 11. Duplication / conflicts

| Conflict | Resolution direction |
|----------|----------------------|
| `/product/[slug]` vs `/store/[slug]` | Canonical commerce = `/store/[slug]` |
| `cart` vs `carts` APIs | Pick one |
| Root layout vs `components/Layout.tsx` | Keep root only |
| Dual footers on `/` | One footer |
| Dual Supabase anon clients | One module |
| npm name vs brand vs GitHub org | Owner alignment |

Full detail: `STORIFY_TECHNICAL_DEBT.md`.

---

## 12. Deployment blockers

- Build failure  
- Undocumented env  
- No DB migrations  
- Insecure payments path  
- No CI  
- External accounts (Supabase/Stripe) unverified in this clone  

Full checklist: `STORIFY_DEPLOYMENT_READINESS.md`.

---

## 13. Verification commands run

| Command | Result |
|---------|--------|
| `git status` / `git branch -a` / `git log` | Clean `main`; 2 commits; remote `shatasolutions/storify` |
| `npm install` | **Passed** (9 audit vulns reported) |
| `npx tsc --noEmit` | **Failed** (8 errors) |
| `npm run lint` | **Failed** (29 errors, 16 warnings) |
| `npm run build` | **Failed** (`nodemailer` missing) |
| `npm run dev -H 127.0.0.1 -p 3000` | **Passed** (server started) |
| Node `fetch` smoke of pages/APIs | Mixed 200/400/404/500 as documented |
| `npm audit` summary | 8 high, 1 low |
| Test suite | **None exists** |

---

## 14. What should go into the Master Plan

Use `STORIFY_MASTER_PLAN_INPUT.md` and `STORIFY_REMAINING_WORK_BACKLOG.md` as primary inputs.

**Phase order:**

0. Stabilize build, env, schema, webhook security, API authz, price authority  
1. Complete commerce vertical slice (routes, cart, checkout UX, dashboard, nav)  
2. Harden (cleanup, tests, CI, a11y)  
3. Merchant/catalog depth  
4. AI differentiation (after commerce works)  
5. Production operations  

**Do not** invent parallel headers, stores, carts, or AI features before Phase 0–1.

---

## 15. Related documents

| File | Contents |
|------|----------|
| `STORIFY_EXECUTIVE_STATUS.md` | Short executive view |
| `STORIFY_FEATURE_INVENTORY.md` | Feature matrix + % by area |
| `STORIFY_ROUTE_INVENTORY.md` | Every page/API route |
| `STORIFY_DATABASE_AUDIT.md` | Supabase/schema/RLS gaps |
| `STORIFY_UI_UX_AUDIT.md` | Header/nav/a11y |
| `STORIFY_SECURITY_AUDIT.md` | Severity-ranked findings |
| `STORIFY_TECHNICAL_DEBT.md` | Duplicates/mocks/dead code |
| `STORIFY_DEPLOYMENT_READINESS.md` | Go-live blockers |
| `STORIFY_REMAINING_WORK_BACKLOG.md` | P0–P5 backlog items |
| `STORIFY_MASTER_PLAN_INPUT.md` | Master Plan source material |

---

## 16. Recommended next action

**Create the Master Plan** from `STORIFY_MASTER_PLAN_INPUT.md`, get owner decisions on product shape (single store vs platform vs SaaS) and GitHub/Supabase/Stripe accounts, then execute Phase 0 only — stabilize and consolidate — before any new feature work.
