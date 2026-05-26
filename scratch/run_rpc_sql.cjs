const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Testing execute_sql RPC...');
  const { data, error } = await supabase.rpc('execute_sql', {
    query: `SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name IN ('lesson_comments', 'video_comments') ORDER BY table_name, ordinal_position;`
  });

  if (error) {
    console.error('RPC Error:', error);
  } else {
    console.log('Result:', JSON.stringify(data, null, 2));
  }
}

run();
