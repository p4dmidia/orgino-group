const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  const { data, error } = await supabase.from('courses').select('*').limit(0);
  if (error) {
    console.log('Error fetching columns:', error);
  } else {
    // In some environments, we can't easily get keys from limit(0) if data is empty
    // But we can try to insert a dummy row or check the error message for missing columns
    console.log('Successfully connected to courses table.');
  }
}

// Better way to check columns via RPC or metadata if possible, but let's try a simple select
checkColumns();
