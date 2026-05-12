import React from "react";
import PublicLayout from "../components/Layout/PublicLayout";
import { motion } from "motion/react";
import { 
  Users, 
  Rocket, 
  Heart, 
  Leaf, 
  GraduationCap, 
  TrendingUp, 
  Globe, 
  CheckCircle,
  CreditCard,
  PlayCircle,
  Sprout
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero-creator.png";

const IMAGES = {
  hero: heroImage,
  ecosystem: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2070",
  marketplace: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=2067",
  dashboard: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015"
};

const SectionHeading = ({ children, badge, subtitle }: { children: React.ReactNode, badge?: string, subtitle?: string }) => (
  <div className="mb-12">
    {badge && (
      <span className="text-accent font-display text-sm uppercase tracking-widest block mb-4">
        {badge}
      </span>
    )}
    <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight mb-4">
      {children}
    </h2>
    {subtitle && (
      <p className="text-slate-400 max-w-2xl text-lg">
        {subtitle}
      </p>
    )}
  </div>
);

export default function LandingPage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-radial-dark relative border-b border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black leading-[1.1] mb-6 md:mb-8">
              Orgino Group <span className="text-gradient">Plataform</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-8 md:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              A plataforma onde influenciadores crescem juntos, monetizam em rede e apoiam uma causa maior. Junte-se à nova era da Creator Economy.
            </p>
            <div className="flex justify-center lg:justify-start">
              <Link to="/auth/register" className="bg-purple-gradient text-white px-6 md:px-8 py-4 md:py-5 rounded-2xl font-bold flex items-center gap-3 hover:brightness-110 transition-all text-base md:text-lg shadow-xl shadow-primary/30 w-full sm:w-fit justify-center">
                Quero ser um Influenciador
                <Rocket className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative mt-12 lg:mt-0"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[80px] md:blur-[100px] rounded-full" />
            <div className="relative z-10 glass-card rounded-[2.5rem] p-2 border-white/10 overflow-hidden">
              <img 
                src={IMAGES.hero} 
                alt="Orgino Creator Hero" 
                className="w-full h-auto rounded-[2rem] object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Purpose Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <SectionHeading badge="NOSSO PROPÓSITO">
          Muito além do engajamento: Um <span className="text-gradient">compromisso</span> com o futuro.
        </SectionHeading>

        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full mb-12">
          <Heart className="text-accent fill-accent" size={20} />
          <span className="font-semibold"><span className="text-gradient">5%</span> de todo o valor arrecadado é destinado à causa</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <Heart className="text-primary" />, title: "Apoio ao TEA", desc: "Suporte integral para crianças com Autismo e suas famílias." },
            { icon: <Leaf className="text-primary" />, title: "Áreas Verdes", desc: "Preservação e criação de espaços naturais regenerativos." },
            { icon: <GraduationCap className="text-primary" />, title: "Workshops", desc: "Capacitação e desenvolvimento técnico para a comunidade." },
            { icon: <Users className="text-primary" />, title: "Apoio Materno", desc: "Cuidado emocional e rede de apoio para mães atípicas." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-2xl hover:border-accent/50 transition-colors"
            >
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                {item.icon}
              </div>
              <h3 className="text-xl font-display font-bold mb-3">{item.title}</h3>
              <p className="text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Innovation Ecosystem Section */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-display font-bold mb-16">Ecossistema de Inovação</h2>
          
          <div className="grid md:grid-cols-12 gap-6 auto-rows-[240px]">
            {/* Main Card */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="md:col-span-8 md:row-span-2 glass-card rounded-[3rem] relative overflow-hidden group border-white/5 shadow-2xl shadow-primary/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/20 z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(112,0,255,0.2),transparent_70%)] animate-pulse" />
              <img src={IMAGES.ecosystem} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000" alt="Networking" />
              
              <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-gradient rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Users className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-4xl font-display font-extrabold text-white">Rede de Engajamento</h3>
                </div>
                <p className="text-xl text-slate-300 max-w-xl leading-relaxed">
                  Crescimento colaborativo onde o sucesso de um potencializa o alcance de todos os membros da rede.
                </p>
              </div>
            </motion.div>

            {/* Monetization Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="md:col-span-4 glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center group"
            >
              <TrendingUp className="w-16 h-16 text-gradient mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-display font-bold mb-3">Monetização 5x10</h3>
              <p className="text-slate-400">Ganhos em rede e comissões recorrentes que escalam sua renda.</p>
            </motion.div>

            {/* Courses Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="md:col-span-4 glass-card rounded-3xl p-8 flex flex-col justify-between"
            >
              <div className="bg-white/5 rounded-xl aspect-video mb-6 border border-white/5 overflow-hidden">
                <img src={IMAGES.marketplace} className="w-full h-full object-cover opacity-30" alt="Marketplace" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold mb-2">Marketplace de Cursos</h3>
                <p className="text-slate-400 text-sm">Venda seu conhecimento em uma vitrine exclusiva para a comunidade.</p>
              </div>
            </motion.div>

            {/* Video Feed */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="md:col-span-5 glass-card rounded-3xl p-8 flex items-center gap-6"
            >
              <div className="w-20 h-24 bg-white/5 rounded-xl flex items-center justify-center border border-primary/20">
                <PlayCircle className="text-primary w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold mb-1">Social Video Feed</h3>
                <p className="text-slate-400 text-sm">Vídeos verticais imersivos para máximo engajamento orgânico.</p>
              </div>
            </motion.div>

            {/* Benefits Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="md:col-span-3 glass-card bg-primary/10 border-primary/20 rounded-3xl p-8 flex flex-col justify-between"
            >
              <CreditCard className="text-primary w-8 h-8" />
              <div>
                <h4 className="font-bold text-sm">Cartão de Benefícios</h4>
                <p className="text-xs text-slate-400">Descontos em parceiros globais.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-display font-bold mb-12">Por que escolher o Orgino Group?</h2>
            <div className="space-y-10">
              {[
                { icon: <TrendingUp className="text-primary" />, title: "Monetização Diária", desc: "Acompanhe seus rendimentos em tempo real e saque com facilidade." },
                { icon: <Users className="text-primary" />, title: "Comunidade Ativa", desc: "Troque experiências e crie parcerias com outros grandes criadores." },
                { icon: <Globe className="text-primary" />, title: "Suporte Multilíngue", desc: "Estamos prontos para atender você em qualquer lugar do mundo." },
                { icon: <CheckCircle className="text-primary" />, title: "Responsabilidade Social", desc: "Cada ação na plataforma gera impacto positivo real no mundo." },
              ].map((benefit, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:border-primary transition-colors">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-display font-bold mb-2">{benefit.title}</h4>
                    <p className="text-slate-400">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="glass-card p-4 rounded-[40px] border-white/10">
              <img src={IMAGES.dashboard} className="rounded-[32px] w-full shadow-2xl opacity-80" alt="Dashboard" />
            </div>
            {/* Badge */}
            <div className="absolute -bottom-8 -left-8 glass-card p-6 rounded-3xl border-white/20 bg-black/90">
              <p className="text-3xl font-display font-extrabold text-gradient">10k+</p>
              <p className="text-xs uppercase tracking-widest font-semibold text-slate-400">Influenciadores</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto glass-card rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/5 blur-[120px] -z-10" />
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">O futuro da influência começa aqui.</h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Não seja apenas mais um número. Seja parte de um legado que transforma vidas enquanto gera lucro real.
          </p>
          <Link to="/auth/register" className="bg-purple-gradient text-white px-12 py-6 rounded-full font-bold text-2xl hover:scale-105 transition-transform shadow-2xl shadow-primary/40 active:scale-95 inline-block">
            Cadastrar-se Agora
          </Link>
        </motion.div>
      </section>
    </PublicLayout>
  );
}
