# Decisions Needed

1. ~~Confirm push authorization to `shatasolutions/storify`~~ — Phase 00 OS pushed (`ea68d30`).
2. SaaS billing truth vs one-time SKUs for platform pricing page.
3. AI MVP pick after Phase 06 (descriptions vs copilot vs storefront chat).
4. Whether limited AI spikes allowed after Phase 03 behind flags (roadmap default: after 06).
5. Email strategy for webhooks (nodemailer remains optional via `EMAIL_*`; unused path should stay inert).
6. Package rename `ai-ecommerce-platform` → `storify` timing.
7. Whether to bump Next.js to clear transitive postcss/sharp audit highs (`npm audit fix --force` is out of current range).
8. Authorize non-production Supabase migration apply for Phase 01 → VERIFIED.
