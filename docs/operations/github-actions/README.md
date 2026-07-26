# Phase 01 CI workflow (pending GitHub `workflow` scope)

GitHub OAuth apps without the `workflow` scope cannot create or update files under `.github/workflows/`.

## Install when authorized

1. Ensure the pushing credential includes the `workflow` scope (or use a PAT / SSH deploy key with Actions permission).
2. Copy this file to `.github/workflows/phase01-quality.yml`.
3. Push to `main` (or open a PR).

Canonical workflow definition:

See [`phase01-quality.yml`](./phase01-quality.yml) in this folder.

## Local equivalent (required until Actions runs)

```bash
npm ci
npm run docs:validate
npm run typecheck
npm run lint
npm test
NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co \
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key-for-ci \
NEXT_PUBLIC_BASE_URL=http://localhost:3000 \
npm run build
git diff --check
```
