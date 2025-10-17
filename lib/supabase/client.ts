import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

export function createBrowserClient() {
  return createSupabaseBrowserClient(
    process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY!,
  )
}

export const createClient = createBrowserClient
