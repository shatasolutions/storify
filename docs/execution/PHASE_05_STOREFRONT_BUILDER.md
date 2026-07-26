# Phase 05 — Storefront and Theme Builder

## 1. Phase number and name
**Phase 05 — Storefront and Theme Builder**

## 2. Strategic objective
Deliver Storefront and Theme Builder toward the platform vision.

## 3. Why this phase exists
Next capability layer after prior gates; avoids skipping foundations.

## 4. Current evidence
- Audited application commit: `920c142` — see [project-audit](../project-audit/).
- Overall completion ~28%; production readiness ~8% (**Verified** at audit). Documentation-only work does **not** improve these percentages.
- Prior phase evidence required before start.

## 5. Entry criteria
- Phase 04 VERIFIED (or explicit waiver).

## 6. Scope
- Theme schema, sections/blocks, global styles, navigation, pages, preview, draft/publish, versions, rollback, SEO, Arabic/RTL, domains, a11y, performance.

## 7. Explicit non-scope
- Later phases.
- Systems owned by other Shata products (ADR-0009).

## 8. Epics
1. Core Storefront and Theme Builder
2. Security/tenancy for new surfaces
3. Tests/docs/status

## 9. Detailed tasks
1. Confirm entry
2. Implement scope
3. Migrations/API/UI
4. Tests + observability
5. Docs/status/handoff
6. Pass gates

## 10. Dependencies
Phase 04 exit criteria met with evidence.

## 11. Likely affected modules and files
Target modules/* , app route groups, supabase/migrations, api/v1

## 12. Database changes
Per DATA_MODEL.md with tenant columns + RLS.

## 13. API changes
Versioned /api/v1 per API_STANDARDS.md.

## 14. UI changes
Phase surfaces only; single Header architecture.

## 15. Security requirements
Update threat model + auth matrix.

## 16. Testing requirements
Unit/integration/e2e/RLS as applicable.

## 17. Observability requirements
Logs/metrics/audit for critical flows.

## 18. Documentation requirements
- Update status files and [AGENT_HANDOFF.md](../handoffs/AGENT_HANDOFF.md).
- Update affected architecture/ops docs.
- File ADRs when decisions change.

## 19. External dependencies
Record provider/Shata dependencies in EXTERNAL_DEPENDENCIES.md.

## 20. Risks
Scope creep; tenancy leaks; payment inconsistency.

## 21. Rollback considerations
Feature flags; expand/contract migrations.

## 22. Acceptance criteria
Scoped AC met with evidence; gates pass.

## 23. Phase exit gate
All applicable gates in [PHASE_GATES.md](../master-plan/PHASE_GATES.md) and [SECURITY_GATES.md](../security/SECURITY_GATES.md) must pass with evidence.

## 24. Required completion evidence
Tests, migrations, UI proof, security notes, status updates.

## 25. Suggested commit boundaries
Epic-sized, phase-pure commits.

## 26. Handoff requirements
Leave exact next task, files to read, and prohibited actions in the handoff.

## 27. Forbidden shortcuts
- Skipping security, RLS, or tests.
- Creating duplicate headers, routes, cart APIs, clients, or tables.
- Claiming completion without acceptance criteria + evidence.
- Starting the next phase early.
- Inventing secrets or remote database state.
