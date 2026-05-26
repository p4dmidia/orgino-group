-- ============================================================================
-- ATUALIZAÇÃO DA CONTA DE ADMINISTRADOR E HIGIENIZAÇÃO DE ACESSOS
-- ============================================================================
-- Execute este script no "SQL Editor" do painel do Supabase para:
-- 1. Definir o usuário 'admin@orginogroup.com.br' como admin com a senha 'admin123'.
-- 2. Garantir que NENHUM outro usuário tenha acesso de administrador.
-- ----------------------------------------------------------------------------

-- 1. Atualizar ou criar o usuário admin@orginogroup.com.br na autenticação (auth.users)
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) 
SELECT 
    '8cf33caa-2447-4d4a-a901-041f0f8d8716'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    'authenticated',
    'admin@orginogroup.com.br',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Admin Master"}'::jsonb,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@orginogroup.com.br'
);

-- Se já existir, apenas atualizar a senha para 'admin123'
UPDATE auth.users 
SET encrypted_password = crypt('admin123', gen_salt('bf')),
    email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'admin@orginogroup.com.br';

-- 2. Garantir que a identidade exista em auth.identities para permitir login por e-mail
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    '8cf33caa-2447-4d4a-a901-041f0f8d8716'::uuid,
    json_build_object('sub', '8cf33caa-2447-4d4a-a901-041f0f8d8716', 'email', 'admin@orginogroup.com.br')::jsonb,
    'email',
    '8cf33caa-2447-4d4a-a901-041f0f8d8716',
    NOW(),
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities WHERE user_id = '8cf33caa-2447-4d4a-a901-041f0f8d8716'::uuid
);

-- 3. Garantir que o perfil público existe em user_profiles e está com cargo 'admin'
INSERT INTO public.user_profiles (
    mocha_user_id,
    email,
    full_name,
    role,
    is_active
)
SELECT 
    '8cf33caa-2447-4d4a-a901-041f0f8d8716',
    'admin@orginogroup.com.br',
    'Admin Master',
    'admin',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_profiles WHERE email = 'admin@orginogroup.com.br'
);

-- Garantir que o cargo está atualizado para 'admin'
UPDATE public.user_profiles
SET role = 'admin',
    mocha_user_id = '8cf33caa-2447-4d4a-a901-041f0f8d8716',
    is_active = true
WHERE email = 'admin@orginogroup.com.br';

-- 4. Remover permissão de admin de TODAS as outras contas antigas (alterar para 'user')
UPDATE public.user_profiles
SET role = 'user'
WHERE email IN (
    'superadmin2@orgino.group',
    'superadmin@orgino.group',
    'thiagoAlmeida321',
    'SEU_EMAIL_AQUI'
) OR mocha_user_id = '146d6f68-9561-40a6-b30e-cf6cac31c87b';
