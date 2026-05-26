-- ============================================================================
-- RESET E CRIAÇÃO DO USUÁRIO ADMINISTRADOR
-- ============================================================================
-- Execute este script no SQL Editor do seu painel Supabase para redefinir/criar
-- as credenciais do admin superadmin2@orgino.group com a senha Admin123456!
-- ----------------------------------------------------------------------------

-- 1. Se o usuário já existir no auth.users, atualiza a senha dele para 'Admin123456!'
UPDATE auth.users 
SET encrypted_password = crypt('Admin123456!', gen_salt('bf')),
    email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'superadmin2@orgino.group';

-- 2. Se o usuário não existir no auth.users, insere com o ID que já está mapeado no user_profiles
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
    'd174d591-b143-40a2-a8a4-b03ec522395a'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    'authenticated',
    'superadmin2@orgino.group',
    crypt('Admin123456!', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Super Admin Dois"}'::jsonb,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'superadmin2@orgino.group'
);

-- 3. Garantir que a identidade exista no auth.identities para permitir o login por e-mail
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
    'd174d591-b143-40a2-a8a4-b03ec522395a'::uuid,
    json_build_object('sub', 'd174d591-b143-40a2-a8a4-b03ec522395a', 'email', 'superadmin2@orgino.group')::jsonb,
    'email',
    'd174d591-b143-40a2-a8a4-b03ec522395a',
    NOW(),
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities WHERE user_id = 'd174d591-b143-40a2-a8a4-b03ec522395a'::uuid
);

-- 4. Garantir que o perfil público existe e está com a role de administrador
INSERT INTO public.user_profiles (
    mocha_user_id,
    email,
    full_name,
    role
)
SELECT 
    'd174d591-b143-40a2-a8a4-b03ec522395a',
    'superadmin2@orgino.group',
    'Super Admin Dois',
    'admin'
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_profiles WHERE email = 'superadmin2@orgino.group'
);

-- 5. Garantir que o cargo está atualizado para admin
UPDATE public.user_profiles
SET role = 'admin',
    mocha_user_id = 'd174d591-b143-40a2-a8a4-b03ec522395a'
WHERE email = 'superadmin2@orgino.group';
