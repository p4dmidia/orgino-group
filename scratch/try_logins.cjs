const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function tryLogin(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, msg: error.message };
    }
    return { success: true, data };
  } catch (err) {
    return { success: false, msg: err.message };
  }
}

async function run() {
  const emails = ['alan80@gmail.com', 'fernando1548@gmail.com', 'jao07@gmail.com'];
  const passwords = ['Admin123456!', 'Password123!', 'alan80@gmail.com', 'fernando1548@gmail.com', 'jao07@gmail.com', '123456', '12345678'];
  
  for (const email of emails) {
    for (const pwd of passwords) {
      const res = await tryLogin(email, pwd);
      if (res.success) {
        console.log(`SUCCESS: ${email} / ${pwd}`);
        return;
      }
    }
  }
  console.log('All login attempts failed.');
}

run();
