const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable() {
  const table = 'user_course_progress';
  console.log(`Checking table ${table}...`);
  
  const { data, error } = await supabase.from(table).select('*').limit(1);
  if (error) {
    console.log(`Error selecting from ${table}: ${error.message}`);
  } else {
    console.log(`Successfully selected from ${table}. Data:`, data);
  }

  // Try to insert to test RLS
  const testData = {
    course_id: 1, // Assumes a course exists
    lesson_id: 1, // Assumes a lesson exists
    user_id: 1,   // Assumes a profile exists
    completed: true,
    completed_at: new Date().toISOString()
  };

  console.log('Testing insert...');
  const { error: insertError } = await supabase.from(table).upsert(testData);
  if (insertError) {
    console.log(`Insert Error: ${insertError.message} (Code: ${insertError.code})`);
  } else {
    console.log('Insert Success!');
  }
}

checkTable();
