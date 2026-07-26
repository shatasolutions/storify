# Phase Gates

A phase cannot be `VERIFIED` until applicable gates pass with evidence in [COMPLETION_EVIDENCE.md](../status/COMPLETION_EVIDENCE.md).

## Categories
1. **Product** — scope/AC met; non-scope respected
2. **Architecture** — domain ownership; no duplicates; ADRs followed
3. **Database** — migrations; RLS; rollback plan
4. **Security** — [SECURITY_GATES.md](../security/SECURITY_GATES.md)
5. **Testing** — required layers + CI
6. **Quality** — lint/types; a11y/responsive for UI
7. **Observability** — logs/metrics/audit for critical paths
8. **Documentation** — status + handoff + contract docs
9. **Deployment** — env/runbook items for the phase
10. **Owner-decision** — DECISIONS_NEEDED resolved or deferred
