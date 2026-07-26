# Route Map

## Current (Verified)
|/|auth|dashboard|store|store/[slug]|product/[slug]|cart|checkout|pricing|demo|success|
APIs: checkout, webhook, cart, save-cart, get-cart, save-order, get-orders  
Missing linked: /services → 404

## Canonical target decisions
| Concept | Canonical | Action |
|---------|-----------|--------|
| Catalog | /store | Preserve |
| Product detail (commerce) | /store/[slug] | Consolidate; redirect /product/:sku if needed |
| Marketing feature pages | /product/[feature] optional | Not for SKUs |
| Cart | /cart | Preserve |
| Checkout | /checkout | Preserve |
| Success | /success | Preserve |
| Auth | /auth | Preserve; add logout |
| Merchant admin | /admin or /dashboard/* | Evolve dashboard |
| APIs | /api/v1/* | Version; deprecate dupes |
| Webhooks | /api/webhooks/* | Signed |

ADR-0011.
