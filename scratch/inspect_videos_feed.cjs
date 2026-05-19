const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

async function run() {
  console.log('Fetching REST API Schema Spec from Supabase...');
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`, {
      headers: { 'apikey': supabaseKey }
    });
    const spec = await response.json();
    
    console.log('Available definitions keys:');
    console.log(Object.keys(spec.definitions || {}));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
