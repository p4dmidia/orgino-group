import React from "react";
import Layout from "../../components/Layout/Layout";
import { motion } from "motion/react";
import { 
  Search, 
  Filter, 
  Play, 
  Clock, 
  BookOpen, 
  Trophy,
  Star,
  ChevronRight,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import { mockCourses } from "../../mocks/courseData";

export default function Catalog() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">Área de Cursos</h1>
            <p className="text-slate-400 text-lg">Aprenda com os melhores produtores da nossa comunidade.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
              <Search size={18} className="text-slate-500" />
              <input type="text" placeholder="O que deseja aprender?" className="bg-transparent border-none outline-none text-sm w-48" />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {["Todos", "Marketing", "Vendas", "Lifestyle", "Negócios", "Finanças", "Edição"].map((cat, i) => (
            <button 
              key={i}
              className={`px-6 py-2 rounded-full border border-white/10 text-sm font-bold whitespace-nowrap transition-all ${i === 0 ? 'bg-primary text-white border-primary' : 'hover:bg-white/5 text-slate-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Continue Watching */}
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold">Continue Assistindo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockCourses.filter(c => c.progress > 0 && c.progress < 100).map((course) => (
              <Link to={`/cursos/player/${course.id}`} key={course.id} className="glass-card p-6 rounded-[2rem] border-white/5 flex gap-6 group hover:border-primary/30 transition-all cursor-pointer">
                <div className="w-40 h-24 rounded-2xl overflow-hidden relative shrink-0">
                  <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={course.title} />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="text-white fill-white" size={32} />
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h4 className="font-bold text-lg leading-tight mb-1">{course.title}</h4>
                    <p className="text-xs text-slate-500">{course.instructor}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${course.progress}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{course.progress}% concluído</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold">Explorar Cursos</h2>
            <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
              Ver todos <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockCourses.map((course) => (
              <motion.div 
                key={course.id}
                whileHover={{ y: -10 }}
                className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden group"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={course.title} />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase border border-white/10">
                    {course.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-emerald-400 text-black px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> 4.9
                  </div>
                </div>
                
                <div className="p-8 space-y-4">
                  <h3 className="text-xl font-display font-bold group-hover:text-primary transition-colors">{course.title}</h3>
                  
                  <div className="flex items-center gap-4 text-slate-400 text-sm">
                    <div className="flex items-center gap-1">
                      <BookOpen size={16} />
                      <span>{course.lessons} aulas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>4h 30m</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor}`} alt="Instructor" />
                      </div>
                      <span className="text-xs font-bold text-slate-300">{course.instructor}</span>
                    </div>
                    
                    <Link to={`/cursos/detalhes/${course.id}`} className="bg-white/5 hover:bg-primary text-white p-2 rounded-xl transition-all group-hover:scale-110">
                      <Play size={18} fill="currentColor" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        <div className="glass-card rounded-[3rem] border-white/5 p-12 bg-purple-gradient relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white blur-[100px] rounded-full" />
          </div>
          
          <div className="md:w-1/2 space-y-6 relative z-10">
            <span className="bg-white/20 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Destaque</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">Torne-se um Produtor de Elite</h2>
            <p className="text-white/80 text-lg">Publique seus próprios cursos, gerencie alunos e escale seus lucros dentro da plataforma Orgino.</p>
            <button className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-2xl">
              Começar a Ensinar
            </button>
          </div>
          
          <div className="md:w-1/2 grid grid-cols-2 gap-4 relative z-10">
            {[
              { icon: <Trophy />, title: "Selo de Elite", desc: "Reconhecimento" },
              { icon: <Users />, title: "Dashboard", desc: "Gestão completa" },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">{item.icon}</div>
                <h4 className="font-bold">{item.title}</h4>
                <p className="text-xs text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
