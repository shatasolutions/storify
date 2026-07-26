# Phase 00 — Governance and Project Control

## 1. Phase number and name
**Phase 00 — Governance and Project Control**

## 2. Strategic objective
Establish the official Storify Project Operating System.

## 3. Why this phase exists
Without a single source of truth, agents recreate insecure duplicates.

## 4. Current evidence
- Audited application commit: `920c142` — see [project-audit](../project-audit/).
- Overall completion ~28%; production readiness ~8% (**Verified** at audit). Documentation-only work does **not** improve these percentages.
- Audit docs exist under docs/project-audit/.

## 5. Entry criteria
- Repository access.
- Ability to commit documentation.

## 6. Scope
- AGENTS.md, Cursor rules, full docs OS, ADRs, status, handoffs, GitHub templates, docs:validate.

## 7. Explicit non-scope
- Application feature implementation.
- Schema migrations execution as product work.
- UI redesign.
- Phase 01 code fixes.

## 8. Epics
1. Governance files
2. Master Plan & product docs
3. Architecture & security docs
4. Phases 00–13
5. Status/handoff/ADR/GitHub/validate

## 9. Detailed tasks
1. Author OS docs
2. Initialize status (Phase 00 IN_PROGRESS/PARTIAL)
3. Run docs:validate
4. Commit locally
5. Do not push until remote ownership confirmed

## 10. Dependencies
None (bootstrap).

## 11. Likely affected modules and files
- AGENTS.md, CLAUDE.md, .cursor/rules/*, docs/**, .github/**, scripts/validate-project-docs.mjs, package.json (docs:validate only)

## 12. Database changes
Design documentation only.

## 13. API changes
None.

## 14. UI changes
None.

## 15. Security requirements
Document gates; do not weaken application security.

## 16. Testing requirements
npm run docs:validate passes.

## 17. Observability requirements
Document targets only.

## 18. Documentation requirements
- Update status files and [AGENT_HANDOFF.md](../handoffs/AGENT_HANDOFF.md).
- Update affected architecture/ops docs.
- File ADRs when decisions change.

## 19. External dependencies
Confirm shatasolutions/storify before push.

## 20. Risks
Docs drift; premature Phase 01.

## 21. Rollback considerations
Revert docs commit.

## 22. Acceptance criteria
- Required docs exist
- docs:validate passes
- Phase 01 NOT_STARTED
- Handoff lists Phase 01 reproduce-failures task

## 23. Phase exit gate
All applicable gates in [PHASE_GATES.md](../master-plan/PHASE_GATES.md) and [SECURITY_GATES.md](../security/SECURITY_GATES.md) must pass with evidence.

## 24. Required completion evidence
Validator output; commit hash; file inventory.

## 25. Suggested commit boundaries
docs(storify): establish master plan and project operating system

## 26. Handoff requirements
Leave exact next task, files to read, and prohibited actions in the handoff.

## 27. Forbidden shortcuts
- Skipping security, RLS, or tests.
- Creating duplicate headers, routes, cart APIs, clients, or tables.
- Claiming completion without acceptance criteria + evidence.
- Starting the next phase early.
- Inventing secrets or remote database state.
