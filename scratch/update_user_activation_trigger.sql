-- EXECUTE ESTE SQL NO SEU EDITOR DE SQL DO SUPABASE
-- Objetivo: Atualizar o motor MMN para ativar o comprador automaticamente (is_active = true) ao confirmar o pagamento de um pedido.

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
       
        -- ATIVAÇÃO DO COMPRADOR: Define is_active como true para o perfil do comprador
        UPDATE public.user_profiles
        SET is_active = true
        WHERE id = NEW.user_id;

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

                -- B. Buscar o código de indicação do patrocinador
                SELECT referral_code INTO sponsor_referral_code 
                FROM public.user_profiles 
                WHERE id = current_sponsor_id;
                
                IF sponsor_referral_code IS NULL THEN
                    sponsor_referral_code := 'IND' || current_sponsor_id;
                END IF;

                -- C. Atualizar estatísticas e saldos financeiros do patrocinador
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

                -- D. Gravar a transação no extrato financeiro geral
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

            -- Subir a hierarquia MMN
            SELECT sponsor_id INTO current_sponsor_id 
            FROM public.user_profiles 
            WHERE id = current_sponsor_id;
            
            current_level := current_level + 1;
            
        END LOOP;

        RAISE NOTICE 'Processamento MMN concluído com sucesso para Pedido #%', NEW.id;
        
    END IF;
    RETURN NEW;
END;
$$;

-- Recriar o trigger
DROP TRIGGER IF EXISTS trg_distribute_order_commissions ON public.orders;
CREATE TRIGGER trg_distribute_order_commissions
    AFTER INSERT OR UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.distribute_order_commissions();
