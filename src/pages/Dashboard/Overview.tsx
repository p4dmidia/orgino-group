import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, 
  Users, 
  PlayCircle, 
  Trophy, 
  ArrowUpRight, 
  Copy, 
  QrCode,
  Wallet,
  Loader2,
  AlertCircle,
  Settings,
  X
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Tables } from "../../types/database";

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

type Stats = Tables<'affiliate_stats'>;
type Commission = Tables<'commissions'> & { order?: { user_profiles?: { full_name: string } } };

export default function Overview() {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentCommissions, setRecentCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Profile Edit Modal States
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: "",
    pixKey: "",
    pixType: "",
    cep: "",
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalCepLoading, setModalCepLoading] = useState(false);

  const openProfileModal = () => {
    if (profile) {
      setProfileForm({
        fullName: profile.full_name || "",
        phone: profile.phone || "",
        pixKey: profile.pix_key || "",
        pixType: profile.pix_type || "",
        cep: profile.cep || "",
        address: profile.address || "",
        number: profile.number || "",
        complement: profile.complement || "",
        neighborhood: profile.neighborhood || "",
        city: profile.city || "",
        state: profile.state || "",
      });
      setShowProfileModal(true);
    }
  };

  const handleModalCepChange = async (cepValue: string) => {
    const cleanCep = cepValue.replace(/\D/g, "");
    setProfileForm(prev => ({ ...prev, cep: cleanCep }));

    if (cleanCep.length === 8) {
      setModalCepLoading(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setProfileForm(prev => ({
            ...prev,
            address: data.logradouro || "",
            neighborhood: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || "",
          }));
          toast.success("Endereço preenchido automaticamente!");
        } else {
          toast.error("CEP não encontrado.");
        }
      } catch (err) {
        console.error("Error fetching CEP:", err);
        toast.error("Erro ao buscar CEP.");
      } finally {
        setModalCepLoading(false);
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setModalLoading(true);
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          full_name: profileForm.fullName,
          phone: profileForm.phone,
          pix_key: profileForm.pixKey,
          pix_type: profileForm.pixType,
          cep: profileForm.cep,
          address: profileForm.address,
          number: profileForm.number,
          complement: profileForm.complement,
          neighborhood: profileForm.neighborhood,
          city: profileForm.city,
          state: profileForm.state,
        })
        .eq("id", profile.id);

      if (error) throw error;
      toast.success("Perfil atualizado com sucesso!");
      setShowProfileModal(false);
      await refreshProfile();
    } catch (err: any) {
      console.error("Error saving profile:", err);
      toast.error("Erro ao salvar perfil.");
    } finally {
      setModalLoading(false);
    }
  };

  const referralCode = (profile?.referral_code || user?.user_metadata?.login || user?.email || "convite")
    .split('@')[0]
    .replace(/[^a-zA-Z0-9_-]/g, "");

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (authLoading) return;
      
      console.log('Overview: Auth ready, profile:', profile?.email || 'No profile');
      
      if (!profile) {
        console.log('Overview: No profile found, stopping load');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        console.log('Overview: Fetching stats for user ID:', profile.id);
        // Fetch stats
        const { data: statsData, error: statsError } = await supabase
          .from('affiliate_stats')
          .select('*')
          .eq('user_id', profile.id)
          .maybeSingle();

        if (statsError) {
          console.warn('Overview: Stats fetch error:', statsError);
        } else {
          console.log('Overview: Stats result:', statsData);
          setStats(statsData);
        }

        console.log('Overview: Fetching recent commissions...');
        // Fetch recent commissions with buyer info
        const { data: commData, error: commError } = await supabase
          .from('commissions')
          .select(`
            *,
            order:orders (
              user:user_profiles (
                full_name
              )
            )
          `)
          .eq('affiliate_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(4);

        if (commError) {
          console.warn('Overview: Commissions fetch error:', commError);
        } else {
          console.log('Overview: Commissions result:', commData?.length || 0, 'items');
          setRecentCommissions(commData as any);
        }

      } catch (err: any) {
        console.error('Overview: Unexpected error:', err);
        setError("Não foi possível carregar os dados do dashboard.");
      } finally {
        console.log('Overview: Loading complete');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [profile, authLoading]);

  const dashboardStats = [
    { 
      label: "Saldo Disponível", 
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(stats?.available_balance || 0)), 
      change: "+0%", 
      color: "primary",
      icon: Wallet
    },
    { 
      label: "Pontos Acumulados", 
      value: (stats?.points_balance || 0).toLocaleString(), 
      change: "+0", 
      color: "accent",
      icon: Users
    },
    { 
      label: "Ganhos Totais", 
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(stats?.total_earnings || 0)), 
      change: "+0%", 
      color: "primary",
      icon: TrendingUp
    },
    { 
      label: "Pontos do Mês", 
      value: (stats?.monthly_points || 0).toLocaleString(), 
      change: "Iniciante", 
      color: "accent",
      icon: Trophy
    },
  ];

  const copyReferralLink = () => {
    const link = `${window.location.origin}/${referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success("Link de indicação copiado!");
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 text-white">
              Olá, {profile?.full_name?.split(' ')[0] || user?.user_metadata?.firstName || 'Usuário'}! 👋
            </h1>
            <p className="text-slate-400 text-lg">Seu ecossistema de influência está <span className="text-primary font-bold">pronto para crescer</span>.</p>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <button 
              onClick={openProfileModal}
              className="glass-card px-6 py-3.5 rounded-2xl flex items-center gap-2 border-white/5 hover:border-primary/50 hover:bg-white/5 transition-all text-white font-semibold text-sm"
            >
              <Settings size={18} className="text-primary animate-spin-hover" />
              Editar Perfil
            </button>

            <div className="glass-card px-6 py-3 rounded-2xl flex items-center gap-3 border-white/5">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Trophy size={20} className="text-yellow-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold text-white">Ranking</p>
                <p className="text-sm font-bold text-white">Iniciante</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

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
                  <stat.icon size={24} />
                </div>
                <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-lg">
                  {stat.change}
                </span>
              </div>
              <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-display font-bold group-hover:text-gradient transition-all text-white">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold text-white">Comissões Recentes</h2>
              <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                Ver tudo <ArrowUpRight size={16} />
              </button>
            </div>
            
            <div className="glass-card rounded-[2rem] border-white/5 divide-y divide-white/5">
              {recentCommissions.length > 0 ? (
                recentCommissions.map((comm) => (
                  <div key={comm.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors first:rounded-t-[2rem] last:rounded-b-[2rem]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-400/10 text-emerald-400">
                        <TrendingUp size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-white">Comissão Nível {comm.level}</p>
                        <p className="text-xs text-slate-500">
                          {comm.order?.user?.full_name || 'Venda'} • {new Date(comm.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400">
                        +{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(comm.amount))}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{comm.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-500">
                  Nenhuma comissão registrada ainda.
                </div>
              )}
            </div>
          </div>

          {/* Referral Sidebar */}
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-white">Convide & Ganhe</h2>
            <div className="glass-card rounded-[2rem] border-white/5 p-8 bg-purple-gradient-90 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-white">
                <Users size={120} />
              </div>
              
              <div className="relative z-10">
                <p className="text-white/80 mb-6 leading-relaxed">
                  Ganhe até <span className="font-bold text-white">comissões multinível</span> sobre cada novo influenciador que entrar na sua rede.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-black/20 backdrop-blur-sm border border-white/10 p-4 rounded-2xl flex items-center justify-between overflow-hidden">
                    <span className="text-xs font-mono text-white truncate mr-2 font-bold">
                      {`${window.location.origin}/${referralCode}`}
                    </span>
                    <button 
                      onClick={copyReferralLink}
                      className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-white"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={copyReferralLink}
                    className="w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
                  >
                    <Copy size={20} />
                    Copiar Link de Indicação
                  </button>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="glass-card rounded-[2rem] border-white/5 p-6 flex items-center gap-4 group cursor-pointer hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <PlayCircle size={24} />
              </div>
              <div>
                <p className="font-bold text-sm text-white">Como funciona a Matriz?</p>
                <p className="text-xs text-slate-400">Assista ao tutorial em 2 minutos.</p>
              </div>
              <ArrowUpRight size={16} className="text-slate-500 ml-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Editar Perfil */}
    <AnimatePresence>
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProfileModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[85vh] bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-y-auto p-6 md:p-8 no-scrollbar z-10"
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowProfileModal(false)}
              className="absolute top-6 right-6 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="mb-8">
              <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                <Settings className="text-primary" />
                Configurações de Perfil
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Atualize seus dados cadastrais, endereço e dados de recebimento (PIX).
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Seção 1: Dados Pessoais */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-white/5 pb-2">
                  Dados Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">WhatsApp / Telefone</label>
                    <input
                      type="text"
                      required
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(00) 00000-0000"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Seção 2: Dados de Recebimento (PIX) */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-white/5 pb-2">
                  Dados Financeiros (PIX)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Tipo de Chave PIX</label>
                    <select
                      value={profileForm.pixType}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, pixType: e.target.value }))}
                      className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors h-[50px] cursor-pointer"
                    >
                      <option value="">Selecione o tipo...</option>
                      <option value="CPF">CPF</option>
                      <option value="CNPJ">CNPJ</option>
                      <option value="E-mail">E-mail</option>
                      <option value="Telefone">Telefone</option>
                      <option value="Chave Aleatória">Chave Aleatória</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Chave PIX</label>
                    <input
                      type="text"
                      value={profileForm.pixKey}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, pixKey: e.target.value }))}
                      placeholder="Sua chave de recebimento"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Seção 3: Dados de Localização */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-white/5 pb-2">
                  Dados de Localização
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">CEP</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength={9}
                        value={profileForm.cep}
                        onChange={(e) => handleModalCepChange(e.target.value)}
                        placeholder="00000-000"
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors pr-10"
                      />
                      {modalCepLoading && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Estado (UF)</label>
                    <select
                      value={profileForm.state}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors h-[50px] cursor-pointer"
                      required
                    >
                      <option value="" disabled>Selecione...</option>
                      {BRAZILIAN_STATES.map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Cidade</label>
                    <input
                      type="text"
                      required
                      value={profileForm.city}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Cidade"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Bairro</label>
                    <input
                      type="text"
                      required
                      value={profileForm.neighborhood}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, neighborhood: e.target.value }))}
                      placeholder="Bairro"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Rua / Logradouro</label>
                    <input
                      type="text"
                      required
                      value={profileForm.address}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Ex: Av. Paulista"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Número</label>
                    <input
                      type="text"
                      required
                      value={profileForm.number}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, number: e.target.value }))}
                      placeholder="123"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Complemento (Opcional)</label>
                    <input
                      type="text"
                      value={profileForm.complement}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, complement: e.target.value }))}
                      placeholder="Ex: Apto 45, Bloco B"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex items-center justify-end gap-3 border-t border-white/5 pt-6 mt-6">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors text-white font-semibold text-sm"
                  disabled={modalLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-2xl bg-primary hover:bg-primary-dark transition-all text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-primary/20"
                  disabled={modalLoading}
                >
                  {modalLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </Layout>
  );
}
