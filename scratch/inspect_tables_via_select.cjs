const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTable(tableName) {
  console.log(`\n--- Inspecting Table: ${tableName} ---`);
  try {
    const { data, error } = await supabase.from(tableName).select('*').limit(1);
    if (error) {
      console.log(`Error querying ${tableName}:`, error.message);
      return;
    }
    if (data && data.length > 0) {
      console.log(`Columns for ${tableName}:`, Object.keys(data[0]));
      console.log('Sample Row:', data[0]);
    } else {
      console.log(`No rows in ${tableName}. Checking if we can insert a dummy and rollback, or just no columns can be inferred.`);
    }
  } catch (err) {
    console.error(`Unexpected error for ${tableName}:`, err.message);
  }
}

async function run() {
  const tables = [
    'user_profiles',
    'orders',
    'commissions',
    'system_settings',
    'commission_distributions',
    'company_purchases',
    'transactions'
  ];
  for (const table of tables) {
    await inspectTable(table);
  }
}

run();
