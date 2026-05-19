-- Forma alternativa e mais garantida de sincronizar os usuários
INSERT INTO public.user_profiles (mocha_user_id, email, full_name, role)
SELECT 
    id::text, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'Usuário Sincronizado'), 
    'user'
FROM auth.users
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_profiles up WHERE up.mocha_user_id = auth.users.id::text
);
