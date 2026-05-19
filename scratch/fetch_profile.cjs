const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const userId = 'd174d591-b143-40a2-a8a4-b03ec522395a';
  console.log(`Fetching profile for user ID: ${userId}`);
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('mocha_user_id', userId)
    .maybeSingle();
    
  if (error) {
    console.error('Error fetching profile:', error);
  } else {
    console.log('Profile:', data);
  }
}

run();
