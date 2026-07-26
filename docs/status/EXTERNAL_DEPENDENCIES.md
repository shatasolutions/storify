# External Dependencies

| Dependency | Needed by | Status |
|------------|-----------|--------|
| Supabase project + keys | Phase 01+ | Code clients ready; live apply **BLOCKED_EXTERNAL** in this session |
| Stripe account + webhook secret | Phase 01+ | Code signed webhook ready; CLI E2E **BLOCKED_EXTERNAL** |
| GitHub Actions (`workflow` scope) | Phase 01 CI | Workflow YAML present; publish may need elevated OAuth |
| Egyptian provider (e.g. Paymob) | Phase 06 | Not configured |
| WhatsApp Business | Phase 06/08 | Not configured |
| Shata Pay / Automation / Guard | Later | Product boundaries only |
| GitHub org push access | Continuous | Remote `https://github.com/shatasolutions/storify.git` confirmed |
