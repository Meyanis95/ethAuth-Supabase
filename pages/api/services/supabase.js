import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL,
  process.env.SUPABASE_SECRET_KEY
)

export default supabase