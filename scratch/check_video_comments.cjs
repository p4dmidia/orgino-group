const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
  console.log('--- Diagnóstico de Comentários de Vídeo ---');
  
  const { count, error: countError } = await supabase
    .from('video_comments')
    .select('*', { count: 'exact', head: true });
  
  if (countError) {
    console.log('Erro ao contar video_comments:', countError.message);
  } else {
    console.log('Total de video_comments no banco:', count);
  }

  const { data, error: fetchError } = await supabase
    .from('video_comments')
    .select('*');

  if (fetchError) {
    console.log('Erro ao buscar video_comments:', fetchError.message);
  } else {
    console.log('Lista de video_comments:', JSON.stringify(data, null, 2));
  }
}

debug();
