import { beforeAll, describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Database-backed RLS isolation using PGlite (Postgres WASM).
 * Applies the committed Phase 01 migration against a local non-production engine.
 * Queries run as non-owner role `authenticated` so FORCE/ENABLE RLS is enforced.
 */

async function asUser(db: PGlite, userId: string | null) {
  await db.exec(`reset role`);
  if (userId) {
    await db.query(`select set_config('request.jwt.claim.sub', $1, false)`, [
      userId,
    ]);
  } else {
    await db.query(`select set_config('request.jwt.claim.sub', '', false)`);
  }
  await db.exec(`set role authenticated`);
}

async function asAdmin(db: PGlite) {
  await db.exec(`reset role`);
  await db.query(`select set_config('request.jwt.claim.sub', '', false)`);
}

describe("Phase 01 RLS isolation (PGlite)", () => {
  let db: PGlite;

  beforeAll(async () => {
    db = new PGlite();
    await db.exec(`
      create schema if not exists auth;
      create table if not exists auth.users (
        id uuid primary key,
        email text
      );
      create or replace function auth.uid()
      returns uuid
      language sql
      stable
      as $$
        select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
      $$;
      do $$ begin
        create role authenticated nologin;
      exception when duplicate_object then null;
      end $$;
    `);

    try {
      await db.exec(`create extension if not exists "pgcrypto"`);
    } catch {
      await db.exec(`
        create or replace function gen_random_uuid()
        returns uuid language sql as $$
          select uuid_in(overlay(overlay(md5(random()::text || clock_timestamp()::text) placing '4' from 13) placing 'a' from 17)::cstring);
        $$;
      `);
    }

    const sql = fs
      .readFileSync(
        path.join(
          process.cwd(),
          "supabase/migrations/202607260001_phase01_baseline.sql"
        ),
        "utf8"
      )
      .replace(/create extension if not exists "pgcrypto";/g, "-- handled above");

    await db.exec(sql);

    await db.exec(`
      grant usage on schema public to authenticated;
      grant select, insert, update, delete on all tables in schema public to authenticated;
      grant usage, select on all sequences in schema public to authenticated;
    `);
  }, 60_000);

  it("creates required tables from migration", async () => {
    await asAdmin(db);
    const res = await db.query<{ tablename: string }>(`
      select tablename from pg_tables
      where schemaname = 'public'
        and tablename in ('profiles','carts','orders','stripe_events')
      order by 1
    `);
    expect(res.rows.map((r) => r.tablename)).toEqual([
      "carts",
      "orders",
      "profiles",
      "stripe_events",
    ]);
  });

  it("owner can access own cart; other user and anon cannot", async () => {
    await asAdmin(db);
    const userA = randomUUID();
    const userB = randomUUID();
    await db.query(`insert into auth.users (id, email) values ($1,'a@test'), ($2,'b@test')`, [
      userA,
      userB,
    ]);
    await db.query(`insert into public.carts (user_id, items) values ($1, $2::jsonb)`, [
      userA,
      JSON.stringify([{ id: "sku", quantity: 1 }]),
    ]);

    await asUser(db, userA);
    expect(
      (await db.query(`select user_id from public.carts`)).rows.length
    ).toBe(1);

    await asUser(db, userB);
    expect(
      (await db.query(`select user_id from public.carts`)).rows.length
    ).toBe(0);

    await asUser(db, null);
    expect(
      (await db.query(`select user_id from public.carts`)).rows.length
    ).toBe(0);
  });

  it("orders are isolated by owner", async () => {
    await asAdmin(db);
    const userA = randomUUID();
    const userB = randomUUID();
    await db.query(`insert into auth.users (id) values ($1), ($2)`, [userA, userB]);
    await db.query(
      `insert into public.orders (user_id, items, total_minor, currency, status, stripe_session_id)
       values ($1, '[]'::jsonb, 100, 'usd', 'paid', $2)`,
      [userA, `cs_${userA}`]
    );

    await asUser(db, userA);
    expect((await db.query(`select id from public.orders`)).rows.length).toBeGreaterThanOrEqual(1);

    await asUser(db, userB);
    const rows = await db.query(`select id from public.orders where stripe_session_id = $1`, [
      `cs_${userA}`,
    ]);
    expect(rows.rows.length).toBe(0);
  });

  it("stripe_events are not readable by authenticated users", async () => {
    await asAdmin(db);
    await db.query(
      `insert into public.stripe_events (id, type, payload) values ('evt_pg','checkout.session.completed','{}'::jsonb)
       on conflict do nothing`
    );
    const user = randomUUID();
    await db.query(`insert into auth.users (id) values ($1)`, [user]);
    await asUser(db, user);
    expect(
      (await db.query(`select id from public.stripe_events`)).rows.length
    ).toBe(0);
  });
});
