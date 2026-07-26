# Capability Map

```text
Storify
├── Identity and Control Plane
├── Commerce Core
├── Storefront Platform
├── Merchant Administration
├── Channels
├── AI and Automation
├── Developer Ecosystem
└── Trust and Operations
```

| Capability | Current | MVP? | Long-term? | Domain | Phase | Related Shata | External? |
|------------|---------|------|------------|--------|------:|---------------|-----------|
| Marketing site shell | PARTIAL | Yes (keep) | Yes | Storefront/Marketing | 00–01 | — | — |
| Auth email/password UI | PARTIAL | Yes | Yes | Identity | 01 | — | Supabase |
| Multi-tenant orgs/stores | NOT_STARTED | Yes | Yes | Organizations/Stores | 02 | — | — |
| Catalog/variants | PARTIAL (static) | Yes | Yes | Catalog | 03 | Scraper later | — |
| Server cart | PARTIAL/broken | Yes | Yes | Carts | 01/03 | — | — |
| Secure checkout/payments | PARTIAL/insecure | Yes | Yes | Checkout/Payments | 01/03 | Shata Pay later | Stripe/Paymob |
| COD | NOT_STARTED | Yes | Yes | Payments/Orders | 06 | — | Ops |
| Orders/fulfillment/returns | PARTIAL | Yes | Yes | Orders… | 03 | — | — |
| Merchant admin | NOT_STARTED | Yes | Yes | Admin | 04 | — | — |
| Theme builder | NOT_STARTED | Yes (basic) | Yes | Themes | 05 | — | — |
| AR/EN RTL | NOT_STARTED | Yes | Yes | Storefront | 05–06 | — | — |
| WhatsApp notifications | NOT_STARTED | Yes | Yes | Channels | 06/08 | Automation | WhatsApp |
| Merchant AI | NOT_STARTED (branding only) | Yes (basic) | Yes | AI | 07 | Guard/Codingo | Models |
| Automation engine | NOT_STARTED | Hooks | Yes | Automation | 08 | Shata Automation | Yes |
| POS | NOT_STARTED | No | Yes | POS | 09 | Restaurant OS | — |
| B2B | NOT_STARTED | No | Yes | B2B | 10 | — | — |
| Developer platform | NOT_STARTED | No | Yes | Integrations | 11 | — | Partners |
| Buyer network | NOT_STARTED | No | Yes | Buyer | 12 | — | — |
| Enterprise SSO/DR | NOT_STARTED | No | Yes | Trust | 13 | — | Contracts |
