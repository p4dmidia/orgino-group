// Deno Edge Function para gerar o link de pagamento do Checkout da InfinitePay de forma segura (evitando CORS no frontend)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Tratar preflight OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId, description, amountInCents, redirectUrl } = await req.json()

    if (!orderId || !amountInCents || !redirectUrl) {
      return new Response(
        JSON.stringify({ error: 'Parâmetros obrigatórios ausentes: orderId, amountInCents, redirectUrl' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const payload = {
      handle: 'orginogroup', // InfiniteTag do lojista
      redirect_url: redirectUrl,
      webhook_url: 'https://qlrxponkhpvfvepnxmzo.supabase.co/functions/v1/infinitepay-webhook',
      order_nsu: orderId.toString(),
      items: [
        {
          quantity: 1,
          price: amountInCents,
          description: description || 'Plano de Adesão'
        }
      ]
    }

    console.log("Chamando API da InfinitePay de forma segura a partir da Edge Function:", JSON.stringify(payload))

    const response = await fetch('https://api.checkout.infinitepay.io/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro retornado pela InfinitePay:', errorText)
      return new Response(
        JSON.stringify({ error: `InfinitePay API returned ${response.status}: ${errorText}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    console.log("Link gerado com sucesso pela InfinitePay:", data.url)

    return new Response(
      JSON.stringify({ url: data.url }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err: any) {
    console.error("Erro ao gerar link de pagamento:", err.message)
    return new Response(
      JSON.stringify({ error: err.message || 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
