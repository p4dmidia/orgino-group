const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Ler o .env para ter certeza absoluta de qual banco está sendo usado
const envContent = fs.readFileSync('.env', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

if (!urlMatch || !keyMatch) {
  console.log("Erro: não encontrou as variáveis VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY no .env");
  process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

console.log(`Conectando no banco: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log("Buscando perfil de superadmin2@orgino.group em user_profiles...");
  const { data: profiles, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', 'superadmin2@orgino.group');
  
  if (error) {
    console.error("Erro ao buscar perfil:", error.message);
  } else {
    console.log("Perfis encontrados:", profiles);
  }
}

checkData();
