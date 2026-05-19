const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

async function run() {
  const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: { 'apikey': supabaseKey }
  });
  const spec = await response.json();
  console.log('Keys of spec response:', Object.keys(spec || {}));
  if (spec.paths) {
    console.log('Number of paths:', Object.keys(spec.paths).length);
    console.log('Sample paths:', Object.keys(spec.paths).slice(0, 10));
  } else {
    console.log('Response content:', spec);
  }
}

run();
