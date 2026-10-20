import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xkaitetlqfodjvbxporw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrYWl0ZXRscWZvZGp2Ynhwb3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0OTY4OTcsImV4cCI6MjEwODA3Mjg5N30.riO0CnNLek00dPX96KJn6if_tSgPu5lTFZPIhnyKm58';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
