import React from "react";
import PublicLayout from "../../components/Layout/PublicLayout";
import { motion } from "motion/react";
import { 
  Users, 
  TrendingUp, 
  Tv, 
  Clock, 
  Layers, 
  CheckCircle2, 
  Target, 
  Heart,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

export default function CollaborativeGrowth() {
  return (
    <PublicLayout>
      {/* Hero Header */}
      <section className="pt-32 pb-20 px-6 bg-radial-dark relative overflow-hidden border-b border-white/5">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-accent font-display text-xs md:text-sm uppercase tracking-widest block font-black"
          >
            Metodologia & Ecossistema
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-black leading-tight text-white"
          >
            Crescimento <span className="text-gradient">Colaborativo</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-2xl text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto pt-4"
          >
            Acreditamos que o crescimento digital não acontece sozinho. Ele acontece quando pessoas ajudam pessoas.
          </motion.p>
        </div>
      </section>

      {/* Intro Context */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <div className="space-y-8 text-slate-300 text-lg md:text-xl leading-relaxed">
          <p>
            Vivemos em uma era onde a comunicação acontece em segundos. Todos os dias milhões de conteúdos são publicados nas redes sociais. Pessoas compartilham experiências, conhecimentos, histórias, produtos, serviços e oportunidades.
          </p>
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl max-w-2xl mx-auto">
            <p className="font-bold text-white text-xl md:text-2xl">
              Por que alguns conteúdos alcançam milhares de pessoas enquanto outros passam despercebidos?
            </p>
          </div>
          <p className="text-accent font-bold">
            A resposta está em três fatores fundamentais: atenção, interação e relevância.
          </p>
          <p>
            Foi pensando nisso que o Orgino Group criou uma comunidade baseada na colaboração, no aprendizado e no crescimento mútuo. Quando uma comunidade se fortalece, todos têm mais oportunidades de crescer.
          </p>
        </div>
      </section>

      {/* How it works in practice */}
      <section className="py-20 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="text-accent font-display text-sm uppercase tracking-widest block font-black">Na Prática</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white">Como Funciona o Fluxo</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              {
                step: "01",
                title: "Publicação Consciente",
                desc: "Manuel publica um vídeo em suas redes sociais contendo seu conteúdo ou recomendação."
              },
              {
                step: "02",
                title: "Interação Genuína",
                desc: "Membros da comunidade assistem, comentam, curtem e compartilham com interesse real."
              },
              {
                step: "03",
                title: "Sinal para as Plataformas",
                desc: "A alta interação sinaliza relevância aos algoritmos, expandindo o alcance orgânico do vídeo."
              }
            ].map((box, i) => (
              <div key={i} className="glass-card p-8 rounded-3xl border-white/5 relative bg-black/45 space-y-4">
                <span className="text-5xl font-display font-black text-primary/30 block">{box.step}</span>
                <h3 className="text-xl font-display font-bold text-white">{box.title}</h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">{box.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center max-w-2xl mx-auto space-y-4">
            <p className="text-slate-300 font-semibold text-lg">
              Manuel também acompanha e interage com os conteúdos produzidos por outros membros.
            </p>
            <p className="text-accent font-black text-sm uppercase tracking-wider">
              Não se trata de obrigação, mas de participação consciente. O crescimento coletivo fortalece o individual.
            </p>
          </div>
        </div>
      </section>

      {/* Algoritmo e Retenção */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Retention block */}
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-accent flex items-center justify-center">
              <Clock size={24} />
            </div>
            <h2 className="text-3xl font-display font-bold text-white">O que é Retenção?</h2>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
              Retenção é o tempo que uma pessoa permanece assistindo ao seu conteúdo. Se você publica um vídeo de dois minutos e a maioria das pessoas assiste apenas alguns segundos, a retenção é baixa. 
            </p>
            <p className="text-white font-medium text-base md:text-lg">
              Mas se as pessoas assistem até o final ou a maior parte dele, a retenção é considerada alta. As plataformas valorizam muito conteúdos que mantêm a atenção do público.
            </p>
            <div className="p-4 bg-accent/5 border border-accent/10 rounded-2xl">
              <p className="text-xs text-accent uppercase font-black tracking-widest">Regra de Ouro</p>
              <p className="text-sm text-slate-300 mt-1 font-semibold">Quanto maior a retenção, maiores serão as oportunidades de alcance.</p>
            </div>
          </div>

          {/* Algorithm block */}
          <div className="glass-card p-8 md:p-12 rounded-[3rem] border-white/5 bg-gradient-to-tr from-primary/15 to-transparent space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center">
              <Layers size={24} />
            </div>
            <h2 className="text-3xl font-display font-bold text-white">O que é o Algoritmo?</h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              O algoritmo é o sistema inteligente utilizado pelas redes sociais para identificar quais conteúdos são mais interessantes para cada perfil. 
            </p>
            <div>
              <p className="text-xs uppercase text-slate-500 font-black tracking-widest mb-3">Fatores Principais Analisados:</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Tempo de Visualização",
                  "Comentários Reais",
                  "Compartilhamentos",
                  "Curtidas & Reações",
                  "Salvamentos",
                  "Frequência de Posts"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs md:text-sm text-slate-300 font-medium">
                    <CheckCircle2 size={16} className="text-accent shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Platform Value Section */}
      <section className="py-20 px-6 bg-white/[0.01] border-t border-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5">
            <div className="glass-card p-8 rounded-3xl border-white/5 relative overflow-hidden bg-primary/5 space-y-6">
              <h4 className="text-xl font-display font-bold text-white border-b border-white/5 pb-2">O que as plataformas valorizam:</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                {[
                  "Conteúdo útil e relevante",
                  "Tempo de visualização (retenção)",
                  "Comentários verdadeiros",
                  "Compartilhamentos espontâneos",
                  "Frequência e consistência",
                  "Comunidade ativa",
                  "Respeito às regras internas"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="md:col-span-7 space-y-6">
            <span className="text-accent font-display text-sm uppercase tracking-widest block font-black">Relevância</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
              Não basta apenas publicar.
            </h2>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
              É necessário construir relacionamentos, gerar valor e criar conteúdos que realmente contribuam para a vida das pessoas de forma positiva.
            </p>
            <p className="text-white font-bold text-base md:text-lg">
              Quando um conteúdo recebe interações genuínas, as plataformas entendem que ele possui relevância e podem ampliar sua distribuição para novas pessoas organicamente.
            </p>
          </div>
        </div>
      </section>

      {/* Dream Sharing Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <span className="text-accent font-display text-sm uppercase tracking-widest block font-black">Empatia Digital</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white">Assistir também é construir o futuro</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { name: "Pedro", role: "Tem um sonho" },
            { name: "Francisco", role: "Tem um sonho" },
            { name: "Maria", role: "Tem um sonho" },
            { name: "Manuel", role: "Tem um sonho" }
          ].map((u, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl border-white/5 text-center relative overflow-hidden bg-white/[0.01]">
              <div className="w-12 h-12 rounded-full bg-primary/20 text-accent flex items-center justify-center mx-auto mb-4 font-black">
                {u.name[0]}
              </div>
              <h4 className="text-white font-bold text-lg">{u.name}</h4>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-semibold">{u.role}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-8 rounded-3xl border-white/5 bg-gradient-to-r from-primary/10 to-transparent space-y-4 max-w-3xl mx-auto text-center">
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Todos estão dedicando tempo, energia e conhecimento para construir algo significativo. Quando assistimos a um conteúdo com atenção, estamos oferecendo algo extremamente valioso: nosso tempo. E quando uma comunidade compreende isso, ela se torna muito mais forte.
          </p>
          <div className="text-accent font-black tracking-widest uppercase text-xs">
            Manuel acompanha Pedro • Pedro acompanha Francisco • Francisco acompanha Maria • Maria acompanha Manuel
          </div>
        </div>
      </section>

      {/* Digital Economy Section */}
      <section className="py-20 px-6 bg-white/[0.01] border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-accent font-display text-sm uppercase tracking-widest block font-black">Economia Digital</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white">Uma Nova Oportunidade para o Futuro</h2>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed">
            Estamos vivendo a maior expansão da economia digital da história. Empresas precisam divulgar produtos, profissionais precisam divulgar serviços, empreendedores precisam divulgar seus negócios e instituições precisam divulgar suas causas. 
          </p>
          <p className="text-white font-medium text-base md:text-lg">
            Para que isso aconteça, é necessário que existam pessoas dispostas a assistir, aprender, compartilhar conhecimento e interagir de forma verdadeira. O Orgino Group capacita qualquer pessoa a utilizar as ferramentas digitais para ampliar suas oportunidades.
          </p>
          <div className="pt-4 flex flex-wrap gap-4 justify-center text-xs font-semibold text-slate-400">
            <span className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-full">Sem Promessas de Facilidade</span>
            <span className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-full">Dedicação & Consistência</span>
            <span className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-full">Trabalho Sério & Ético</span>
          </div>
        </div>
      </section>

      {/* Purpose & Closing Block */}
      <section className="py-24 px-6 bg-radial-dark border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-accent font-display text-xs uppercase tracking-widest font-black">
            <Target size={14} />
            Nosso Propósito
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-black text-white leading-tight">
            Ninguém cresce sozinho.
          </h2>
          <p className="text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto font-medium">
            Mais do que formar influenciadores digitais, queremos construir uma comunidade onde pessoas aprendem juntas, crescem juntas, compartilham experiências, apoiam umas às outras e transformam oportunidades em resultados reais.
          </p>
          <p className="text-slate-500 uppercase tracking-widest text-xs font-black">
            ORGINO GROUP • Unindo pessoas em um único objetivo.
          </p>
          <div className="pt-6">
            <Link to="/auth/register" className="bg-purple-gradient text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform inline-flex items-center gap-2">
              Começar Agora
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
