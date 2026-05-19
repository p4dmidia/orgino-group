import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { motion, AnimatePresence } from "motion/react";
import { 
  Settings as SettingsIcon, 
  Save, 
  Percent, 
  DollarSign, 
  ShieldCheck, 
  Globe, 
  Lock,
  Smartphone,
  ChevronRight,
  ShieldAlert,
  Loader2,
  Check,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

type TabType = "geral" | "matriz" | "financeiro" | "seguranca";

interface SettingItem {
  id: number;
  key: string;
  value: string;
  description: string;
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<TabType>("geral");
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [cashbackLevels, setCashbackLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const menuItems = [
    { id: "geral", label: "Geral", icon: Globe },
    { id: "matriz", label: "Matriz & Bônus", icon: Percent },
    { id: "financeiro", label: "Financeiro & Taxas", icon: DollarSign },
    { id: "seguranca", label: "Segurança", icon: Lock },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');

      if (error) throw error;
      setSettings(data || []);

      const { data: levelsData, error: levelsError } = await supabase
        .from('cashback_config')
        .select('*')
        .order('level', { ascending: true });
      
      if (levelsError) throw levelsError;
      setCashbackLevels(levelsData || []);
    } catch (err) {
      console.error('Error fetching settings:', err);
      toast.error("Erro ao carregar configurações.");
    } finally {
      setLoading(false);
    }
  };

  const getSetting = (key: string) => settings.find(s => s.key === key)?.value || "";

  const handleUpdateSetting = (key: string, value: string) => {
    setSettings(prev => {
      const exists = prev.find(s => s.key === key);
      if (exists) {
        return prev.map(s => s.key === key ? { ...s, value } : s);
      }
      // Se não existir, adiciona um novo item temporário no estado
      return [...prev, { id: Math.random(), key, value, description: "" }];
    });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const updates = settings.map(setting => (
        supabase
          .from('system_settings')
          .upsert({ 
            key: setting.key, 
            value: setting.value, 
            updated_at: new Date().toISOString() 
          }, { onConflict: 'key' })
      ));

      const levelUpdates = cashbackLevels.map(level => (
        supabase
          .from('cashback_config')
          .update({ 
            amount: parseFloat(level.amount.toString()),
            updated_at: new Date().toISOString()
          })
          .eq('id', level.id)
      ));

      const results = await Promise.all([...updates, ...levelUpdates]);
      const errors = results.filter(r => r.error);

      if (errors.length > 0) throw errors[0].error;

      toast.success("Todas as configurações foram atualizadas!");
    } catch (err: any) {
      console.error('Error saving settings:', err);
      toast.error("Erro ao salvar: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    if (loading) return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="font-bold">Carregando parâmetros...</p>
      </div>
    );

    switch (activeTab) {
      case "geral":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <section className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
              <h3 className="text-xl font-bold text-white">Informações da Plataforma</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Nome do Sistema</label>
                  <input 
                    type="text" 
                    value={getSetting('site_name')} 
                    onChange={(e) => handleUpdateSetting('site_name', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">E-mail de Suporte</label>
                  <input 
                    type="email" 
                    value={getSetting('support_email')} 
                    onChange={(e) => handleUpdateSetting('support_email', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">WhatsApp Suporte</label>
                  <input 
                    type="text" 
                    value={getSetting('support_whatsapp')} 
                    onChange={(e) => handleUpdateSetting('support_whatsapp', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">URL Oficial</label>
                  <input 
                    type="text" 
                    value={getSetting('site_url')} 
                    onChange={(e) => handleUpdateSetting('site_url', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50" 
                  />
                </div>
              </div>
            </section>
            
            <section className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
              <h3 className="text-xl font-bold text-white">Chave PIX Master (Recebimento)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Chave PIX (Matriz)</label>
                  <input 
                    type="text" 
                    value={getSetting('matrix_pix_key')} 
                    onChange={(e) => handleUpdateSetting('matrix_pix_key', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 font-mono" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">CPF/CNPJ (Matriz)</label>
                  <input 
                    type="text" 
                    value={getSetting('matrix_cpf')} 
                    onChange={(e) => handleUpdateSetting('matrix_cpf', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50" 
                  />
                </div>
              </div>
            </section>
          </motion.div>
        );
      case "financeiro":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <section className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
              <h3 className="text-xl font-bold text-white">Parâmetros de Saque</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Valor Mínimo (R$)</label>
                  <input 
                    type="number" 
                    value={getSetting('min_withdrawal_amount')} 
                    onChange={(e) => handleUpdateSetting('min_withdrawal_amount', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Taxa de Saque (%)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={getSetting('withdrawal_fee_percentage')} 
                      onChange={(e) => handleUpdateSetting('withdrawal_fee_percentage', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50" 
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">%</span>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        );
      case "matriz":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            {/* Global Matrix Config */}
            <section className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                  <Percent size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Configuração Global da Matriz</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Largura da Matriz (Diretos)</label>
                  <input 
                    type="number" 
                    value={getSetting('max_matrix_width')} 
                    onChange={(e) => handleUpdateSetting('max_matrix_width', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50" 
                  />
                  <p className="text-[10px] text-zinc-600 px-1 italic">Ex: 5 para matriz 5x10</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Profundidade (Níveis)</label>
                  <input 
                    type="number" 
                    value={getSetting('max_network_levels')} 
                    onChange={(e) => handleUpdateSetting('max_network_levels', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Valor p/ 1 Ponto (R$)</label>
                  <input 
                    type="number" 
                    value={getSetting('points_conversion_rate')} 
                    onChange={(e) => handleUpdateSetting('points_conversion_rate', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50" 
                  />
                </div>
              </div>
            </section>

            {/* Commission by Level */}
            <section className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <TrendingUp size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Comissões por Nível</h3>
                </div>
                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Porcentagem (%)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {cashbackLevels.map((level, idx) => (
                  <div key={level.id} className="bg-black/40 border border-white/5 p-4 rounded-3xl space-y-3 group hover:border-red-500/30 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-zinc-600 uppercase">Nível {level.level}</span>
                      {level.level === 1 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                    </div>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="0.01"
                        value={level.amount}
                        onChange={(e) => {
                          const newLevels = [...cashbackLevels];
                          newLevels[idx].amount = e.target.value;
                          setCashbackLevels(newLevels);
                        }}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-2 text-white font-bold text-center focus:outline-none focus:ring-1 focus:ring-red-500/50"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs font-bold">%</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-start gap-3">
                <AlertCircle className="text-blue-500 mt-0.5" size={16} />
                <p className="text-xs text-zinc-500 leading-relaxed">
                  As comissões são calculadas sobre o valor base do treinamento. O sistema utiliza a lógica de "compressão dinâmica" caso algum nível esteja inativo.
                </p>
              </div>
            </section>
          </motion.div>
        );
      case "seguranca":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <section className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
              <h3 className="text-xl font-bold text-white">Segurança e Acesso</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Tempo de Sessão (min)</label>
                  <input 
                    type="number" 
                    value={getSetting('session_timeout')} 
                    onChange={(e) => handleUpdateSetting('session_timeout', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Tentativas de Login</label>
                  <input 
                    type="number" 
                    value={getSetting('max_login_attempts')} 
                    onChange={(e) => handleUpdateSetting('max_login_attempts', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50" 
                  />
                </div>
              </div>
            </section>
          </motion.div>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <SettingsIcon className="text-red-500" />
              Configurações do Sistema
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Gerencie as regras de negócio, taxas e parâmetros globais.</p>
          </div>
          <button 
            onClick={handleSaveAll}
            disabled={isSaving}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar Nav */}
          <div className="space-y-3">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-3xl font-bold text-sm transition-all group border ${
                    isActive 
                      ? "bg-white/10 text-white border-white/20 shadow-xl" 
                      : "text-zinc-500 hover:text-white hover:bg-white/5 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className={isActive ? "text-red-500" : "group-hover:text-red-500 transition-colors"} />
                    {item.label}
                  </div>
                  {isActive && <ChevronRight size={16} className="text-red-500" />}
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
