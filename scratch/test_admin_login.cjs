const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      console.log(`Failed to sign in ${email}:`, error.message);
    } else {
      console.log(`Successfully signed in ${email}! User ID:`, data.user.id);
    }
  } catch (err) {
    console.error(`Error signing in ${email}:`, err);
  }
}

async function run() {
  await test('superadmin2@orgino.group', 'Admin123456!');
  await test('superadmin@orgino.group', 'Admin123456!');
  await test('admin@orginogroup.com.br', 'Admin123456!');
  await test('admin@orgino.group', 'Admin123456!');
}

run();
