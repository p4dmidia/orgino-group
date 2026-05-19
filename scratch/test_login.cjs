const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing sign in of the newly created test user...");
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'testuser_1779108266823@gmail.com',
      password: 'Password123!'
    });
    if (error) {
      console.log("Sign in error status:", error.status);
      console.log("Sign in error message:", error.message);
      console.log("Full error:", error);
    } else {
      console.log("Sign in success data:", data);
    }
  } catch (err) {
    console.error("Caught error during sign in:", err);
  }
}

test();
