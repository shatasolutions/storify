# ADR-0009: SHATA PRODUCT BOUNDARIES

- **Status:** Accepted
- **Date:** 2026-07-25

## Context
Storify must scale as a platform while the repo is currently a prototype (`920c142` audit).

## Decision
Clear ownership vs Pay/Automation/Guard/Scraper/Restaurant/Codingo.

## Alternatives considered
- Duplicating those engines rejected
- Delay decision (rejected — causes agent thrash)

## Consequences
- Guides phases, schema, and agent rules
- Requires discipline not to re-litigate casually

## Risks
- Over-constraining early spikes — mitigate with ADRs + changelog

## Migration impact
None for Phase 00; shapes Phase 01+ migrations and APIs.

## Related documents
[STORIFY_MASTER_PLAN.md](../master-plan/STORIFY_MASTER_PLAN.md) · [AGENTS.md](../../AGENTS.md)

## Revisit conditions
Material market/tech change recorded in MASTER_PLAN_CHANGELOG with superseding ADR.
