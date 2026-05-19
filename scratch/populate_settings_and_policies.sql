-- ============================================================================
-- ORGINO GROUP - POPULAÇÃO DE CONFIGURAÇÕES E POLÍTICAS RLS DE CONFIGURAÇÃO
-- ============================================================================
-- Este script realiza duas ações essenciais:
-- 1. Popula as tabelas 'system_settings' e 'cashback_config' com os parâmetros 
--    corretos para uma Matriz MMN 5x10, resolvendo a falta de dados que deixava a
--    tela de Comissões vazia.
-- 2. Configura as políticas de RLS para permitir que os administradores (role = 'admin')
--    possam salvar alterações diretamente pela interface do painel.

-- ----------------------------------------------------------------------------
-- 1. HABILITAR RLS NAS TABELAS DE CONFIGURAÇÃO
-- ----------------------------------------------------------------------------
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cashback_config ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 2. CRIAR POLÍTICAS DE RLS PARA 'system_settings'
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Permitir leitura de configurações para todos" ON public.system_settings;
CREATE POLICY "Permitir leitura de configurações para todos" 
    ON public.system_settings 
    FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Permitir inserção de configurações para administradores" ON public.system_settings;
CREATE POLICY "Permitir inserção de configurações para administradores" 
    ON public.system_settings 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE mocha_user_id = auth.uid()::text 
              AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Permitir atualização de configurações para administradores" ON public.system_settings;
CREATE POLICY "Permitir atualização de configurações para administradores" 
    ON public.system_settings 
    FOR UPDATE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE mocha_user_id = auth.uid()::text 
              AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE mocha_user_id = auth.uid()::text 
              AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Permitir exclusão de configurações para administradores" ON public.system_settings;
CREATE POLICY "Permitir exclusão de configurações para administradores" 
    ON public.system_settings 
    FOR DELETE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE mocha_user_id = auth.uid()::text 
              AND role = 'admin'
        )
    );

-- ----------------------------------------------------------------------------
-- 3. CRIAR POLÍTICAS DE RLS PARA 'cashback_config'
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Permitir leitura de cashback para todos" ON public.cashback_config;
CREATE POLICY "Permitir leitura de cashback para todos" 
    ON public.cashback_config 
    FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Permitir inserção de cashback para administradores" ON public.cashback_config;
CREATE POLICY "Permitir inserção de cashback para administradores" 
    ON public.cashback_config 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE mocha_user_id = auth.uid()::text 
              AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Permitir atualização de cashback para administradores" ON public.cashback_config;
CREATE POLICY "Permitir atualização de cashback para administradores" 
    ON public.cashback_config 
    FOR UPDATE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE mocha_user_id = auth.uid()::text 
              AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE mocha_user_id = auth.uid()::text 
              AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Permitir exclusão de cashback para administradores" ON public.cashback_config;
CREATE POLICY "Permitir exclusão de cashback para administradores" 
    ON public.cashback_config 
    FOR DELETE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE mocha_user_id = auth.uid()::text 
              AND role = 'admin'
        )
    );

-- ----------------------------------------------------------------------------
-- 4. POPULAR CONFIGURAÇÕES GLOBAIS DO SISTEMA
-- ----------------------------------------------------------------------------
-- Adiciona ou atualiza os parâmetros globais da plataforma para seguir a regra
-- de negócio de Matriz 5x10.
INSERT INTO public.system_settings (key, value, description) VALUES
    ('site_name', 'Orgino Group', 'Nome comercial da plataforma'),
    ('support_email', 'suporte@orginogroup.com', 'E-mail oficial de suporte ao cliente'),
    ('support_whatsapp', '+55 (11) 99999-9999', 'WhatsApp oficial de atendimento ao cliente'),
    ('site_url', 'https://orginogroup.com', 'URL oficial da aplicação de produção'),
    ('matrix_pix_key', 'financeiro@orginogroup.com', 'Chave PIX Master para recebimento de ativações da rede'),
    ('matrix_cpf', '00.000.000/0001-00', 'CPF ou CNPJ do titular da conta bancária Master'),
    ('min_withdrawal_amount', '50.00', 'Valor mínimo em reais exigido para solicitar saques (R$)'),
    ('withdrawal_fee_percentage', '5.00', 'Taxa administrativa percentual descontada sobre saques (%)'),
    ('max_matrix_width', '5', 'Largura máxima permitida na matriz de derramamento (Diretos)'),
    ('max_network_levels', '10', 'Profundidade máxima permitida para recebimento de comissões (Níveis)'),
    ('points_conversion_rate', '1.00', 'Taxa de conversão: Valor em reais equivalente a 1 Ponto de carreira (R$)'),
    ('session_timeout', '30', 'Tempo limite de inatividade em minutos antes de expirar a sessão admin'),
    ('max_login_attempts', '5', 'Número de tentativas incorretas de login antes do bloqueio temporário')
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    description = EXCLUDED.description,
    updated_at = NOW();

-- ----------------------------------------------------------------------------
-- 5. POPULAR CONFIGURAÇÃO DE COMISSÃO POR NÍVEL (CASHBACK_CONFIG)
-- ----------------------------------------------------------------------------
-- Popula as 10 linhas da tabela 'cashback_config' correspondentes aos 10 níveis 
-- da matriz 5x10, distribuindo comissões residuais que incentivam a profundidade.
-- Total distribuído em rede: 30% do valor da ativação/curso.
INSERT INTO public.cashback_config (level, amount, commission_type, description, is_active) VALUES
    (1, 10.00, 'percentage', 'Comissão Nível 1 - Indicados Diretos (10%)', true),
    (2, 5.00, 'percentage', 'Comissão Nível 2 - Segunda Linha (5%)', true),
    (3, 4.00, 'percentage', 'Comissão Nível 3 - Terceira Linha (4%)', true),
    (4, 3.00, 'percentage', 'Comissão Nível 4 - Quarta Linha (3%)', true),
    (5, 2.00, 'percentage', 'Comissão Nível 5 - Quinta Linha (2%)', true),
    (6, 1.00, 'percentage', 'Comissão Nível 6 - Sexta Linha (1%)', true),
    (7, 1.00, 'percentage', 'Comissão Nível 7 - Sétima Linha (1%)', true),
    (8, 1.00, 'percentage', 'Comissão Nível 8 - Oitava Linha (1%)', true),
    (9, 1.00, 'percentage', 'Comissão Nível 9 - Nona Linha (1%)', true),
    (10, 2.00, 'percentage', 'Comissão Nível 10 - Décima Linha / Alavancagem (2%)', true)
ON CONFLICT (level) DO UPDATE SET
    amount = EXCLUDED.amount,
    description = EXCLUDED.description,
    commission_type = EXCLUDED.commission_type,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- ============================================================================
-- FIM DO SCRIPT DE MIGRAÇÃO
-- ============================================================================
