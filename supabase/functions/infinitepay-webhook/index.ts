// Deno Edge Function para processar o Webhook da InfinitePay
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Trata requisições OPTIONS (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Variáveis de ambiente do Supabase não configuradas.");
      return new Response(
        JSON.stringify({ error: 'Supabase configuration missing' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })

    // Parse do payload do webhook
    const body = await req.json()
    console.log("Recebendo payload do webhook da InfinitePay:", JSON.stringify(body))

    // InfinitePay envia o identificador do pedido no campo `order_nsu`
    const orderNsu = body.order_nsu || body.orderId || body.slug
    
    if (!orderNsu) {
      console.warn("Webhook recebido sem identificador de pedido (order_nsu).")
      return new Response(
        JSON.stringify({ error: 'Missing order identifier (order_nsu)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const orderId = parseInt(orderNsu, 10)
    if (isNaN(orderId)) {
      console.warn(`Identificador de pedido inválido recebido: ${orderNsu}`)
      return new Response(
        JSON.stringify({ error: 'Invalid order identifier format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Buscando pedido ID ${orderId} no banco de dados...`)
    
    // Verifica se o pedido existe e qual seu status atual
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, status, user_id')
      .eq('id', orderId)
      .maybeSingle()

    if (orderError) {
      console.error(`Erro ao buscar pedido ID ${orderId}:`, orderError.message)
      throw orderError
    }

    if (!order) {
      console.warn(`Pedido ID ${orderId} não encontrado no banco de dados.`)
      return new Response(
        JSON.stringify({ error: `Order ${orderId} not found` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Pedido encontrado. Status atual: ${order.status}. Usuário associado: ${order.user_id}`)

    // Se o pedido já estiver pago, retorna sucesso direto (evita reprocessamento redundante)
    if (order.status === 'paid') {
      console.log(`Pedido ID ${orderId} já consta como pago.`)
      return new Response(
        JSON.stringify({ message: 'Order already processed as paid' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Atualizando status do pedido ID ${orderId} para 'paid'...`)
    
    // Atualiza o pedido para 'paid'
    // Isso dispara o trigger trg_distribute_order_commissions que:
    // 1. Ativa o perfil do comprador (user_profiles.is_active = true)
    // 2. Distribui as comissões multinível da rede
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'paid', updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (updateError) {
      console.error(`Erro ao atualizar o pedido ID ${orderId}:`, updateError.message)
      throw updateError
    }

    console.log(`Pedido ID ${orderId} processado e ativado com sucesso!`)

    return new Response(
      JSON.stringify({ success: true, message: `Order ${orderId} successfully marked as paid` }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err: any) {
    console.error("Erro inesperado no processamento do webhook:", err.message)
    return new Response(
      JSON.stringify({ error: err.message || 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
