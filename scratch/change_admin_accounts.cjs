const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // 1. Log in as superadmin2 to get admin permissions
  console.log('Logging in as superadmin2@orgino.group...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'superadmin2@orgino.group',
    password: 'Admin123456!'
  });

  if (authError) {
    console.error('Failed to log in as superadmin2:', authError.message);
    return;
  }

  console.log('Successfully logged in as superadmin2.');

  // 2. Change password of admin@orginogroup.com.br to admin123
  console.log('Updating auth password for admin@orginogroup.com.br...');
  const { data: rpcData, error: rpcError } = await supabase.rpc('admin_update_user_auth', {
    p_user_id: '8cf33caa-2447-4d4a-a901-041f0f8d8716',
    p_password: 'admin123',
    p_email: 'admin@orginogroup.com.br'
  });

  if (rpcError) {
    console.error('Failed to update admin@orginogroup.com.br auth:', rpcError.message);
    console.error('Full RPC error:', rpcError);
    return;
  }
  console.log('Successfully updated password in auth for admin@orginogroup.com.br.');

  // 3. Remove admin role from superadmin2@orgino.group
  console.log('Updating superadmin2@orgino.group profile role to "user"...');
  const { data: updateData, error: updateError } = await supabase
    .from('user_profiles')
    .update({ role: 'user' })
    .eq('mocha_user_id', 'd174d591-b143-40a2-a8a4-b03ec522395a');

  if (updateError) {
    console.error('Failed to update superadmin2 role in user_profiles:', updateError.message);
  } else {
    console.log('Successfully demoted superadmin2@orgino.group to "user".');
  }

  // 4. Log out superadmin2 session
  await supabase.auth.signOut();

  // 5. Test login with the new admin account
  console.log('Testing login for admin@orginogroup.com.br with password "admin123"...');
  const { data: testLoginData, error: testLoginError } = await supabase.auth.signInWithPassword({
    email: 'admin@orginogroup.com.br',
    password: 'admin123'
  });

  if (testLoginError) {
    console.error('Failed to log in as admin@orginogroup.com.br with new password:', testLoginError.message);
  } else {
    console.log('Successfully logged in as admin@orginogroup.com.br! User ID:', testLoginData.user.id);
  }
}

run();
