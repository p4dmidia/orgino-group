const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

async function run() {
  console.log('Fetching REST API Schema Spec from Supabase...');
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`, {
      headers: { 'apikey': supabaseKey }
    });
    const spec = await response.json();
    
    console.log('Available Tables/Definitions:');
    const tables = Object.keys(spec.definitions || {});
    console.log(tables.join(', '));

    console.log('\nInspecting "orders" table columns:');
    if (spec.definitions.orders) {
      console.log(Object.keys(spec.definitions.orders.properties).join(', '));
    } else {
      console.log('Table "orders" not found in spec.');
    }

    console.log('\nInspecting "commissions" table columns:');
    if (spec.definitions.commissions) {
      console.log(Object.keys(spec.definitions.commissions.properties).join(', '));
    } else {
      console.log('Table "commissions" not found in spec.');
    }

    console.log('\nAvailable RPC Functions:');
    const paths = Object.keys(spec.paths || {});
    const rpcs = paths.filter(p => p.startsWith('/rpc/'));
    console.log(rpcs.join(', '));
  } catch (err) {
    console.error('Error fetching spec:', err.message);
  }
}

run();
