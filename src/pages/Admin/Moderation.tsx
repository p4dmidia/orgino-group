import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { motion } from "motion/react";
import { 
  MessageSquare, 
  Loader2,
  Trash2,
  CheckCircle,
  User,
  BookOpen,
  RefreshCcw,
  ShieldAlert,
  Film
} from "lucide-react";
import { supabase as supabaseClient } from "../../lib/supabase";
const supabase = supabaseClient as any;
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";

export default function AdminModeration() {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      // BUSCA PARALELA NO BANCO (Aulas e Feed de Vídeos)
      const lessonPromise = supabase
        .from('lesson_comments')
        .select(`
          id,
          content,
          created_at,
          is_approved,
          user_profiles (full_name),
          lessons (title)
        `)
        .eq('is_approved', false);

      const videoPromise = supabase
        .from('video_comments')
        .select(`
          id,
          content,
          created_at,
          is_approved,
          user_profiles (full_name),
          videos_feed (description)
        `)
        .eq('is_approved', false);

      const [lessonsRes, videosRes] = await Promise.all([lessonPromise, videoPromise]);

      if (lessonsRes.error) throw lessonsRes.error;
      if (videosRes.error) throw videosRes.error;

      const formattedLessons = (lessonsRes.data || []).map((c: any) => ({
        id: c.id,
        type: 'lesson',
        content: c.content,
        created_at: c.created_at,
        is_approved: c.is_approved,
        user_name: c.user_profiles?.full_name || 'Usuário',
        context_title: c.lessons?.title || 'Aula'
      }));

      const formattedVideos = (videosRes.data || []).map((c: any) => ({
        id: c.id,
        type: 'video',
        content: c.content,
        created_at: c.created_at,
        is_approved: c.is_approved,
        user_name: c.user_profiles?.full_name || 'Usuário',
        context_title: c.videos_feed?.description || 'Vídeo'
      }));

      // Combina e ordena por mais recente
      const combined = [...formattedLessons, ...formattedVideos].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setComments(combined);
    } catch (err: any) {
      console.error('Fetch Error:', err);
      toast.error("Erro ao carregar comentários para moderação: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve_comment' | 'delete_comment', type: 'lesson' | 'video') => {
    const confirmMsg = action === 'delete_comment' ? "Excluir comentário?" : null;
    if (confirmMsg && !confirm(confirmMsg)) return;

    setLoading(true);
    try {
      const table = type === 'lesson' ? 'lesson_comments' : 'video_comments';

      if (action === 'approve_comment') {
        const { error } = await supabase
          .from(table)
          .update({ is_approved: true })
          .eq('id', Number(id));
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('id', Number(id));
        if (error) throw error;
      }

      toast.success(action === 'approve_comment' ? "Aprovado com sucesso!" : "Excluído com sucesso!");
      await fetchComments();
    } catch (err: any) {
      toast.error("Erro ao processar ação: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchComments();
  }, [user]);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
             <h1 className="text-3xl font-bold text-white flex items-center gap-3">
               <ShieldAlert className="text-primary" />
               Moderação em Tempo Real
             </h1>
             <p className="text-zinc-500 text-sm mt-1">Conectado via Tunel de Segurança (Bypass de CORS ativado).</p>
          </div>
          <button 
            onClick={fetchComments}
            className="p-3 bg-zinc-900 border border-white/5 rounded-2xl text-zinc-400 hover:text-white transition-all shadow-xl"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-zinc-500 font-bold animate-pulse">Sincronizando com o Servidor...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <motion.div
                  key={`${comment.type}-${comment.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-zinc-900/60 border border-white/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-start md:items-center group hover:border-primary/20 transition-all shadow-2xl"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                       <span className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase border border-primary/20">
                          <User size={12} /> {comment.user_name}
                       </span>
                       
                       {comment.type === 'lesson' ? (
                         <span className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-blue-500/20">
                            <BookOpen size={12} /> Curso: {comment.context_title}
                         </span>
                       ) : (
                         <span className="flex items-center gap-2 bg-rose-500/10 text-rose-400 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-rose-500/20">
                            <Film size={12} /> Feed: {comment.context_title}
                         </span>
                       )}

                       <span className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-yellow-500/20 animate-pulse">
                          <RefreshCcw size={12} /> Pendente
                       </span>
                    </div>
                    <p className="text-zinc-100 text-lg leading-relaxed font-medium">"{comment.content}"</p>
                    <p className="text-[10px] text-zinc-600 font-bold mt-4 uppercase tracking-widest">
                      {new Date(comment.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  
                  <div className="flex gap-3 mt-6 md:mt-0">
                    <button 
                      onClick={() => handleAction(comment.id.toString(), 'approve_comment', comment.type)}
                      disabled={loading}
                      className="p-4 bg-zinc-800 text-zinc-500 hover:text-emerald-500 rounded-2xl transition-all hover:bg-zinc-700 disabled:opacity-50"
                      title="Aprovar comentário"
                    >
                      <CheckCircle size={24} />
                    </button>
                    <button 
                      onClick={() => handleAction(comment.id.toString(), 'delete_comment', comment.type)}
                      disabled={loading}
                      className="p-4 bg-zinc-800 text-zinc-500 hover:text-red-500 rounded-2xl transition-all hover:bg-zinc-700 disabled:opacity-50"
                      title="Excluir comentário"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-24 text-center bg-zinc-900/20 rounded-[4rem] border border-dashed border-white/10">
                 <MessageSquare size={56} className="mx-auto text-zinc-800 mb-4" />
                 <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Nenhuma atividade detectada no servidor.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
