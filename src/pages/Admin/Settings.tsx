import React, { useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { motion, AnimatePresence } from "motion/react";
import { 
  Settings as SettingsIcon, 
  Save, 
  Percent, 
  DollarSign, 
  ShieldCheck, 
  Globe, 
  Bell, 
  Database,
  Lock,
  Smartphone,
  ChevronRight,
  ShieldAlert
} from "lucide-react";

type TabType = "geral" | "matriz" | "financeiro" | "seguranca" | "notificacoes" | "api";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<TabType>("geral");

  const menuItems = [
    { id: "geral", label: "Geral", icon: Globe },
    { id: "matriz", label: "Matriz & Bônus", icon: Percent },
    { id: "financeiro", label: "Financeiro & Taxas", icon: DollarSign },
    { id: "seguranca", label: "Segurança", icon: Lock },
    { id: "notificacoes", label: "Notificações", icon: Bell },
    { id: "api", label: "Integrações (API)", icon: Database },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "geral":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <section className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
              <h3 className="text-xl font-bold text-white">Informações da Plataforma</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Nome do Sistema</label>
                  <input type="text" defaultValue="Orgino Group Official" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">E-mail de Suporte</label>
                  <input type="email" defaultValue="suporte@orgino.group" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50" />
                </div>
              </div>
            </section>
            <section className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
              <h3 className="text-xl font-bold text-white">Status de Operação</h3>
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                <div>
                  <p className="text-sm font-bold text-white">Modo de Manutenção</p>
                  <p className="text-[10px] text-zinc-500">Bloqueia o acesso de todos os usuários.</p>
                </div>
                <div className="w-12 h-6 bg-zinc-800 rounded-full relative cursor-pointer group">
                   <div className="absolute left-1 top-1 w-4 h-4 bg-zinc-600 rounded-full transition-all" />
                </div>
              </div>
            </section>
          </motion.div>
        );
      case "matriz":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <section className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Ganhos por Nível (Matriz 5x10)</h3>
                <span className="text-[10px] font-black bg-red-500/20 text-red-500 px-3 py-1 rounded-full uppercase">Ativa</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <div key={n} className="flex items-center gap-3 p-4 bg-black/20 rounded-2xl border border-white/5">
                    <span className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg text-xs font-black text-zinc-500">L{n}</span>
                    <div className="flex-1">
                      <label className="text-[10px] font-black text-zinc-600 uppercase">Porcentagem</label>
                      <div className="relative">
                        <input type="number" defaultValue={10 - n} className="w-full bg-transparent border-none p-0 text-white font-bold focus:ring-0" />
                        <span className="absolute right-0 top-0 text-zinc-500">%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        );
      case "financeiro":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <section className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
              <h3 className="text-xl font-bold text-white">Parâmetros de Pagamento</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-emerald-500/10 rounded-xl"><DollarSign className="text-emerald-500" size={20} /></div>
                    <div>
                      <p className="text-sm font-bold text-white">Saques Instantâneos (PIX)</p>
                      <p className="text-[10px] text-zinc-500">Permitir processamento automático até R$ 500,00.</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-emerald-500/20 rounded-full relative border border-emerald-500/30">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Limite Diário Global</label>
                    <input type="text" defaultValue="R$ 50.000,00" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Taxa de Adesão Rede</label>
                    <input type="text" defaultValue="R$ 97,00" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white" />
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        );
      case "seguranca":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <section className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldAlert className="text-red-500" size={20} />
                Políticas de Acesso
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                  <div>
                    <p className="text-sm font-bold text-white">Autenticação em Dois Fatores (2FA)</p>
                    <p className="text-[10px] text-zinc-500">Obrigatório para todos os administradores.</p>
                  </div>
                  <div className="w-12 h-6 bg-red-600/20 rounded-full relative border border-red-500/30">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">IPs Permitidos (Whitelist)</label>
                  <textarea 
                    placeholder="Ex: 192.168.1.1 (deixe em branco para permitir todos)"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white h-32 focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none"
                  />
                </div>
              </div>
            </section>
          </motion.div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-700">
            <Database size={48} className="mb-4" />
            <p className="font-bold">Conteúdo em desenvolvimento...</p>
          </div>
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
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-600/20 active:scale-95">
            <Save size={20} />
            Salvar Alterações
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
