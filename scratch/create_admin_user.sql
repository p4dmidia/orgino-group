-- SCRIPT PARA CRIAR UM NOVO ADMINISTRADOR DO ZERO E VINCULAR O PROVEDOR DE EMAIL

DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
    admin_email TEXT := 'superadmin2@orgino.group'; -- Mude para o e-mail desejado
    admin_password TEXT := 'Admin123456!'; -- Mude para a senha desejada
    admin_name TEXT := 'Super Admin Dois'; -- Mude para o nome desejado
BEGIN
    -- 1. Inserir no sistema de Autenticação principal (auth.users)
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
    ) VALUES (
        new_user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        admin_email,
        crypt(admin_password, gen_salt('bf')),
        NOW(),
        '{"provider": "email", "providers": ["email"]}'::jsonb,
        json_build_object('full_name', admin_name)::jsonb,
        NOW(),
        NOW()
    );

    -- 2. Inserir a identidade (auth.identities)
    -- ESSE É O SEGREDO PARA APARECER O "EMAIL" NA COLUNA PROVIDERS E PERMITIR O LOGIN!
    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        new_user_id,
        json_build_object('sub', new_user_id::text, 'email', admin_email)::jsonb,
        'email',
        new_user_id::text,
        NOW(),
        NOW(),
        NOW()
    );

    -- 3. Atualizar o cargo para 'admin' no seu sistema
    UPDATE public.user_profiles 
    SET role = 'admin' 
    WHERE mocha_user_id = new_user_id::text;

END $$;
