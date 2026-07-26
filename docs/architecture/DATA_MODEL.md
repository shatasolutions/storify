# Data Model (Design Only)

**Do not implement migrations in Phase 00.**

## Conventions
- Money: integer **minor units** + `currency` (ISO)
- IDs: UUID/cuid
- Timestamps: `created_at`, `updated_at`
- Soft delete: `deleted_at` where needed
- Tenant: `organization_id`, `store_id` on commerce tables
- Idempotency keys on payments/webhooks/checkouts
- Order **snapshots** of line items at purchase
- Inventory **reservations** with TTL/state
- `payment_attempts`, `provider_events`
- `outbox_events`, `webhook_deliveries`, `audit_events`

## Core entities
organizations · stores · memberships · roles · products · variants · collections · media · inventory_items · inventory_reservations · customers · carts · cart_items · checkout_sessions · orders · order_items · payments · fulfillments · returns · themes · page_revisions · ai_tool_calls · ai_approvals

State machines: [COMMERCE_LIFECYCLES.md](./COMMERCE_LIFECYCLES.md)
