import React from "react";
import Layout from "../../components/Layout/Layout";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  Users, 
  PlayCircle, 
  Trophy, 
  ArrowUpRight, 
  Copy, 
  QrCode,
  Wallet
} from "lucide-react";
import { dashboardStats, recentTransactions } from "../../mocks/dashboardData";

export default function Overview() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">Olá, Alex! 👋</h1>
            <p className="text-slate-400 text-lg">Seu ecossistema de influência cresceu <span className="text-primary font-bold">15%</span> esta semana.</p>
          </div>
          
          <div className="flex gap-3">
            <div className="glass-card px-6 py-3 rounded-2xl flex items-center gap-3 border-white/5">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Trophy size={20} className="text-yellow-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Meta Mensal</p>
                <p className="text-sm font-bold">R$ 15.000 / R$ 20.000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-[2rem] border-white/5 hover:border-primary/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                  {i === 0 && <Wallet size={24} />}
                  {i === 1 && <Users size={24} />}
                  {i === 2 && <PlayCircle size={24} />}
                  {i === 3 && <Trophy size={24} />}
                </div>
                <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-lg">
                  {stat.change}
                </span>
              </div>
              <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-display font-bold group-hover:text-gradient transition-all">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold">Atividade Recente</h2>
              <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                Ver tudo <ArrowUpRight size={16} />
              </button>
            </div>
            
            <div className="glass-card rounded-[2rem] border-white/5 divide-y divide-white/5">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors first:rounded-t-[2rem] last:rounded-b-[2rem]">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.amount.startsWith('-') ? 'bg-red-400/10 text-red-400' : 'bg-emerald-400/10 text-emerald-400'}`}>
                      <TrendingUp size={18} />
                    </div>
                    <div>
                      <p className="font-bold">{tx.type}</p>
                      <p className="text-xs text-slate-500">{tx.user} • {tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.amount.startsWith('-') ? 'text-white' : 'text-emerald-400'}`}>{tx.amount}</p>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{tx.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Referral Sidebar */}
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold">Convide & Ganhe</h2>
            <div className="glass-card rounded-[2rem] border-white/5 p-8 bg-purple-gradient-90 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users size={120} />
              </div>
              
              <div className="relative z-10">
                <p className="text-white/80 mb-6 leading-relaxed">
                  Ganhe até <span className="font-bold text-white">10% de comissão</span> sobre cada novo influenciador que entrar na sua rede através do seu link.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-black/20 backdrop-blur-sm border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                    <span className="text-xs font-mono text-white/60 truncate mr-2">orgino.com/join/alex42</span>
                    <button className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                      <Copy size={16} />
                    </button>
                  </div>
                  
                  <button className="w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform">
                    <QrCode size={20} />
                    Gerar QR Code
                  </button>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="glass-card rounded-[2rem] border-white/5 p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
                <PlayCircle size={24} />
              </div>
              <div>
                <p className="font-bold text-sm">Como funciona a Matriz?</p>
                <p className="text-xs text-slate-400">Assista ao tutorial em 2 minutos.</p>
              </div>
              <ArrowUpRight size={16} className="text-slate-500 ml-auto" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
