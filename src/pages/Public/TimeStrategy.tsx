import React from "react";
import PublicLayout from "../../components/Layout/PublicLayout";
import { motion } from "motion/react";
import { 
  Clock, 
  Compass, 
  Brain, 
  ArrowRight, 
  HelpCircle, 
  Target, 
  Activity, 
  BookOpen,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

export default function TimeStrategy() {
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
            A Chave para Sair do Automático e Construir um Novo Futuro
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-black leading-tight text-white"
          >
            Tempo & <span className="text-gradient">Estratégia</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-2xl text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto pt-4"
          >
            A verdade é que o problema não é a falta de tempo. Todos nós recebemos as mesmas vinte e quatro horas por dia. O que faz a diferença é a forma como administramos esse tempo.
          </motion.p>
        </div>
      </section>

      {/* The Rat Race section */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6">
            <span className="text-accent font-display text-xs md:text-sm uppercase tracking-widest block font-black">A Corrida dos Ratos</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white">Saindo do Piloto Automático</h2>
            <div className="space-y-4 text-slate-400 leading-relaxed text-base md:text-lg">
              <p>
                Vivemos em uma sociedade onde quase todos estão correndo. Corremos para estudar, trabalhar, pagar contas e conquistar sonhos. E, muitas vezes, corremos tanto que esquecemos de viver.
              </p>
              <p>
                O investidor Robert Kiyosaki popularizou uma expressão conhecida mundialmente: <strong>“A Corrida dos Ratos”</strong>. Ela representa a vida de milhões de pessoas que passam anos presas em uma rotina automática de despesas crescentes e trabalho exaustivo sem planejamento.
              </p>
              <p className="text-white font-bold">
                Os dias passam, os meses passam, os anos passam... E muitas vezes temos a sensação de que o tempo está escapando pelas nossas mãos.
              </p>
            </div>
          </div>
          
          <div className="md:col-span-5">
            <div className="glass-card p-8 rounded-[2.5rem] border-white/5 bg-primary/5 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/15 rounded-full blur-2xl pointer-events-none" />
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-accent">
                <HelpCircle size={20} />
              </div>
              <p className="text-white font-display font-bold text-lg">Você está administrando seu tempo ou está sendo administrado por ele?</p>
              <p className="text-slate-400 text-sm">Quando somos jovens, desejamos que o tempo passe rápido. Depois chegam as responsabilidades e, sem perceber, entramos no piloto automático. Trabalhamos cada vez mais, mas planejamos cada vez menos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Relationship with Orgino Group */}
      <section className="py-20 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="glass-card p-8 rounded-[3rem] border-white/10 bg-gradient-to-br from-primary/25 to-transparent relative overflow-hidden h-[340px] flex flex-col justify-between">
              <div className="absolute top-4 right-4 text-accent/30 animate-pulse">
                <Brain size={48} />
              </div>
              <span className="text-xs uppercase text-slate-500 font-black tracking-widest block">Uso Inteligente</span>
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-black text-white">Patrimônio</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  O tempo é o nosso maior patrimônio. O Orgino Group convida você a reeducar o tempo diário, transformando minutos ociosos em janelas de oportunidade.
                </p>
              </div>
              <div className="text-[10px] text-accent uppercase font-black tracking-widest">
                Tempo & Estratégia Caminham Juntos
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <span className="text-accent font-display text-sm uppercase tracking-widest block font-black">O que isso tem a ver com a plataforma?</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white">Tudo.</h2>
            <div className="space-y-4 text-slate-400 leading-relaxed text-base md:text-lg">
              <p>
                O Orgino Group acredita que o crescimento acontece quando aprendemos a usar nosso tempo com inteligência e estratégia. O sucesso não depende apenas de trabalhar mais, mas de gerenciar melhor as horas que já possuímos.
              </p>
              <p>
                Não estamos pedindo que você pare sua vida, abandone seu trabalho ou suas responsabilidades. Estamos convidando você a refletir sobre a forma como utiliza seu tempo diariamente.
              </p>
              <p className="text-white font-medium">
                Se você está assistindo a um filme e surge um comercial, você muda de canal porque acredita que não pode perder alguns segundos. Mas e se aquela mensagem pudesse apresentar uma oportunidade capaz de transformar sua vida? Quantas oportunidades deixamos passar simplesmente por não dedicarmos alguns minutos para prestar atenção?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cycle & Strategy */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <span className="text-accent font-display text-sm uppercase tracking-widest block font-black">Equilíbrio</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white">Há tempo para todas as coisas</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 text-slate-400 leading-relaxed text-base md:text-lg">
            <p>
              A vida possui ciclos e cada ciclo exige respeito ao tempo. Há tempo para nascer, crescer, plantar, colher, viver e partir. 
            </p>
            <p>
              Imagine um piloto conduzindo uma aeronave com centenas de passageiros. Ele possui uma rota, um planejamento e um tempo determinado para chegar ao destino. Se tentar acelerar além do limite seguro, colocará todos em risco. Por isso ele respeita o processo, o tempo e a estratégia. Na vida real, o processo funciona de forma idêntica.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Tempo de Plantar", desc: "Respeito ao início e esforço" },
              { label: "Tempo de Colher", desc: "Resultado do trabalho" },
              { label: "Respeito à Rota", desc: "Planejamento estruturado" },
              { label: "Aproveitar o Voo", desc: "Viver o presente ativamente" }
            ].map((box, i) => (
              <div key={i} className="glass-card p-6 rounded-2xl border-white/5 bg-white/[0.01]">
                <h4 className="font-bold text-white font-display text-sm mb-1">{box.label}</h4>
                <p className="text-slate-500 text-xs">{box.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secret of Digital Growth */}
      <section className="py-20 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-accent font-display text-sm uppercase tracking-widest block font-black">Crescimento Digital</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
              O segredo do alcance orgânico
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed text-base md:text-lg">
              <p>
                Muitas pessoas sonham em se tornar influenciadores. Muitas empresas desejam divulgar seus produtos e profissionais desejam mostrar seus serviços ao mundo. Mas poucos entendem que tudo começa com algo simples: <strong>dedicar tempo</strong>.
              </p>
              <p>
                Tempo para aprender, assistir, compreender, apoiar e construir relacionamentos. No Orgino Group, acreditamos na força da comunidade e da participação mútua de forma consciente.
              </p>
              <p className="text-white font-bold">
                Cada minuto dedicado à comunidade fortalece não apenas quem produz o conteúdo, mas todo o ecossistema de crescimento construído pelo Orgino Group.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="glass-card p-8 rounded-[3.5rem] border-white/5 bg-gradient-to-tr from-accent/5 to-transparent space-y-6">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 text-accent flex items-center justify-center font-bold">M</div>
                <div>
                  <h4 className="text-white font-bold text-sm">Rede Conectada</h4>
                  <p className="text-xs text-slate-500">Fluxo de Engajamento</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 italic">
                "Quando Maria reserva alguns minutos para assistir e comentar o conteúdo de Francisca, ela fortalece aquela conexão. Quando Francisca faz o mesmo por Pérola, cria-se um ecossistema indestrutível."
              </p>
              <div className="h-px bg-white/5" />
              <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span>Aprender</span> • <span>Assistir</span> • <span>Apoiar</span> • <span>Construir</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Time Reeducation Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center space-y-8">
        <span className="text-accent font-display text-sm uppercase tracking-widest block font-black">Reflexão</span>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white">Reeducar o Tempo</h2>
        <p className="text-slate-400 text-base md:text-lg leading-relaxed">
          Talvez o maior desafio dos nossos dias não seja encontrar mais tempo, mas aprender a utilizar melhor o que já temos. Passamos horas consumindo conteúdos aleatórios na internet. Assistimos a dezenas de vídeos sem reter conhecimento relevante.
        </p>
        <p className="text-white font-bold text-base md:text-lg">
          Mas imagine o que aconteceria se parte desse tempo fosse direcionada para conteúdos que agregam conhecimento, oportunidades e crescimento. Pequenas mudanças de hábito geram grandes resultados a longo prazo.
        </p>
      </section>

      {/* Purpose & Closing Block */}
      <section className="py-24 px-6 bg-radial-dark border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-accent font-display text-xs uppercase tracking-widest font-black">
            <Target size={14} />
            Escolhas de Valor
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-black text-white leading-tight">
            O tempo continuará passando para todos.
          </h2>
          <p className="text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto font-medium">
            Você pode continuar correndo sem direção, ou pode transformar cada minuto em uma oportunidade de crescimento, aprendizado e construção de um futuro melhor. Invista em conhecimento e construa relacionamentos reais.
          </p>
          <div className="text-slate-500 uppercase tracking-widest text-xs font-black">
            "Viva o hoje, porque o amanhã ainda não nos pertence."
          </div>
          <div className="pt-6">
            <Link to="/auth/register" className="bg-purple-gradient text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform inline-flex items-center gap-2">
              Transforme Seu Tempo
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
