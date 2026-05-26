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
    console.error('Failed to log in as superadmin2:', authError.message);
    return;
  }
  console.log('Logged in successfully!');

  // Try updating the role of superadmin2 to user
  console.log('Trying to update role of superadmin2 to user...');
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ role: 'user' })
    .eq('mocha_user_id', 'd174d591-b143-40a2-a8a4-b03ec522395a')
    .select();

  if (error) {
    console.error('Failed to update role:', error.message);
  } else {
    console.log('Update result:', data);
  }
}

run();
