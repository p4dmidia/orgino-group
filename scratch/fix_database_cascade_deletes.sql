-- ============================================================================
-- ORGINO GROUP - SCRIPT UNIFICADO DE CORREÇÃO DO BANCO DE DADOS
-- ============================================================================
-- Execute este script no "SQL Editor" do painel do Supabase para corrigir:
-- 1. O erro que impede a exclusão/atualização de Usuários (Políticas RLS e Cascade).
-- 2. O erro 409 (Conflict) ao tentar excluir um Curso/Treinamento (Cascade).
-- ----------------------------------------------------------------------------

-- ============================================================================
-- PARTE 1: CORREÇÕES DA TABELA DE USUÁRIOS (user_profiles)
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

-- Ajuste de chaves estrangeiras relacionadas a usuários
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_user_id_fkey;
ALTER TABLE public.transactions ADD CONSTRAINT transactions_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

ALTER TABLE public.withdrawals DROP CONSTRAINT IF EXISTS withdrawals_user_id_fkey;
ALTER TABLE public.withdrawals ADD CONSTRAINT withdrawals_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

ALTER TABLE public.user_settings DROP CONSTRAINT IF EXISTS user_settings_user_id_fkey;
ALTER TABLE public.user_settings ADD CONSTRAINT user_settings_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

ALTER TABLE public.videos_feed DROP CONSTRAINT IF EXISTS videos_feed_user_id_fkey;
ALTER TABLE public.videos_feed ADD CONSTRAINT videos_feed_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_sponsor_id_fkey;
ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_sponsor_id_fkey 
    FOREIGN KEY (sponsor_id) REFERENCES public.user_profiles(id) ON DELETE SET NULL;


-- ============================================================================
-- PARTE 2: CORREÇÕES DAS TABELAS DE CURSOS/EAD (LMS)
-- ============================================================================

-- Módulos do Curso (course_modules): Deletar ao excluir o curso
ALTER TABLE public.course_modules DROP CONSTRAINT IF EXISTS course_modules_course_id_fkey;
ALTER TABLE public.course_modules ADD CONSTRAINT course_modules_course_id_fkey 
    FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

-- Aulas (lessons): Deletar ao excluir o módulo ou o curso
ALTER TABLE public.lessons DROP CONSTRAINT IF EXISTS lessons_course_id_fkey;
ALTER TABLE public.lessons ADD CONSTRAINT lessons_course_id_fkey 
    FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

ALTER TABLE public.lessons DROP CONSTRAINT IF EXISTS lessons_module_id_fkey;
ALTER TABLE public.lessons ADD CONSTRAINT lessons_module_id_fkey 
    FOREIGN KEY (module_id) REFERENCES public.course_modules(id) ON DELETE CASCADE;

-- Materiais de Aula (lesson_materials): Deletar ao excluir a aula
ALTER TABLE public.lesson_materials DROP CONSTRAINT IF EXISTS lesson_materials_lesson_id_fkey;
ALTER TABLE public.lesson_materials ADD CONSTRAINT lesson_materials_lesson_id_fkey 
    FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;

-- Comentários de Aula (lesson_comments): Deletar ao excluir a aula
ALTER TABLE public.lesson_comments DROP CONSTRAINT IF EXISTS lesson_comments_lesson_id_fkey;
ALTER TABLE public.lesson_comments ADD CONSTRAINT lesson_comments_lesson_id_fkey 
    FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;
