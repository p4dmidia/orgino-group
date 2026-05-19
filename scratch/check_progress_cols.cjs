const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCols() {
    const table = 'user_course_progress';
    const { data, error } = await supabase.from(table).select('*').limit(1);
    
    // If no data, we can't see columns easily via select. 
    // But if we get an empty array [], the table exists.
    
    // Let's try to get columns via a trick (selecting a non-existent col)
    const { error: colError } = await supabase.from(table).select('non_existent_col').limit(1);
    if (colError && colError.message.includes('column "non_existent_col" does not exist')) {
        console.log('Columns list from error hint:');
        console.log(colError.message);
    }
}

checkCols();
