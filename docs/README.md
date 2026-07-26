# Storify Documentation

**Official documentation operating system for Storify.**  
Audited application baseline: commit `920c142` (2026-07-24).  
Preferred remote: [shatasolutions/storify](https://github.com/shatasolutions/storify).

## Authoritative documents

| Kind | Location | Authority |
|------|----------|-----------|
| Agent rules | [`AGENTS.md`](../AGENTS.md) | Highest — operating contract |
| Master Plan | [`master-plan/STORIFY_MASTER_PLAN.md`](./master-plan/STORIFY_MASTER_PLAN.md) | Official product + delivery plan |
| ADRs | [`adr/`](./adr/) | Foundational decisions |
| Current state | [`status/CURRENT_STATE.md`](./status/CURRENT_STATE.md) | Verified present only |
| Active phase | [`status/ACTIVE_PHASE.md`](./status/ACTIVE_PHASE.md) | What to do now |
| Audit evidence | [`project-audit/`](./project-audit/) | Historical snapshot — not the plan |

## Current vs future

- **Current state** = `status/*` + `project-audit/*` (evidence-backed).
- **Future state** = `master-plan/*`, `product/*`, `architecture/*`, `execution/*`.
- Never treat audit placeholders as shipped features.
- Never invent remote Supabase/Stripe production facts.

## Agents must read first

1. [`AGENTS.md`](../AGENTS.md)
2. This file
3. [`master-plan/STORIFY_MASTER_PLAN.md`](./master-plan/STORIFY_MASTER_PLAN.md)
4. [`status/CURRENT_STATE.md`](./status/CURRENT_STATE.md)
5. [`status/IMPLEMENTATION_STATUS.md`](./status/IMPLEMENTATION_STATUS.md)
6. Active phase via [`status/ACTIVE_PHASE.md`](./status/ACTIVE_PHASE.md)
7. Relevant architecture / security / ADRs / audit evidence

Session checklists: [`handoffs/SESSION_START_CHECKLIST.md`](./handoffs/SESSION_START_CHECKLIST.md).

## How to find the active phase

Open [`status/ACTIVE_PHASE.md`](./status/ACTIVE_PHASE.md). Only one phase is active unless an explicit exception is recorded.

## How to update project status

After meaningful work, update:

1. `status/CURRENT_STATE.md`
2. `status/IMPLEMENTATION_STATUS.md`
3. `status/IMPLEMENTATION_MATRIX.yaml`
4. `status/ACTIVE_PHASE.md`
5. `status/STATUS_CHANGELOG.md`
6. `handoffs/AGENT_HANDOFF.md`
7. Blockers / external deps / decisions files if needed

Allowed statuses: `NOT_STARTED` | `PLANNED` | `IN_PROGRESS` | `PARTIAL` | `BLOCKED_EXTERNAL` | `BLOCKED_INTERNAL` | `IMPLEMENTED_UNVERIFIED` | `VERIFIED` | `DEFERRED` | `RETIRED`

## How to create an ADR

1. Copy structure from [`adr/README.md`](./adr/README.md)
2. Add next ADR number
3. Link from Master Plan / PRODUCT_DECISIONS
4. Record in `MASTER_PLAN_CHANGELOG.md` if material

## Audit vs Master Plan

| Audit (`project-audit/`) | Master Plan (`master-plan/`) |
|---------------------------|-------------------------------|
| What existed on 2026-07-24 | What we will build |
| Evidence of bugs/gaps | Phases, gates, MVP |
| ~28% completion / ~8% prod readiness | Target platform |

## How completed work is proven

See [`status/COMPLETION_EVIDENCE.md`](./status/COMPLETION_EVIDENCE.md) and [`engineering/DEFINITION_OF_DONE.md`](./engineering/DEFINITION_OF_DONE.md).  
A file existing is **not** completion.

## After implementation, update

- Status files + handoff
- Affected architecture / ops docs
- ADR if decision changed
- Phase file acceptance evidence section

## Documentation map

### Planning
- [Master Plan](./master-plan/STORIFY_MASTER_PLAN.md)
- [Execution roadmap](./master-plan/EXECUTION_ROADMAP.md)
- [Phase gates](./master-plan/PHASE_GATES.md)
- [MVP scope](./master-plan/MVP_SCOPE.md)
- [Long-term scope](./master-plan/LONG_TERM_SCOPE.md)

### Product
- [Vision](./product/PRODUCT_VISION.md) · [PRD](./product/PRODUCT_REQUIREMENTS.md) · [Principles](./product/PRODUCT_PRINCIPLES.md)
- [Customers](./product/TARGET_CUSTOMERS.md) · [Capabilities](./product/CAPABILITY_MAP.md) · [Journeys](./product/USER_JOURNEYS.md)
- [Business model](./product/BUSINESS_MODEL.md) · [Market entry](./product/MARKET_ENTRY_STRATEGY.md) · [KPIs](./product/KPI_FRAMEWORK.md)

### Architecture & security
- [System overview](./architecture/SYSTEM_OVERVIEW.md) · [Domain ownership](./architecture/DOMAIN_OWNERSHIP.md)
- [Route map](./architecture/ROUTE_MAP.md) · [Data model](./architecture/DATA_MODEL.md)
- [Security model](./security/SECURITY_MODEL.md) · [Threat model](./security/THREAT_MODEL.md)

### Execution
- [Phase index](./execution/PHASE_INDEX.md) · Phases 00–13 under `execution/`

### Status & handoffs
- [Current state](./status/CURRENT_STATE.md) · [Active phase](./status/ACTIVE_PHASE.md) · [Handoff](./handoffs/AGENT_HANDOFF.md)

### Operations & engineering
- [Local development](./operations/LOCAL_DEVELOPMENT.md) · [Env config](./operations/ENVIRONMENT_CONFIGURATION.md)
- [Engineering standards](./engineering/ENGINEERING_STANDARDS.md) · [DoD](./engineering/DEFINITION_OF_DONE.md)

### Validation

```bash
npm run docs:validate
```
