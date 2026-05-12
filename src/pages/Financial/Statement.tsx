import React, { useState } from "react";
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
  AlertCircle
} from "lucide-react";
import { recentTransactions } from "../../mocks/dashboardData";

export default function Statement() {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    setTimeout(() => setStep(3), 2000);
  };

  const closeModal = () => {
    setIsWithdrawModalOpen(false);
    setStep(1);
    setAmount("");
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">Financeiro</h1>
            <p className="text-slate-400 text-lg">Gerencie seus ganhos e solicite saques com facilidade.</p>
          </div>
          
          <button 
            onClick={() => setIsWithdrawModalOpen(true)}
            className="bg-purple-gradient px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-transform shadow-xl shadow-primary/30"
          >
            <ArrowUpCircle size={22} />
            Solicitar Saque
          </button>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-[2.5rem] border-white/5 bg-primary/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
              <Wallet size={80} />
            </div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">Saldo Disponível</p>
            <h3 className="text-5xl font-display font-bold text-gradient">R$ 12.450,00</h3>
            <div className="mt-8 flex gap-4">
              <span className="text-xs text-slate-500 font-bold bg-white/5 px-3 py-1 rounded-full border border-white/5">PIX Ativo</span>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-white/5">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">Saldo Bloqueado</p>
            <h3 className="text-4xl font-display font-bold">R$ 4.200,00</h3>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">Liberação prevista em até <span className="text-white font-bold">7 dias</span> após a venda.</p>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-white/5">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">Total Sacado</p>
            <h3 className="text-4xl font-display font-bold">R$ 45.800,00</h3>
            <div className="mt-6 flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <ArrowUpCircle size={14} />
              <span>+15% em relação ao mês anterior</span>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-display font-bold flex items-center gap-3">
              <History className="text-primary" />
              Extrato de Ganhos
            </h2>
            
            <div className="flex gap-3">
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
                <Search size={16} className="text-slate-500" />
                <input type="text" placeholder="Filtrar..." className="bg-transparent border-none outline-none text-xs w-32" />
              </div>
              <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors">
                <Filter size={18} />
              </button>
              <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors">
                <Download size={18} />
              </button>
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
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
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${tx.amount.startsWith('-') ? 'bg-red-400/10 text-red-400' : 'bg-emerald-400/10 text-emerald-400'}`}>
                          {tx.amount.startsWith('-') ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                        </div>
                        <span className="font-bold">{tx.type}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-slate-400">{tx.user}</td>
                    <td className="px-8 py-6 text-slate-400">{tx.date}</td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full ${tx.status === 'completed' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-yellow-400/10 text-yellow-400'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className={`px-8 py-6 text-right font-bold text-lg ${tx.amount.startsWith('-') ? 'text-white' : 'text-emerald-400'}`}>
                      {tx.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                        <p className="text-xs text-zinc-500 ml-1">Saldo disponível: R$ 12.450,00</p>
                      </div>

                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-2">Chave PIX Destino</p>
                        <div className="flex items-center gap-3 text-white font-medium">
                          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                            <CreditCard size={16} className="text-primary" />
                          </div>
                          (11) 9****-**42
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                      >
                        Confirmar Saque
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
                        <p className="text-zinc-400">Seu saque de <span className="text-white font-bold">R$ {amount}</span> foi solicitado com sucesso.</p>
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
