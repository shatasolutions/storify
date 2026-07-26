# Product Requirements (PRD)

## Problem
MENA merchants juggle storefronts, WhatsApp chats, COD, fragmented payments, and manual ops. Existing global platforms are heavy, expensive, or weak on regional realities. The current Storify repo is only a marketing/prototype shell ([audit](../project-audit/)).

## Goals
- Multi-tenant secure commerce MVP
- AR/EN + regional payments/COD
- Merchant admin + storefront builder basics
- Permissioned merchant AI
- Clean integration boundaries with Shata products

## Non-goals (MVP)
- Full Shopify parity; POS; B2B; buyer network; public app store; autonomous high-risk AI

## Users
Org owners, store staff (RBAC), customers/buyers, later developers/partners, platform admins.

## Primary workflows
See [USER_JOURNEYS.md](./USER_JOURNEYS.md).

## Functional requirements (MVP summary)
Identity · Orgs/Stores · Catalog/Variants/Collections · Inventory · Pricing · Customers · Server cart · Checkout · Payments (Stripe + EG provider + COD) · Orders · Fulfillment · Returns · Themes/pages · Domains · Analytics basics · Merchant AI basics · Automation hooks · WhatsApp notifications · Audit logs

## Non-functional
Security (RLS, signed webhooks, no IDOR) · Reliability · Performance budgets · Accessibility · Localization/RTL · Observability

## Success metrics
See [KPI_FRAMEWORK.md](./KPI_FRAMEWORK.md).

## Assumptions
- Supabase/Postgres initially (ADR-0004)
- Modular monolith (ADR-0003)
- Owner provides provider accounts for Phase 01+

## Risks
See [../status/RISKS.md](../status/RISKS.md).

## Open decisions
See [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md) and [../status/DECISIONS_NEEDED.md](../status/DECISIONS_NEEDED.md).
