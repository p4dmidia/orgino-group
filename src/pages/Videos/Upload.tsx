import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { motion, AnimatePresence } from "motion/react";
import { 
  Upload as UploadIcon, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Clapperboard, 
  Music, 
  Hash, 
  Globe,
  Settings2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VideoUpload() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate("/videos"), 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Criar Novo Vídeo</h1>
            <p className="text-zinc-400">Compartilhe seu momento com a comunidade Orgino.</p>
          </div>
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="text-zinc-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div className="space-y-6">
            <div 
              className={`aspect-[9/16] max-h-[600px] border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center p-8 transition-all relative overflow-hidden ${
                file ? "border-primary/50 bg-primary/5" : "border-white/10 hover:border-primary/30 bg-zinc-900/50"
              }`}
            >
              {!file ? (
                <>
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <UploadIcon className="text-primary w-8 h-8" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-lg font-bold text-white">Arraste seu vídeo aqui</p>
                    <p className="text-sm text-zinc-500">MP4 ou WebM, até 100MB</p>
                  </div>
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    accept="video/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-4">
                  <Clapperboard className="w-16 h-16 text-primary" />
                  <div className="space-y-1">
                    <p className="text-white font-bold truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-zinc-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  <button 
                    onClick={() => setFile(null)}
                    className="text-red-400 text-xs font-bold hover:underline"
                  >
                    Remover vídeo
                  </button>
                </div>
              )}

              {isUploading && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-8 space-y-6">
                  <div className="w-full max-w-[200px] space-y-3">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                      <span className="text-primary">Enviando...</span>
                      <span className="text-white">{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-primary shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400">Não feche esta página até concluir.</p>
                </div>
              )}
            </div>
          </div>

          {/* Form Area */}
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 ml-1">Legenda</label>
                <textarea
                  placeholder="O que está acontecendo? #hashtag #viral"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[120px] resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300 ml-1 flex items-center gap-2">
                    <Music className="w-4 h-4 text-primary" /> Música
                  </label>
                  <select className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm appearance-none">
                    <option>Sem música</option>
                    <option>Trending Now #1</option>
                    <option>Lo-fi Beats</option>
                    <option>Crescimento Acelerado</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300 ml-1 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" /> Visibilidade
                  </label>
                  <select className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm appearance-none">
                    <option>Público</option>
                    <option>Apenas Seguidores</option>
                    <option>Privado</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Settings2 className="text-zinc-500 w-5 h-5" />
                    <div>
                      <p className="text-sm font-bold text-white">Comentários</p>
                      <p className="text-[10px] text-zinc-500">Permitir interações no vídeo</p>
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-primary h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex gap-3">
              <AlertCircle className="text-primary shrink-0" />
              <p className="text-xs text-zinc-400 leading-relaxed">
                Certifique-se de que seu vídeo segue nossas <span className="text-white font-bold underline">Diretrizes da Comunidade</span>. Conteúdos inapropriados serão removidos.
              </p>
            </div>

            <button
              type="submit"
              disabled={!file || isUploading}
              className={`w-full font-bold py-4 rounded-2xl transition-all shadow-lg ${
                !file || isUploading 
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                  : "bg-primary hover:bg-primary-dark text-white shadow-primary/20 hover:scale-[1.02]"
              }`}
            >
              Publicar Vídeo
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
