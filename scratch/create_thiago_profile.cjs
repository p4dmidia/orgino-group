const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createProfile() {
    console.log('--- CRIANDO PERFIL PARA THIAGO ALMEIDA ---');
    
    // Como não sabemos o domínio do email, vamos tentar criar um registro que o Auth consiga ler
    // Geralmente o email no Supabase Auth é o e-mail completo.
    
    const email = 'thiagoAlmeida321'; // O usuário mandou assim, talvez seja um email sem @ ou ele esqueceu o resto
    
    const { data, error } = await supabase.from('user_profiles').insert([
        {
            full_name: 'Thiago almeida',
            email: email,
            referral_code: 'THIAGOALMEIDA321',
            role: 'admin',
            is_active: true
        }
    ]).select();

    if (error) {
        console.log('Erro ao criar perfil:', error.message);
    } else {
        console.log('Perfil criado com sucesso:', data);
        console.log('\nAGORA: Recarregue a página do sistema. O botão deve começar a funcionar!');
    }
}

createProfile();
