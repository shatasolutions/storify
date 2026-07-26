/**
 * @deprecated Prefer `@/lib/supabase/browser` `createSupabaseBrowserClient()`.
 * Kept as a lazy proxy for existing client imports.
 */
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    if (!client) client = createSupabaseBrowserClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
