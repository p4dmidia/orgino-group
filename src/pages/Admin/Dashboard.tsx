import React from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { motion } from "motion/react";
import { 
  ShieldCheck, 
  Users, 
  ArrowUpCircle, 
  AlertTriangle, 
  CheckCircle, 
  XCircle 
} from "lucide-react";

export default function AdminDashboard() {
  const adminStats = [
    { label: "Total de Usuários", value: "24.502", change: "+142 hoje", icon: Users, color: "text-blue-400" },
    { label: "Saques Pendentes", value: "32", change: "R$ 14.200", icon: ArrowUpCircle, color: "text-yellow-400" },
    { label: "Denúncias", value: "18", change: "4 críticas", icon: AlertTriangle, color: "text-red-400" },
    { label: "Novos Cursos", value: "7", change: "Aguardando review", icon: ShieldCheck, color: "text-emerald-400" },
  ];

  const pendingWithdrawals = [
    { id: "TX1024", user: "Marcos Oliveira", amount: "R$ 1.200,00", date: "Há 2 horas", status: "pending" },
    { id: "TX1025", user: "Juliana Costa", amount: "R$ 850,00", date: "Há 4 horas", status: "pending" },
    { id: "TX1026", user: "Ricardo Silva", amount: "R$ 2.450,00", date: "Há 5 horas", status: "pending" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500/20 rounded-2xl border border-red-500/20">
            <ShieldCheck className="text-red-500 w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
            <p className="text-zinc-500 text-sm font-medium">Controle total da plataforma Orgino Group</p>
          </div>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900/50 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`${stat.color} w-6 h-6`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.change}</span>
              </div>
              <p className="text-zinc-500 text-xs font-bold mb-1 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Withdrawal Requests */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ArrowUpCircle className="text-yellow-400" size={20} />
                Saques Aguardando Aprovação
              </h2>
              <button className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">Ver todos</button>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-500">Usuário</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-500">Valor</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-500">Data</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-500 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pendingWithdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4 font-bold text-sm text-white">{w.user}</td>
                      <td className="px-6 py-4 font-bold text-sm text-emerald-400">{w.amount}</td>
                      <td className="px-6 py-4 text-xs text-zinc-500">{w.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl transition-all">
                            <CheckCircle size={18} />
                          </button>
                          <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all">
                            <XCircle size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Moderation Queue */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="text-red-400" size={20} />
              Fila de Moderação
            </h2>
            
            <div className="space-y-4">
              {[
                { type: "Vídeo", user: "@fake_news_01", reason: "Conteúdo impróprio", time: "Há 10m" },
                { type: "Comentário", user: "@hater_99", reason: "Spam", time: "Há 15m" },
                { type: "Curso", user: "Pedro Tech", reason: "Review pendente", time: "Há 1h" },
              ].map((item, i) => (
                <div key={i} className="bg-zinc-900/50 border border-white/5 p-5 rounded-3xl hover:border-red-500/20 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black bg-white/5 px-2 py-1 rounded-lg text-zinc-400 uppercase">{item.type}</span>
                    <span className="text-[10px] text-zinc-600 font-bold">{item.time}</span>
                  </div>
                  <p className="text-sm font-bold text-white mb-1">{item.user}</p>
                  <p className="text-xs text-zinc-500 mb-4">{item.reason}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-white/5 hover:bg-white/10 text-xs font-bold py-2 rounded-xl transition-all">Revisar</button>
                    <button className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all">
                      <XCircle size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
