# Storify — Agent Instructions (Canonical)

> **This file is the universal operating contract for every human engineer and AI agent working on Storify.**  
> If any other instruction conflicts with this file, **this file wins** unless an ADR explicitly supersedes it.

**Last updated:** 2026-07-25  
**Active phase:** Phase 00 — Governance and Project Control (`PARTIAL` / `IN_PROGRESS`)  
**Audited application commit:** `920c142`  
**Official remote (preferred):** `https://github.com/shatasolutions/storify.git`

---

## 1. Product definition

Storify is:

> An **AI-native, multi-tenant unified commerce platform** that allows businesses to create, launch, manage, automate, and grow all sales channels from one system.

Storify is **not**:

- A single ecommerce store
- A Shopify UI clone
- A basic website builder
- A Stripe checkout demo
- An AI landing-page generator
- A collection of disconnected pages
- A single-merchant application

**Long-term promise:** Build and run your entire business through one conversation.  
**Initial market:** Egypt and MENA (globally extensible).  
**MVP:** Narrower than the long-term vision — see `docs/master-plan/MVP_SCOPE.md`.

---

## 2. Source-of-truth document order

| Rank | Document | Role |
|------|----------|------|
| 1 | `AGENTS.md` (this file) | Operating rules |
| 2 | `docs/README.md` | Documentation map |
| 3 | `docs/master-plan/STORIFY_MASTER_PLAN.md` | Official Master Plan |
| 4 | `docs/status/CURRENT_STATE.md` | Verified present state only |
| 5 | `docs/status/IMPLEMENTATION_STATUS.md` | Capability status matrix |
| 6 | Active phase file under `docs/execution/` | What to do now |
| 7 | Relevant `docs/architecture/*` | Target design |
| 8 | Relevant `docs/security/*` | Security requirements |
| 9 | `docs/project-audit/*` | Historical evidence (2026-07-24) |
| 10 | Relevant `docs/adr/*` | Foundational decisions |

**Audit documents describe the past verified state.**  
**Master Plan / architecture documents describe the approved future.**  
Never treat audit placeholders as completed product features.

---

## 3. Required reading order (every session)

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/master-plan/STORIFY_MASTER_PLAN.md` (or skim + deep-read sections relevant to the task)
4. `docs/status/CURRENT_STATE.md`
5. `docs/status/IMPLEMENTATION_STATUS.md`
6. `docs/status/ACTIVE_PHASE.md` → open the linked phase file
7. Relevant architecture docs
8. Relevant security docs
9. Existing audit evidence for the touched area
10. Relevant ADRs

Then follow `docs/handoffs/SESSION_START_CHECKLIST.md`.

---

## 4. Preflight steps (mandatory before code changes)

1. `git status`, `git branch -vv`, `git remote -v`, `git log -5 --oneline`
2. Confirm you will not discard uncommitted work
3. Read `CURRENT_STATE.md` and `ACTIVE_PHASE.md`
4. Confirm the intended phase’s **entry criteria** are met
5. Search for existing implementations of the same concept (routes, Header, cart APIs, Supabase clients, tables)
6. State the exact task you will perform
7. Do **not** begin a later phase early

**This Phase 00 documentation task forbids application feature implementation.**  
After Phase 00 gates pass, Phase 01 is rescue/security only.

---

## 5. Phase execution rules

1. Only one phase is **active** unless an explicit exception is recorded in `ACTIVE_PHASE.md`.
2. No phase may begin until dependencies and entry criteria are satisfied (`docs/master-plan/PHASE_GATES.md`).
3. Required workflow for implementation sessions:

   1. Read  
   2. Inspect  
   3. Plan  
   4. Implement  
   5. Test  
   6. Review  
   7. Update documentation  
   8. Update status  
   9. Create handoff  
   10. Commit  

4. Stop at phase gates. Do not “just continue” into the next phase.
5. Phase 01 must not start until Phase 00 exit criteria are met or an owner waiver is recorded in `DECISIONS_NEEDED.md`.

---

## 6. No-duplication rules

**Never create a second:**

- Master Plan
- Status file that conflicts with `CURRENT_STATE.md` / `IMPLEMENTATION_MATRIX.yaml`
- Header / layout chrome outside the canonical Header path
- Cart context or cart API concept
- Product detail route concept for commerce SKUs
- Supabase browser/server/admin client pattern
- Database table for the same entity under a different name
- Overlapping ADR for the same decision

Canonical commerce product detail path (target): `/store/[slug]`  
Canonical marketing Header (current): `components/Header.tsx` via `app/layout.tsx` only  
See ADR-0011 and `docs/architecture/ROUTE_MAP.md`.

---

## 7. Evidence requirements

Every claim about current implementation must cite evidence:

- File path, route, component, function, migration, test output, command result, or audit doc

Distinguish:

- **Verified** — observed in repo/commands  
- **Partially verified** — code exists but not end-to-end proven  
- **Inferred** — reasonable deduction; label it  
- **Unverified** — not checked  
- **Externally blocked** — needs credentials/accounts/outside systems  
- **Planned** — target state only  

**A file existing is not completion.**

---

## 8. Security requirements (non-negotiable)

- No client-authoritative prices, taxes, discounts, or inventory decisions
- No unsigned payment webhooks in production paths
- No service-role key in browser or `NEXT_PUBLIC_*`
- No trusting client-supplied `user_id` / `store_id` / `organization_id` for authorization
- RLS required for multi-tenant data once schema lands
- Secrets never committed; names only in docs
- AI tools must be permissioned; no unrestricted DB access; no cross-merchant memory

See `docs/security/SECURITY_GATES.md`.

---

## 9. Testing requirements

- Phase-required tests must pass before claiming completion
- Prefer failing tests that prove the bug before fixing (when implementing)
- RLS, webhook signature, and price-authority tests are mandatory once those areas change
- No “tests exist” without assertions that match acceptance criteria

---

## 10. Migration rules

- Every schema change requires a committed migration
- Migrations are immutable after deploy
- Expand → migrate → contract
- Include RLS with schema where applicable
- Document rollback
- See `docs/engineering/DATABASE_MIGRATION_POLICY.md`

---

## 11. Commit rules

- Commit only when asked or when a phase/task Definition of Done requires it and the user has authorized committing for that session
- Never force-push to `main`
- Never commit secrets
- Prefer focused commits with clear why
- Do not amend pushed commits
- Update status + handoff in the same change set when completing meaningful work

---

## 12. Status-update rules

After every meaningful task, update:

1. `docs/status/CURRENT_STATE.md`
2. `docs/status/IMPLEMENTATION_STATUS.md`
3. `docs/status/IMPLEMENTATION_MATRIX.yaml`
4. `docs/status/ACTIVE_PHASE.md`
5. `docs/status/BLOCKERS.md` / `EXTERNAL_DEPENDENCIES.md` / `DECISIONS_NEEDED.md` if applicable
6. `docs/status/STATUS_CHANGELOG.md`
7. `docs/handoffs/AGENT_HANDOFF.md`

Allowed statuses: `NOT_STARTED` | `PLANNED` | `IN_PROGRESS` | `PARTIAL` | `BLOCKED_EXTERNAL` | `BLOCKED_INTERNAL` | `IMPLEMENTED_UNVERIFIED` | `VERIFIED` | `DEFERRED` | `RETIRED`

---

## 13. Handoff rules

End every session with a current `docs/handoffs/AGENT_HANDOFF.md` using the session-end checklist.  
The next agent must be able to resume **without chat history**.

---

## 14. Definition of Done

A feature/task is done only when `docs/engineering/DEFINITION_OF_DONE.md` is satisfied, including acceptance criteria, tests, docs, and status updates with evidence.

---

## 15. Prohibited actions

- Implementing Phase 01+ product work during Phase 00 docs-only sessions (this OS establishment)
- Creating duplicate headers, cart APIs, product routes, Supabase clients, or schemas
- Claiming production readiness improved without application + security verification
- Marking phases `VERIFIED` without exit gates
- Skipping security gates
- Exposing secrets in docs or commits
- Inventing remote Supabase/Stripe production state
- Pushing when remote ownership or branch safety is unclear
- Redesigning UI / adding product pages as part of governance tasks

---

## 16. External blockers

If work needs credentials, accounts, or outside systems:

1. Record in `docs/status/EXTERNAL_DEPENDENCIES.md` and `BLOCKERS.md`
2. Mark capability `BLOCKED_EXTERNAL`
3. Continue only on unblocked work within the same phase
4. Do not invent configuration values

---

## 17. Recovery after interrupted work

1. Read `AGENT_HANDOFF.md` and `CURRENT_STATE.md`
2. Inspect `git status` / diff
3. Do not reset or discard unknown changes
4. Re-run baseline checks for the active phase
5. Resume the **exact next task** listed in the handoff

---

## 18. Shata product boundaries (summary)

| System | Owns |
|--------|------|
| **Storify** | Commerce, catalog, carts, checkout UX, orders, storefront, merchant AI surface, commerce analytics |
| **Shata Pay** | Payment adapters, intents, routing, reconciliation, payouts (long-term) |
| **Shata Automation** | Workflow engine, triggers/actions runtime |
| **ShataGuard** | Risk/security policy decisions, AI action governance |
| **Ultimate Scraper** | Import/scraping extraction |
| **Restaurant OS** | Restaurant ops (future industry pack) |
| **Codingo** | Optional future model routing / agent infra |

Storify must remain independently operable. Details: `docs/architecture/DOMAIN_OWNERSHIP.md`, ADR-0009.

---

## 19. Immediate next implementation task (after Phase 00)

> Begin Phase 01 baseline stabilization by reproducing the build, TypeScript, lint, environment, schema, authentication, payment and API authorization failures from audited commit `920c142` without implementing unrelated features.

Do **not** start Phase 01 until Phase 00 exit criteria pass or an owner waiver is recorded.
