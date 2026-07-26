# Deployment Architecture

Target: Vercel (or equivalent) for Next.js + Supabase managed Postgres.  
Preview deployments per PR after Phase 01 CI.  
Secrets in host env — never git.  
Migrations applied via controlled pipeline.
