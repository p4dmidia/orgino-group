-- Criação da função que insere o perfil do usuário automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, mocha_user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.id::text,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'user'
  );
  RETURN NEW;
END;
$$;

-- Remove o trigger se ele já existir (para evitar erros)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criação do gatilho na tabela auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Criação da função de sincronização de email
CREATE OR REPLACE FUNCTION public.sync_user_email()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
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

-- Remove o trigger de email se ele já existir
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Criação do gatilho para sincronizar email na tabela auth.users
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.sync_user_email();
