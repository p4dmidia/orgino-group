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
    console.error('Failed to log in:', authError.message);
    return;
  }
  console.log('Login successful!');

  console.log('Inserting test lesson comment with is_approved=false...');
  const { data, error } = await supabase
    .from('lesson_comments')
    .insert([{
      lesson_id: 1,
      user_id: 25, // superadmin ID
      content: 'Comentário de teste pendente!',
      is_approved: false
    }])
    .select();

  if (error) {
    console.error('Insert Error:', error);
  } else {
    console.log('Inserted successfully:', data);
  }

  console.log('Now querying pending comments...');
  const { data: pending, error: queryError } = await supabase
    .from('lesson_comments')
    .select('*')
    .eq('is_approved', false);

  if (queryError) {
    console.error('Query Error:', queryError);
  } else {
    console.log('Pending comments found:', pending.length, pending);
  }
}

run();
