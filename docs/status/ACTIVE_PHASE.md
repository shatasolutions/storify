# Active Phase

**Only one active phase.**

| Field | Value |
|-------|-------|
| Active phase | **01 — Rescue and Security** |
| Status | `PARTIAL` |
| Objective | Buildable, typed, linted, schema-owned, authz-safe commerce prototype |
| Current epic | External verification (Supabase apply + Stripe webhook E2E + CI on GitHub) |
| Current task | Apply baseline migration to a safe Supabase project; confirm webhook with Stripe CLI |
| Entry criteria | Phase 00 VERIFIED (`ea68d30` on `origin/main`) |
| Exit gate | Remaining external proofs before `VERIFIED` |
| Blockers | Live Supabase/Stripe verification; optional workflow-scope for CI publish |
| Exact next action | Apply Phase 01 migration to non-prod Supabase and verify signed webhook end-to-end |

Phase 00 status: **VERIFIED**.
Phase 02+: **NOT_STARTED** (do not start).
