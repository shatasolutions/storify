# Environment Configuration

## Overview

Storify validates environment variables through `lib/env.ts`. Missing public Supabase values fail client/server factory creation with clear errors. Stripe and service-role secrets fail only when a privileged operation requires them.

Never commit real secrets. Copy `.env.example` to `.env.local`.

## Variable classification

| Variable | Required | Visibility | Environments | Notes |
|----------|----------|------------|--------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (auth/data) | Client-safe | Dev + prod | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes (auth/data) | Client-safe | Dev + prod | Anon key only |
| `NEXT_PUBLIC_BASE_URL` | Recommended | Client-safe | Dev + prod | Defaults to `http://localhost:3000` |
| `SUPABASE_SERVICE_ROLE_KEY` | Prod/webhook | Server-only | Prod + local webhook | Never `NEXT_PUBLIC_*` |
| `STRIPE_SECRET_KEY` | Checkout/webhook | Server-only | Dev test + prod | Prefer `sk_test_` locally |
| `STRIPE_WEBHOOK_SECRET` | Webhook | Server-only | Dev + prod | From Stripe CLI or dashboard |
| `EMAIL_USER` | Optional | Server-only | Optional | Only if email notifications kept |
| `EMAIL_PASS` | Optional | Server-only | Optional | App password / SMTP secret |

## Build behavior

- **Marketing pages** can render without Stripe secrets.
- **Checkout/webhook/confirm** throw clear configuration errors if Stripe secrets are missing.
- **Service role** is used only by `lib/supabase/admin.ts` (imported with `server-only`) for webhook system writes.
- CI build uses placeholder public Supabase values; it does not require production secrets.

## Local setup

```bash
cp .env.example .env.local
# fill values
npm run dev
```

Stripe webhook local forwarding (test mode):

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

## Production checklist

1. Set all Production-required variables in the host.
2. Confirm webhook endpoint uses the live/test signing secret matching the Stripe mode.
3. Confirm `NEXT_PUBLIC_BASE_URL` matches the deployed origin.
4. Confirm service role is never exposed to the browser bundle.
