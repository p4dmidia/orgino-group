import React from "react";
import { motion } from "motion/react";
import { Mail, Lock, ArrowRight, User, ShieldCheck, Globe, CheckCircle2, Ticket } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row overflow-hidden">
      {/* Left Side: Brand & Benefits */}
      <div className="hidden md:flex md:w-1/2 bg-zinc-950 relative items-center justify-center p-12 overflow-hidden border-r border-white/5">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] animate-pulse delay-700" />
        
        <div className="relative z-10 max-w-lg space-y-12">
          <Link to="/" className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldCheck className="text-white w-8 h-8" />
            </div>
            <span className="text-3xl font-display font-bold tracking-tight text-white">Orgino Group</span>
          </Link>

          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl font-display font-bold leading-tight text-white"
            >
              Comece sua jornada <br /><span className="text-gradient">exponencial</span> hoje.
            </motion.h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Junte-se a milhares de criadores que já estão monetizando seu engajamento e criando impacto social real.
            </p>
          </div>

          <div className="space-y-4">
            {[
              "Acesso imediato ao Marketplace",
              "Posicionamento na Matriz Global",
              "Cartão de Benefícios Ativado",
              "Bônus de indicação direta"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-zinc-300 text-sm font-medium bg-white/5 p-4 rounded-2xl border border-white/5">
                <CheckCircle2 className="text-primary" size={18} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-black relative overflow-y-auto">
        <div className="md:hidden absolute top-10 left-10">
          <Link to="/" className="flex items-center gap-2">
            <ShieldCheck className="text-primary w-8 h-8" />
            <span className="text-xl font-display font-bold text-white">Orgino</span>
          </Link>
        </div>
        <div className="absolute top-10 right-10 hidden md:flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
          <Globe size={14} />
          <span>Português (BR)</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8 py-12"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold group"
          >
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Voltar ao Início
          </Link>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">Criar nova conta</h2>
            <p className="text-zinc-500">Preencha os dados abaixo para se tornar um parceiro.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Código de Indicação</label>
              <div className="relative group">
                <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="ORG-XXXXXX"
                  className="w-full bg-primary/5 border border-primary/20 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono font-bold placeholder:text-zinc-700"
                  required
                />
              </div>
              <p className="text-[10px] text-zinc-500 ml-1">* Este código é obrigatório para o sistema de matriz.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 ml-1">Nome</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="Seu nome"
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 ml-1">Usuário</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">@</div>
                  <input
                    type="text"
                    placeholder="username"
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-2 px-1">
              <input type="checkbox" id="terms" className="accent-primary w-4 h-4 rounded border-white/10 mt-1" required />
              <label htmlFor="terms" className="text-xs text-zinc-500 leading-relaxed">
                Eu li e concordo com os <a href="#" className="text-primary hover:underline font-bold">Termos de Uso</a> e a <a href="#" className="text-primary hover:underline font-bold">Política de Privacidade</a> do Orgino Group.
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 group transition-all shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] mt-4"
            >
              Cadastrar Agora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center text-zinc-500 text-sm">
            Já possui acesso?{" "}
            <Link to="/auth/login" className="text-primary font-bold hover:underline">
              Entrar no Escritório
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
