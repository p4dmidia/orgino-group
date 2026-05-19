-- ============================================================================
-- ORGINO GROUP - CORREÇÃO DE POLÍTICAS RLS PARA A TABELA 'videos_feed'
-- ============================================================================
-- Este script resolve o erro de 403 (Forbidden) / Violação de RLS ao tentar
-- publicar novos vídeos através do Painel Administrativo.
--
-- Execute este script no SQL Editor do seu painel Supabase.
-- ----------------------------------------------------------------------------

-- 1. Garantir que o Row Level Security (RLS) está habilitado
ALTER TABLE public.videos_feed ENABLE ROW LEVEL SECURITY;

-- 2. Remover políticas antigas para evitar conflitos
DROP POLICY IF EXISTS "Permitir leitura de vídeos para todos" ON public.videos_feed;
DROP POLICY IF EXISTS "Permitir inserção de vídeos para usuários autenticados" ON public.videos_feed;
DROP POLICY IF EXISTS "Permitir atualização de vídeos para proprietários ou admins" ON public.videos_feed;
DROP POLICY IF EXISTS "Permitir exclusão de vídeos para proprietários ou admins" ON public.videos_feed;

-- 3. Criar política de LEITURA (SELECT) - Qualquer um pode visualizar os vídeos do feed
CREATE POLICY "Permitir leitura de vídeos para todos" 
    ON public.videos_feed 
    FOR SELECT 
    USING (true);

-- 4. Criar política de INSERÇÃO (INSERT) - Permite que:
--    a) O usuário insira um vídeo vinculando ao seu próprio profile.id
--    b) Qualquer Administrador (role = 'admin') publique vídeos
CREATE POLICY "Permitir inserção de vídeos para usuários autenticados" 
    ON public.videos_feed 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (
        user_id = (SELECT id FROM public.user_profiles WHERE mocha_user_id = auth.uid()::text)
        OR EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE mocha_user_id = auth.uid()::text 
              AND role = 'admin'
        )
    );

-- 5. Criar política de ATUALIZAÇÃO (UPDATE) - Permite que o proprietário ou admins atualizem
CREATE POLICY "Permitir atualização de vídeos para proprietários ou admins" 
    ON public.videos_feed 
    FOR UPDATE 
    TO authenticated 
    USING (
        user_id = (SELECT id FROM public.user_profiles WHERE mocha_user_id = auth.uid()::text)
        OR EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE mocha_user_id = auth.uid()::text 
              AND role = 'admin'
        )
    )
    WITH CHECK (
        user_id = (SELECT id FROM public.user_profiles WHERE mocha_user_id = auth.uid()::text)
        OR EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE mocha_user_id = auth.uid()::text 
              AND role = 'admin'
        )
    );

-- 6. Criar política de EXCLUSÃO (DELETE) - Permite que o proprietário ou admins excluam
CREATE POLICY "Permitir exclusão de vídeos para proprietários ou admins" 
    ON public.videos_feed 
    FOR DELETE 
    TO authenticated 
    USING (
        user_id = (SELECT id FROM public.user_profiles WHERE mocha_user_id = auth.uid()::text)
        OR EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE mocha_user_id = auth.uid()::text 
              AND role = 'admin'
        )
    );

-- 7. Criar funções RPC para curtir e descurtir vídeos (SECURITY DEFINER para contornar RLS de forma segura)
CREATE OR REPLACE FUNCTION public.like_video(video_id bigint)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.videos_feed
  SET likes_count = COALESCE(likes_count, 0) + 1
  WHERE id = video_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.unlike_video(video_id bigint)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.videos_feed
  SET likes_count = GREATEST(0, COALESCE(likes_count, 0) - 1)
  WHERE id = video_id;
END;
$$;

-- Liberar acesso às funções RPC para usuários autenticados
GRANT EXECUTE ON FUNCTION public.like_video(bigint) TO authenticated;
GRANT EXECUTE ON FUNCTION public.unlike_video(bigint) TO authenticated;

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
