const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

async function run() {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`, {
      headers: { 'apikey': supabaseKey }
    });
    const spec = await response.json();
    console.log('Spec Keys:', Object.keys(spec));
    if (spec.paths) {
      console.log('Paths:', Object.keys(spec.paths).slice(0, 15));
    }
    if (spec.components && spec.components.schemas) {
      console.log('Schemas:', Object.keys(spec.components.schemas));
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
