# Phase 01 API authorization matrix

| Route | Auth | Authorization | Ownership | Service role | Notes |
|-------|------|---------------|-----------|--------------|-------|
| `GET/POST/DELETE /api/cart` | Session | Own cart | `auth.uid()` | No | Canonical cart API |
| `POST /api/checkout` | Session | Self | Session user in Stripe metadata | No | Server catalog pricing |
| `POST /api/checkout/confirm` | Session | Session owner must match Stripe session | Self | No | Clears cart only if paid |
| `POST /api/webhook` | Stripe signature | N/A | System | Yes | Idempotent `stripe_events` |
| `GET /api/get-orders` | Session | Own orders | `auth.uid()` | No | Dashboard contract |
| `GET /api/health` | None | Public | N/A | No | Readiness |
| `GET/POST /api/get-cart` | Retired | — | — | — | **410 Gone** |
| `POST /api/save-cart` | Retired | — | — | — | **410 Gone** |
| `POST /api/save-order` | Retired | — | — | — | **410 Gone** (was IDOR) |

Client-supplied `user_id` is never trusted. Prices are never accepted from the client.
