const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function viewAll() {
  const { data: settings, error: settingsError } = await supabase
    .from('system_settings')
    .select('*');

  if (settingsError) {
    console.error('Error fetching settings:', settingsError);
  } else {
    console.log('--- SYSTEM SETTINGS ---');
    console.log(settings);
  }

  const { data: levels, error: levelsError } = await supabase
    .from('cashback_config')
    .select('*')
    .order('level', { ascending: true });

  if (levelsError) {
    console.error('Error fetching cashback_config:', levelsError);
  } else {
    console.log('--- CASHBACK CONFIG ---');
    console.log(levels);
  }
}

viewAll();
