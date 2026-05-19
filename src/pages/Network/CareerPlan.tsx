import React from "react";
import Layout from "../../components/Layout/Layout";
import { motion } from "motion/react";
import { 
  Award, 
  TrendingUp, 
  Users, 
  Zap, 
  Star, 
  ShieldCheck, 
  Gem, 
  Crown,
  CheckCircle2,
  ArrowRight,
  Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CareerPlan() {
  const navigate = useNavigate();
  const levels = [
    {
      name: "Starter",
      icon: <Zap className="text-zinc-400" />,
      color: "bg-zinc-500",
      requirement: "Ativação da conta",
      bonus: "Acesso à plataforma e rede 5x10",
      points: "0 pts"
    },
    {
      name: "Bronze",
      icon: <Award className="text-orange-500" />,
      color: "bg-orange-600",
      requirement: "5 indicados diretos ativos",
      bonus: "Bônus de 5% sobre a rede direta",
      points: "500 pts"
    },
    {
      name: "Silver",
      icon: <Award className="text-slate-300" />,
      color: "bg-slate-400",
      requirement: "25 membros na rede (2 níveis)",
      bonus: "Bônus de 7% + Acesso a cursos Premium",
      points: "2.500 pts"
    },
    {
      name: "Gold",
      icon: <Star className="text-yellow-500" />,
      color: "bg-yellow-500",
      requirement: "125 membros na rede (3 níveis)",
      bonus: "Bônus de 10% + Participação nos lucros (1%)",
      points: "10.000 pts"
    },
    {
      name: "Platinum",
      icon: <ShieldCheck className="text-cyan-400" />,
      color: "bg-cyan-500",
      requirement: "625 membros na rede (4 níveis)",
      bonus: "Viagem nacional + Bônus de Liderança",
      points: "50.000 pts"
    },
    {
      name: "Diamond",
      icon: <Gem className="text-blue-400" />,
      color: "bg-blue-500",
      requirement: "3.125 membros na rede (5 níveis)",
      bonus: "Viagem Internacional + iPhone 15 Pro Max",
      points: "200.000 pts"
    },
    {
      name: "Master",
      icon: <Crown className="text-white" />,
      color: "bg-purple-gradient",
      requirement: "Matriz 5x10 completa ou 10k membros",
      bonus: "Carro de Luxo + Participação nos lucros Global",
      points: "1.000.000 pts"
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-20 pb-20">
        {/* Header Hero */}
        <section className="text-center space-y-8 pt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-primary"
          >
            <TrendingUp size={14} /> Crescimento Exponencial
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-tight">
            Plano de <span className="text-gradient">Carreira</span> Orgino
          </h1>
          
          <p className="text-zinc-500 text-lg md:text-xl max-w-3xl mx-auto font-medium">
            Sua dedicação é recompensada em cada nível. Evolua sua rede, acumule pontos e libere bônus que transformam vidas.
          </p>
        </section>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Target size={24} />
              </div>
              <h3 className="text-white font-bold text-xl">Objetivos Claros</h3>
              <p className="text-zinc-500 text-sm">Cada nível tem requisitos transparentes de membros e pontuação.</p>
           </div>
           <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] space-y-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-white font-bold text-xl">Segurança Vitalícia</h3>
              <p className="text-zinc-500 text-sm">Uma vez alcançado o nível, você mantém seus benefícios base.</p>
           </div>
           <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] space-y-4">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                <Zap size={24} />
              </div>
              <h3 className="text-white font-bold text-xl">Aceleração</h3>
              <p className="text-zinc-500 text-sm">Cursos e treinamentos ajudam você a subir de nível 2x mais rápido.</p>
           </div>
        </div>

        {/* Career Path Timeline */}
        <div className="relative space-y-8">
           <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-zinc-800 to-transparent hidden md:block" />
           
           {levels.map((level, i) => (
             <motion.div 
               key={level.name}
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="relative flex flex-col md:flex-row gap-8 items-start md:items-center group"
             >
                {/* Marker */}
                <div className={`z-10 w-16 h-16 rounded-2xl ${level.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 shrink-0`}>
                  {React.cloneElement(level.icon as React.ReactElement, { size: 28, className: level.name === "Master" ? "text-white" : "text-white" })}
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-zinc-900/30 border border-white/5 p-8 rounded-[2.5rem] hover:bg-zinc-900/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8 group-hover:border-primary/20">
                   <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-2xl font-black text-white">{level.name}</h4>
                        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-zinc-400 uppercase tracking-widest">{level.points}</span>
                      </div>
                      <p className="text-zinc-500 font-medium">{level.requirement}</p>
                   </div>
                   
                   <div className="flex items-center gap-6">
                      <div className="text-right">
                         <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest mb-1">Recompensa</p>
                         <p className="text-emerald-400 font-bold">{level.bonus}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-600 group-hover:text-primary group-hover:border-primary/30 transition-all">
                        <CheckCircle2 size={18} />
                      </div>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Bottom CTA */}
        <section className="bg-purple-gradient rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
           <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Pronto para subir de nível?</h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">Comece sua jornada hoje mesmo. Cada novo afiliado na sua rede aproxima você do próximo prêmio.</p>
              <button 
                onClick={() => navigate('/rede')}
                className="bg-white text-primary px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
              >
                 Ver Minha Rede Agora
              </button>
           </div>
           <Crown size={300} className="absolute -right-20 -bottom-20 text-white/5 rotate-12 group-hover:rotate-45 transition-all duration-[2s]" />
        </section>
      </div>
    </Layout>
  );
}
