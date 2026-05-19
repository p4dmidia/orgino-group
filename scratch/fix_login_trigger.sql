-- Corrige o erro 500 no Login!

-- 1. Recria a função de sincronização com o search_path = public obrigatório do Supabase
CREATE OR REPLACE FUNCTION public.sync_user_email()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  BEGIN
    UPDATE public.user_profiles
    SET email = NEW.email
    WHERE mocha_user_id = NEW.id::text;
  EXCEPTION WHEN OTHERS THEN
    RETURN NEW;
  END;
  RETURN NEW;
END;
$$;

-- 2. (Opcional, apenas para garantir) Recria o gatilho corretamente
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.sync_user_email();
