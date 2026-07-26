# Domain Ownership

For each domain: purpose, entities, rules, interfaces, events, deps, prohibited deps, Shata link.

| Domain | Purpose | Key entities | Prohibited |
|--------|---------|--------------|------------|
| Identity | Auth users/sessions | users, sessions | Owning catalog |
| Organizations | Tenant orgs | organizations, memberships | Payment provider internals |
| Stores | Store units | stores, domains, settings | Workflow engine |
| Catalog | Sellable items | products, variants, collections, media | Inventory ledgers owned elsewhere incorrectly |
| Inventory | Stock | levels, reservations | Price calculation ownership |
| Pricing | Prices/discounts | price_lists, discounts | Charging cards |
| Customers | Buyer profiles | customers, addresses | Platform billing |
| Carts | Cart aggregate | carts, cart_items | Final capture |
| Checkout | Checkout session | checkout_sessions, snapshots | Provider settlement |
| Payments | Attempts via port | payment_attempts, provider_events | Building Shata Pay core |
| Orders | Orders | orders, order_items | Shipping carrier APIs long-term maybe |
| Fulfillment | Ship/fulfill | fulfillments | Payments capture |
| Returns | RMA | returns, refunds linkage | — |
| Storefront | Public store UX | — | Admin RBAC |
| Themes | Theme schema | themes, sections | — |
| Publishing | Draft/publish | revisions | — |
| Analytics | Metrics | events aggregates | Raw payment PAN |
| AI | Copilot/tools | tool_calls, approvals | Unrestricted SQL |
| Automation | Triggers to Shata Automation | stubs/connectors | Full workflow engine |
| Integrations | Apps/webhooks | oauth_apps | — |
| Billing | Platform SaaS billing | subscriptions | Commerce order payments confusion |
| Audit | Audit log | audit_events | — |

Detailed event names: [EVENT_ARCHITECTURE.md](./EVENT_ARCHITECTURE.md).
