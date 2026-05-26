const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

async function run() {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`, {
      headers: { 'apikey': supabaseKey }
    });
    const spec = await response.json();
    console.log('Spec keys:', Object.keys(spec));
    if (spec.paths) {
      console.log('Paths:', Object.keys(spec.paths).filter(p => p.includes('comment') || p.includes('sql') || p.includes('rpc')));
    }
  } catch (err) {
    console.error('Error:', err);
  }
}
run();
