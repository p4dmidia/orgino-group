const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log('Testing insert into commissions table...');
  const { data, error } = await supabase
    .from('commissions')
    .insert({
      affiliate_id: 7, // Admin ID
      amount: 10.00,
      level: 1,
      order_id: null,
      status: 'pending'
    })
    .select();

  if (error) {
    console.error('Error inserting:', error.message);
  } else {
    console.log('Success! Inserted Row:', data);
    
    // Clean up
    const { error: deleteError } = await supabase
      .from('commissions')
      .delete()
      .eq('id', data[0].id);
    console.log('Cleaned up:', deleteError ? deleteError.message : 'OK');
  }
}

testInsert();
