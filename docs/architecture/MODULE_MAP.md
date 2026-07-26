# Module Map

## Current
Flat: `app/`, `components/`, `context/`, `lib/`.

## Target (modular monolith)
```text
modules/
  identity/ organizations/ stores/ catalog/ inventory/ pricing/
  customers/ carts/ checkout/ payments/ orders/ fulfillment/ returns/
  storefront/ themes/ publishing/ analytics/ ai/ automation/
  integrations/ billing/ audit/
apps/web/   # Next.js app router composing modules
```
Migrate incrementally in Phases 02–05; do not big-bang rewrite in Phase 01.
