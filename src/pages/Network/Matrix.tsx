import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { motion, AnimatePresence } from "motion/react";
import { Users, UserPlus, TrendingUp, ChevronDown, Search, GitGraph, List } from "lucide-react";
import NetworkTree from "../../components/Network/NetworkTree";

const MOCK_NETWORK = {
  id: "root",
  name: "Você (Alex Rivera)",
  level: "Master",
  referrals: 8,
  earnings: "R$ 4.250",
  children: [
    {
      id: "1",
      name: "Beatriz Santos",
      level: "Influencer",
      referrals: 12,
      earnings: "R$ 1.100",
      children: [
        { id: "1-1", name: "Carlos Lima", level: "Iniciante", referrals: 2, earnings: "R$ 150" },
        { id: "1-2", name: "Daniela Oliveira", level: "Influencer", referrals: 5, earnings: "R$ 400" },
      ]
    },
    {
      id: "2",
      name: "Eduardo Costa",
      level: "Influencer",
      referrals: 4,
      earnings: "R$ 850",
      children: [
        { id: "2-1", name: "Fernanda Silva", level: "Iniciante", referrals: 1, earnings: "R$ 50" },
        { id: "2-2", name: "Guilherme Reis", level: "Iniciante", referrals: 0, earnings: "R$ 0" },
      ]
    },
    {
      id: "3",
      name: "Gabriel Souza",
      level: "Iniciante",
      referrals: 0,
      earnings: "R$ 0",
      children: [
        { id: "3-1", name: "Isabela Rocha", level: "Iniciante", referrals: 0, earnings: "R$ 0" },
      ]
    }
  ]
};

const NetworkNode = ({ node, depth = 0 }: { node: any, depth?: number }) => (
  <div className="space-y-4">
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: depth * 0.1 }}
      className={`glass-card p-6 rounded-3xl border-white/5 flex items-center justify-between hover:border-primary/50 transition-all cursor-pointer group ${depth === 0 ? 'border-primary/30 bg-primary/5' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-purple-gradient p-[2px]">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${node.name}`} alt="Avatar" />
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg">{node.name}</h4>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{node.level} • Nível {depth}</p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="text-center">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Diretos</p>
          <p className="font-bold text-primary">{node.referrals}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Ganhos</p>
          <p className="font-bold text-emerald-400">{node.earnings}</p>
        </div>
        <ChevronDown size={20} className="text-slate-500 group-hover:text-white transition-colors" />
      </div>
    </motion.div>

    {node.children && (
      <div className="pl-12 border-l border-white/10 space-y-4 ml-6">
        {node.children.map((child: any) => (
          <NetworkNode key={child.id} node={child} depth={depth + 1} />
        ))}
      </div>
    )}
  </div>
);

export default function Matrix() {
  const [viewMode, setViewMode] = useState<"list" | "tree">("list");

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">Minha Rede</h1>
            <p className="text-slate-400 text-lg">Acompanhe o crescimento da sua matriz <span className="text-primary font-bold">5x10</span>.</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {/* View Toggle */}
            <div className="bg-zinc-900 border border-white/5 p-1 rounded-2xl flex">
              <button 
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === "list" ? "bg-primary text-white" : "text-zinc-500 hover:text-white"}`}
              >
                <List size={16} />
                Lista
              </button>
              <button 
                onClick={() => setViewMode("tree")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === "tree" ? "bg-primary text-white" : "text-zinc-500 hover:text-white"}`}
              >
                <GitGraph size={16} />
                Árvore
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
              <Search size={18} className="text-slate-500" />
              <input type="text" placeholder="Buscar afiliado..." className="bg-transparent border-none outline-none text-sm w-40" />
            </div>
            <button className="bg-purple-gradient px-6 py-2 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-primary/20">
              <UserPlus size={20} />
              Novo Convite
            </button>
          </div>
        </div>

        {/* Network Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl border-white/5">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Users size={20} />
              <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Total na Rede</span>
            </div>
            <h3 className="text-4xl font-display font-bold">1,240</h3>
            <p className="text-emerald-400 text-xs font-bold mt-2">+48 novos este mês</p>
          </div>
          
          <div className="glass-card p-6 rounded-3xl border-white/5">
            <div className="flex items-center gap-3 mb-4 text-accent">
              <TrendingUp size={20} />
              <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Níveis Ativos</span>
            </div>
            <h3 className="text-4xl font-display font-bold">5 / 10</h3>
            <p className="text-slate-500 text-xs font-bold mt-2">Próximo nível: Nível 6</p>
          </div>

          <div className="glass-card p-6 rounded-3xl border-white/5">
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
              <Users size={20} />
              <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Diretos Ativos</span>
            </div>
            <h3 className="text-4xl font-display font-bold">42</h3>
            <p className="text-slate-500 text-xs font-bold mt-2">Sua meta: 50 diretos</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold">
              {viewMode === "list" ? "Estrutura de Níveis" : "Visualização Gráfica"}
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === "list" ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <NetworkNode node={MOCK_NETWORK} />
              </motion.div>
            ) : (
              <motion.div
                key="tree"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card border-white/5 rounded-[3rem] overflow-hidden bg-black/40"
              >
                <NetworkTree data={MOCK_NETWORK} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
