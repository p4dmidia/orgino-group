const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllProfiles() {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, email, referral_code, mocha_user_id, full_name, sponsor_id, role, created_at')
    .order('id', { ascending: false });

  if (error) {
    console.error('Error fetching profiles:', error);
  } else {
    console.log('All Profiles in DB:', data);
  }
}

listAllProfiles();
