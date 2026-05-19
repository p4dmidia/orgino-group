-- ============================================================================
-- ORGINO GROUP - SISTEMA DE COMENTÁRIOS DO FEED DE VÍDEOS
-- ============================================================================

-- 1. Criar a tabela de comentários do feed de vídeos se ela não existir
CREATE TABLE IF NOT EXISTS public.video_comments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    video_id BIGINT NOT NULL REFERENCES public.videos_feed(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE public.video_comments ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas antigas para evitar conflitos
DROP POLICY IF EXISTS "Permitir leitura de comentários para todos" ON public.video_comments;
DROP POLICY IF EXISTS "Permitir inserção de comentários para usuários autenticados" ON public.video_comments;
DROP POLICY IF EXISTS "Permitir exclusão de comentários para proprietários ou admins" ON public.video_comments;

-- 4. Criar política de LEITURA (SELECT) - Qualquer um pode visualizar os comentários
CREATE POLICY "Permitir leitura de comentários para todos"
    ON public.video_comments
    FOR SELECT
    USING (true);

-- 5. Criar política de INSERÇÃO (INSERT) - Apenas o próprio usuário autenticado pode comentar
CREATE POLICY "Permitir inserção de comentários para usuários autenticados"
    ON public.video_comments
    FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = (SELECT id FROM public.user_profiles WHERE mocha_user_id = auth.uid()::text)
    );

-- 6. Criar política de EXCLUSÃO (DELETE) - Apenas o dono do comentário ou administradores podem deletar
CREATE POLICY "Permitir exclusão de comentários para proprietários ou admins"
    ON public.video_comments
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

-- 7. Criar gatilho (Trigger) para atualizar a contagem de comentários no 'videos_feed' automaticamente
CREATE OR REPLACE FUNCTION public.handle_video_comment_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.videos_feed
    SET comments_count = COALESCE(comments_count, 0) + 1
    WHERE id = NEW.video_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.videos_feed
    SET comments_count = GREATEST(0, COALESCE(comments_count, 0) - 1)
    WHERE id = OLD.video_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover trigger se já existir para recriá-lo de forma limpa
DROP TRIGGER IF EXISTS on_video_comment_change ON public.video_comments;

CREATE TRIGGER on_video_comment_change
  AFTER INSERT OR DELETE ON public.video_comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_video_comment_changes();
