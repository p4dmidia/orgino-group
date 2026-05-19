const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnostic() {
    console.log('--- DIAGNÓSTICO DE user_course_progress ---');
    
    // Teste 1: Verificar se as colunas batem
    const testData = {
        course_id: 1,
        lesson_id: 1,
        user_id: 1,
        completed: true
    };

    console.log('Tentando upsert simples...');
    const { error } = await supabase.from('user_course_progress').upsert(testData);
    
    if (error) {
        console.log('ERRO ENCONTRADO:', error.message);
        console.log('CÓDIGO:', error.code);
        
        if (error.message.includes('column') && error.message.includes('does not exist')) {
            console.log('Dica: A coluna não existe. Precisamos criar ou renomear.');
        }
        
        if (error.code === '42501') {
            console.log('Dica: Erro de RLS. A política não foi aplicada corretamente.');
        }
    } else {
        console.log('SUCESSO: O banco aceitou os dados. O problema pode estar no Frontend ou no Auth.');
    }
}

diagnostic();
