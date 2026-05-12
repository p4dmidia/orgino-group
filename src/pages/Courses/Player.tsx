import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Maximize, 
  CheckCircle, 
  FileText, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp,
  Star,
  Download
} from "lucide-react";
import { useParams } from "react-router-dom";
import { mockCourses } from "../../mocks/courseData";

export default function CoursePlayer() {
  const { id } = useParams();
  const course = mockCourses.find(c => c.id === Number(id)) || mockCourses[0];
  const [activeTab, setActiveTab] = useState("content");
  const [currentLesson, setCurrentLesson] = useState(1);

  const modules = [
    {
      title: "Módulo 1: Introdução Estratégica",
      lessons: [
        { id: 1, title: "Boas-vindas e Mindset", duration: "12:45", completed: true },
        { id: 2, title: "O Novo Algoritmo", duration: "24:30", completed: true },
        { id: 3, title: "Ferramentas Indispensáveis", duration: "18:20", completed: false },
      ]
    },
    {
      title: "Módulo 2: Criação de Conteúdo Viral",
      lessons: [
        { id: 4, title: "Storytelling que Prende", duration: "15:10", completed: false },
        { id: 5, title: "Edição de Alto Nível", duration: "32:00", completed: false },
        { id: 6, title: "Análise de Métricas", duration: "21:45", completed: false },
      ]
    }
  ];

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-120px)]">
        {/* Main Player Section */}
        <div className="flex-1 space-y-6">
          {/* Video Player Placeholder */}
          <div className="aspect-video bg-zinc-900 rounded-3xl overflow-hidden relative border border-white/5 group shadow-2xl">
            <img 
              src={course.thumbnail} 
              alt="Video Thumbnail" 
              className="w-full h-full object-cover opacity-40"
            />
            
            {/* Player Controls Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/40 group-hover:scale-110 transition-transform"
              >
                <Play className="w-8 h-8 fill-current ml-1" />
              </motion.button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <button className="text-white hover:text-primary transition-colors"><SkipBack className="w-6 h-6" /></button>
                  <button className="text-white hover:text-primary transition-colors"><Pause className="w-6 h-6 fill-current" /></button>
                  <button className="text-white hover:text-primary transition-colors"><SkipForward className="w-6 h-6" /></button>
                  <div className="flex items-center gap-4 ml-4">
                    <span className="text-xs text-zinc-300">08:24 / 15:10</span>
                    <div className="w-48 h-1 bg-white/20 rounded-full relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-primary rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Volume2 className="w-6 h-6 text-white" />
                  <Maximize className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Info */}
          <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Edição de Alto Nível: Transições que Convertem</h1>
                <p className="text-zinc-400 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  {course.title} • Por {course.instructor}
                </p>
              </div>
              <button className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
                <CheckCircle className="w-5 h-5" />
                Concluir Aula
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5">
              {[
                { id: "content", label: "Sobre a aula", icon: <FileText className="w-4 h-4" /> },
                { id: "comments", label: "Comentários", icon: <MessageSquare className="w-4 h-4" /> },
                { id: "downloads", label: "Materiais", icon: <Download className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative ${
                    activeTab === tab.id ? "text-primary" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>

            <div className="py-4 text-zinc-400 leading-relaxed min-h-[150px]">
              <AnimatePresence mode="wait">
                {activeTab === "content" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    Nesta aula vamos mergulhar nas técnicas avançadas de edição para redes sociais. 
                    Você aprenderá como manter a retenção do público nos primeiros 3 segundos e como utilizar o ritmo da música para ditar o corte.
                  </motion.div>
                )}
                {activeTab === "comments" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    Nenhum comentário ainda. Seja o primeiro a perguntar!
                  </motion.div>
                )}
                {activeTab === "downloads" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                    <button className="flex items-center justify-between w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="text-white text-sm">Guia de Edição (PDF)</span>
                      </div>
                      <Download className="w-4 h-4 text-zinc-500" />
                    </button>
                    <button className="flex items-center justify-between w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="text-white text-sm">Presets de Cor (ZIP)</span>
                      </div>
                      <Download className="w-4 h-4 text-zinc-500" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sidebar Lesson List */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/5 bg-zinc-900/80">
              <h2 className="text-lg font-bold text-white mb-1">Conteúdo do Curso</h2>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">2 Módulos • 6 Aulas</span>
                <span className="text-xs text-primary font-bold">45% Concluído</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full mt-3 overflow-hidden">
                <div className="w-[45%] h-full bg-primary" />
              </div>
            </div>

            <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
              {modules.map((module, mIdx) => (
                <div key={mIdx}>
                  <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between group cursor-pointer">
                    <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{module.title}</span>
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="divide-y divide-white/5">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setCurrentLesson(lesson.id)}
                        className={`w-full px-6 py-4 flex items-center gap-4 transition-all hover:bg-primary/5 group ${
                          currentLesson === lesson.id ? "bg-primary/10 border-l-4 border-primary" : ""
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                          lesson.completed 
                            ? "bg-primary/20 border-primary/40 text-primary" 
                            : "bg-zinc-800 border-white/10 text-zinc-500 group-hover:border-primary/50"
                        }`}>
                          {lesson.completed ? <CheckCircle className="w-4 h-4" /> : lesson.id}
                        </div>
                        <div className="text-left overflow-hidden">
                          <p className={`text-sm font-medium truncate ${
                            currentLesson === lesson.id ? "text-primary" : "text-zinc-300"
                          }`}>
                            {lesson.title}
                          </p>
                          <span className="text-[10px] text-zinc-500">{lesson.duration}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructor Card */}
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white mb-4">Sobre o Instrutor</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor}`} alt={course.instructor} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{course.instructor}</p>
                <p className="text-xs text-zinc-400">Especialista em Redes Sociais</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
