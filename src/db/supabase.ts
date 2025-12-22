import { createClient } from "@supabase/supabase-js"

// Try PUBLIC_ prefixed vars first (needed for client-side/browser access in Astro)
// These work both locally and on Vercel when properly configured
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) {
    return null
  }
  return createClient(supabaseUrl, supabaseKey)
}

export const supabase = getSupabaseClient()
