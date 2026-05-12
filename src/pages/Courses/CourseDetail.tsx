import React from "react";
import Layout from "../../components/Layout/Layout";
import { motion } from "motion/react";
import { 
  Play, 
  Star, 
  Users, 
  Clock, 
  BookOpen, 
  Award, 
  CheckCircle, 
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { mockCourses } from "../../mocks/courseData";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = mockCourses.find(c => c.id === Number(id)) || mockCourses[0];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="relative h-[400px] rounded-[3rem] overflow-hidden border border-white/5">
          <img src={course.thumbnail} className="w-full h-full object-cover opacity-30" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          <div className="absolute inset-0 p-12 flex flex-col justify-end space-y-6">
            <div className="flex gap-3">
              <span className="bg-primary/20 text-primary px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-primary/20">
                {course.category}
              </span>
              <span className="bg-white/10 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-white/10 flex items-center gap-1">
                <Star size={12} className="text-yellow-500 fill-current" /> 4.9 (2.4k avaliações)
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white max-w-3xl leading-tight">
              {course.title}
            </h1>
            
            <div className="flex items-center gap-8 text-slate-300">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-primary" />
                <span className="font-bold">12.4k Alunos</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-primary" />
                <span className="font-bold">18h de conteúdo</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={20} className="text-primary" />
                <span className="font-bold">Certificado Incluso</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-6">
              <h2 className="text-3xl font-display font-bold">O que você vai aprender</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Estratégias de retenção viral",
                  "Algoritmo das redes sociais 2024",
                  "Edição profissional no celular",
                  "Como fechar parcerias de alto ticket",
                  "Criação de comunidade engajada",
                  "Análise de dados e crescimento"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <CheckCircle className="text-primary shrink-0 mt-1" size={18} />
                    <span className="text-slate-300 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-display font-bold">Conteúdo do Curso</h2>
              <div className="space-y-4">
                {[
                  { title: "Módulo 1: Fundamentos do Influencer", lessons: "4 aulas", time: "2h 30m" },
                  { title: "Módulo 2: O Poder do Storytelling", lessons: "6 aulas", time: "4h 15m" },
                  { title: "Módulo 3: Produção e Edição", lessons: "8 aulas", time: "6h 45m" },
                  { title: "Módulo 4: Monetização e Vendas", lessons: "5 aulas", time: "4h 30m" },
                ].map((mod, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-center justify-between hover:bg-white/[0.08] transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-white group-hover:text-primary transition-colors">{mod.title}</h4>
                        <p className="text-xs text-slate-500">{mod.lessons} • {mod.time}</p>
                      </div>
                    </div>
                    <ArrowRight className="text-slate-600 group-hover:text-primary transition-colors" size={20} />
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-gradient-to-br from-primary/10 to-accent/10 border border-white/5 p-8 rounded-[3rem] flex items-center gap-8">
              <div className="w-24 h-24 rounded-full border-4 border-primary overflow-hidden shrink-0">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor}`} alt="" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Sobre o Instrutor: {course.instructor}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Referência em marketing de influência com mais de 10 anos de experiência. Já ajudou mais de 50 mil alunos a transformarem suas redes sociais em máquinas de lucro.
                </p>
              </div>
            </section>
          </div>

          {/* Pricing/Sticky Card */}
          <div className="space-y-6">
            <div className="sticky top-12 glass-card p-8 rounded-[3rem] border-primary/30 bg-primary/5 shadow-2xl shadow-primary/10 space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
                  <Zap size={14} fill="currentColor" /> Oferta por tempo limitado
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-5xl font-display font-bold text-white">R$ 497</h3>
                  <span className="text-slate-500 line-through text-lg">R$ 997</span>
                </div>
                <p className="text-slate-400 text-xs">Ou em até 12x de <span className="text-white font-bold">R$ 49,90</span> no cartão.</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => navigate(`/cursos/player/${course.id}`)}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                >
                  Garantir Minha Vaga
                  <ArrowRight size={20} />
                </button>
                <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                  7 dias de garantia incondicional
                </p>
              </div>

              <div className="space-y-4 pt-8 border-t border-white/5">
                {[
                  { icon: <ShieldCheck size={18} />, label: "Acesso vitalício" },
                  { icon: <Play size={18} />, label: "Assista onde quiser" },
                  { icon: <BookOpen size={18} />, label: "Materiais de apoio inclusos" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                    <div className="text-primary">{item.icon}</div>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
