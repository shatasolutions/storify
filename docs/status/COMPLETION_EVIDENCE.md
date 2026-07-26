# Completion Evidence

## Acceptable evidence types
Test output · build output · commit hash · migration file · RLS test · screenshot · API response · preview URL · security review notes · external confirmation

## Phase 00 evidence log
| Item | Evidence |
|------|----------|
| OS docs created | docs/ tree + AGENTS.md |
| Validator | `npm run docs:validate` → OK |
| Synced to origin | `ea68d30` on `origin/main` (0 0) |
| Status | **VERIFIED** |

## Phase 01 evidence log (2026-07-26)
| Gate | Command / artifact | Result |
|------|-------------------|--------|
| Install | `npm ci` (lockfile preserved) | Pass |
| Docs | `npm run docs:validate` | Pass |
| Typecheck | `npx tsc --noEmit` / `npm run typecheck` | Pass (exit 0) |
| Lint | `npm run lint` | Pass (exit 0) |
| Tests | `npm test` (vitest, 21 tests) | Pass |
| Build | `npm run build` with CI placeholder public env | Pass |
| Schema+RLS | `supabase/migrations/202607260001_phase01_baseline.sql` | Committed; remote apply pending |
| Webhook signature | `constructEvent` + reject missing/invalid | Code + source tests |
| Idempotency | `stripe_events` PK | Code |
| Server pricing | `lib/catalog.ts` `priceCheckoutLines` | Unit tests reject unknown SKU/plan |
| IDOR retirement | `/api/save-order` → 410; cart uses `requireUser` | Code |
| Cart clear | `/api/checkout/confirm` requires paid Stripe session | Code |
| Canonical cart | `/api/cart`; legacy get/save-cart → 410 | Code |
| Canonical product | `/store/[slug]`; commerce SKUs redirect from `/product` | Code |
| Supabase clients | `lib/supabase/{browser,server,admin}.ts`; admin `server-only` | Code |
| CI workflow | `docs/operations/github-actions/phase01-quality.yml` | Documented; install to `.github/workflows/` needs `workflow` OAuth scope |
| Health | `GET /api/health` | Present |
| API matrix | `docs/security/API_AUTHORIZATION_MATRIX.md` | Present |
| Live Supabase RLS | — | **BLOCKED_EXTERNAL** |
| Stripe CLI E2E | — | **BLOCKED_EXTERNAL** |
| npm audit (omit=dev) | 3 high via Next transitive postcss/sharp | Documented; force bump deferred |

## Phase status
Phase 01 = **PARTIAL** until live Supabase + Stripe proofs land.
