-- EXECUTE ESTE SQL NO SEU EDITOR DE SQL DO SUPABASE
-- Objetivo: Permitir que usuários autenticados criem e visualizem seus próprios pedidos na tabela "orders".

-- 1. Garantir que RLS está habilitado
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 2. Remover políticas antigas de inserção/visualização se existirem
DROP POLICY IF EXISTS "Allow users to insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow users to select their own orders" ON public.orders;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.orders;

-- 3. Criar política para permitir inserção apenas dos próprios pedidos
CREATE POLICY "Allow users to insert their own orders" ON public.orders
    FOR INSERT 
    TO authenticated 
    WITH CHECK (
        user_id IN (
            SELECT id FROM public.user_profiles WHERE mocha_user_id = auth.uid()::text
        )
    );

-- 4. Criar política para permitir visualização apenas dos próprios pedidos
CREATE POLICY "Allow users to select their own orders" ON public.orders
    FOR SELECT 
    TO authenticated 
    USING (
        user_id IN (
            SELECT id FROM public.user_profiles WHERE mocha_user_id = auth.uid()::text
        )
    );
