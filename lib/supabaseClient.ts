import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Kita gunakan 'export default' agar bisa di-import dengan cara simpel
export default createClient(supabaseUrl, supabaseAnonKey)