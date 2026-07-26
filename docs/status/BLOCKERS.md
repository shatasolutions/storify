# Blockers

## Internal (application)
| ID | Blocker | Phase | Evidence |
|----|---------|------:|----------|
| B1 | `npm run build` fails — missing nodemailer | 01 | audit + build |
| B2 | Unsigned webhook / insecure payments path | 01 | api/webhook |
| B3 | IDOR cart/order APIs | 01 | get-cart/save-cart/get-orders |
| B4 | No migrations/RLS in repo | 01 | database audit |
| B5 | Dual cart + dual product routes | 01 | route inventory |

## Process
| ID | Blocker | Notes |
|----|---------|-------|
| B6 | Push deferred | Confirm GitHub permissions on shatasolutions/storify |
