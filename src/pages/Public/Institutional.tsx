import React from "react";
import PublicLayout from "../../components/Layout/PublicLayout";
import { motion } from "motion/react";
import { 
  Heart, 
  Activity, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  CheckCircle2,
  Compass,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Institutional() {
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
            Manifesto Institucional
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-black leading-tight text-white"
          >
            Conectando Mentes a <span className="text-gradient">Oportunidades</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-2xl text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto pt-4"
          >
            O Orgino Group nasceu com um propósito muito maior do que simplesmente criar uma empresa. Nasceu para conectar pessoas a oportunidades.
          </motion.p>
        </div>
      </section>

      {/* Philosophy Brief */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
            <p className="font-semibold text-white text-xl">
              Acreditamos que toda pessoa possui talentos, sonhos e potencial para crescer quando encontra orientação, conhecimento e oportunidades reais.
            </p>
            <p>
              Por isso desenvolvemos uma plataforma que une saúde, educação digital, desenvolvimento humano, inclusão social e responsabilidade coletiva.
            </p>
            <p className="text-accent font-bold">
              Mais do que negócios, construímos caminhos. Mais do que resultados financeiros, buscamos gerar impacto positivo na vida das pessoas.
            </p>
          </div>
          <div className="glass-card p-8 rounded-[2.5rem] border-white/5 flex flex-col justify-center relative overflow-hidden bg-primary/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
            <span className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Nossa Filosofia</span>
            <div className="space-y-4">
              {[
                "Crescer com propósito.",
                "Trabalhar com transparência.",
                "Respeitar as pessoas.",
                "Gerar oportunidades.",
                "Transformar vidas."
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-accent shrink-0" size={20} />
                  <span className="text-white font-bold text-lg">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Core Columns */}
      <section className="py-20 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto space-y-24">
          
          {/* Card Saude */}
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-accent font-display text-xs uppercase tracking-widest font-black">
                <Activity size={14} />
                Nosso Produto
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
                Orgino Card Saúde
              </h2>
              <div className="space-y-4 text-slate-400 leading-relaxed text-base md:text-lg">
                <p>
                  O Cartão Saúde Orgino Group é nosso principal produto, desenvolvido para proporcionar benefícios, acessibilidade e mais qualidade de vida para as famílias brasileiras.
                </p>
                <p>
                  Todo associado do Orgino Group já ingressa na plataforma com seu Cartão Saúde garantido. Além disso, pessoas que não desejam participar do programa de bonificações ou do sistema de marketing também poderão adquirir o cartão diretamente pelo site.
                </p>
                <p className="text-white font-medium">
                  Nosso cartão possui um importante propósito social: parte dos recursos arrecadados através de sua comercialização será destinada ao desenvolvimento e fortalecimento dos projetos sociais apoiados pelo Orgino Group.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="glass-card p-8 rounded-[3rem] border-white/10 relative overflow-hidden group hover:border-accent/30 transition-all shadow-2xl bg-gradient-to-br from-primary/20 to-transparent">
                <div className="absolute top-4 right-4 text-accent animate-pulse">
                  <Award size={32} />
                </div>
                <h3 className="text-2xl font-display font-black text-white mb-6">Orgino Health Card</h3>
                <div className="h-44 rounded-2xl bg-gradient-to-r from-primary to-accent p-6 flex flex-col justify-between shadow-xl">
                  <span className="text-white font-display font-black tracking-widest text-lg">OG GROUP</span>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-white/70 uppercase font-mono">Status do Cartão</p>
                      <p className="text-xs text-white font-black uppercase tracking-wider">Ativo / Saúde & Cuidado</p>
                    </div>
                    <Activity className="text-white animate-pulse" size={24} />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-6 text-center">Cada aquisição representa muito mais do que um benefício pessoal: representa uma contribuição para transformar vidas.</p>
              </div>
            </div>
          </div>

          {/* Influencer Training */}
          <div className="grid lg:grid-cols-12 gap-12 items-center pt-12">
            <div className="lg:col-span-5 order-last lg:order-first">
              <div className="glass-card p-8 rounded-[3rem] border-white/10 flex flex-col justify-between h-[360px] bg-gradient-to-bl from-accent/5 to-transparent relative overflow-hidden">
                <div className="absolute bottom-[-10%] right-[-10%] w-44 h-44 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                <TrendingUp className="text-accent w-12 h-12" />
                <div>
                  <h4 className="text-2xl font-display font-extrabold text-white mb-2">Presença & Autoridade</h4>
                  <p className="text-sm text-slate-400">Desenvolvimento ético de canais digitais nos principais feeds modernos.</p>
                </div>
                <div className="flex gap-2">
                  {["Instagram", "TikTok", "Kwai", "YouTube"].map((social) => (
                    <span key={social} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-xs font-semibold text-slate-400">{social}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-accent font-display text-xs uppercase tracking-widest font-black">
                <Users size={14} />
                Nosso Serviço
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
                Formação de Influenciadores Digitais
              </h2>
              <div className="space-y-4 text-slate-400 leading-relaxed text-base md:text-lg">
                <p>
                  Vivemos a maior transformação digital da história. Todos os dias, milhões de pessoas utilizam as redes sociais para aprender, compartilhar experiências e influenciar decisões. Grandes marcas investem bilhões porque compreenderam que as pessoas confiam em pessoas.
                </p>
                <p>
                  Criamos uma plataforma de capacitação para quem deseja crescer no ambiente digital. Acreditamos que qualquer pessoa, independentemente de idade, profissão ou condição financeira, pode aprender a produzir conteúdo de qualidade.
                </p>
                <p className="text-white font-medium">
                  Não vendemos ilusões ou promessas de riqueza fácil. Nosso compromisso é oferecer conhecimento técnico, orientação ética e ferramentas reais de desenvolvimento pessoal e profissional.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Social Project Block */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="glass-card rounded-[4rem] border-white/5 p-8 md:p-16 relative overflow-hidden bg-gradient-to-br from-primary/10 via-transparent to-accent/5">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-3xl space-y-6 mb-12">
            <span className="text-accent font-display text-xs md:text-sm uppercase tracking-widest block font-black">Projeto Social</span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-white leading-tight">
              Inclusão Que Transforma. <br />Propósito Que Multiplica.
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              O Orgino Group acredita que o verdadeiro sucesso acontece quando conseguimos transformar vidas. Por isso, desenvolvemos um importante projeto social voltado ao apoio de crianças com Transtorno do Espectro Autista (TEA) e acolhimento de suas famílias. Nosso sonho é construir um espaço completo de convivência e integração social.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Estrutura Completa", items: ["Área verde preservada", "Piscina adaptada", "Campinho de futebol"] },
              { title: "Lazer e Integração", items: ["Playground acessível", "Interação orientada com animais", "Ambiente seguro"] },
              { title: "Apoio Familiar", items: ["Espaço especial para mães", "Salas de acolhimento", "Orientação familiar"] },
              { title: "Espaço Integrado", items: ["Convivência ativa", "Fortalecimento emocional", "Desenvolvimento infantil"] },
            ].map((box, i) => (
              <div key={i} className="bg-black/45 border border-white/5 rounded-3xl p-6 space-y-4">
                <h4 className="text-white font-display font-bold text-lg border-b border-white/5 pb-2">{box.title}</h4>
                <ul className="space-y-2 text-xs md:text-sm text-slate-400">
                  {box.items.map((li, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {li}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-sm text-center text-slate-500 mt-12 font-medium">
            Queremos cuidar de quem cuida todos os dias. Acreditamos que quando ajudamos uma criança, apoiamos uma família inteira.
          </p>
        </div>
      </section>

      {/* Senior Generation Section */}
      <section className="py-20 px-6 bg-white/[0.01] border-t border-white/5">
        <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6">
            <span className="text-accent font-display text-sm uppercase tracking-widest block font-black">Terceira Idade</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
              A Faculdade da Vida
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed text-base md:text-lg">
              <p>
                O Orgino Group acredita que a experiência possui valor. As histórias possuem valor. A vida possui valor.
              </p>
              <p>
                Por isso, criamos um espaço onde homens e mulheres da terceira idade poderão compartilhar suas experiências, ensinamentos, conquistas e aprendizados.
              </p>
              <p className="text-white font-bold">
                Porque existe uma faculdade que nenhum diploma consegue substituir: a faculdade da vida. Cada história compartilhada pode inspirar alguém e guiar uma nova geração.
              </p>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="glass-card p-8 rounded-3xl border-white/5 text-center relative overflow-hidden bg-primary/5">
              <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6">
                <Compass size={28} className="animate-spin-slow" />
              </div>
              <blockquote className="text-slate-300 italic text-base mb-4">
                "Cada vida possui um legado que merece ser ouvido e compartilhado."
              </blockquote>
              <cite className="text-xs font-bold text-accent uppercase tracking-wider font-display not-italic">Orgino Legacy Project</cite>
            </div>
          </div>
        </div>
      </section>

      {/* Values & Manifesto Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-16">
          <span className="text-accent font-display text-xs md:text-sm uppercase tracking-widest block mb-4 font-black">Valores Fundamentais</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
            Nossos Valores
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            "Respeito", "Transparência", "Inclusão", "Ética",
            "Solidariedade", "Desenvolvimento Humano", "Responsabilidade Social", "Oportunidades para Todos"
          ].map((val, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl border-white/5 text-center hover:border-accent/40 transition-colors">
              <p className="text-white font-display font-extrabold text-base md:text-lg">{val}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Closing Manifesto */}
      <section className="py-24 px-6 bg-radial-dark border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-display font-black text-white">ORGINO GROUP</h2>
          <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium">
            Conectando Mentes a Oportunidades. <br />
            Transformando Vidas. <br />
            Deixando Legado.
          </p>
          <div className="pt-6">
            <Link to="/auth/register" className="bg-purple-gradient text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform inline-flex items-center gap-2">
              Faça Parte do Nosso Legado
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
