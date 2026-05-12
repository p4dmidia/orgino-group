import React, { useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Play, 
  Video, 
  Layers, 
  MessageSquare, 
  Edit3, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Save,
  Clock,
  MoreVertical,
  CheckCircle,
  XCircle
} from "lucide-react";

// Mock Data for the Admin's own course
const initialModules = [
  {
    id: 1,
    title: "Módulo 1: Boas-vindas e Mindset",
    lessons: [
      { id: 101, title: "Introdução ao Orgino Group", duration: "05:20", videoUrl: "https://youtube.com/..." },
      { id: 102, title: "Como configurar seu perfil", duration: "12:45", videoUrl: "https://youtube.com/..." },
    ]
  },
  {
    id: 2,
    title: "Módulo 2: Estratégias de Rede",
    lessons: [
      { id: 201, title: "Entendendo a Matriz 5x10", duration: "18:30", videoUrl: "https://youtube.com/..." },
      { id: 202, title: "Primeiros passos para atrair afiliados", duration: "15:10", videoUrl: "https://youtube.com/..." },
    ]
  }
];

const mockComments = [
  { id: 1, user: "Marcos Silva", lesson: "Entendendo a Matriz 5x10", text: "Excelente explicação! Tirou todas as minhas dúvidas.", date: "Há 10m", status: "pending" },
  { id: 2, user: "Ana Clara", lesson: "Introdução ao Orgino Group", text: "O áudio está um pouco baixo nessa aula...", date: "Há 1h", status: "pending" },
];

export default function AdminCourses() {
  const [activeTab, setActiveTab] = useState<"content" | "comments">("content");
  const [expandedModules, setExpandedModules] = useState<number[]>([1]);

  const toggleModule = (id: number) => {
    setExpandedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Video className="text-red-500" />
              Gestão de Conteúdo (LMS)
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Configure módulos, aulas e interações do seu curso oficial.</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-600/20">
              <Plus size={20} />
              Criar Novo Módulo
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-white/5">
          <button 
            onClick={() => setActiveTab("content")}
            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === "content" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            Estrutura do Curso
            {activeTab === "content" && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />}
          </button>
          <button 
            onClick={() => setActiveTab("comments")}
            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === "comments" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            Moderação de Comentários
            {activeTab === "comments" && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "content" ? (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {initialModules.map((module) => (
                <div key={module.id} className="bg-zinc-900/40 border border-white/5 rounded-[2rem] overflow-hidden">
                  <div 
                    onClick={() => toggleModule(module.id)}
                    className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-zinc-800 rounded-xl">
                        <Layers size={20} className="text-red-500" />
                      </div>
                      <h3 className="text-lg font-bold text-white">{module.title}</h3>
                      <span className="text-xs text-zinc-500 bg-white/5 px-2 py-1 rounded-lg">{module.lessons.length} aulas</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="p-2 text-zinc-500 hover:text-white transition-colors"><Edit3 size={18} /></button>
                      <button className="p-2 text-zinc-500 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      {expandedModules.includes(module.id) ? <ChevronUp className="text-zinc-500" /> : <ChevronDown className="text-zinc-500" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedModules.includes(module.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-white/5"
                      >
                        <div className="p-4 space-y-2">
                          {module.lessons.map((lesson) => (
                            <div key={lesson.id} className="group flex items-center justify-between p-4 bg-zinc-900/50 hover:bg-zinc-800/50 rounded-2xl border border-transparent hover:border-white/5 transition-all">
                              <div className="flex items-center gap-4">
                                <div className="p-2 bg-black/50 text-zinc-500 rounded-lg group-hover:text-red-500 transition-colors">
                                  <Play size={16} fill="currentColor" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-white">{lesson.title}</p>
                                  <p className="text-[10px] text-zinc-600 flex items-center gap-1 mt-0.5">
                                    <Clock size={10} />
                                    {lesson.duration}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-xs font-bold flex items-center gap-2">
                                  <Video size={14} />
                                  Vídeo
                                </button>
                                <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all"><Edit3 size={14} /></button>
                                <button className="p-2 bg-white/5 hover:bg-red-500/20 text-red-500 rounded-xl transition-all"><Trash2 size={14} /></button>
                              </div>
                            </div>
                          ))}
                          <button className="w-full py-4 mt-2 border-2 border-dashed border-white/5 rounded-2xl text-zinc-500 text-xs font-bold hover:border-red-500/30 hover:text-red-500 transition-all flex items-center justify-center gap-2">
                            <Plus size={16} />
                            Adicionar Aula ao Módulo
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="comments"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {mockComments.map((comment) => (
                <div key={comment.id} className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user}`} alt="" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{comment.user}</p>
                        <p className="text-[10px] text-zinc-500 font-medium">Aula: <span className="text-red-500">{comment.lesson}</span> • {comment.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl transition-all"><CheckCircle size={18} /></button>
                      <button className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"><XCircle size={18} /></button>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed bg-black/20 p-4 rounded-2xl border border-white/5">
                    "{comment.text}"
                  </p>
                </div>
              ))}
              {mockComments.length === 0 && (
                <div className="py-20 text-center">
                  <MessageSquare className="mx-auto text-zinc-800 w-16 h-16 mb-4" />
                  <p className="text-zinc-500 font-bold">Nenhum comentário aguardando moderação.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
