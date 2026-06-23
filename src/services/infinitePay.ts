/**
 * Serviço de Integração com o Checkout da InfinitePay
 */
import { supabase } from '../lib/supabase';

interface CreateCheckoutLinkParams {
  orderId: string; // ID único do pedido (nsu)
  description: string;
  amountInCents: number; // ex: 3000 para R$ 30,00
  redirectUrl: string; // URL de retorno pós-pagamento
}

/**
 * Cria um link de pagamento utilizando a Edge Function intermediária para evitar CORS
 * @param params Parâmetros do checkout
 * @returns Retorna a URL para redirecionamento do pagamento
 */
export async function createInfinitePayCheckoutLink(params: CreateCheckoutLinkParams): Promise<string> {
  try {
    console.log('Chamando Edge Function do Supabase para gerar o link do checkout...');
    
    const { data, error } = await supabase.functions.invoke('create-infinitepay-checkout', {
      body: {
        orderId: params.orderId,
        description: params.description,
        amountInCents: params.amountInCents,
        redirectUrl: params.redirectUrl
      }
    });

    if (error) {
      console.error('Erro retornado pela Edge Function:', error);
      throw new Error(`Falha no checkout: ${error.message || 'Erro interno'}`);
    }

    if (!data || !data.url) {
      throw new Error('URL de pagamento não foi retornada pela Edge Function.');
    }

    return data.url;
  } catch (err: any) {
    console.error('Falha ao gerar checkout na InfinitePay:', err);
    throw err;
  }
}
