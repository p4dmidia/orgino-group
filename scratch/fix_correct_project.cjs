const { createClient } = require('@supabase/supabase-js');

const URL = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(URL, KEY);

async function fix() {
  console.log("Iniciando correção no projeto QLRX...");
  
  // 1. Criar perfil se não existir
  const { error: profileErr } = await supabase
    .from('user_profiles')
    .upsert([{ 
      mocha_user_id: '4266f030-35c3-4d53-a69d-d1cd693610ee', 
      full_name: 'Mike Maluco', 
      email: 'mikemaluco@teste.com', 
      role: 'user' 
    }], { onConflict: 'mocha_user_id' });
    
  if (profileErr) console.error("Erro Perfil:", profileErr.message);
  else console.log("Perfil Mike Maluco garantido!");

  // 2. Liberar RLS (via RPC execute_sql se disponível, ou assumindo que SELECT já funciona com Anon se houver políticas)
  // Como Anon não pode rodar DDL (DROP/CREATE), vou tentar inserir um registro de progresso para testar
  const { error: progErr } = await supabase
    .from('user_course_progress')
    .insert([{ 
      user_id: 101, // ID que vimos antes
      lesson_id: 3, 
      completed: true 
    }]);

  if (progErr) console.log("Nota: Erro ao testar progresso (pode ser RLS):", progErr.message);
  else console.log("Teste de progresso funcionou!");
}

fix();
