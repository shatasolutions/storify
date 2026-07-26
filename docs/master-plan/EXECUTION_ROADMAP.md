# Execution Roadmap

Dependency-based. No calendar dates.

| Phase | Name | Objective | Entry | Deliverables | Deps | Exit highlights | External? |
|------:|------|-----------|-------|--------------|------|-----------------|-----------|
| 00 | Governance | OS | Repo | Docs/ADRs/status/validate | — | docs:validate | Push ownership |
| 01 | Rescue | Secure buildable prototype | 00 | Build, schema, RLS, authz, webhooks, CI | 00 | Security rescue gates | Supabase/Stripe |
| 02 | Multi-tenant | Org/store/RBAC | 01 | Tenancy | 01 | RLS proven | — |
| 03 | Commerce | Catalog→order | 02 | Commerce core | 02 | E2E test checkout | Payments |
| 04 | Admin | Merchant ops UI | 03 | Dashboard | 03 | Journeys | — |
| 05 | Storefront | Themes/publish | 04 | Builder | 04 | Publish/rollback | Domains |
| 06 | MENA pilot | Real pilots | 05 | Paymob/COD/WhatsApp | 05 | Pilot checklist | Providers |
| 07 | AI | Copilot/employees | 06* | AI + approvals | 06 | AI security | Models |
| 08 | Omni | Channels/automation | 07 | Automation+channels | 07 | Sync | Shata Automation |
| 09 | POS | Retail/packs | 08 | POS | 08 | Shared inventory | Restaurant OS |
| 10 | B2B/Intl | Markets | 09 | B2B | 09 | Multi-market | — |
| 11 | Developers | APIs/apps | 10 | Platform | 10 | App review | Partners |
| 12 | Buyer net | Consumer graph | 11 | Buyer features | 11 | One-tap pilot | — |
| 13 | Enterprise | Scale | 12 | SSO/DR/SLA | 12 | Enterprise checklist | Contracts |

\* Limited AI spikes after Phase 03 only behind flags; default production AI after Phase 06.
