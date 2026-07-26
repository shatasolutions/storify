# Threat Model

## Assets
Credentials, tenant data, orders, payments metadata, AI memory, secrets, admin sessions.

## Actors
Anonymous buyer · authenticated customer · staff · org owner · attacker · malicious app · compromised AI tool caller.

## Trust boundaries
Browser ↔ Next.js · Next.js ↔ Postgres · Next.js ↔ Payment providers · Next.js ↔ Automation · AI model ↔ tools.

## Priority threats (Phase 01)
| Threat | Severity | Phase |
|--------|----------|------:|
| Unsigned payment webhook forgery | Critical | 01 |
| IDOR via client user_id + service role | Critical | 01 |
| Client price manipulation | Critical | 01 |
| Unauthenticated order insert | Critical | 01 |
| Missing RLS | High | 01–02 |
| Cross-tenant AI memory leak | Critical | 07 |
| Privilege escalation via weak RBAC | High | 02–04 |
