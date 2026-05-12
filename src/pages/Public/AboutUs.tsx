import React from "react";
import PublicLayout from "../../components/Layout/PublicLayout";
import { motion } from "motion/react";
import { 
  Users, 
  Heart, 
  Sprout, 
  Globe, 
  Target, 
  ShieldCheck, 
  Award,
  ArrowRight
} from "lucide-react";

export default function AboutUs() {
  const values = [
    { icon: <Target className="text-primary" />, title: "Missão", desc: "Democratizar o acesso à monetização digital através da união e do crescimento coletivo." },
    { icon: <ShieldCheck className="text-accent" />, title: "Integridade", desc: "Transparência total em todas as transações e processos da nossa rede." },
    { icon: <Users className="text-primary" />, title: "Comunidade", desc: "O sucesso individual só é real quando impulsiona o sucesso de todos ao redor." },
    { icon: <Heart className="text-accent" />, title: "Impacto", desc: "Destinar recursos reais para causas que transformam a sociedade e o planeta." },
  ];

  return (
    <PublicLayout>
      <div className="space-y-32 py-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-primary"
            >
              Nossa História
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
              Unindo pessoas para criar um <span className="text-gradient">legado digital.</span>
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
              O Orgino Group nasceu da necessidade de equilibrar a Creator Economy. Acreditamos que o engajamento social deve gerar mais do que apenas likes; deve gerar impacto real e liberdade financeira para todos.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400" className="rounded-3xl shadow-2xl" alt="" />
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400" className="rounded-3xl shadow-2xl" alt="" />
              </div>
              <div className="space-y-4 pt-12">
                <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400" className="rounded-3xl shadow-2xl" alt="" />
                <div className="aspect-square bg-primary rounded-3xl flex flex-col items-center justify-center text-center p-6 text-white shadow-2xl">
                  <span className="text-4xl font-bold">50k+</span>
                  <span className="text-xs font-black uppercase tracking-widest">Membros</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-zinc-900/50 py-32 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-4xl font-display font-bold">Nossos Pilares</h2>
              <p className="text-zinc-500">O que nos move todos os dias para construir algo maior.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-zinc-900 border border-white/5 p-8 rounded-[2.5rem] hover:border-primary/30 transition-all group"
                >
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Impact Detail */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/10 rounded-[4rem] p-12 md:p-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  Compromisso 5%
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold">Responsabilidade que Transforma</h2>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  Não somos apenas uma plataforma de ganhos. Somos uma rede de apoio. Destinamos 5% do nosso faturamento global para projetos de inclusão de crianças autistas, apoio a mães atípicas e regeneração ambiental.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-white">R$ 450k+</p>
                    <p className="text-xs text-zinc-500 uppercase font-black">Investidos em causas</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-white">1.200+</p>
                    <p className="text-xs text-zinc-500 uppercase font-black">Famílias auxiliadas</p>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800" className="rounded-[3rem] shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700" alt="Support" />
                <div className="absolute inset-0 bg-primary/10 rounded-[3rem]" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 text-center space-y-12 pb-20">
          <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Award className="text-primary w-10 h-10" />
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold">Faça parte da nossa <br />história de sucesso.</h2>
          <button className="bg-primary hover:bg-primary-dark text-white px-12 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary/20">
            Juntar-se ao Orgino Group
          </button>
        </section>
      </div>
    </PublicLayout>
  );
}
