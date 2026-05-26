-- ============================================================================
-- CORREÇÃO DE INTEGRIDADE REFERENCIAL DO LMS (CASCADE DELETE PARA CURSOS)
-- ============================================================================
-- Execute este script no "SQL Editor" do painel do Supabase para corrigir o erro
-- de status 409 (Conflict) ao tentar excluir um curso.
-- 
-- Este script adiciona "ON DELETE CASCADE" nas chaves estrangeiras relacionadas 
-- a cursos, módulos, aulas, comentários e materiais de aula, permitindo a exclusão
-- limpa e completa de um curso.
-- ----------------------------------------------------------------------------

-- 1. Módulos do Curso (course_modules): Deletar ao excluir o curso
ALTER TABLE public.course_modules DROP CONSTRAINT IF EXISTS course_modules_course_id_fkey;
ALTER TABLE public.course_modules ADD CONSTRAINT course_modules_course_id_fkey 
    FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

-- 2. Aulas (lessons): Deletar ao excluir o módulo ou o curso
ALTER TABLE public.lessons DROP CONSTRAINT IF EXISTS lessons_course_id_fkey;
ALTER TABLE public.lessons ADD CONSTRAINT lessons_course_id_fkey 
    FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

ALTER TABLE public.lessons DROP CONSTRAINT IF EXISTS lessons_module_id_fkey;
ALTER TABLE public.lessons ADD CONSTRAINT lessons_module_id_fkey 
    FOREIGN KEY (module_id) REFERENCES public.course_modules(id) ON DELETE CASCADE;

-- 3. Materiais de Aula (lesson_materials): Deletar ao excluir a aula
ALTER TABLE public.lesson_materials DROP CONSTRAINT IF EXISTS lesson_materials_lesson_id_fkey;
ALTER TABLE public.lesson_materials ADD CONSTRAINT lesson_materials_lesson_id_fkey 
    FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;

-- 4. Comentários de Aula (lesson_comments): Deletar ao excluir a aula
ALTER TABLE public.lesson_comments DROP CONSTRAINT IF EXISTS lesson_comments_lesson_id_fkey;
ALTER TABLE public.lesson_comments ADD CONSTRAINT lesson_comments_lesson_id_fkey 
    FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;
