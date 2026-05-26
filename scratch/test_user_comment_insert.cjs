const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Logging in as alan80@gmail.com...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'alan80@gmail.com',
    password: '123456'
  });

  if (authError) {
    console.error('Failed to log in:', authError.message);
    return;
  }
  console.log('Login successful! Profile ID is 20.');

  console.log('Inserting lesson comment with is_approved=false...');
  const { data, error } = await supabase
    .from('lesson_comments')
    .insert([{
      lesson_id: 1,
      user_id: 20, // alan80 profile ID
      content: 'Comentário de teste do usuário normal!',
      is_approved: false
    }])
    .select();

  if (error) {
    console.error('Insert Error:', error);
  } else {
    console.log('Inserted successfully:', data);
  }
}

run();
