# Active Phase

**Only one active phase.**

| Field | Value |
|-------|-------|
| Active phase | **01 — Rescue and Security** |
| Status | `PARTIAL` |
| Objective | Close remaining live Supabase / Stripe / GitHub Actions gates |
| Current epic | Human credential unlock → remote proofs → VERIFIED |
| Current task | Waiting on GitHub `workflow` scope, Supabase staging access, Stripe test keys/CLI |
| Entry criteria | Phase 00 VERIFIED |
| Exit gate | Live migration+RLS on Supabase staging; Stripe CLI E2E; Actions green |
| Blockers | See CURRENT_STATE.md human-only list |
| Exact next action | Human: `gh auth refresh -h github.com -s repo,workflow,read:org` then reconnect Supabase MCP and add Stripe test secrets to `.env.local` |

Phase 00 status: **VERIFIED**.
Phase 02+: **NOT_STARTED** (entry blocked until Phase 01 VERIFIED).
