-- ============================================================================
-- ORGINO GROUP - MOTOR DE COMISSÕES DE REDE DINÂMICAS (MMN)
-- ============================================================================
-- Este script cria as funções e gatilhos que calculam e distribuem as comissões
-- multinível em tempo real, baseando-se dinamicamente nas configurações de
-- largura da matriz, limites globais de níveis e percentuais definidos pelo
-- administrador na tabela 'cashback_config' e 'system_settings'.
--
-- O gatilho é disparado automaticamente quando o status de um pedido ('orders')
-- é alterado para 'paid' (Pago) ou quando inserido com status 'paid'.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. DROP DE FUNÇÕES E TRIGGERS EXISTENTES PARA EVITAR DUPLICIDADE
-- ----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_distribute_order_commissions ON public.orders;
DROP FUNCTION IF EXISTS public.distribute_order_commissions();

-- ----------------------------------------------------------------------------
-- 2. FUNÇÃO QUE CALCULA E DISTRIBUI AS COMISSÕES MMN
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.distribute_order_commissions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_sponsor_id BIGINT;
    current_level INT := 1;
    level_commission_pct NUMERIC;
    commission_val NUMERIC;
    points_val NUMERIC;
    conversion_rate NUMERIC;
    max_levels INT := 10;
    sponsor_referral_code TEXT;
BEGIN
    -- Apenas executa quando o status do pedido se torna 'paid' (Pago)
    IF (TG_OP = 'UPDATE' AND NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid')) 
       OR (TG_OP = 'INSERT' AND NEW.status = 'paid') THEN

        RAISE NOTICE 'Iniciando processamento MMN para Pedido #%, Valor R$ %', NEW.id, NEW.total_amount;
       
        -- 1. Buscar a taxa de conversão de pontos
        SELECT COALESCE(value::NUMERIC, 1.00) INTO conversion_rate 
        FROM public.system_settings 
        WHERE key = 'points_conversion_rate';
        
        IF conversion_rate <= 0 THEN
            conversion_rate := 1.00;
        END IF;

        -- 2. Buscar o limite máximo de níveis da rede
        SELECT COALESCE(value::INTEGER, 10) INTO max_levels 
        FROM public.system_settings 
        WHERE key = 'max_network_levels';

        -- 3. Identificar o primeiro patrocinador na árvore MMN
        -- Prioriza o 'affiliate_id' do pedido (indicador direto do checkout).
        -- Se não estiver preenchido, usa o 'sponsor_id' no perfil do comprador.
        IF NEW.affiliate_id IS NOT NULL THEN
            current_sponsor_id := NEW.affiliate_id;
        ELSE
            SELECT sponsor_id INTO current_sponsor_id 
            FROM public.user_profiles 
            WHERE id = NEW.user_id;
        END IF;

        RAISE NOTICE 'Primeiro patrocinador identificado: ID %', current_sponsor_id;

        -- 4. Percorrer a árvore de patrocínio subindo os níveis da matriz
        WHILE current_sponsor_id IS NOT NULL AND current_level <= max_levels LOOP
            
            -- Buscar a comissão ativa configurada para o nível atual
            SELECT amount INTO level_commission_pct 
            FROM public.cashback_config 
            WHERE level = current_level AND is_active = true;
            
            -- Compressão Dinâmica: Se o nível não estiver ativo ou não configurado,
            -- a comissão não é gerada neste patrocinador, mas o loop continua subindo a rede.
            IF level_commission_pct IS NOT NULL AND level_commission_pct > 0 THEN
                
                -- Cálculo dos valores
                commission_val := ROUND((NEW.total_amount * level_commission_pct / 100.00), 2);
                points_val := ROUND((NEW.total_amount / conversion_rate), 2);

                RAISE NOTICE 'Nivel %: Patrocinador ID %, Comissão % por cento, Valor R$ %, Pontos %', 
                    current_level, current_sponsor_id, level_commission_pct, commission_val, points_val;

                -- A. Inserir registro na tabela de 'commissions'
                INSERT INTO public.commissions (
                    affiliate_id, 
                    amount, 
                    level, 
                    order_id, 
                    status, 
                    created_at
                )
                VALUES (
                    current_sponsor_id, 
                    commission_val, 
                    current_level, 
                    NEW.id, 
                    'completed', 
                    NOW()
                );

                -- B. Buscar o código de indicação do patrocinador para a tabela de estatísticas
                SELECT referral_code INTO sponsor_referral_code 
                FROM public.user_profiles 
                WHERE id = current_sponsor_id;
                
                IF sponsor_referral_code IS NULL THEN
                    sponsor_referral_code := 'IND' || current_sponsor_id;
                END IF;

                -- C. Atualizar estatísticas e saldos financeiros do patrocinador ('affiliate_stats')
                INSERT INTO public.affiliate_stats (
                    user_id, 
                    referral_code, 
                    available_balance, 
                    points_balance, 
                    total_earnings, 
                    monthly_points, 
                    created_at, 
                    updated_at
                )
                VALUES (
                    current_sponsor_id, 
                    sponsor_referral_code, 
                    commission_val, 
                    points_val, 
                    commission_val, 
                    points_val, 
                    NOW(), 
                    NOW()
                )
                ON CONFLICT (user_id) DO UPDATE SET
                    available_balance = COALESCE(public.affiliate_stats.available_balance, 0) + EXCLUDED.available_balance,
                    total_earnings = COALESCE(public.affiliate_stats.total_earnings, 0) + EXCLUDED.total_earnings,
                    points_balance = COALESCE(public.affiliate_stats.points_balance, 0) + EXCLUDED.points_balance,
                    monthly_points = COALESCE(public.affiliate_stats.monthly_points, 0) + EXCLUDED.monthly_points,
                    updated_at = NOW();

                -- D. Gravar a transação no extrato financeiro geral ('transactions')
                INSERT INTO public.transactions (
                    user_id, 
                    type, 
                    amount, 
                    description, 
                    status, 
                    created_at
                )
                VALUES (
                    current_sponsor_id, 
                    'commission', 
                    commission_val, 
                    'Comissão MMN Nível ' || current_level || ' (' || level_commission_pct || '%) sobre pedido #' || NEW.id, 
                    'completed', 
                    NOW()
                );

            END IF;

            -- Subir a hierarquia MMN buscando o patrocinador do atual patrocinador
            SELECT sponsor_id INTO current_sponsor_id 
            FROM public.user_profiles 
            WHERE id = current_sponsor_id;
            
            -- Avançar o nível para fins de cálculo de cashback do próximo upline
            current_level := current_level + 1;
            
        END LOOP;

        RAISE NOTICE 'Processamento MMN concluído com sucesso para Pedido #%', NEW.id;
        
    END IF;
    RETURN NEW;
END;
$$;

-- ----------------------------------------------------------------------------
-- 3. CRIAÇÃO DO TRIGGER NA TABELA DE PEDIDOS
-- ----------------------------------------------------------------------------
CREATE TRIGGER trg_distribute_order_commissions
    AFTER INSERT OR UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.distribute_order_commissions();

-- ============================================================================
-- SCRIPT DE VALIDAÇÃO (OPCIONAL - COM ROLLBACK AUTOMÁTICO)
-- ============================================================================
-- Você pode copiar e rodar este bloco inteiro no seu Editor SQL do Supabase.
-- Ele simula um pedido de R$ 100,00 e mostra o extrato de comissões gerado na
-- rede, desfazendo (ROLLBACK) todas as alterações no final para manter o banco limpo!
-- ============================================================================
/*
BEGIN;

-- 1. Criar usuários temporários na árvore (ou usar existentes)
-- Criamos Patrocinador N3, N2, N1 e o Comprador
INSERT INTO public.user_profiles (id, full_name, role, sponsor_id)
VALUES 
    (99903, 'Sponsor Nível 3 (Temp)', 'user', null),
    (99902, 'Sponsor Nível 2 (Temp)', 'user', 99903),
    (99901, 'Sponsor Nível 1 (Temp)', 'user', 99902),
    (99900, 'Comprador (Temp)', 'user', 99901);

-- 2. Criar um pedido pago para o Comprador no valor de R$ 150,00
INSERT INTO public.orders (id, user_id, total_amount, status, created_at)
VALUES (999999, 99900, 150.00, 'pending', NOW());

-- 3. Atualizar para 'paid' para disparar o motor MMN
UPDATE public.orders 
SET status = 'paid' 
WHERE id = 999999;

-- 4. Exibir as comissões geradas na rede para auditoria
SELECT 
    c.level as "Nível",
    u.full_name as "Beneficiário",
    c.amount as "Comissão Recebida (R$)",
    c.status as "Status"
FROM public.commissions c
JOIN public.user_profiles u ON u.id = c.affiliate_id
WHERE c.order_id = 999999
ORDER BY c.level ASC;

-- 5. Exibir a atualização dos saldos na carteira (affiliate_stats)
SELECT 
    u.full_name as "Beneficiário",
    s.available_balance as "Saldo Disponível (R$)",
    s.points_balance as "Pontos de Carreira"
FROM public.affiliate_stats s
JOIN public.user_profiles u ON u.id = s.user_id
WHERE s.user_id IN (99901, 99902, 99903);

-- 6. Exibir o extrato de transações financeiras gerado (transactions)
SELECT 
    u.full_name as "Beneficiário",
    t.amount as "Valor (R$)",
    t.description as "Descrição do Extrato"
FROM public.transactions t
JOIN public.user_profiles u ON u.id = t.user_id
WHERE t.user_id IN (99901, 99902, 99903)
ORDER BY t.created_at DESC;

-- Desfaz todas as inserções temporárias mantendo seu banco de produção 100% intacto!
ROLLBACK;
*/
-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
