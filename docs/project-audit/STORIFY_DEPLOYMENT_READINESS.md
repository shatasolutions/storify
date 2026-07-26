# Storify — Deployment Readiness

**Audit date:** 2026-07-24  
**Verdict:** **Not deployment-ready.** Production build fails; env undocumented; DB schema not in repo; payment webhook insecure/incomplete.

---

## Platform configuration

| Item | Status |
|------|--------|
| Vercel project config in repo (`vercel.json`) | **Missing** |
| Framework preset | Next.js (default detectable) |
| Build command | `next build` (package.json) — **currently fails** |
| Install command | `npm install` (lockfile present) |
| Output | Next default |
| Node engines field | **Not specified** in package.json (local audit used Node v22.17.1) |
| CI workflows | **None** (`.github/` missing) |
| README deploy docs | Stock create-next-app only |

---

## Build verification (local)

| Command | Result |
|---------|--------|
| `npm install` | Passed (with sandbox tar warnings; 9 npm audit vulns) |
| `npx tsc --noEmit` | **Failed** (8 errors) |
| `npm run lint` | **Failed** (29 errors) |
| `npm run build` | **Failed** — `Can't resolve 'nodemailer'` |
| `npm run dev` | Starts; many routes 500 without env |
| Unit tests | **N/A** (none) |

---

## Environment variable checklist

| Variable | Side | Required for deploy? | Documented? | Fallback | Risk |
|----------|------|----------------------|-------------|----------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Yes for auth pages | No `.env.example` | None — **throws** | Auth/checkout/dashboard crash on missing |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Yes | No | None — throws | same |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Yes for cart/orders/webhook | No | `/api/cart` falls back to anon | Critical if leaked; IDOR if used as now |
| `STRIPE_SECRET_KEY` | Server | Yes for checkout | No | None — module throws | Checkout dead |
| `STRIPE_WEBHOOK_SECRET` | Server | **Should be** | Not referenced | N/A | **Missing from code** |
| `NEXT_PUBLIC_BASE_URL` | Public | Yes in prod | No | `http://localhost:3000` | Wrong redirects if unset |
| `EMAIL_USER` | Server | If email kept | No | Silent email fail | Ops |
| `EMAIL_PASS` | Server | If email kept | No | Silent email fail | Secret |

**Flags**

- No secret correctly exposed as `NEXT_PUBLIC_*` for service role (**good**)
- Missing `.env.example` (**blocker for onboarding**)
- Unsafe localhost fallback for base URL (**prod footgun**)

---

## Supabase production readiness

| Requirement | Status |
|-------------|--------|
| Migrations versioned in git | **Missing** |
| RLS reviewed | **Missing in repo** |
| Auth redirect URLs configured | **External / unverified** |
| Service role only on server | Yes in intent |
| Seed data strategy | Missing |
| Backup/rollback | Not documented |

---

## Payment readiness

| Requirement | Status |
|-------------|--------|
| Stripe Checkout Session | Scaffold only |
| Webhook endpoint deployable | **No** (nodemailer build break) |
| Signature verification | **No** |
| Idempotency | **No** |
| Test vs live mode docs | Missing |
| Success/cancel URLs | Depend on `NEXT_PUBLIC_BASE_URL` |
| Price integrity | Client-trusted — unsafe |

---

## Domain & callback requirements (external)

Owner must configure (cannot verify from repo alone):

1. Production domain → Vercel
2. `NEXT_PUBLIC_BASE_URL` = canonical HTTPS origin
3. Supabase Auth Site URL + redirect allow list
4. Stripe webhook URL → `https://<domain>/api/webhook` with signing secret
5. Gmail (or other) app password if nodemailer path retained — prefer transactional provider later

---

## Deployment blockers by class

### Code blockers

- `nodemailer` import without dependency → build fail
- TypeScript errors (cookies async, Stripe apiVersion, cart ids, product description)
- Lint errors (may not fail Vercel by default, but should)
- Webhook insecure / incomplete
- Checkout price manipulation
- Success page cart clear incomplete

### Configuration blockers

- No `.env.example`
- No documented required env set
- No Node engine pin
- No CI gate

### External account blockers

- Supabase project + keys (**unverified locally** — no env files)
- Stripe account + webhook secret
- Email provider credentials (if kept)
- DNS/domain

### Database blockers

- No migrations in repo
- Dual `cart`/`carts` ambiguity
- Orders schema incomplete/unverified
- RLS unknown

### Security blockers

- IDOR on cart/order APIs
- Unauthenticated webhook + save-order
- Middleware non-enforcement

### Manual verification blockers

- End-to-end checkout with real Stripe test mode
- Auth email confirmation flow
- Dashboard order visibility after webhook
- Cart clear after paid session

---

## Go-live checklist (minimum)

- [ ] `npm run build` passes on clean CI
- [ ] `tsc` and lint pass (or explicitly waived with plan)
- [ ] `.env.example` committed; production env set in Vercel
- [ ] Supabase migrations applied; RLS enabled; service role restricted
- [ ] Stripe webhook verified with signatures
- [ ] Server-side product pricing
- [ ] Auth session works for cart + orders
- [ ] Canonical product routes linked correctly
- [ ] No dead `/services` links (or page exists)
- [ ] Privacy/Terms real pages if collecting data
- [ ] Monitoring/error tracking chosen
- [ ] Manual test: guest browse → signup → add → pay → order visible → cart empty

---

## Logging / monitoring / backups

| Capability | Status |
|------------|--------|
| Structured logging | `console.*` only |
| Error tracking (Sentry etc.) | Missing |
| Analytics | Missing |
| DB backups | External/unknown |
| Rollback strategy | Git revert only; no documented process |
