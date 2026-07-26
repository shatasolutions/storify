# Active Phase

**Only one active phase.**

| Field | Value |
|-------|-------|
| Active phase | **00 — Governance and Project Control** |
| Status | `IN_PROGRESS` / `PARTIAL` |
| Objective | Establish docs OS, ADRs, status, agent rules, validation |
| Current epic | Documentation OS completion + local commit |
| Current task | Finish remaining OS files, run docs:validate, commit |
| Entry criteria | Met (repo + audit available) |
| Exit gate | docs:validate pass; handoff; Phase 01 still NOT_STARTED; commit created |
| Blockers | Push deferred until owner confirms |
| Latest evidence | Files under docs/, AGENTS.md, Cursor rules |
| Exact next action after Phase 00 | Reproduce Phase 01 baseline failures from `920c142` |

Phase 01 status: **NOT_STARTED** (do not begin implementation in this docs session beyond OS).
