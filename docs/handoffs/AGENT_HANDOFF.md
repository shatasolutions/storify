# Agent Handoff

**Updated:** 2026-07-26

## Project
Storify

## Branch / commit
- Branch: `main`
- Audited application baseline: `920c142`
- Phase 00 OS on origin: `ea68d30`
- Phase 01 rescue: commits created in this session (see `git log`)

## Remote
`origin` → `https://github.com/shatasolutions/storify.git`

## Active phase
Phase **01** — Rescue and Security — `PARTIAL`

## Work completed this session
- Closed Phase 00 (already synced) and executed Phase 01 rescue workstreams.
- Env validation (`lib/env.ts`), canonical Supabase clients, auth (`requireUser` + middleware).
- Baseline migration + RLS; signed Stripe webhook + idempotency; server-authoritative checkout pricing.
- Canonical `/api/cart` and `/store/[slug]`; retired insecure/legacy APIs with 410.
- Cart clear only after `/api/checkout/confirm` verifies paid Stripe session.
- Vitest suite + CI workflow definition under `docs/operations/github-actions/` (blocked from `.github/workflows/` by OAuth scope) + status/handoff docs.

## Application areas touched
`app/api/**`, `app/{auth,cart,checkout,dashboard,demo,product,store,success}`, `components/Header.tsx`, deleted `components/Layout.tsx`, `context/CartContext.tsx`, `lib/**`, `middleware.ts`, `supabase/migrations/**`, `tests/**`, `.github/workflows/**`, docs/status + ops/security.

## Commands (must stay green)
```bash
npm ci
npm run docs:validate
npx tsc --noEmit
npm run lint
npm test
npm run build   # with public Supabase placeholders for CI
git diff --check
```

## Decisions made
- Canonical commerce product route: `/store/[slug]`
- Canonical cart API: `/api/cart`
- Orders created only via signed webhooks
- Service role only in `lib/supabase/admin.ts` (`server-only`)

## Decisions pending
See `docs/status/DECISIONS_NEEDED.md` (Supabase apply auth, Stripe E2E, Next audit bump).

## Blockers
- `BLOCKED_EXTERNAL`: live Supabase migration/RLS proof
- `BLOCKED_EXTERNAL`: Stripe CLI webhook E2E
- GitHub `workflow` scope required to install Actions YAML into `.github/workflows/`

## Exact next task
> Apply `supabase/migrations/202607260001_phase01_baseline.sql` to a **non-production** Supabase project, run `stripe listen --forward-to localhost:3000/api/webhook`, prove signed + replay-safe processing, then mark Phase 01 `VERIFIED` with evidence. **Do not start Phase 02.**

## Next agent must read
1. AGENTS.md
2. docs/status/CURRENT_STATE.md
3. docs/status/ACTIVE_PHASE.md
4. docs/status/COMPLETION_EVIDENCE.md
5. docs/status/BLOCKERS.md
6. docs/execution/PHASE_01_RESCUE_AND_SECURITY.md
7. docs/security/API_AUTHORIZATION_MATRIX.md

## Prohibited
- Starting Phase 02
- Force-push; committing secrets
- Creating duplicate headers/routes/cart APIs/Supabase clients
- Claiming Phase 01 VERIFIED without live external proofs (or owner waiver)
- Weakening security tests to get green

## Committed / pushed
- Commits: `386ae03`, `d8688cb`, `51bcabf`, `b1ae0dd`, `1884b27`
- Pushed: **Yes** to `origin/main`
- Sync: `0 0` after push
- HEAD: `1884b27`
