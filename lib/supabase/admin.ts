import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getPublicEnv, requireServiceRoleKey } from "@/lib/env";

/**
 * Canonical service-role client.
 * Use ONLY for privileged system operations (e.g. verified webhooks).
 * Never import into client components.
 */
export function createSupabaseAdminClient() {
  const { NEXT_PUBLIC_SUPABASE_URL } = getPublicEnv();
  return createClient(NEXT_PUBLIC_SUPABASE_URL, requireServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
