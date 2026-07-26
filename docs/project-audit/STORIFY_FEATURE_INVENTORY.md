# Storify — Feature Inventory

**Status legend:** Complete | Working but incomplete | Mocked | Broken | Missing | Unverified | Production-ready

---

## Feature matrix

| Feature | Status | Evidence | User-facing route | Backend support | Database support | Tests | Remaining work |
|---------|--------|----------|-------------------|-----------------|------------------|-------|----------------|
| Marketing homepage | Working but incomplete | `app/page.tsx` (~985 lines), CTAs mostly non-navigating `PrimaryButton` | `/` | None | N/A | None | Wire CTAs; remove dead `NavDropdown`; dedupe footer |
| Global header/nav | Working but incomplete | `components/Header.tsx` in `app/layout.tsx` | all pages | N/A | N/A | None | Fix dead links; simplify mega-menu; a11y |
| Footer | Working but incomplete | `components/Footer.tsx` + duplicate footer in `app/page.tsx` | all pages | N/A | N/A | None | Single footer; real Privacy/Terms |
| Email/password login | Broken / externally blocked | `app/auth/page.tsx` `signInWithPassword`; 500 without env | `/auth` | Supabase Auth | Auth users (remote) | None | Env; session cookies; UX errors |
| Sign up | Broken / externally blocked | `signUp` in auth page | `/auth` | Supabase Auth | Auth users | None | Email confirm flow UX; env |
| Logout | Missing | No `signOut` usage in repo | — | — | — | None | Add logout + clear cart/session |
| Password reset | Missing | No reset APIs/UI | — | — | — | None | Implement |
| OAuth | Missing | No `signInWithOAuth` | — | — | — | None | Decide providers |
| Auth middleware protection | Broken / mocked | `middleware.ts` logs and **allows** unauthenticated cart/checkout | `/cart`, `/checkout` | Cookie names only | N/A | None | Real SSR session + redirects |
| Session → cart sync | Broken | `CartContext` reads `localStorage.user`; auth never sets it | `/cart` | `/api/save-cart`, `/api/get-cart` | `cart` assumed | None | Write user id after login; prefer SSR cookies |
| Store catalog | Mocked | `lib/products.ts` (5 static products); `app/store/page.tsx` | `/store` | None | None | None | DB products; images; pagination |
| Product detail (usable) | Working but incomplete / Mocked | `app/store/[slug]/page.tsx` uses static products; references missing `description` (TS error) | `/store/[slug]` | None | None | None | Fix type; link store list here; images; SEO |
| Product detail (stub) | Mocked | `app/product/[slug]/page.tsx` “We’ll connect real data next” | `/product/[slug]` | None | None | None | Consolidate or delete concept |
| Product create/edit/delete | Missing | No admin forms/APIs | — | — | — | None | Merchant CRUD |
| Variants / inventory | Missing | Cart has no variant fields | — | — | — | None | Schema + UI |
| Categories/collections | Mocked | Client filter by `category` string on static data | `/store` | None | None | None | Real taxonomy |
| Search | Working but incomplete | Client-side name filter | `/store` | None | None | None | Server search if catalog grows |
| Demo product page | Mocked | Hardcoded product in `app/demo/page.tsx`; TS error on `currency` | `/demo` | None | None | None | Align types; decide if keep |
| Cart add/remove/qty | Working but incomplete | `CartContext` reducer + `app/cart/page.tsx` | `/cart` | Partial APIs | Partial | None | Auth sync; clear after checkout fix |
| Multi-click protection | Complete (local) | 300ms debounce in `addToCart` | — | N/A | N/A | None | Keep; add tests |
| Guest cart | Working but incomplete | localStorage only | `/cart` | None | None | None | Guest→user merge |
| Server cart | Broken | Dual APIs/tables; unused `/api/cart`; auth wiring gaps | APIs | Service role | `cart`/`carts` | None | Consolidate + secure |
| Checkout page | Broken / incomplete | Fake card inputs unused; Stripe redirect path; plan `addToCart` missing `id` | `/checkout` | `/api/checkout` | metadata only | None | Remove fake card form; fix plan ids; Suspense |
| Pricing → checkout | Working but incomplete | `/pricing` → `/checkout?plan=`; yearly toggle does not affect checkout plan prices | `/pricing` | Stripe one-time mode | None | None | Real subscriptions if intended |
| Stripe Checkout Session | Working but incomplete / externally blocked | `app/api/checkout/route.ts`; fails without `STRIPE_SECRET_KEY`; wrong typed API version | `/api/checkout` | Stripe | metadata | None | Fix API version; validate prices server-side |
| Stripe webhook | Broken | Missing `nodemailer`; no signature verify; raw JSON | `/api/webhook` | Supabase insert | `orders`, `cart` | None | Install/remove email; `constructEvent`; idempotency |
| Success page | Working but incomplete | Clears `localStorage.cart` only; does not call `clearCart()`; ignores `cart-cleared` event | `/success` | None | webhook clears DB cart | None | Sync React cart state |
| Cancel page | Missing | cancel_url is `/checkout` | — | — | — | None | Optional dedicated cancel UX |
| Order save (API) | Broken / unused | `app/api/save-order` inserts without `user_id`; no callers found | `/api/save-order` | Service role | `orders` | None | Delete or secure; align schema |
| Order list (dashboard) | Broken | Dashboard sends Bearer; API requires `?user_id=` | `/dashboard` | `/api/get-orders` | `orders` | None | Fix contract; auth verify |
| Order detail | Missing | Dashboard shows date + total only | — | — | — | None | Detail page |
| Refunds / fulfillment | Missing | — | — | — | — | None | Later |
| Customer accounts area | Missing | Marketing menu item only | `/product/customer-accounts` stub | — | — | None | Account pages |
| Admin | Missing | Marketing copy only | — | — | — | None | Full admin |
| Merchant tools | Missing | — | — | — | — | None | Store management |
| AI features | Mocked (branding only) | “Sidekick AI”, “AI Content” copy; no AI SDKs/keys | marketing/header | None | None | None | Define real AI scope |
| Email notifications | Broken | Webhook uses nodemailer (not in package.json); emails to `EMAIL_USER` only | webhook | Gmail SMTP env | N/A | None | Dependency + customer email |
| Theme provider | Dead code | `app/providers.tsx` unused; `next-themes` installed | — | — | — | None | Wire or remove |
| Layout wrapper | Dead code | `components/Layout.tsx` unused | — | — | — | None | Remove or use exclusively |
| ProductCard component | Dead code | `components/ProductCard.tsx` unused | — | — | — | None | Use in store or remove |
| Testing | Missing | 0 test files | — | — | — | None | Unit + API + e2e |
| CI/CD | Missing | No `.github/workflows` | — | — | — | None | Add |
| Documentation | Missing / stock | README is create-next-app default | — | — | — | None | Product docs + env |

---

## Completion by product area

| Area | % | Confidence | Verdict |
|------|---|------------|---------|
| Storefront (marketing) | 65% | High | Strong UI shell; not a real store |
| Storefront (commerce browse) | 35% | High | Static catalog; wrong detail links |
| Authentication | 30% | High | UI exists; session integration incomplete |
| Dashboard | 15% | High | Orders stub; broken fetch |
| Products (customer) | 30% | High | Mock data |
| Products (merchant) | 0% | High | Missing |
| Cart | 50% | High | Local OK; server broken |
| Checkout | 35% | High | Stripe scaffold; UX/security gaps |
| Payments | 25% | High | Session create only; webhook broken |
| Orders | 20% | High | Insert path fragile |
| Customers | 5% | High | Auth user only |
| Admin | 0% | High | Missing |
| Merchant tools | 0% | High | Missing |
| AI functionality | 5% | High | Branding only |
| Database | 10% | High | Code assumes tables; no schema |
| Security | 15% | High | Multiple critical issues |
| Testing | 0% | High | None |
| Deployment | 10% | High | Build fails |
| Mobile responsiveness | 55% | Medium | Mobile menu exists; dropdown desktop-heavy |
| Accessibility | 25% | Medium | Limited ARIA; buttons without labels patterns |
| Production operations | 5% | High | No monitoring/logging strategy |

---

## Notes on “AI”

Searched for OpenAI/Anthropic/GPT/Claude SDKs and AI API routes: **none found**. AI is marketing language in `app/page.tsx`, `components/Header.tsx` (“Sidekick AI”), and pricing feature lists. **Do not plan as if AI is implemented.**
