# Authentication & Authorization

## Current gaps (Verified)
Anon client in browser; cookies expected but not set; middleware non-enforcing; dashboard API contract mismatch; no logout.

## Target
- Supabase Auth + `@supabase/ssr` cookies
- Middleware enforces protected routes
- RBAC per [AUTHORIZATION_MATRIX.md](../security/AUTHORIZATION_MATRIX.md)
- Service role only for trusted server jobs
