
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Database } from '../../../src/integrations/supabase/types';

dotenv.config();

// Initialize the Supabase client with service role key for server-side operations
const supabaseUrl = process.env.SUPABASE_URL || 'https://phwjuvecnfvyeumpbqbz.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables');
  process.exit(1);
}

// Create and export the Supabase client with service role for admin access
export const supabaseServer = createClient<Database>(supabaseUrl, supabaseServiceKey);

// Export a function to get a client using the user's JWT for RLS policies
export const getSupabaseClient = (authHeader?: string) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return supabaseServer; // Fall back to service role if no JWT
  }

  const jwt = authHeader.replace('Bearer ', '');
  return createClient<Database>(supabaseUrl, process.env.SUPABASE_ANON_KEY || '', {
    global: {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    }
  });
};
