import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Plus, 
  Trash2, 
  Video as VideoIcon, 
  Youtube, 
  Search,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Upload
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Tables } from "../../types/database";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

type Video = Tables<'videos_feed'>;

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function AdminVideos() {
  const { profile } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [targetStates, setTargetStates] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    video_url: "",
    description: "",
    type: "video" as "video" | "youtube",
    thumbnail_url: ""
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('videos_feed')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (err) {
      console.error('Error fetching videos:', err);
      toast.error("Erro ao carregar vídeos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalVideoUrl = formData.video_url;

      if (formData.type === 'video') {
        if (!videoFile) {
          toast.error("Por favor, selecione um arquivo de vídeo");
          setIsSubmitting(false);
          return;
        }

        const fileExt = videoFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Attempt upload to 'videos' bucket
        const { error: uploadError } = await supabase.storage
          .from('videos')
          .upload(filePath, videoFile);

        if (uploadError) {
          console.warn("Could not upload to 'videos' bucket, trying 'company-logos' fallback:", uploadError);
          
          // Attempt fallback to 'company-logos' bucket
          const { error: fallbackError } = await supabase.storage
            .from('company-logos')
            .upload(filePath, videoFile);

          if (fallbackError) throw fallbackError;

          const { data } = supabase.storage
            .from('company-logos')
            .getPublicUrl(filePath);

          finalVideoUrl = data.publicUrl;
        } else {
          const { data } = supabase.storage
            .from('videos')
            .getPublicUrl(filePath);

          finalVideoUrl = data.publicUrl;
        }
      } else {
        if (!formData.video_url) {
          toast.error("Por favor, insira o link do YouTube");
          setIsSubmitting(false);
          return;
        }
      }

      const { error } = await supabase
        .from('videos_feed')
        .insert({
          video_url: finalVideoUrl,
          description: formData.description,
          type: formData.type,
          thumbnail_url: formData.thumbnail_url,
          user_id: profile?.id,
          target_states: targetStates
        });

      if (error) throw error;

      toast.success("Vídeo publicado com sucesso!");
      setIsModalOpen(false);
      setFormData({ video_url: "", description: "", type: "video", thumbnail_url: "" });
      setTargetStates([]);
      setVideoFile(null);
      fetchVideos();
    } catch (err) {
      console.error('Error adding video:', err);
      toast.error("Erro ao publicar vídeo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este vídeo?")) return;

    try {
      const { error } = await supabase
        .from('videos_feed')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Vídeo excluído");
      setVideos(prev => prev.filter(v => v.id.toString() !== id));
    } catch (err) {
      console.error('Error deleting video:', err);
      toast.error("Erro ao excluir vídeo");
    }
  };

  const filteredVideos = videos.filter(v => 
    v.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.video_url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <VideoIcon className="text-purple-500" />
              </div>
              Gerenciar Feed de Vídeos
            </h1>
            <p className="text-zinc-500 font-medium">Controle os conteúdos que aparecem no feed dos afiliados</p>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105"
          >
            <Plus size={20} />
            Novo Vídeo
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por descrição ou URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600"
            />
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="aspect-video bg-zinc-900/50 rounded-3xl animate-pulse border border-white/5" />
            ))
          ) : filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <motion.div 
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden group hover:border-purple-500/20 transition-all"
              >
                <div className="aspect-video relative bg-black flex items-center justify-center">
                  {video.type === 'youtube' ? (
                    <Youtube className="text-red-500 w-12 h-12" />
                  ) : (
                    <Play className="text-primary w-12 h-12" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => window.open(video.video_url, '_blank')}
                      className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:scale-110 transition-transform"
                    >
                      Visualizar
                    </button>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm line-clamp-2">{video.description || 'Sem descrição'}</p>
                      <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-1">
                        {video.type === 'youtube' ? 'YouTube' : 'MP4/WebM'} • {new Date(video.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDelete(video.id.toString())}
                      className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/5">
              <VideoIcon className="mx-auto text-zinc-700 w-12 h-12" />
              <div className="space-y-1">
                <p className="text-white font-bold">Nenhum vídeo encontrado</p>
                <p className="text-zinc-500 text-sm">Adicione um novo vídeo para começar a alimentar o feed.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Cadastro */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsModalOpen(false); setVideoFile(null); }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-zinc-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Novo Vídeo</h2>
                  <p className="text-zinc-500 text-sm">Preencha os dados do vídeo para o feed</p>
                </div>
                <button onClick={() => { setIsModalOpen(false); setVideoFile(null); }} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="text-zinc-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4 p-1 bg-black/40 rounded-2xl border border-white/5">
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'video' }))}
                    className={`py-3 rounded-xl text-sm font-bold transition-all ${formData.type === 'video' ? 'bg-primary text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                  >
                    Arquivo MP4/WebM
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'youtube' }))}
                    className={`py-3 rounded-xl text-sm font-bold transition-all ${formData.type === 'youtube' ? 'bg-red-500 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                  >
                    Link YouTube
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.type === 'video' ? (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400 ml-1">Arquivo de Vídeo</label>
                      <div 
                        onClick={() => document.getElementById('video-file-upload')?.click()}
                        className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 transition-all relative overflow-hidden cursor-pointer ${
                          videoFile ? "border-primary/50 bg-primary/5" : "border-white/10 hover:border-primary/30 bg-black/40"
                        }`}
                      >
                        {videoFile ? (
                          <div className="text-center space-y-2">
                            <VideoIcon className="text-primary w-10 h-10 mx-auto" />
                            <p className="text-sm font-bold text-white truncate max-w-[300px]">{videoFile.name}</p>
                            <p className="text-xs text-zinc-500">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                            <button 
                              type="button" 
                              onClick={(e) => { e.stopPropagation(); setVideoFile(null); }}
                              className="text-red-400 text-xs font-bold hover:underline"
                            >
                              Alterar arquivo
                            </button>
                          </div>
                        ) : (
                          <div className="text-center space-y-2">
                            <Upload className="text-zinc-500 w-8 h-8 mx-auto" />
                            <p className="text-sm font-bold text-white">Clique para fazer upload do vídeo</p>
                            <p className="text-xs text-zinc-500">MP4 ou WebM, até 100MB</p>
                          </div>
                        )}
                        <input 
                          id="video-file-upload"
                          type="file" 
                          className="hidden" 
                          accept="video/*"
                          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400 ml-1">Link do YouTube</label>
                      <div className="relative">
                        <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" size={18} />
                        <input 
                          required
                          type="url"
                          placeholder="https://youtube.com/watch?v=..."
                          value={formData.video_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 ml-1">Descrição / Legenda</label>
                    <textarea 
                      required
                      placeholder="Sobre o que é este vídeo?"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 ml-1">URL da Thumbnail (Opcional)</label>
                    <input 
                      type="url"
                      placeholder="https://exemplo.com/thumb.jpg"
                      value={formData.thumbnail_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                    />
                  </div>

                  {/* Segmentação Regional */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-zinc-400 ml-1">Estados Destino (Segmentação Regional)</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setTargetStates(BRAZILIAN_STATES)}
                          className="text-[10px] text-primary font-bold hover:underline"
                        >
                          Selecionar Todos
                        </button>
                        <span className="text-[10px] text-zinc-600">|</span>
                        <button
                          type="button"
                          onClick={() => setTargetStates([])}
                          className="text-[10px] text-zinc-400 hover:underline"
                        >
                          Limpar
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 max-h-[140px] overflow-y-auto p-2 bg-black/40 border border-white/5 rounded-2xl no-scrollbar">
                      {BRAZILIAN_STATES.map((uf) => {
                        const isSelected = targetStates.includes(uf);
                        return (
                          <button
                            key={uf}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setTargetStates(prev => prev.filter(state => state !== uf));
                              } else {
                                setTargetStates(prev => [...prev, uf]);
                              }
                            }}
                            className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                              isSelected 
                                ? 'bg-primary/20 border-primary text-primary shadow-sm shadow-primary/20' 
                                : 'bg-zinc-950 border-white/5 text-zinc-500 hover:text-white hover:border-white/10'
                            }`}
                          >
                            {uf}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-zinc-500 ml-1">
                      {targetStates.length === 0 
                        ? "* Nenhum selecionado. O vídeo será exibido para todos os afiliados." 
                        : `* Segmentado para os ${targetStates.length} estados selecionados.`
                      }
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => { setIsModalOpen(false); setVideoFile(null); }}
                    className="flex-1 px-6 py-4 rounded-2xl font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        {formData.type === 'video' ? "Enviando Vídeo..." : "Publicando..."}
                      </>
                    ) : "Publicar Vídeo"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
