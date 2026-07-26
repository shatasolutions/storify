# Phase 01 — Rescue and Security

## 1. Phase number and name
**Phase 01 — Rescue and Security**

## 2. Strategic objective
Rescue build quality and close critical security holes in the commerce prototype.

## 3. Why this phase exists
Build fails (nodemailer); unsigned webhooks; IDOR; client prices; no migrations/RLS; dual carts/routes.

## 4. Current evidence
- Audited application commit: `920c142` — see [project-audit](../project-audit/).
- Overall completion ~28%; production readiness ~8% (**Verified** at audit). Documentation-only work does **not** improve these percentages.
- See STORIFY_SECURITY_AUDIT.md and STORIFY_DEPLOYMENT_READINESS.md.

## 5. Entry criteria
- Phase 00 exit met or owner waiver.

## 6. Scope
- Build/tsc/lint; .env.example; migrations+RLS; auth enforcement; API authz; webhook signatures; price authority; idempotency; route/cart/client consolidation; CI; tests; secure preview.

## 7. Explicit non-scope
- Full multi-tenant product UI
- Theme builder
- Real AI product
- New marketing pages

## 8. Epics
1. Tooling rescue
2. Env contract
3. Schema+RLS
4. Auth SSR
5. API authz+prices
6. Webhooks
7. Consolidation
8. CI/tests

## 9. Detailed tasks
1. Reproduce failures from 920c142
2. Unblock build
3. Green tsc/lint
4. Migrations for single cart + orders
5. Signed webhooks
6. Remove IDOR
7. Server price lookup
8. Canonical /store/[slug] + one cart API
9. CI
10. Preview smoke

## 10. Dependencies
Phase 00 exit criteria met (or owner waiver in DECISIONS_NEEDED.md).

## 11. Likely affected modules and files
app/api/**, middleware.ts, lib/supabase*, context/CartContext.tsx, app/store/**, app/product/**, supabase/migrations/**, .github/workflows/**, .env.example

## 12. Database changes
First committed migrations + RLS; one cart table name.

## 13. API changes
Secure checkout/webhook/cart/orders; deprecate duplicates.

## 14. UI changes
Minimal honesty fixes only (no redesign).

## 15. Security requirements
All rescue SECURITY_GATES must pass.

## 16. Testing requirements
Webhook reject; price tamper reject; authz; CI build/tsc/lint.

## 17. Observability requirements
Safe structured logs.

## 18. Documentation requirements
- Update status files and [AGENT_HANDOFF.md](../handoffs/AGENT_HANDOFF.md).
- Update affected architecture/ops docs.
- File ADRs when decisions change.

## 19. External dependencies
Supabase + Stripe test credentials.

## 20. Risks
Demo breakage; data model dual-table conflicts.

## 21. Rollback considerations
Revert commits; expand/contract migrations.

## 22. Acceptance criteria
Build passes; critical audit issues closed or owner-deferred; CI green; no unsigned webhook; no client price trust; no user_id IDOR.

## 23. Phase exit gate
All applicable gates in [PHASE_GATES.md](../master-plan/PHASE_GATES.md) and [SECURITY_GATES.md](../security/SECURITY_GATES.md) must pass with evidence.

## 24. Required completion evidence
CI logs; tests; migrations; security evidence.

## 25. Suggested commit boundaries
Split: build; schema; authz; webhook; consolidation; CI.

## 26. Handoff requirements
Leave exact next task, files to read, and prohibited actions in the handoff.

## 27. Forbidden shortcuts
- Skipping security, RLS, or tests.
- Creating duplicate headers, routes, cart APIs, clients, or tables.
- Claiming completion without acceptance criteria + evidence.
- Starting the next phase early.
- Inventing secrets or remote database state.
