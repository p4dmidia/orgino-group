const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jxupizzwrnivhnaexrmb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dXBpenp3cm5pdmhuYWV4cm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDk1NjksImV4cCI6MjA4OTg4NTU2OX0.N17XSUASYwShkKmpnI3NDCLD1dgWqnEk-1xLmaKprlo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing invalid email login on JXU...");
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'nonexistent@orgino.group',
      password: 'somepassword123'
    });
    if (error) {
      console.log("Error status:", error.status);
      console.log("Error message:", error.message);
      console.log("Full error:", error);
    } else {
      console.log("Success data:", data);
    }
  } catch (err) {
    console.error("Caught error:", err);
  }
}

test();
