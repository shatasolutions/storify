# Claude / Cursor Compatibility Notes for Storify

> **Canonical rules live in [`AGENTS.md`](./AGENTS.md).**  
> This file does **not** override `AGENTS.md`. If anything here conflicts, follow `AGENTS.md`.

## Repository orientation

- Product: **Storify** — AI-native multi-tenant unified commerce platform
- Preferred remote: `https://github.com/shatasolutions/storify.git`
- App is Next.js App Router under `app/`
- Official planning OS lives under `docs/`
- Historical audit evidence: `docs/project-audit/` (2026-07-24, commit `920c142`)

## Mandatory reading order

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/master-plan/STORIFY_MASTER_PLAN.md`
4. `docs/status/CURRENT_STATE.md`
5. `docs/status/IMPLEMENTATION_STATUS.md`
6. Active phase (`docs/status/ACTIVE_PHASE.md` → `docs/execution/...`)
7. Relevant architecture / security / ADRs / audit evidence

Then: `docs/handoffs/SESSION_START_CHECKLIST.md`

## Commands (documentation and baseline)

```bash
npm run docs:validate
git status --short
git diff --check
```

Application baseline (Phase 01+; do not “fix” casually during docs-only work):

```bash
npm install
npx tsc --noEmit
npm run lint
npm run build
```

Expect failures on audited commit `920c142` until Phase 01 rescue lands (e.g. missing `nodemailer`, env throws, TypeScript errors). Treat failures as evidence, not as permission to invent features.

## Status and handoff expectations

After meaningful work:

- Update `docs/status/CURRENT_STATE.md`
- Update `docs/status/IMPLEMENTATION_STATUS.md`
- Update `docs/status/IMPLEMENTATION_MATRIX.yaml`
- Update `docs/status/ACTIVE_PHASE.md`
- Update `docs/handoffs/AGENT_HANDOFF.md`
- Append `docs/status/STATUS_CHANGELOG.md`

Never claim completion without acceptance criteria + evidence.

## Prohibitions

- Do not create duplicate headers, cart APIs, product routes, Supabase clients, or schemas
- Do not implement Phase 01+ during unfinished Phase 00 unless owner waives
- Do not mark Phase 1 started from documentation-only sessions
- Do not claim production readiness improved without verified application/security changes
- Do not push unless remote ownership and branch safety are confirmed

## Product boundaries reminder

Storify owns commerce. Shata Pay owns payment infrastructure long-term. Shata Automation owns workflow runtime. See ADR-0009 and `docs/architecture/DOMAIN_OWNERSHIP.md`.
