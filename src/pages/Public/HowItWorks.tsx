import React from "react";
import PublicLayout from "../../components/Layout/PublicLayout";
import { motion } from "motion/react";
import { 
  Network, 
  PlayCircle, 
  CreditCard, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp,
  Zap,
  Users
} from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Users className="text-primary" />,
      title: "1. Cadastre-se e Ative-se",
      description: "Crie sua conta e entre para a nossa comunidade de influenciadores selecionados. Ao se ativar, você garante sua posição na matriz global."
    },
    {
      icon: <Network className="text-accent" />,
      title: "2. Construa sua Rede 5x10",
      description: "Convide 5 amigos e ajude-os a fazer o mesmo. Nossa matriz inteligente preenche automaticamente os níveis, maximizando seus ganhos residuais."
    },
    {
      icon: <PlayCircle className="text-primary" />,
      title: "3. Interaja e Ganhe",
      description: "Assista a vídeos, curta e compartilhe conteúdos da comunidade. Cada interação gera pontos que podem ser convertidos em saldo real."
    },
    {
      icon: <GraduationCap className="text-accent" />,
      title: "4. Evolua com Cursos",
      description: "Acesse treinamentos exclusivos de marketing e influência. Quanto mais você aprende, maior é o seu potencial de escala e lucro."
    }
  ];

  return (
    <PublicLayout>
      <div className="space-y-32 py-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-primary"
          >
            <Zap size={14} fill="currentColor" /> O Ecossistema Orgino
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold leading-tight max-w-4xl mx-auto"
          >
            Como transformamos <span className="text-primary">Engajamento</span> em <span className="text-accent">Liberdade</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Diferente de tudo o que você já viu, o Orgino Group une redes sociais, educação e monetização em rede em um único lugar.
          </motion.p>
        </section>

        {/* The Matrix Explanation */}
        <section className="relative overflow-hidden bg-zinc-900/50 py-32 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 relative z-10">
              <h2 className="text-4xl font-display font-bold">A Revolucionária <br /> <span className="text-primary">Matriz 5x10</span></h2>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Nossa matriz forçada garante que ninguém fique para trás. Com apenas 5 diretos, sua rede pode se expandir até o 10º nível, gerando ganhos em escala geométrica.
              </p>
              <div className="space-y-4">
                {[
                  "Derramamento inteligente de rede",
                  "Comissões de ativação e recorrência",
                  "Bônus por indicação direta e indireta",
                  "Acompanhamento em tempo real via Dashboard"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary" size={20} />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <button className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all">
                Simular Meus Ganhos
                <ArrowRight size={20} />
              </button>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] group-hover:bg-primary/30 transition-colors rounded-full" />
              <div className="relative bg-zinc-900 border border-white/10 p-12 rounded-[3rem] shadow-2xl">
                {/* Visual representation of a matrix node */}
                <div className="flex flex-col items-center gap-8">
                  <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                    <Users className="text-white w-10 h-10" />
                  </div>
                  <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
                  <div className="grid grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xs font-bold text-primary">
                        {i}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest text-center">Nível 1: Seus 5 Diretos</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Steps Grid */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl font-display font-bold">Jornada do Influenciador</h2>
            <p className="text-zinc-500">O caminho para o sucesso no Orgino Group é simples e recompensador.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2.5rem] hover:bg-zinc-800/50 transition-all group"
              >
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Benefits Cards Section */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-white/10 rounded-[4rem] p-12 md:p-20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] -mr-48 -mt-48 rounded-full" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
              <div className="space-y-8">
                <h2 className="text-4xl font-display font-bold">Mais do que uma rede, <br />um <span className="text-accent">Clube de Vantagens</span></h2>
                <p className="text-zinc-300 text-lg leading-relaxed">
                  Ao fazer parte do Orgino Group, você recebe o **Cartão Orgino**, garantindo descontos reais em farmácias, academias, restaurantes e lojas de todo o Brasil.
                </p>
                <div className="flex items-center gap-4 text-white font-bold">
                  <div className="flex -space-x-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-2 border-zinc-900 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="" />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm">Junte-se a +50.000 membros</p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <motion.div
                  whileHover={{ rotateY: 15, rotateX: -5 }}
                  className="w-full max-w-sm aspect-[1.6/1] bg-gradient-to-br from-zinc-800 to-black rounded-3xl border border-white/20 p-8 shadow-2xl relative overflow-hidden group preserve-3d"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex justify-between items-start mb-12">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                      <Users className="text-primary w-8 h-8" />
                    </div>
                    <CreditCard className="text-zinc-500" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-black">Orgino Group Member</p>
                    <p className="text-xl font-display font-bold tracking-widest text-white">4582 • 9102 • 3384 • 1029</p>
                  </div>
                  <div className="mt-8 flex justify-between items-end">
                    <p className="text-sm font-bold text-zinc-400">ALEX RIVERA</p>
                    <div className="flex gap-1">
                      <div className="w-8 h-8 bg-primary/20 rounded-full" />
                      <div className="w-8 h-8 bg-accent/20 rounded-full" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 text-center space-y-12 pb-20">
          <h2 className="text-5xl font-display font-bold">Pronto para começar sua <br /> <span className="text-gradient">jornada exponencial?</span></h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-12 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary/20">
              Começar Agora Gratuitamente
            </button>
            <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white px-12 py-5 rounded-2xl font-bold text-lg border border-white/10 transition-all">
              Falar com um Consultor
            </button>
          </div>
          <p className="text-zinc-500 text-sm">Sem taxas ocultas. Cancele quando quiser.</p>
        </section>
      </div>
    </PublicLayout>
  );
}
