import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { motion, AnimatePresence } from "motion/react";
import { 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Search, 
  Filter, 
  Download,
  CreditCard,
  History,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { Tables } from "../../types/database";

type Transaction = {
  id: string | number;
  type: string;
  amount: number;
  date: string;
  status: string;
  origin: string;
  isNegative: boolean;
};

export default function Statement() {
  const { profile, loading: authLoading } = useAuth();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [stats, setStats] = useState<Tables<'affiliate_stats'> | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!profile) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch stats
        const { data: statsData } = await supabase
          .from('affiliate_stats')
          .select('*')
          .eq('user_id', profile.id)
          .single();
        
        setStats(statsData);

        // Fetch Commissions
        const { data: comms } = await supabase
          .from('commissions')
          .select(`
            *,
            order:orders (
              customer:user_profiles!customer_id (full_name)
            )
          `)
          .eq('affiliate_id', profile.id)
          .order('created_at', { ascending: false });

        // Fetch Withdrawals
        const { data: withdrawals } = await supabase
          .from('withdrawals')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false });

        // Combine and format
        const combined: Transaction[] = [
          ...(comms || []).map(c => ({
            id: `c-${c.id}`,
            type: 'Comissão',
            amount: Number(c.amount),
            date: c.created_at,
            status: c.status || 'pending',
            origin: (c.order as any)?.customer?.full_name || 'Venda Direta',
            isNegative: false
          })),
          ...(withdrawals || []).map(w => ({
            id: `w-${w.id}`,
            type: 'Saque',
            amount: Number(w.amount_requested),
            date: w.created_at,
            status: w.status || 'pending',
            origin: 'Sua Conta',
            isNegative: true
          }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setTransactions(combined);
      } catch (err) {
        console.error('Error fetching financial data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !amount || Number(amount) <= 0) return;

    setWithdrawing(true);
    setStep(2);
    
    try {
      const requested = Number(amount);
      const fee = 4.90;
      const net = requested - fee;

      const { error } = await supabase
        .from('withdrawals')
        .insert({
          user_id: profile.id,
          amount_requested: requested,
          fee_amount: fee,
          net_amount: net,
          status: 'pending',
          pix_key: profile.referral_code || 'N/A' // Simulating pix key with referral code or something else
        });

      if (error) throw error;

      // Update local balance (optimistic or wait for trigger)
      setTimeout(() => setStep(3), 1500);
    } catch (err) {
      console.error('Error requesting withdrawal:', err);
      setStep(1);
    } finally {
      setWithdrawing(false);
    }
  };

  const closeModal = () => {
    setIsWithdrawModalOpen(false);
    setStep(1);
    setAmount("");
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 text-white">Financeiro</h1>
            <p className="text-slate-400 text-lg">Gerencie seus ganhos e solicite saques com facilidade.</p>
          </div>
          
          <button 
            onClick={() => setIsWithdrawModalOpen(true)}
            className="bg-purple-gradient px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-transform shadow-xl shadow-primary/30 text-white"
          >
            <ArrowUpCircle size={22} />
            Solicitar Saque
          </button>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-[2.5rem] border-white/5 bg-primary/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform text-white">
              <Wallet size={80} />
            </div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">Saldo Disponível</p>
            <h3 className="text-5xl font-display font-bold text-gradient">
              {formatCurrency(Number(stats?.available_balance || 0))}
            </h3>
            <div className="mt-8 flex gap-4">
              <span className="text-xs text-slate-500 font-bold bg-white/5 px-3 py-1 rounded-full border border-white/5">PIX Ativo</span>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-white/5">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">Saldo Bloqueado</p>
            <h3 className="text-4xl font-display font-bold text-white">
              {formatCurrency(Number(stats?.pending_balance || 0))}
            </h3>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">Liberação prevista em até <span className="text-white font-bold">7 dias</span> após a venda.</p>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-white/5">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">Total Sacado</p>
            <h3 className="text-4xl font-display font-bold text-white">
              {formatCurrency(Number(stats?.total_withdrawn || 0))}
            </h3>
            <div className="mt-6 flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <ArrowUpCircle size={14} />
              <span>Ganhos constantes</span>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-display font-bold flex items-center gap-3 text-white">
              <History className="text-primary" />
              Extrato de Ganhos
            </h2>
            
            <div className="flex gap-3">
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
                <Search size={16} className="text-slate-500" />
                <input type="text" placeholder="Filtrar..." className="bg-transparent border-none outline-none text-xs w-32 text-white" />
              </div>
              <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors">
                <Filter size={18} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : (
            <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5">
                      <th className="px-8 py-6 text-xs uppercase tracking-widest text-slate-500 font-bold">Tipo</th>
                      <th className="px-8 py-6 text-xs uppercase tracking-widest text-slate-500 font-bold">Origem</th>
                      <th className="px-8 py-6 text-xs uppercase tracking-widest text-slate-500 font-bold">Data</th>
                      <th className="px-8 py-6 text-xs uppercase tracking-widest text-slate-500 font-bold">Status</th>
                      <th className="px-8 py-6 text-xs uppercase tracking-widest text-slate-500 font-bold text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactions.length > 0 ? (
                      transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${tx.isNegative ? 'bg-red-400/10 text-red-400' : 'bg-emerald-400/10 text-emerald-400'}`}>
                                {tx.isNegative ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                              </div>
                              <span className="font-bold text-white">{tx.type}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-slate-400">{tx.origin}</td>
                          <td className="px-8 py-6 text-slate-400">
                            {new Date(tx.date).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-8 py-6">
                            <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full ${
                              tx.status === 'completed' || tx.status === 'paid' 
                                ? 'bg-emerald-400/10 text-emerald-400' 
                                : 'bg-yellow-400/10 text-yellow-400'
                            }`}>
                              {tx.status === 'paid' ? 'Pago' : tx.status === 'completed' ? 'Concluído' : 'Pendente'}
                            </span>
                          </td>
                          <td className={`px-8 py-6 text-right font-bold text-lg ${tx.isNegative ? 'text-white' : 'text-emerald-400'}`}>
                            {tx.isNegative ? '-' : '+'} {formatCurrency(tx.amount)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center text-slate-500">
                          Nenhuma transação encontrada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {isWithdrawModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-white">Solicitar Saque</h2>
                  <button onClick={closeModal} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X className="text-zinc-500" />
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.form
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleWithdraw}
                      className="space-y-6"
                    >
                      <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex gap-3">
                        <AlertCircle className="text-primary shrink-0" />
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          O valor será transferido para sua chave PIX cadastrada em até 24h úteis. Taxa fixa de <span className="text-white font-bold">R$ 4,90</span> por saque.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300 ml-1">Valor do Saque</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold text-lg">R$</span>
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0,00"
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            required
                          />
                        </div>
                        <p className="text-xs text-zinc-500 ml-1">Saldo disponível: {formatCurrency(Number(stats?.available_balance || 0))}</p>
                      </div>

                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-2">Chave PIX Destino</p>
                        <div className="flex items-center gap-3 text-white font-medium">
                          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                            <CreditCard size={16} className="text-primary" />
                          </div>
                          PIX Identificado
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={withdrawing || !amount || Number(amount) > Number(stats?.available_balance || 0)}
                        className="w-full bg-primary disabled:opacity-50 hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                      >
                        {withdrawing ? 'Processando...' : 'Confirmar Saque'}
                      </button>
                    </motion.form>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 flex flex-col items-center justify-center text-center space-y-6"
                    >
                      <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Processando Pedido</h3>
                        <p className="text-zinc-400">Validando informações de segurança...</p>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-8 flex flex-col items-center justify-center text-center space-y-6"
                    >
                      <div className="w-20 h-20 bg-emerald-400/20 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Solicitação Enviada!</h3>
                        <p className="text-zinc-400">Seu saque de <span className="text-white font-bold">{formatCurrency(Number(amount))}</span> foi solicitado com sucesso.</p>
                      </div>
                      <button
                        onClick={closeModal}
                        className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl border border-white/10 transition-all"
                      >
                        Fechar
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
