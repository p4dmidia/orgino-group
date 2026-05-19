const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTriggers() {
  const { data, error } = await supabase.rpc('execute_sql', {
    query: `
      SELECT 
        p.proname as function_name,
        pg_get_functiondef(p.oid) as function_definition
      FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public' AND p.proname LIKE '%user%';
    `
  });

  if (error) {
    // Se o RPC não estiver exposto, podemos tentar fazer uma busca de outra forma,
    // mas vamos ver se temos alguma RPC de SQL que possamos usar.
    console.error('Error querying via RPC:', error);
    
    // Tentamos usar o client para ver se há alguma função listada ou tabelas de sistema expostas via PostgREST
    const { data: systemData, error: systemError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    console.log('User profile accessibility test:', systemData ? 'OK' : systemError);
  } else {
    console.log('Function definitions:', data);
  }
}

inspectTriggers();
