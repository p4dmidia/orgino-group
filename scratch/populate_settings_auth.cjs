const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

const defaultSettings = [
  { key: 'site_name', value: 'Orgino Group', description: 'Nome da plataforma' },
  { key: 'support_email', value: 'suporte@orginogroup.com', description: 'E-mail oficial de suporte' },
  { key: 'support_whatsapp', value: '+55 (11) 99999-9999', description: 'WhatsApp oficial de suporte' },
  { key: 'site_url', value: 'https://orginogroup.com', description: 'URL oficial da plataforma' },
  { key: 'matrix_pix_key', value: 'financeiro@orginogroup.com', description: 'Chave PIX Master para recebimentos' },
  { key: 'matrix_cpf', value: '00.000.000/0001-00', description: 'CPF/CNPJ do recebedor Master' },
  { key: 'min_withdrawal_amount', value: '50.00', description: 'Valor mínimo para solicitação de saque (R$)' },
  { key: 'withdrawal_fee_percentage', value: '5.00', description: 'Taxa administrativa cobrada sobre saques (%)' },
  { key: 'max_matrix_width', value: '5', description: 'Largura máxima da matriz (indicados diretos)' },
  { key: 'max_network_levels', value: '10', description: 'Profundidade máxima da rede da matriz (níveis)' },
  { key: 'points_conversion_rate', value: '1.00', description: 'Valor em reais correspondente a 1 ponto de carreira (R$)' },
  { key: 'session_timeout', value: '30', description: 'Tempo limite para expiração de sessão em minutos' },
  { key: 'max_login_attempts', value: '5', description: 'Número máximo de tentativas de login antes de bloquear' }
];

const defaultCashbackLevels = [
  { level: 1, amount: 10.00, description: 'Comissão de Nível 1 (Indicados Diretos)', commission_type: 'percentage', is_active: true },
  { level: 2, amount: 5.00, description: 'Comissão de Nível 2', commission_type: 'percentage', is_active: true },
  { level: 3, amount: 4.00, description: 'Comissão de Nível 3', commission_type: 'percentage', is_active: true },
  { level: 4, amount: 3.00, description: 'Comissão de Nível 4', commission_type: 'percentage', is_active: true },
  { level: 5, amount: 2.00, description: 'Comissão de Nível 5', commission_type: 'percentage', is_active: true },
  { level: 6, amount: 1.00, description: 'Comissão de Nível 6', commission_type: 'percentage', is_active: true },
  { level: 7, amount: 1.00, description: 'Comissão de Nível 7', commission_type: 'percentage', is_active: true },
  { level: 8, amount: 1.00, description: 'Comissão de Nível 8', commission_type: 'percentage', is_active: true },
  { level: 9, amount: 1.00, description: 'Comissão de Nível 9', commission_type: 'percentage', is_active: true },
  { level: 10, amount: 2.00, description: 'Comissão de Nível 10 (Profundidade Máxima)', commission_type: 'percentage', is_active: true }
];

async function run() {
  console.log('Logging in as superadmin2@orgino.group...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'superadmin2@orgino.group',
    password: 'Admin123456!'
  });

  if (authError) {
    console.error('Failed to log in:', authError.message);
    return;
  }

  console.log('Successfully logged in! Access token acquired.');
  
  // Try inserting setting sites
  console.log('Populating system_settings...');
  for (const item of defaultSettings) {
    const { error } = await supabase
      .from('system_settings')
      .upsert(item, { onConflict: 'key' });
    
    if (error) {
      console.error(`Error inserting setting ${item.key}:`, error.message);
    } else {
      console.log(`Setting ${item.key} successfully updated!`);
    }
  }

  console.log('\nPopulating cashback_config (MMN Levels)...');
  for (const item of defaultCashbackLevels) {
    const { data: existing, error: fetchError } = await supabase
      .from('cashback_config')
      .select('*')
      .eq('level', item.level)
      .maybeSingle();

    if (fetchError) {
      console.error(`Error checking level ${item.level}:`, fetchError.message);
      continue;
    }

    if (existing) {
      const { error: updateError } = await supabase
        .from('cashback_config')
        .update({
          amount: item.amount,
          description: item.description,
          commission_type: item.commission_type,
          is_active: item.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error(`Error updating level ${item.level}:`, updateError.message);
      } else {
        console.log(`Level ${item.level} successfully updated!`);
      }
    } else {
      const { error: insertError } = await supabase
        .from('cashback_config')
        .insert(item);

      if (insertError) {
        console.error(`Error inserting level ${item.level}:`, insertError.message);
      } else {
        console.log(`Level ${item.level} successfully inserted!`);
      }
    }
  }
}

run();
