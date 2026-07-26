# Event Architecture

- Domain events via **transactional outbox** (ADR-0010)
- At-least-once delivery; consumers idempotent
- Versioned payloads; dead-letter queue
- Correlation IDs for audit

## Sample catalog
`store.created` · `product.published` · `checkout.started` · `payment.succeeded` · `order.placed` · `order.fulfilled` · `refund.succeeded` · `ai.tool.requested` · `ai.tool.approved`
