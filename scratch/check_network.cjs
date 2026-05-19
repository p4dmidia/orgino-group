const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkNetwork() {
  // 1. Fetch profile for the active UUID
  const { data: profile, error: pError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('mocha_user_id', '5d23ad5a-bf13-4d0d-a073-273a8c1c81af')
    .maybeSingle();

  console.log('Profile loaded:', profile);
  if (pError) console.error('Profile Error:', pError);

  if (profile) {
    // 2. Fetch directs
    const { data: level1, error: lError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('sponsor_id', profile.id);

    console.log('Directs (Level 1):', level1);
    if (lError) console.error('Directs Error:', lError);
  }
}

checkNetwork();
