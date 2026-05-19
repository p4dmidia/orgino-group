const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
  console.log('--- Diagnóstico de Comentários ---');
  
  // 1. Verificar total de comentários
  const { count, error: countError } = await supabase
    .from('lesson_comments')
    .select('*', { count: 'exact', head: true });
  
  if (countError) {
    console.log('Erro ao contar comentários:', countError.message);
  } else {
    console.log('Total de comentários no banco:', count);
  }

  // 2. Verificar comentários não aprovados
  const { data, error: fetchError } = await supabase
    .from('lesson_comments')
    .select('id, content, is_approved, user_id')
    .eq('is_approved', false);

  if (fetchError) {
    console.log('Erro ao buscar pendentes:', fetchError.message);
  } else {
    console.log('Comentários pendentes (is_approved=false):', data.length);
    if (data.length > 0) {
      console.log('Exemplo de conteúdo:', data[0].content);
    }
  }
}

debug();
