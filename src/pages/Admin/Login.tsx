import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, ShieldAlert, ArrowRight, Terminal, Globe, Loader2, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("=== INICIANDO TENTATIVA DE LOGIN ADM ===");
    console.log("Email:", email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("=== ERRO RETORNADO PELO SUPABASE AUTH ===");
        console.error("Erro completo:", error);
        console.error("Status HTTP:", error.status);
        console.error("Código do Erro:", error.code);
        console.error("Mensagem:", error.message);
        console.error("=========================================");
        throw error;
      }

      console.log("Login com senha feito com sucesso! Buscando perfil...");
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('mocha_user_id', data.user.id)
        .single();

      if (profileError) {
        console.error("=== ERRO AO BUSCAR PERFIL ===");
        console.error(profileError);
        throw profileError;
      }

      console.log("Perfil obtido:", profile);

      if (profile?.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error("Acesso negado. Somente administradores podem acessar este terminal.");
      }

      toast.success("Autenticação Master confirmada!");
      navigate("/admin");
    } catch (err: any) {
      console.error("=== CAPTURADO NO CATCH DO LOGIN ===");
      console.error("Objeto do erro:", err);
      console.error("Mensagem final exibida:", err.message);
      console.error("====================================");
      toast.error(err.message || "Erro na autenticação administrativa");
    } finally {
      setLoading(false);
      console.log("=== FIM DA TENTATIVA DE LOGIN ADM ===");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row overflow-hidden">
      {/* Left Side: Admin Identity */}
      <div className="hidden md:flex md:w-1/2 bg-zinc-950 relative items-center justify-center p-12 overflow-hidden border-r border-white/5">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
        
        <div className="relative z-10 max-w-lg space-y-12">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-20 h-20 rounded-full p-[10px] bg-gradient-to-tr from-[#0047FF] to-[#00d2ff]">
              <div className="w-full h-full rounded-full bg-black" />
            </div>
            <span className="text-6xl font-display font-black tracking-tighter text-white">RGINO</span>
            <span className="bg-purple-600/10 text-purple-500 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">Admin</span>
          </div>

          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl font-display font-bold leading-tight text-white"
            >
              Controle <br /> <span className="text-purple-500 underline decoration-purple-500/30 underline-offset-8">Centralizado</span> <br /> da Operação.
            </motion.h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Área restrita para gestão de infraestrutura, auditoria financeira e moderação de rede. 
              O acesso não autorizado é estritamente proibido e monitorado.
            </p>
          </div>

          <div className="flex items-center gap-4 text-zinc-500 font-mono text-xs">
            <Terminal size={16} className="text-purple-500" />
            <span>SECURE_LAYER_ID: ORG_ADM_B2_88</span>
          </div>
        </div>
      </div>

      {/* Right Side: Admin Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-black relative">
        <div className="absolute top-10 right-10 hidden md:flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
          <Globe size={14} />
          <span>Security Protocol v2.4</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold group"
          >
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Voltar ao Início
          </Link>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">Autenticação Master</h2>
            <p className="text-zinc-500">Identifique-se para acessar as ferramentas de gestão.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Admin Key / Email</label>
              <div className="relative group">
                <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin.master@orgino.group"
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-zinc-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-medium text-zinc-300">Senha Administrativa</label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-zinc-600"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 group transition-all shadow-xl shadow-purple-600/20 hover:scale-[1.01] active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  Acessar Terminal Admin
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl">
            <p className="text-[10px] text-zinc-500 text-center uppercase tracking-tighter leading-relaxed">
              Ao acessar este terminal, você concorda com as políticas de auditoria. 
              Todas as ações são registradas com IP e Timestamp.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
