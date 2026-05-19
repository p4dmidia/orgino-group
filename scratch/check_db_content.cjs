const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    console.log('--- VERIFICANDO DADOS DE CURSOS E AULAS ---');
    
    const { data: courses, error: cErr } = await supabase.from('courses').select('id, title');
    console.log('Cursos encontrados:', courses || []);
    if (cErr) console.log('Erro Cursos:', cErr.message);

    const { data: lessons, error: lErr } = await supabase.from('lessons').select('id, title, course_id');
    console.log('Aulas encontradas:', lessons || []);
    if (lErr) console.log('Erro Aulas:', lErr.message);

    const { data: profiles, error: pErr } = await supabase.from('user_profiles').select('id, full_name');
    console.log('Perfis encontrados:', profiles || []);
    if (pErr) console.log('Erro Perfis:', pErr.message);
}

checkData();
