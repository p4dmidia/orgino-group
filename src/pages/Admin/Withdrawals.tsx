import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { motion } from "motion/react";
import { 
  ArrowUpCircle, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  AlertCircle,
  FileText,
  Loader2
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Tables } from "../../types/database";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type WithdrawalWithUser = Tables<'withdrawals'> & {
  user_profiles?: { full_name: string } | null;
};

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'pending' | 'paid' | 'rejected'>('pending');

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select(`
          *,
          user_profiles (full_name)
        `)
        .eq('status', filter)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWithdrawals(data as any);
    } catch (err) {
      console.error('Error fetching admin withdrawals:', err);
      toast.error("Erro ao carregar solicitações de saque.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [filter]);

  const handleAction = async (id: number, status: 'paid' | 'rejected') => {
    setProcessingId(id);
    try {
      const { error } = await supabase
        .from('withdrawals')
        .update({ 
          status, 
          processed_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;

      toast.success(status === 'paid' ? "Saque aprovado com sucesso!" : "Saque recusado.");
      setWithdrawals(prev => prev.filter(w => w.id !== id));
    } catch (err: any) {
      console.error('Error updating withdrawal status:', err);
      toast.error("Erro ao processar ação: " + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <ArrowUpCircle className="text-primary" />
              Gestão de Saques
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Aprovação e monitoramento de retiradas via PIX.</p>
          </div>
          <div className="flex gap-2 bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5">
            <button 
              onClick={() => setFilter('pending')}
              className={`${filter === 'pending' ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-600/20' : 'text-zinc-500 hover:text-white'} px-4 py-2 rounded-xl text-xs font-bold transition-all`}
            >
              Pendentes
            </button>
            <button 
              onClick={() => setFilter('paid')}
              className={`${filter === 'paid' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-zinc-500 hover:text-white'} px-4 py-2 rounded-xl text-xs font-bold transition-all`}
            >
              Pagos
            </button>
            <button 
              onClick={() => setFilter('rejected')}
              className={`${filter === 'rejected' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-500 hover:text-white'} px-4 py-2 rounded-xl text-xs font-bold transition-all`}
            >
              Recusados
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform text-yellow-400">
              <Clock size={64} />
            </div>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-2">Volume Atual</p>
            <h3 className="text-4xl font-bold text-white">{withdrawals.length}</h3>
            <p className="text-yellow-400 text-sm font-bold mt-2">Solicitações filtradas</p>
          </div>

          <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform text-emerald-400">
              <CheckCircle size={64} />
            </div>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-2">Montante Total</p>
            <h3 className="text-4xl font-bold text-white">
              {formatCurrency(withdrawals.reduce((acc, w) => acc + Number(w.amount_requested), 0))}
            </h3>
            <p className="text-emerald-400 text-sm font-bold mt-2">Valor bruto total</p>
          </div>

          <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform text-red-400">
              <AlertCircle size={64} />
            </div>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-2">Status do Servidor</p>
            <h3 className="text-4xl font-bold text-white">Online</h3>
            <p className="text-red-400 text-sm font-bold mt-2">Pronto para processar</p>
          </div>
        </div>

        {/* Withdrawals List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
          </div>
        ) : (
          <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/5">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500">ID / Data</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500">Usuário</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500">Chave PIX</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500">Valor Líquido</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {withdrawals.length > 0 ? (
                    withdrawals.map((w, index) => (
                      <motion.tr 
                        key={w.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-mono text-zinc-400">#{w.id}</span>
                            <span className="text-xs text-zinc-600">
                              {format(new Date(w.created_at || ''), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 font-bold text-white">{w.user_profiles?.full_name || 'Usuário Master'}</td>
                        <td className="px-8 py-6">
                          <span className="text-xs text-zinc-500 font-mono">{w.pix_key}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-1 text-lg font-black text-emerald-400">
                            {formatCurrency(Number(w.net_amount))}
                          </div>
                          <span className="text-[10px] text-zinc-500">Taxa: {formatCurrency(Number(w.fee_amount))}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                            w.status === "paid" ? "bg-emerald-500/10 text-emerald-500" :
                            w.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
                            "bg-red-500/10 text-red-500"
                          }`}>
                            {w.status === "paid" ? "Pago" : w.status === "pending" ? "Aguardando" : "Recusado"}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex justify-end gap-2">
                            {w.status === "pending" ? (
                              <>
                                <button 
                                  disabled={processingId === Number(w.id)}
                                  onClick={() => handleAction(Number(w.id), 'paid')}
                                  className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-50" title="Aprovar Pagamento"
                                >
                                  {processingId === Number(w.id) ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                </button>
                                <button 
                                  disabled={processingId === Number(w.id)}
                                  onClick={() => handleAction(Number(w.id), 'rejected')}
                                  className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all shadow-lg shadow-red-500/10 disabled:opacity-50" title="Recusar Saque"
                                >
                                  {processingId === Number(w.id) ? <Loader2 className="animate-spin" size={20} /> : <XCircle size={20} />}
                                </button>
                              </>
                            ) : (
                              <button className="p-2.5 bg-white/5 text-zinc-500 rounded-xl cursor-not-allowed">
                                <FileText size={20} />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center text-zinc-500">
                        Nenhuma solicitação encontrada para o filtro selecionado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
