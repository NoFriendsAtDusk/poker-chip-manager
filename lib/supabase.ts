import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create client only when env vars are available (avoids crash in test environment)
export const supabase: SupabaseClient = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : (null as unknown as SupabaseClient);
