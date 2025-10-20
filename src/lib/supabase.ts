import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client - only for server-side use
export const createSupabaseAdmin = () => {
  if (typeof window !== 'undefined') {
    throw new Error('Admin client cannot be used on client side')
  }
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}