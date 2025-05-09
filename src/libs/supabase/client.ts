import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY

if(!SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL")
}
if(!SUPABASE_KEY) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_KEY")
}

export const client = createBrowserClient(SUPABASE_URL, SUPABASE_KEY)