import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

// Export a function that safely creates the client
export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase environment variables not found. Supabase features will be disabled.")
    return null
  }
  return createClient(supabaseUrl, supabaseKey)
}

// Export the client instance (may be null)
export const supabase = getSupabaseClient()
