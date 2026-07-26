# Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agents implement features before rescue | Critical security debt | Phase 01 rescue landed; Phase 02 gated |
| Duplicate routes/APIs return | Confusion/regressions | Canonical cart/store + 410 retirements |
| Docs drift from code | False status | Status updates mandatory |
| External providers delayed | Pilot / Phase 01 VERIFIED slips | EXTERNAL_DEPENDENCIES + BLOCKERS |
| AI before secure commerce | Abuse/fraud | Phase order 01→…→07 |
| Migration not applied remotely | Runtime cart/order failures | Apply baseline SQL before preview demo |
| Success-page trust regression | False paid UX | Confirm API requires Stripe `payment_status=paid` |
| Force-auditing Next deps | Break lockfile/range | Owner decision before bump |
