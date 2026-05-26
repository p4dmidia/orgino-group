-- ============================================================================
-- CORREÇÃO DE POLÍTICAS RLS E INTEGRIDADE REFERENCIAL (CASCADE DELETE)
-- ============================================================================
-- Execute este script no "SQL Editor" do Supabase para corrigir o erro que impede
-- a exclusão e atualização de usuários pelo painel administrativo.
-- 
-- Este script realiza duas ações:
-- 1. Cria as políticas de DELETE e UPDATE na tabela public.user_profiles.
-- 2. Altera as chaves estrangeiras para ON DELETE CASCADE para evitar erros de 
--    violação de integridade referencial ao excluir o perfil do usuário.
-- ----------------------------------------------------------------------------

-- ============================================================================
-- 1. CORREÇÃO DAS POLÍTICAS DE SEGURANÇA (RLS)
-- ============================================================================

-- Habilitar o RLS na tabela de perfis (caso não esteja habilitado)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas para evitar conflitos
DROP POLICY IF EXISTS "Enable read access for all users" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Permitir leitura de perfis para todos" ON public.user_profiles;
DROP POLICY IF EXISTS "Permitir inserção de perfis" ON public.user_profiles;
DROP POLICY IF EXISTS "Permitir atualização de perfis" ON public.user_profiles;
DROP POLICY IF EXISTS "Permitir exclusão de perfis" ON public.user_profiles;
DROP POLICY IF EXISTS "Permitir exclusão de perfis para administradores" ON public.user_profiles;

-- Criar nova política de LEITURA (SELECT) - Todos podem ler perfis
CREATE POLICY "Permitir leitura de perfis para todos" 
    ON public.user_profiles 
    FOR SELECT 
    USING (true);

-- Criar nova política de INSERÇÃO (INSERT) - Qualquer usuário autenticado ou gatilho pode inserir
CREATE POLICY "Permitir inserção de perfis" 
    ON public.user_profiles 
    FOR INSERT 
    WITH CHECK (true);

-- Criar nova política de ATUALIZAÇÃO (UPDATE) - O próprio usuário pode se atualizar OU qualquer admin
CREATE POLICY "Permitir atualização de perfis" 
    ON public.user_profiles 
    FOR UPDATE 
    TO authenticated
    USING (
        auth.uid()::text = mocha_user_id OR 
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE mocha_user_id = auth.uid()::text 
              AND role = 'admin'
        )
    )
    WITH CHECK (
        auth.uid()::text = mocha_user_id OR 
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE mocha_user_id = auth.uid()::text 
              AND role = 'admin'
        )
    );

-- Criar nova política de EXCLUSÃO (DELETE) - Apenas administradores podem excluir perfis
CREATE POLICY "Permitir exclusão de perfis para administradores" 
    ON public.user_profiles 
    FOR DELETE 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE mocha_user_id = auth.uid()::text 
              AND role = 'admin'
        )
    );

-- ============================================================================
-- 2. AJUSTE DE CHAVES ESTRANGEIRAS (ON DELETE CASCADE / ON DELETE SET NULL)
-- ============================================================================

-- Transações: Deletar transações do usuário ao excluir o usuário
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_user_id_fkey;
ALTER TABLE public.transactions ADD CONSTRAINT transactions_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

-- Saques: Deletar solicitações de saque do usuário ao excluir o usuário
ALTER TABLE public.withdrawals DROP CONSTRAINT IF EXISTS withdrawals_user_id_fkey;
ALTER TABLE public.withdrawals ADD CONSTRAINT withdrawals_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

-- Configurações de Usuário (Saldos, etc.): Deletar ao excluir o usuário
ALTER TABLE public.user_settings DROP CONSTRAINT IF EXISTS user_settings_user_id_fkey;
ALTER TABLE public.user_settings ADD CONSTRAINT user_settings_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

-- Vídeos: Deletar posts de vídeo do usuário ao excluir o usuário
ALTER TABLE public.videos_feed DROP CONSTRAINT IF EXISTS videos_feed_user_id_fkey;
ALTER TABLE public.videos_feed ADD CONSTRAINT videos_feed_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

-- Patrocinador (Sponsor): Se o patrocinador for excluído, define sponsor_id dos indicados como NULL
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_sponsor_id_fkey;
ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_sponsor_id_fkey 
    FOREIGN KEY (sponsor_id) REFERENCES public.user_profiles(id) ON DELETE SET NULL;
