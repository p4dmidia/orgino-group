import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/Layout/AdminLayout";
import { motion } from "motion/react";
import { supabase } from "../../lib/supabase";
import { 
  ShieldCheck, 
  Users, 
  ArrowUpCircle, 
  CheckCircle, 
  XCircle,
  Loader2
} from "lucide-react";
import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface DashboardStats {
  totalUsers: number;
  pendingWithdrawalsCount: number;
  totalPendingAmount: number;
  reportsCount: number;
  newCoursesCount: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingWithdrawalsCount: 0,
    totalPendingAmount: 0,
    reportsCount: 0,
    newCoursesCount: 0
  });
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Total Users
      const { data: usersData, count: usersCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact' });

      // 2. Pending Withdrawals
      const { data: withdrawalsData } = await supabase
        .from('withdrawals')
        .select('*, user_profiles(full_name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      const pendingAmount = withdrawalsData?.reduce((acc, curr) => acc + Number(curr.amount_requested), 0) || 0;

      // 3. New Courses
      const { count: coursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      setStats({
        totalUsers: usersCount || 0,
        pendingWithdrawalsCount: withdrawalsData?.length || 0,
        totalPendingAmount: pendingAmount,
        reportsCount: 0,
        newCoursesCount: coursesCount || 0
      });

      setWithdrawals(withdrawalsData || []);

      // 4. Growth & Revenue Data (Last 7 days)
      const days = eachDayOfInterval({
        start: subDays(new Date(), 6),
        end: new Date(),
      });

      // Fetch orders for revenue
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'paid');

      const chartData = days.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        
        const userCount = usersData?.filter(u => 
          format(new Date(u.created_at), 'yyyy-MM-dd') === dateStr
        ).length || 0;

        const dailyRevenue = ordersData?.filter(o => 
          format(new Date(o.created_at), 'yyyy-MM-dd') === dateStr
        ).reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;
        
        return {
          name: format(day, 'dd/MM'),
          usuarios: userCount,
          faturamento: dailyRevenue
        };
      });

      setGrowthData(chartData);
      setRevenueData(chartData); // Sharing the same labels
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const adminStats = [
    { label: "Total de Usuários", value: stats.totalUsers.toLocaleString('pt-BR'), change: "Ativos na plataforma", icon: Users, color: "text-blue-400" },
    { label: "Saques Pendentes", value: stats.pendingWithdrawalsCount.toString(), change: `R$ ${stats.totalPendingAmount.toLocaleString('pt-BR')}`, icon: ArrowUpCircle, color: "text-yellow-400" },
    { label: "Novos Cursos", value: stats.newCoursesCount.toString(), change: "Cursos ativos", icon: ShieldCheck, color: "text-emerald-400" },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-500/20">
            <ShieldCheck className="text-purple-500 w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
            <p className="text-zinc-500 text-sm font-medium">Controle total da plataforma Orgino Group</p>
          </div>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Growth Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/50 border border-white/5 p-6 rounded-[2.5rem] overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Crescimento da Rede</h2>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Usuários nos últimos 7 dias</p>
              </div>
            </div>

            <div className="h-[250px] w-full" style={{ minHeight: '250px' }}>
              <ResponsiveContainer width="99%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 10, fontWeight: 700 }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      border: '1px solid #ffffff10',
                      borderRadius: '16px',
                      fontSize: '10px'
                    }}
                    cursor={{ stroke: '#ef444420', strokeWidth: 2 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="usuarios" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Revenue Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/50 border border-white/5 p-6 rounded-[2.5rem] overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Faturamento</h2>
                <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mt-1">Volume de vendas em R$</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-lg">
                <span className="text-[10px] font-black text-emerald-500 tracking-widest uppercase">7 Dias</span>
              </div>
            </div>

            <div className="h-[250px] w-full" style={{ minHeight: '250px' }}>
              <ResponsiveContainer width="99%" height="100%">
                <BarChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={1}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 10, fontWeight: 700 }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Faturamento']}
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      border: '1px solid #ffffff10',
                      borderRadius: '16px',
                      fontSize: '10px'
                    }}
                    cursor={{ fill: '#ffffff05' }}
                  />
                  <Bar 
                    dataKey="faturamento" 
                    fill="url(#colorRev)" 
                    radius={[6, 6, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Withdrawal Requests */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ArrowUpCircle className="text-yellow-400" size={20} />
                Saques Aguardando Aprovação
              </h2>
              <button 
                onClick={() => navigate('/admin/saques')}
                className="text-xs font-bold text-zinc-500 hover:text-white transition-colors"
              >
                Ver todos
              </button>
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
                  {withdrawals.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-zinc-500 text-sm">Nenhum saque pendente no momento</td>
                    </tr>
                  ) : (
                    withdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4 font-bold text-sm text-white">{w.user_profiles?.full_name || 'Usuário Desconhecido'}</td>
                        <td className="px-6 py-4 font-bold text-sm text-emerald-400">R$ {Number(w.amount_requested).toLocaleString('pt-BR')}</td>
                        <td className="px-6 py-4 text-xs text-zinc-500">
                          {format(new Date(w.created_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl transition-all">
                              <CheckCircle size={18} />
                            </button>
                            <button className="p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 rounded-xl transition-all">
                              <XCircle size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
