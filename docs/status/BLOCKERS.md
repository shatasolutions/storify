# Blockers

## Resolved (local Phase 01)
| ID | Blocker | Resolution |
|----|---------|------------|
| B1–B5 | Build/webhook/IDOR/migrations/dual routes | Closed in prior Phase 01 commits |
| B11 | nanoid/non-secure under Next postcss | Overrides + Next 16.2.12; `npm run dev` 200 |
| B12 | No automated RLS proof | PGlite applies baseline migration; User A/B/anon tests pass |

## Open — human credential unlock required
| ID | Blocker | Class | Exact human action |
|----|---------|-------|--------------------|
| B7 | Live Supabase migration apply | HUMAN | Reconnect Supabase MCP **or** create Storify staging project and put keys only in `.env.local` |
| B8 | Stripe CLI webhook E2E | HUMAN | Install Stripe CLI; add test `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` to `.env.local` |
| B9 | GitHub Actions workflow publish | HUMAN | `gh auth refresh -h github.com -s repo,workflow,read:org` then push `.github/workflows/phase01-quality.yml` |
| B10 | sharp via Next | DEFERRED | Await Next release that bumps sharp ≥0.35 without downgrade |

## Process
Do **not** apply Storify migrations to the shata-solutions Supabase host.
