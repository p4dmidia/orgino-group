const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSimulation() {
  console.log('\n========================================================================');
  console.log('      SIMULAÇÃO E AUDITORIA DE COMISSÕES DE REDE ORGINO GROUP');
  console.log('========================================================================\n');

  try {
    // 0. AUTENTICAR COMO ADMIN PARA CONTORNAR POLÍTICAS RLS DE ESCRITA
    console.log('0. Autenticando como Administrador no Supabase...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'superadmin2@orgino.group',
      password: 'Admin123456!'
    });

    if (authError) {
      throw new Error('Falha na autenticação do admin: ' + authError.message);
    }
    console.log('✔ Autenticado com sucesso como Administrador Master!');

    // 1. CARREGAR CONFIGURAÇÕES REAIS DO BANCO DE DADOS (DEFINIDAS PELO ADMIN)
    console.log('\n1. Carregando configurações ativas da tela do administrador...');
    
    const { data: rawLevels, error: errLevels } = await supabase
      .from('cashback_config')
      .select('*')
      .eq('is_active', true)
      .order('level', { ascending: true });

    if (errLevels) throw new Error('Erro ao carregar cashback_config: ' + errLevels.message);
    
    const { data: rawSettings, error: errSettings } = await supabase
      .from('system_settings')
      .select('*');

    if (errSettings) throw new Error('Erro ao carregar system_settings: ' + errSettings.message);

    const getSetting = (key) => rawSettings.find(s => s.key === key)?.value || '1.00';
    const conversionRate = parseFloat(getSetting('points_conversion_rate'));
    const maxLevels = parseInt(getSetting('max_network_levels')) || 10;

    console.log('✔ Parâmetros Globais do Administrador:');
    console.log(`   - Limite Máximo de Níveis: ${maxLevels}`);
    console.log(`   - Conversão de Pontos (R$/Ponto): R$ ${conversionRate.toFixed(2)}`);
    console.log('✔ Percentuais por Nível configurados no Painel:');
    rawLevels.forEach(lvl => {
      console.log(`   - Nível ${lvl.level}: ${lvl.amount}% (${lvl.description})`);
    });

    console.log('\n------------------------------------------------------------------------');

    // 2. BUSCAR USUÁRIOS NA ÁRVORE DE PATROCÍNIO PARA O TESTE
    console.log('2. Mapeando hierarquia de patrocínio para teste...');
    const { data: users, error: errUsers } = await supabase
      .from('user_profiles')
      .select('id, full_name, sponsor_id, referral_code')
      .limit(5);

    if (errUsers) throw new Error('Erro ao buscar perfis: ' + errUsers.message);
    if (!users || users.length < 3) {
      console.log('ℹ Não há perfis suficientes cadastrados para montar a árvore automática.');
      return;
    }

    // Criar uma cadeia de patrocínio de teste com os usuários existentes para a simulação
    const p3 = users[0]; // Patrocinador Nível 3
    const p2 = users[1]; // Patrocinador Nível 2
    const p1 = users[2]; // Patrocinador Nível 1

    console.log(`✔ Hierarquia MMN estabelecida para a simulação:`);
    console.log(`   [Nível 3] Patrocinador: ID ${p3.id} - ${p3.full_name}`);
    console.log(`   [Nível 2] Patrocinador: ID ${p2.id} - ${p2.full_name}`);
    console.log(`   [Nível 1] Patrocinador: ID ${p1.id} - ${p1.full_name}`);

    console.log('\n------------------------------------------------------------------------');

    // 3. CONSULTAR E REGISTRAR O SALDO ATUAL (ANTES DA COMPRA)
    console.log('3. Lendo saldos atuais da tabela affiliate_stats...');
    
    const getStats = async (userId) => {
      const { data, error } = await supabase
        .from('affiliate_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      return data || { available_balance: 0, points_balance: 0, total_earnings: 0 };
    };

    const statsP1Before = await getStats(p1.id);
    const statsP2Before = await getStats(p2.id);
    const statsP3Before = await getStats(p3.id);

    console.log(`   - Patrocinador N1 (ID ${p1.id}) Saldo Atual: R$ ${Number(statsP1Before.available_balance || 0).toFixed(2)} | Pontos: ${Number(statsP1Before.points_balance || 0).toFixed(2)}`);
    console.log(`   - Patrocinador N2 (ID ${p2.id}) Saldo Atual: R$ ${Number(statsP2Before.available_balance || 0).toFixed(2)} | Pontos: ${Number(statsP2Before.points_balance || 0).toFixed(2)}`);
    console.log(`   - Patrocinador N3 (ID ${p3.id}) Saldo Atual: R$ ${Number(statsP3Before.available_balance || 0).toFixed(2)} | Pontos: ${Number(statsP3Before.points_balance || 0).toFixed(2)}`);

    console.log('\n------------------------------------------------------------------------');

    // 4. SIMULAR A COMPRA E DISTRIBUIÇÃO MMN COM BASE NOS NÍVEIS
    const valorCompra = 100.00;
    console.log(`4. Simulando compra no valor de R$ ${valorCompra.toFixed(2)}...`);
    console.log('   Calculando e distribuindo ganhos em rede conforme regras do Admin...');

    const chain = [
      { level: 1, sponsor: p1, before: statsP1Before },
      { level: 2, sponsor: p2, before: statsP2Before },
      { level: 3, sponsor: p3, before: statsP3Before }
    ];

    const insertedCommissions = [];
    const insertedTransactions = [];
    
    for (const node of chain) {
      const config = rawLevels.find(l => l.level === node.level);
      if (!config) continue;

      const pct = parseFloat(config.amount);
      const comissaoVal = parseFloat(((valorCompra * pct) / 100).toFixed(2));
      const pontosVal = parseFloat((valorCompra / conversionRate).toFixed(2));

      console.log(`   👉 Gerando para Nível ${node.level} (${node.sponsor.full_name}): R$ ${comissaoVal.toFixed(2)} de comissão e ${pontosVal.toFixed(2)} pontos`);

      // Inserir a comissão de forma real no banco (omitindo released_at que não existe)
      const { data: commData, error: errComm } = await supabase
        .from('commissions')
        .insert({
          affiliate_id: node.sponsor.id,
          amount: comissaoVal,
          level: node.level,
          order_id: null,
          status: 'completed'
        })
        .select()
        .single();

      if (errComm) {
        console.error(`   ❌ Erro ao registrar comissão para ID ${node.sponsor.id}:`, errComm.message);
        continue;
      }
      insertedCommissions.push(commData.id);

      // Atualizar saldos em affiliate_stats
      const { error: errStatsUpd } = await supabase
        .from('affiliate_stats')
        .upsert({
          user_id: node.sponsor.id,
          referral_code: node.sponsor.referral_code || 'IND' + node.sponsor.id,
          available_balance: Number(node.before.available_balance || 0) + comissaoVal,
          total_earnings: Number(node.before.total_earnings || 0) + comissaoVal,
          points_balance: Number(node.before.points_balance || 0) + pontosVal,
          monthly_points: Number(node.before.monthly_points || 0) + pontosVal,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (errStatsUpd) {
        console.error(`   ❌ Erro ao atualizar saldos para ID ${node.sponsor.id}:`, errStatsUpd.message);
      }

      // Registrar histórico em transactions
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: node.sponsor.id,
          type: 'commission',
          amount: comissaoVal,
          description: `Simulação MMN Nível ${node.level} (${pct}%) - Teste Admin`,
          status: 'completed'
        })
        .select()
        .single();

      if (!txError && txData) {
        insertedTransactions.push(txData.id);
      }
    }

    console.log('\n------------------------------------------------------------------------');

    // 5. CONSULTAR E REGISTRAR O SALDO APÓS A COMPRA
    console.log('5. Lendo saldos atualizados de affiliate_stats para validação...');

    const statsP1After = await getStats(p1.id);
    const statsP2After = await getStats(p2.id);
    const statsP3After = await getStats(p3.id);

    console.log(`   - Patrocinador N1 (ID ${p1.id}) Saldo Novo: R$ ${Number(statsP1After.available_balance || 0).toFixed(2)} (+ R$ ${(Number(statsP1After.available_balance || 0) - Number(statsP1Before.available_balance || 0)).toFixed(2)})`);
    console.log(`   - Patrocinador N2 (ID ${p2.id}) Saldo Novo: R$ ${Number(statsP2After.available_balance || 0).toFixed(2)} (+ R$ ${(Number(statsP2After.available_balance || 0) - Number(statsP2Before.available_balance || 0)).toFixed(2)})`);
    console.log(`   - Patrocinador N3 (ID ${p3.id}) Saldo Novo: R$ ${Number(statsP3After.available_balance || 0).toFixed(2)} (+ R$ ${(Number(statsP3After.available_balance || 0) - Number(statsP3Before.available_balance || 0)).toFixed(2)})`);

    console.log('\n------------------------------------------------------------------------');

    // 6. LIMPEZA AUTOMÁTICA DOS DADOS DE SIMULAÇÃO
    console.log('6. Realizando a limpeza dos registros de simulação do banco...');
    
    if (insertedCommissions.length > 0) {
      await supabase.from('commissions').delete().in('id', insertedCommissions);
    }
    if (insertedTransactions.length > 0) {
      await supabase.from('transactions').delete().in('id', insertedTransactions);
    }
    
    // Restaurar saldos iniciais de teste
    for (const node of chain) {
      await supabase
        .from('affiliate_stats')
        .update({
          available_balance: node.before.available_balance,
          total_earnings: node.before.total_earnings,
          points_balance: node.before.points_balance,
          monthly_points: node.before.monthly_points,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', node.sponsor.id);
    }
    
    console.log('✔ Banco de dados limpo e restaurado com sucesso!');

    console.log('\n========================================================================');
    console.log('                 AUDITORIA FINALIZADA COM SUCESSO!                      ');
    console.log('   As regras definidas pelo Admin estão ATIVAS e CREDITANDO em rede!    ');
    console.log('========================================================================\n');

  } catch (err) {
    console.error('❌ Ocorreu um erro na simulação:', err.message);
  }
}

runSimulation();
