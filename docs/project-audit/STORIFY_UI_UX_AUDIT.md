# Storify — UI / UX / Layout Audit

**Audit date:** 2026-07-24  
**Method:** Code inspection + local route smoke tests. Full multi-viewport browser visual QA was limited (no automated screenshot suite). Findings below are evidence-based from components and layouts.

---

## Header component map

| Component | Path | Used? |
|-----------|------|-------|
| **Canonical Header** | `components/Header.tsx` | **Yes** — imported by `app/layout.tsx` |
| Layout wrapper Header | `components/Layout.tsx` → Header | **No** — Layout never imported |
| Homepage leftover nav | `NavDropdown` + unused mobile/solutions state in `app/page.tsx` | Dead code inside homepage (not rendered as second header) |

**Active render path:**

```
app/layout.tsx
  └─ CartProvider
       └─ Header (fixed)
       └─ {children}
       └─ Footer
```

### Multiple headers on same page?

**Currently: No** (only root layout Header).  
Historical risk remains if someone wires `components/Layout.tsx` around pages that already use root layout → **would double Header/Footer**.

---

## Header behavior analysis

| Concern | Finding | Evidence |
|---------|---------|----------|
| Fixed header covering content | Pages use `py-32` / `pt-32` to clear header — mostly intentional | store, cart, checkout, product, demo, homepage hero |
| Layout shift on hover | Products dropdown is `fixed` centered; Solutions is `absolute` under item | Header.tsx |
| Dropdown viewport | Products menu `w-[900px] max-w-[calc(100vw-2rem)]` centered — generally OK on desktop; heavy on small laptops | Header.tsx ~167 |
| Dropdown interactivity | Outer Products panel has `pointer-events-none`; inner content `pointer-events-auto` — workable but fragile | Header.tsx |
| Header height change | Mobile menu expands inside rounded header container → header grows | Mobile `AnimatePresence` block |
| White/broken backgrounds | Active header uses translucent dark glass (`from-cyan-400/10...`) — not white | Header.tsx |
| Impure render particles | `Math.random()` during render for sparkles — lint purity error; can cause flicker | Header.tsx ~207 |
| Logo not linked | Brand mark is `<div>`/`span`, not `Link` to `/` | Header.tsx ~119–126 |
| Get Started CTA | `<button>` with no navigation | Header.tsx ~463–466 |
| Dashboard link | Missing from nav | — |
| Logout | Missing | — |

---

## Navigation analysis

### Desktop links

| Label | Target | Valid? |
|-------|--------|--------|
| Platform | `/` | Yes |
| Products (menu) | many `/product/...` | Reachable stubs only |
| Store | `/store` | Yes |
| Solutions → AI Content | `/product/demo` | Stub |
| Solutions → Commerce Tools | `/services` | **404** |
| Solutions → Checkout Flow | `/cart` | Yes |
| Solutions → Automation | non-link `<div>` | Dead |
| Pricing | `/pricing` | Yes |
| Cart | `/cart` | Yes |
| Demo Page | `/demo` | Yes |
| Sign In | `/auth` | Exists (500 without env) |

### Mobile links

Includes `/services` (404) and Solutions `href="#"`.

---

## Duplicate layout findings

1. **`components/Layout.tsx`** duplicates root chrome (Header+Footer) — unused.
2. **Double footer on `/`:** root `Footer` + inline `<footer>` in `app/page.tsx` (~962).
3. **Duplicate TiltCard implementations:** homepage `app/page.tsx` and `components/ProductCard.tsx`.
4. **Dead homepage nav remnants:** `NavDropdown`, `mobileOpen`, `solutionsOpen` unused — leftover from when homepage owned the header.

---

## Product / store UX

| Issue | Evidence |
|-------|----------|
| Store cards link to stub detail | `app/store/page.tsx` → `/product/${id}` |
| Usable detail page underused | `app/store/[slug]/page.tsx` has ATC but missing `description` on product type |
| No product images | Placeholder “Product Image” box |
| ProductCard unused | Store uses raw Link cards |
| Pricing yearly toggle | Changes displayed price but checkout plan map ignores yearly | `pricing/page.tsx` vs checkout `planDetails` |

---

## Cart / checkout UX

| Issue | Evidence |
|-------|----------|
| Checkout shows fake card fields | Inputs for card number/CVC while payment is Stripe-hosted | `checkout/page.tsx` |
| Misleading PCI UX | Users may think card is collected on-site | same |
| Success clears storage but not React cart | `success/page.tsx` removes localStorage key; CartProvider already hydrated state | Cart may reappear until refresh if effect re-writes storage |
| Empty cart checkout still reachable | Link only when items exist — OK; direct `/checkout` allowed by middleware | — |
| Plan add missing `id` | TypeScript error; runtime may create undefined ids | checkout plan effect |

---

## Responsive findings

| Viewport | Assessment |
|----------|------------|
| Mobile | Hamburger present; Products mega-menu is desktop-only (no mobile equivalent of full Products taxonomy) |
| Tablet | Intermediate — Solutions dropdown width 520px may clip near edges |
| Desktop | Mega-menu designed for wide screens |
| Wide | Centered fixed dropdown OK |

**Confidence:** Medium (code-based; limited live visual measurement).

---

## Accessibility findings

| Issue | Severity | Evidence |
|-------|----------|----------|
| Products/Solutions toggles are `<button>` without `aria-expanded` | Medium | Header.tsx |
| Mobile menu button label only `aria-label="Toggle menu"` — OK | Low | — |
| Decorative particle spans may clutter a11y tree | Low | Header particles |
| Form inputs lack associated `<label>` | Medium | auth, checkout |
| Color contrast mostly light-on-dark | Informational | Design system |
| Focus states not systematically designed | Medium | Tailwind hover-heavy |
| Homepage CTAs non-functional buttons | High (UX) | PrimaryButton / Get Started |

---

## Content-overlap / spacing

- Fixed header + `py-32` pattern is consistent on commerce pages.
- Homepage uses `pt-32` on hero — consistent.
- No evidence of white header border regression in current Header code (historical issue not currently reproduced in source).

---

## Recommendation: single canonical header architecture

**Keep:** `components/Header.tsx` as the only header, rendered exclusively from `app/layout.tsx`.

**Do not:**

- Import `components/Layout.tsx` on App Router pages
- Reintroduce a second header inside `app/page.tsx`
- Create additional Header variants without removing the first

**Simplify:**

1. Reduce Products mega-menu to real routes only (or “coming soon” non-links clearly)
2. Add Account/Dashboard + Logout when auth works
3. Make logo + Get Started navigate to `/` and `/auth` (or onboarding)
4. Provide a mobile Products accordion instead of desktop-only mega-menu
5. Remove impure `Math.random` particles or precompute positions

**Do not implement in this audit.**
