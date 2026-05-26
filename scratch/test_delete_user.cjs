const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // Let's check if the user mikemaluco exists
  console.log('Checking if mikemaluco@teste.com exists...');
  const { data: user, error: findError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', 'mikemaluco@teste.com')
    .maybeSingle();

  if (findError) {
    console.error('Error finding user:', findError.message);
    return;
  }

  if (!user) {
    console.log('User mikemaluco@teste.com not found.');
    return;
  }

  console.log('User found:', user);

  // Try to delete this user profile
  console.log(`Trying to delete user profile with ID ${user.id}...`);
  const { data: deleteData, error: deleteError } = await supabase
    .from('user_profiles')
    .delete()
    .eq('id', user.id)
    .select();

  if (deleteError) {
    console.error('Delete error:', deleteError.message);
  } else {
    console.log('Delete result:', deleteData);
  }
}

run();
