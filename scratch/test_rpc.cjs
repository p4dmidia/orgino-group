const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Logging in as superadmin2@orgino.group...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'superadmin2@orgino.group',
    password: 'Admin123456!'
  });

  if (authError) {
    console.error('Login failed:', authError.message);
    return;
  }
  console.log('Logged in successfully!');

  const rpcs = ['is_admin', 'get_all_profiles', 'get_all_profiles_safe'];
  for (const rpc of rpcs) {
    console.log(`Calling RPC: ${rpc}...`);
    const { data, error } = await supabase.rpc(rpc);
    if (error) {
      console.error(`Error calling ${rpc}:`, error.message);
    } else {
      console.log(`Success ${rpc}:`, data);
    }
  }
}

run();
