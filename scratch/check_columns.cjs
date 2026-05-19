const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  const table = 'user_profiles';
  console.log(`Checking columns for ${table}...`);
  
  const { data, error } = await supabase.from(table).select('*').limit(1);
  if (error) {
    console.error('Error:', error.message);
    return;
  }

  if (data && data.length > 0) {
    console.log('Columns:', Object.keys(data[0]).join(', '));
  } else {
    // If no data, try to get from OpenAPI spec
    console.log('No data found to infer columns. Trying REST API...');
    const response = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`, {
        headers: { 'apikey': supabaseKey }
    });
    const spec = await response.json();
    if (spec.definitions && spec.definitions[table]) {
        console.log('Columns from Spec:', Object.keys(spec.definitions[table].properties).join(', '));
    }
  }
}

checkColumns();
