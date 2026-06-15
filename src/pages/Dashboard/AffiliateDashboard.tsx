import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import {
  PlayCircle,
  Users,
  TrendingUp,
  Loader2,
  AlertCircle,
  Calendar,
  Share2,
  ExternalLink,
  Info,
  ChevronRight,
  TrendingDown,
  UserCheck
} from "lucide-react";
import { motion } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { toast } from "react-hot-toast";

interface ViewLog {
  id: number;
  video_id: number;
  created_at: string;
  videos_feed: {
    id: number;
    description: string | null;
    type: string;
  } | null;
}

interface ReferralUser {
  id: number;
  full_name: string;
  email: string | null;
  created_at: string;
  role: string;
}

interface VideoStats {
  id: number;
  description: string;
  type: string;
  viewsCount: number;
}

export default function AffiliateDashboard() {
  const { profile, loading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [views, setViews] = useState<ViewLog[]>([]);
  const [referrals, setReferrals] = useState<ReferralUser[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [videoStats, setVideoStats] = useState<VideoStats[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading) return;
      if (!profile) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 1. Fetch affiliate video view logs
        const { data: viewsData, error: viewsError } = await (supabase as any)
          .from("video_views_logs")
          .select(`
            id,
            video_id,
            created_at,
            videos_feed (
              id,
              description,
              type
            )
          `)
          .eq("affiliate_id", profile.id);

        if (viewsError) throw viewsError;

        // 2. Fetch referrals (users sponsored by this profile)
        const { data: referralsData, error: referralsError } = await supabase
          .from("user_profiles")
          .select("id, full_name, email, created_at, role")
          .eq("sponsor_id", profile.id)
          .order("created_at", { ascending: false });

        if (referralsError) throw referralsError;

        const typedViews = (viewsData || []) as any[] as ViewLog[];
        const typedReferrals = (referralsData || []) as ReferralUser[];

        setViews(typedViews);
        setReferrals(typedReferrals);

        // 3. Process chart data for the last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d;
        }).reverse();

        const formattedChartData = last7Days.map(date => {
          const dateString = date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit"
          });
          
          const dayViews = typedViews.filter(v => {
            const vDate = new Date(v.created_at);
            return vDate.toDateString() === date.toDateString();
          }).length;

          const dayReferrals = typedReferrals.filter(r => {
            const rDate = new Date(r.created_at);
            return rDate.toDateString() === date.toDateString();
          }).length;

          return {
            date: dateString,
            "Visualizações": dayViews,
            "Cadastros": dayReferrals
          };
        });

        setChartData(formattedChartData);

        // 4. Process unique video stats (views generated per video by this affiliate)
        const videoMap = new Map<number, { description: string; type: string; count: number }>();
        
        typedViews.forEach(v => {
          if (!v.videos_feed) return;
          const vidId = v.videos_feed.id;
          const current = videoMap.get(vidId) || {
            description: v.videos_feed.description || `Vídeo #${vidId}`,
            type: v.videos_feed.type,
            count: 0
          };
          current.count += 1;
          videoMap.set(vidId, current);
        });

        const formattedVideoStats: VideoStats[] = [];
        videoMap.forEach((val, key) => {
          formattedVideoStats.push({
            id: key,
            description: val.description,
            type: val.type,
            viewsCount: val.count
          });
        });

        // Sort videos by view count descending
        formattedVideoStats.sort((a, b) => b.viewsCount - a.viewsCount);
        setVideoStats(formattedVideoStats);

      } catch (err: any) {
        console.error("Affiliate dashboard error:", err);
        setError("Erro ao carregar os dados de rastreamento do afiliado.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile, authLoading]);

  // Copy unique video view tracking link
  const copyVideoTrackingLink = (videoId: number) => {
    if (!profile) return;
    const url = `${window.location.origin}/v/${videoId}?ref=${profile.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link de rastreamento copiado!");
  };

  // Stats calculation
  const totalViews = views.length;
  const totalRegistrations = referrals.length;
  const conversionRate = totalViews > 0 
    ? ((totalRegistrations / totalViews) * 100).toFixed(1)
    : "0.0";

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-slate-400 font-medium animate-pulse">Carregando métricas de performance...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 text-white">
            Performance de Afiliado 📊
          </h1>
          <p className="text-slate-400 text-lg">
            Acompanhe o engajamento dos seus links compartilhados e novos parceiros na rede.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Total Views Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 rounded-[2rem] border-white/5 hover:border-primary/20 transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <PlayCircle size={24} />
              </div>
              <span className="text-purple-400 text-xs font-bold bg-purple-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
                Visualizações
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium mb-1">Visualizações de Vídeos</p>
            <h3 className="text-4xl font-display font-bold text-white group-hover:text-gradient transition-all">
              {totalViews.toLocaleString()}
            </h3>
          </motion.div>

          {/* Total Registrations Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-[2rem] border-white/5 hover:border-accent/20 transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Users size={24} />
              </div>
              <span className="text-cyan-400 text-xs font-bold bg-cyan-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
                Cadastros
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium mb-1">Parceiros Indicados</p>
            <h3 className="text-4xl font-display font-bold text-white group-hover:text-gradient transition-all">
              {totalRegistrations.toLocaleString()}
            </h3>
          </motion.div>

          {/* Conversion Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 rounded-[2rem] border-white/5 hover:border-primary/20 transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-lg">
                Conversão
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium mb-1">Taxa de Conversão</p>
            <h3 className="text-4xl font-display font-bold text-white group-hover:text-gradient transition-all">
              {conversionRate}%
            </h3>
          </motion.div>
        </div>

        {/* Analytics Chart Block */}
        <div className="glass-card p-6 md:p-8 rounded-[2rem] border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold text-white">Gráfico de Performance</h2>
              <p className="text-slate-500 text-xs mt-1">Estatísticas acumuladas de cliques e novos cadastros nos últimos 7 dias</p>
            </div>
            <Calendar size={20} className="text-slate-500" />
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0052D4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0052D4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00d2ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "1rem"
                  }}
                  labelStyle={{ color: "#fff", fontWeight: "bold" }}
                />
                <Legend verticalAlign="top" height={36} />
                <Area 
                  type="monotone" 
                  dataKey="Visualizações" 
                  stroke="#0052D4" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Cadastros" 
                  stroke="#00d2ff" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRegistrations)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Shared Videos & Views */}
          <div className="space-y-4">
            <h3 className="text-xl font-display font-bold text-white">Seus Vídeos Compartilhados</h3>
            
            <div className="glass-card rounded-[2rem] border-white/5 overflow-hidden">
              {videoStats.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {videoStats.map((item) => (
                    <div key={item.id} className="p-5 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                      <div className="space-y-1 max-w-[70%]">
                        <p className="text-sm font-semibold text-white truncate">
                          {item.description}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                          {item.type}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">{item.viewsCount} cliques</p>
                        </div>
                        <button
                          onClick={() => copyVideoTrackingLink(item.id)}
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-purple-400 hover:text-white"
                          title="Copiar link"
                        >
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                  <PlayCircle size={32} className="text-slate-600 mb-2" />
                  <p className="text-sm font-medium">Nenhum link de vídeo compartilhado gerou visualização ainda.</p>
                  <p className="text-xs text-slate-600 max-w-xs">Acesse o feed de Vídeos e use o botão compartilhar para divulgar nas suas redes.</p>
                </div>
              )}
            </div>
          </div>

          {/* Attributed Referrals List */}
          <div className="space-y-4">
            <h3 className="text-xl font-display font-bold text-white">Cadastros por Indicação</h3>
            
            <div className="glass-card rounded-[2rem] border-white/5 overflow-hidden">
              {referrals.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {referrals.map((user) => (
                    <div key={user.id} className="p-5 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                          <UserCheck size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{user.full_name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        <p className="font-medium">Cadastrado em</p>
                        <p>{new Date(user.created_at).toLocaleDateString("pt-BR")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                  <Users size={32} className="text-slate-600 mb-2" />
                  <p className="text-sm font-medium">Nenhum cadastro atribuído ainda.</p>
                  <p className="text-xs text-slate-600 max-w-xs">Quando um visitante assistir ao seu vídeo compartilhado e criar uma conta, ele aparecerá aqui.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
