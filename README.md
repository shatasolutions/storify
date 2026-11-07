# Storify

An early-stage personal project by [Mostafa Shata](https://github.com/shatasolutions): an
AI-native, multi-tenant commerce platform built with Next.js, Supabase and Stripe.

> **Not a Shata Solutions product, and not production-ready.** Shata Solutions' products and
> engineering live at [github.com/shata-solutions](https://github.com/shata-solutions).

## Status

Phase 00 (governance) is verified. Phase 01 (rescue and security) is partial: local build,
row-level-security isolation tests and Stripe webhook tests pass, while live staging
database, payment and CI gates are still open. Later phases have not started. The current,
evidence-backed state is kept in [`docs/status/`](docs/status/), starting with
[`CURRENT_STATE.md`](docs/status/CURRENT_STATE.md).

## Run it locally

```bash
npm ci
cp .env.example .env.local   # fill in your own Supabase and Stripe test values
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm test` | Unit and isolation tests (Vitest) |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint |
| `npm run docs:validate` | Checks the project documentation structure |

## Documentation

- [`AGENTS.md`](AGENTS.md) — product definition and the working contract for contributors
- [`docs/`](docs/) — architecture, decisions (ADRs), security notes and the master plan
