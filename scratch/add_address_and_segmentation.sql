-- ============================================================================
-- ORGINO GROUP - SEGMENTAÇÃO REGIONAL E ENDEREÇO DO AFILIADO
-- ============================================================================
-- Execute este script no SQL Editor do seu painel Supabase.
-- ----------------------------------------------------------------------------

-- 1. Adicionar coluna neighborhood (bairro) na tabela user_profiles se não existir
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS neighborhood TEXT;

-- 2. Adicionar coluna target_states (array de UFs de destino) na tabela videos_feed se não existir
ALTER TABLE public.videos_feed ADD COLUMN IF NOT EXISTS target_states TEXT[] DEFAULT '{}'::TEXT[];

-- 3. Atualizar a função handle_new_user() para sincronizar os dados do formulário de registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_sponsor_id BIGINT;
BEGIN
  -- 1. Buscar o ID do patrocinador (sponsor_id) usando o sponsor_code (que está em referral_code)
  IF NEW.raw_user_meta_data->>'sponsor_code' IS NOT NULL AND NEW.raw_user_meta_data->>'sponsor_code' <> '' THEN
    SELECT id INTO v_sponsor_id 
    FROM public.user_profiles 
    WHERE referral_code = NEW.raw_user_meta_data->>'sponsor_code'
    LIMIT 1;
  END IF;

  -- 2. Inserir na tabela user_profiles copiando todos os metadados do cadastro
  INSERT INTO public.user_profiles (
    mocha_user_id, 
    email, 
    full_name, 
    role,
    phone,
    cpf,
    referral_code,
    sponsor_id,
    cep,
    address,
    number,
    complement,
    city,
    state,
    neighborhood
  )
  VALUES (
    NEW.id::text,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      TRIM(COALESCE(NEW.raw_user_meta_data->>'firstName', '') || ' ' || COALESCE(NEW.raw_user_meta_data->>'lastName', ''))
    ),
    'user',
    NEW.raw_user_meta_data->>'whatsapp',
    NEW.raw_user_meta_data->>'cpfCnpj',
    NEW.raw_user_meta_data->>'login',
    v_sponsor_id,
    NEW.raw_user_meta_data->>'cep',
    NEW.raw_user_meta_data->>'address',
    NEW.raw_user_meta_data->>'number',
    NEW.raw_user_meta_data->>'complement',
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'state',
    NEW.raw_user_meta_data->>'neighborhood'
  );
  RETURN NEW;
END;
$$;
