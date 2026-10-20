import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xkaitetlqfodjvbxporw.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrYWl0ZXRscWZvZGp2Ynhwb3J3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjQ5Njg5NywiZXhwIjoyMTA4MDcyODk3fQ.oyCqclxzvnkLApHbnCOoWODDNCLO5HDvN3t9XBaoMkc';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function testConnection() {
  const { data, error } = await supabase.from('leads').select('*').limit(1);
  console.log('Result:', { data, error });
}

testConnection();
