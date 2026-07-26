# Payment Architecture

## Current
Stripe Checkout session + insecure webhook (audit).

## Target
`PaymentProvider` port: createIntent/session, refund, verifyWebhook, reconcile.  
Adapters: Stripe, Paymob, COD.  
Shata Pay becomes orchestration layer later without rewriting checkout UX.
