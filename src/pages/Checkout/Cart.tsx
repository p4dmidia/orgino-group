import React, { useEffect, useState } from "react";
import PublicLayout from "../../components/Layout/PublicLayout";
import { motion } from "motion/react";
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Tag, Info, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
}

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Inicializa o carrinho. Por padrão, se o usuário veio assinar o plano, garantimos que ele esteja no carrinho.
    const savedCart = localStorage.getItem("orgino_cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    } else {
      // Pré-popula com o plano de adesão por conveniência
      const defaultItem: CartItem = {
        id: "plano_adesao",
        name: "Plano de Adesão Orgino Group",
        price: 30.00,
        quantity: 1,
        description: "Acesso completo à plataforma de influência, matriz MMN de comissões, cursos premium e cartão de benefícios digital."
      };
      setCartItems([defaultItem]);
      localStorage.setItem("orgino_cart", JSON.stringify([defaultItem]));
    }
  }, []);

  const removeItem = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("orgino_cart", JSON.stringify(updated));
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <PublicLayout>
      <div className="min-h-screen pt-32 pb-24 px-6 relative bg-radial-dark overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-10 relative z-10">
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-white/5 pb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-black text-white tracking-tight">Carrinho de Compras</h1>
              <p className="text-slate-400 text-sm">Revise seus itens antes de finalizar a assinatura.</p>
            </div>
          </div>

          {cartItems.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 rounded-[2rem] border-white/5 bg-zinc-900/20 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/20 transition-colors"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-primary/20 text-primary px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                          Assinatura Anual
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white font-display">{item.name}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed max-w-xl">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-8 border-t border-white/5 md:border-none pt-4 md:pt-0">
                      <div className="text-left md:text-right">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Preço</p>
                        <p className="text-2xl font-black text-white">{formatCurrency(item.price)}</p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                        title="Remover item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}

                {/* Info Box */}
                <div className="bg-white/5 border border-white/5 p-6 rounded-3xl flex gap-4 items-start">
                  <Info className="text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-white text-sm font-bold">Compra 100% Segura e Certificada</p>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Ao assinar o Plano de Adesão, sua conta é ativada instantaneamente na plataforma após a confirmação do pagamento pela InfinitePay. Parte do valor arrecadado é destinado a causas e projetos sociais.
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Sidebar */}
              <div className="space-y-6">
                <div className="glass-card p-8 rounded-[2.5rem] border-primary/30 bg-primary/5 shadow-2xl shadow-primary/10 space-y-6">
                  <h3 className="text-xl font-bold text-white font-display">Resumo do Pedido</h3>
                  
                  <div className="space-y-4 text-sm font-semibold">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal</span>
                      <span>{formatCurrency(calculateTotal())}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Desconto</span>
                      <span className="text-emerald-400">- R$ 0,00</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Ciclo de Cobrança</span>
                      <span>Anual</span>
                    </div>
                    
                    <div className="border-t border-white/5 pt-4 flex justify-between items-end">
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Geral</p>
                        <p className="text-3xl font-black text-white font-display mt-1">{formatCurrency(calculateTotal())}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
                  >
                    Ir para o Pagamento
                    <ArrowRight size={18} />
                  </button>
                </div>

                <div className="glass-card p-6 rounded-3xl border-white/5 text-center flex flex-col items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                    <Heart size={20} className="fill-accent" />
                  </div>
                  <p className="text-xs text-slate-400 font-bold">
                    Ao finalizar esta adesão, você apoia o projeto social de auxílio ao TEA (Autismo).
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-16 rounded-[3rem] border-white/5 text-center flex flex-col items-center justify-center max-w-xl mx-auto space-y-6"
            >
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-slate-500 border border-white/10">
                <ShoppingBag size={36} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white font-display">Seu carrinho está vazio</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Adicione o plano de adesão na página inicial para iniciar a sua ativação de parceiro Orgino Group.
                </p>
              </div>
              <button
                onClick={() => navigate("/")}
                className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                Voltar à Página Inicial
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
