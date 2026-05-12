import React from "react";
import Layout from "../../components/Layout/Layout";
import { motion } from "motion/react";
import { 
  Users, 
  DollarSign, 
  BookOpen, 
  Plus, 
  TrendingUp, 
  BarChart3, 
  MessageSquare,
  ChevronRight,
  MoreVertical,
  Play
} from "lucide-react";
import { mockCourses } from "../../mocks/courseData";

export default function ProducerDashboard() {
  const stats = [
    { label: "Vendas Totais", value: "R$ 45.280", change: "+12%", icon: DollarSign, color: "text-emerald-400" },
    { label: "Alunos Ativos", value: "1.240", change: "+8%", icon: Users, color: "text-primary" },
    { label: "Cursos Publicados", value: "4", change: "0%", icon: BookOpen, color: "text-blue-400" },
    { label: "Taxa de Conclusão", value: "68%", change: "+5%", icon: BarChart3, color: "text-purple-400" },
  ];

  return (
    <Layout>
      <div className="space-y-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">Área do Produtor</h1>
            <p className="text-slate-400 text-lg">Gerencie seu conteúdo e acompanhe o crescimento dos seus alunos.</p>
          </div>
          
          <button className="bg-primary hover:bg-primary-dark px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-xl shadow-primary/20">
            <Plus size={22} />
            Criar Novo Curso
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-3xl border-white/5 bg-white/[0.02]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">
                  {stat.change}
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold">Meus Cursos</h2>
              <button className="text-primary text-sm font-bold hover:underline">Ver todos</button>
            </div>
            
            <div className="space-y-4">
              {mockCourses.map((course) => (
                <div key={course.id} className="glass-card p-4 rounded-3xl border-white/5 hover:bg-white/[0.03] transition-all flex items-center gap-6 group">
                  <div className="w-24 h-16 rounded-xl overflow-hidden shrink-0">
                    <img src={course.thumbnail} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white group-hover:text-primary transition-colors">{course.title}</h4>
                    <p className="text-xs text-slate-500">{course.lessons} aulas • {course.category}</p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-white">R$ 497,00</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Preço Sugerido</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-colors">
                      <BarChart3 size={18} />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Sales/Activity */}
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold">Vendas Recentes</h2>
            <div className="glass-card p-6 rounded-[2.5rem] border-white/5 bg-white/[0.02] space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    JD
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">João D. comprou seu curso</p>
                    <p className="text-[10px] text-slate-500">Há 15 minutos</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-400">+ R$ 497</span>
                </div>
              ))}
              <button className="w-full py-4 border border-white/5 rounded-2xl text-sm font-bold text-slate-400 hover:bg-white/5 transition-all">
                Ver Relatório Completo
              </button>
            </div>

            {/* Support/Engagement */}
            <div className="glass-card p-6 rounded-[2.5rem] border-primary/20 bg-primary/5 space-y-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="text-primary" />
                <h3 className="font-bold">Novas Dúvidas</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">Você tem <span className="text-white font-bold">12 perguntas</span> aguardando resposta nas suas aulas.</p>
              <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                Ir para o fórum <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
