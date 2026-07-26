# Database — Phase 01 baseline

## Migration
`supabase/migrations/202607260001_phase01_baseline.sql`

## Tables
- `profiles` — user profile row keyed to `auth.users`
- `carts` — one JSON cart per user (canonical; legacy `cart` table name retired)
- `orders` — `total_minor`, `currency`, `status`, unique `stripe_session_id`
- `stripe_events` — webhook idempotency (PK = Stripe event id)

## RLS
Deny-by-default enabled. Owner policies on profiles/carts; orders select-own; stripe_events deny-all (service role only).

## Local / empty DB
Apply the SQL file to a fresh Supabase/Postgres with `auth.users` available.

## Production comparison
**BLOCKED_EXTERNAL** until credentials allow introspection. Do not invent remote state.

## Not applied this session
No production (or remote) migration was executed from the agent environment.
