const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function demote(mochaUserId, email) {
  console.log(`Demoting ${email || mochaUserId}...`);
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ role: 'user' })
    .eq('mocha_user_id', mochaUserId)
    .select();

  if (error) {
    console.error(`Failed to demote ${email || mochaUserId}:`, error.message);
  } else {
    console.log(`Success! Demoted ${email || mochaUserId}:`, data);
  }
}

async function run() {
  // Let's run a select first to confirm if we can see them
  const { data: admins, error: selectError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('role', 'admin');

  if (selectError) {
    console.error('Error fetching admins:', selectError.message);
    return;
  }

  console.log('Current admins in DB:', admins.map(a => ({ email: a.email, id: a.id, mocha_user_id: a.mocha_user_id })));

  // We want ONLY admin@orginogroup.com.br (mocha_user_id: 8cf33caa-2447-4d4a-a901-041f0f8d8716) to be admin.
  // So we will demote any admin profile where mocha_user_id is not 8cf33caa-2447-4d4a-a901-041f0f8d8716.
  for (const admin of admins) {
    if (admin.mocha_user_id !== '8cf33caa-2447-4d4a-a901-041f0f8d8716' && admin.email !== 'admin@orginogroup.com.br') {
      await demote(admin.mocha_user_id, admin.email);
    }
  }

  // Ensure admin@orginogroup.com.br is indeed admin
  console.log('Ensuring admin@orginogroup.com.br is admin...');
  const { data: adminData, error: adminError } = await supabase
    .from('user_profiles')
    .update({ role: 'admin' })
    .eq('email', 'admin@orginogroup.com.br')
    .select();

  if (adminError) {
    console.error('Failed to ensure admin@orginogroup.com.br is admin:', adminError.message);
  } else {
    console.log('Success ensuring admin:', adminData);
  }

  // Let's run a final check of all admins
  const { data: finalAdmins } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('role', 'admin');

  console.log('Final admins in DB:', finalAdmins.map(a => ({ email: a.email, id: a.id, mocha_user_id: a.mocha_user_id })));
}

run();
