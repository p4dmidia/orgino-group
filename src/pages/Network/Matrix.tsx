import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { motion, AnimatePresence } from "motion/react";
import { Users, UserPlus, TrendingUp, ChevronDown, Search, GitGraph, List, Loader2 } from "lucide-react";
import NetworkTree from "../../components/Network/NetworkTree";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { Tables } from "../../types/database";
import { getUserDisplayName } from "../../lib/utils";

type NetworkMember = {
  id: string | number;
  full_name: string;
  role: string;
  referral_code: string;
  created_at: string;
  children?: NetworkMember[];
  direct_count?: number;
};

const NetworkNode = ({ node, depth = 0 }: { node: NetworkMember, depth?: number, key?: any }) => (
  <div className="space-y-4">
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: depth * 0.1 }}
      className={`glass-card p-6 rounded-3xl border-white/5 flex items-center justify-between hover:border-primary/50 transition-all cursor-pointer group ${depth === 0 ? 'border-primary/30 bg-primary/5' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-purple-gradient p-[2px]">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden bg-white/5">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${node.full_name}`} alt="Avatar" />
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg text-white">{node.full_name}</h4>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
            {node.role} • Nível {depth}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="text-center">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Diretos</p>
          <p className="font-bold text-primary">{node.direct_count || 0}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Desde</p>
          <p className="font-bold text-emerald-400">
            {new Date(node.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <ChevronDown size={20} className="text-slate-500 group-hover:text-white transition-colors" />
      </div>
    </motion.div>

    {node.children && node.children.length > 0 && (
      <div className="pl-12 border-l border-white/10 space-y-4 ml-6">
        {node.children.map((child: any) => (
          <NetworkNode key={child.id} node={child} depth={depth + 1} />
        ))}
      </div>
    )}
  </div>
);

export default function Matrix() {
  const { user, profile, loading: authLoading } = useAuth();
  const [viewMode, setViewMode] = useState<"list" | "tree">("list");
  const [referrals, setReferrals] = useState<NetworkMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, levels: 0, directActive: 0 });

  useEffect(() => {
    if (authLoading) return;
    if (!profile) {
      setLoading(false);
      return;
    }

    const fetchNetwork = async () => {
      setLoading(true);
      try {
        // Fetch Level 1 (Directs)
        const { data: level1, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('sponsor_id', profile.id);

        if (error) throw error;

        // Fetch counts for each direct
        const members = await Promise.all((level1 || []).map(async (m) => {
          const { count } = await supabase
            .from('user_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('sponsor_id', m.id);
          
          return {
            ...m,
            direct_count: count || 0
          } as NetworkMember;
        }));

        setReferrals(members);
        setStats({
          total: members.length, // Simplified total
          levels: 1,
          directActive: members.length
        });
      } catch (err) {
        console.error('Error fetching network:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNetwork();
  }, [profile]);

  const rootNode: NetworkMember = {
    id: profile?.id || 'root',
    full_name: `Você (${getUserDisplayName(profile, user)})`,
    role: profile?.role || 'Master',
    referral_code: profile?.referral_code || '',
    created_at: profile?.created_at || new Date().toISOString(),
    children: referrals,
    direct_count: referrals.length
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 text-white">Minha Rede</h1>
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
              <input type="text" placeholder="Buscar afiliado..." className="bg-transparent border-none outline-none text-sm w-40 text-white" />
            </div>
          </div>
        </div>

        {/* Network Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl border-white/5">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Users size={20} />
              <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Diretos</span>
            </div>
            <h3 className="text-4xl font-display font-bold text-white">{stats.total}</h3>
            <p className="text-emerald-400 text-xs font-bold mt-2">Crescimento constante</p>
          </div>
          
          <div className="glass-card p-6 rounded-3xl border-white/5">
            <div className="flex items-center gap-3 mb-4 text-accent">
              <TrendingUp size={20} />
              <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Níveis</span>
            </div>
            <h3 className="text-4xl font-display font-bold text-white">{stats.levels} / 10</h3>
            <p className="text-slate-500 text-xs font-bold mt-2">Aumente sua profundidade</p>
          </div>

          <div className="glass-card p-6 rounded-3xl border-white/5">
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
              <Users size={20} />
              <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Status</span>
            </div>
            <h3 className="text-4xl font-display font-bold text-white">Ativo</h3>
            <p className="text-slate-500 text-xs font-bold mt-2">Rede em expansão</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-white">
              {viewMode === "list" ? "Estrutura de Níveis" : "Visualização Gráfica"}
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {viewMode === "list" ? (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <NetworkNode node={rootNode} />
                </motion.div>
              ) : (
                <div key="tree">
                  <NetworkTree data={rootNode as any} />
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </Layout>
  );
}
