# Blockers

## Resolved in Phase 01 (code)
| ID | Blocker | Resolution |
|----|---------|------------|
| B1 | Build fails — nodemailer | Dependency + types installed; build green |
| B2 | Unsigned webhook | Signature verification + idempotent events |
| B3 | IDOR cart/order APIs | Session auth; save-order retired (410) |
| B4 | No migrations/RLS in repo | Baseline migration committed |
| B5 | Dual cart + dual product routes | Canonical `/api/cart` + `/store/[slug]` |

## Open
| ID | Blocker | Phase | Class | Notes |
|----|---------|------:|-------|-------|
| B7 | Live Supabase migration apply + RLS proof | 01 | BLOCKED_EXTERNAL | Needs project credentials; do not invent schema |
| B8 | Stripe test webhook E2E | 01 | BLOCKED_EXTERNAL | Use Stripe CLI + test keys |
| B9 | GitHub Actions workflow publish | 01 | BLOCKED_EXTERNAL | YAML in `docs/operations/github-actions/`; needs OAuth `workflow` scope to place under `.github/workflows/` |
| B10 | npm audit highs (postcss/sharp via next) | 01 | DEFERRED | Avoid `npm audit fix --force` out-of-range bump without owner decision |

## Process
| ID | Blocker | Notes |
|----|---------|-------|
| B6 | Push deferred historically | Phase 00 OS now on origin (`ea68d30`) |
