import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout/Layout";
import { motion, AnimatePresence } from "motion/react";
import { Heart, MessageCircle, Share2, Bookmark, Music, Plus, Play, Pause, Volume2, VolumeX, Loader2, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase as supabaseClient } from "../../lib/supabase";
const supabase = supabaseClient as any;
import { Tables } from "../../types/database";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";

type Video = Tables<'videos_feed'> & {
  user?: { full_name: string } | null;
};

const VideoCard = ({ video, isActive }: { video: Video, isActive: boolean }) => {
  const { profile } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showIcon, setShowIcon] = useState<"play" | "pause" | "volume" | "mute" | null>(null);
  
  // Likes logic
  const [isLiked, setIsLiked] = useState(() => {
    return localStorage.getItem(`liked_video_${video.id}`) === 'true';
  });
  const [likesCount, setLikesCount] = useState(video.likes_count || 0);
  const [isLiking, setIsLiking] = useState(false);

  // Comments logic
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsCount, setCommentsCount] = useState(video.comments_count || 0);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const getShareUrl = () => {
    return window.location.origin + "/v/" + video.id + (profile ? "?ref=" + profile.id : "");
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = getShareUrl();
    const shareData = {
      title: 'Orgino Group',
      text: video.description || 'Confira este vídeo no Orgino Group!',
      url: shareUrl
    };

    // Try native Web Share API
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        console.warn("Native share error or dismissed:", err);
      }
    }

    // Fallback: open bottom drawer
    setShowShareOptions(true);
  };

  const copyToClipboard = async () => {
    const textToCopy = getShareUrl();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (!successful) throw new Error("execCommand copy failed");
      }
    } catch (err) {
      console.warn("Clipboard copy fallback warning:", err);
    } finally {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setShowShareOptions(false);
    }
  };


  useEffect(() => {
    setLikesCount(video.likes_count || 0);
    setCommentsCount(video.comments_count || 0);
    setIsLiked(localStorage.getItem(`liked_video_${video.id}`) === 'true');
  }, [video]);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      let query = supabase
        .from('video_comments')
        .select(`
          id,
          content,
          created_at,
          is_approved,
          user:user_profiles (
            full_name,
            role
          )
        `)
        .eq('video_id', video.id);

      if (profile?.id) {
        query = query.or(`is_approved.eq.true,user_id.eq.${profile.id}`);
      } else {
        query = query.eq('is_approved', true);
      }

      const { data, error } = await query.order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !profile || isSubmittingComment) return;
    setIsSubmittingComment(true);

    try {
      const { data, error } = await supabase
        .from('video_comments')
        .insert({
          video_id: video.id,
          user_id: profile.id,
          content: newComment.trim(),
          is_approved: false
        })
        .select(`
          id,
          content,
          created_at,
          is_approved,
          user:user_profiles (
            full_name,
            role
          )
        `)
        .single();

      if (error) throw error;

      setComments(prev => [...prev, data]);
      setNewComment("");
      setCommentsCount(prev => prev + 1);
      video.comments_count = (video.comments_count || 0) + 1;
      toast.success("Comentário enviado para moderação!");
    } catch (err) {
      console.error('Error submitting comment:', err);
      toast.error("Erro ao enviar comentário.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // YouTube Controller
  useEffect(() => {
    if (video.type === "youtube" && iframeRef.current && isActive) {
      const message = isPaused 
        ? '{"event":"command","func":"pauseVideo","args":""}' 
        : '{"event":"command","func":"playVideo","args":""}';
      iframeRef.current.contentWindow?.postMessage(message, "*");
    }
  }, [isPaused, isActive, video.type]);

  useEffect(() => {
    if (video.type === "youtube" && iframeRef.current && isActive) {
      const message = isMuted 
        ? '{"event":"command","func":"mute","args":""}' 
        : '{"event":"command","func":"unMute","args":""}';
      iframeRef.current.contentWindow?.postMessage(message, "*");
    }
  }, [isMuted, isActive, video.type]);

  // MP4 Controller
  useEffect(() => {
    if (video.type === "video" && videoRef.current) {
      if (isActive && !isPaused) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, isPaused, video.type]);

  // Reset pause state when video becomes active
  useEffect(() => {
    if (isActive) setIsPaused(false);
  }, [isActive]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showComments) {
      setShowComments(false);
      return;
    }
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    setShowIcon(newPausedState ? "pause" : "play");
    setTimeout(() => setShowIcon(null), 800);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    setShowIcon(newMutedState ? "mute" : "volume");
    setTimeout(() => setShowIcon(null), 800);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking) return;
    setIsLiking(true);

    const newLikedState = !isLiked;
    const originalLikesCount = likesCount;

    setIsLiked(newLikedState);
    setLikesCount(prev => Math.max(0, prev + (newLikedState ? 1 : -1)));

    try {
      if (newLikedState) {
        localStorage.setItem(`liked_video_${video.id}`, 'true');
        const { error } = await supabase.rpc('like_video', { video_id: video.id });
        if (error) throw error;
      } else {
        localStorage.removeItem(`liked_video_${video.id}`);
        const { error } = await supabase.rpc('unlike_video', { video_id: video.id });
        if (error) throw error;
      }
    } catch (err) {
      console.error('Error handling video like:', err);
      setIsLiked(!newLikedState);
      setLikesCount(originalLikesCount);
      if (newLikedState) {
        localStorage.removeItem(`liked_video_${video.id}`);
      } else {
        localStorage.setItem(`liked_video_${video.id}`, 'true');
      }
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div 
      className="h-full w-full snap-start relative flex flex-col justify-end p-6 group overflow-hidden cursor-pointer bg-black"
      onClick={togglePlay}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 16, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="absolute top-4 left-1/2 bg-primary/95 backdrop-blur-md text-white text-xs font-black px-4 py-2 rounded-full shadow-2xl border border-white/10 z-50 flex items-center gap-2 pointer-events-none"
          >
            <span>Link copiado!</span>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Background Content */}
      <div className="absolute inset-0 w-full h-full">
        {video.type === "youtube" ? (
          isActive ? (
            <iframe
              ref={iframeRef}
              src={`${video.video_url}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&playlist=${video.video_url.split("/").pop()}&enablejsapi=1`}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              allow="autoplay; encrypted-media"
              title="YouTube Video"
            />
          ) : (
            <div className="absolute inset-0 bg-black" />
          )
        ) : (
          <video 
            ref={videoRef}
            src={video.video_url} 
            loop 
            muted={isMuted}
            playsInline
            className="absolute inset-0 w-full h-full object-contain"
          />
        )}
      </div>

      {/* Visual Feedback Icon */}
      <AnimatePresence>
        {showIcon && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          >
            <div className="w-20 h-20 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white">
              {showIcon === "play" && <Play size={40} fill="currentColor" />}
              {showIcon === "pause" && <Pause size={40} fill="currentColor" />}
              {showIcon === "volume" && <Volume2 size={40} fill="currentColor" />}
              {showIcon === "mute" && <VolumeX size={40} fill="currentColor" />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-10" />

      {/* Side Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col gap-6 z-30">
        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={toggleMute}
            className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white"
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} className="text-primary" />}
          </button>
        </div>

        <div className="flex flex-col items-center gap-1 text-white">
          <button 
            type="button"
            onClick={handleLike}
            disabled={isLiking}
            className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer group/icon disabled:opacity-50"
          >
            <Heart 
              size={24} 
              className={`transition-colors ${isLiked ? "text-red-500 fill-red-500" : "group-hover/icon:text-red-500"}`} 
            />
          </button>
          <span className="text-xs font-bold">{likesCount}</span>
        </div>
        
        <div className="flex flex-col items-center gap-1 text-white">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowComments(true);
            }}
            className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-white"
          >
            <MessageCircle size={24} />
          </button>
          <span className="text-xs font-bold">{commentsCount}</span>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-white"
        >
          <Share2 size={24} />
        </button>
      </div>

      {/* Info Area */}
      <div className="relative z-20 pr-16 space-y-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden bg-white/5">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.user?.full_name || 'user'}`} alt="Avatar" />
          </div>
          <div>
            <h4 className="font-bold text-lg flex items-center gap-2">
              {video.user?.full_name || 'Usuário'}
            </h4>
          </div>
        </div>
        
        <p className="text-sm text-slate-200 line-clamp-2">
          {video.description}
        </p>
      </div>

      {/* Comments Drawer/Sheet */}
      <AnimatePresence>
        {showComments && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-40 rounded-[2.5rem]"
              onClick={(e) => {
                e.stopPropagation();
                setShowComments(false);
              }}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="absolute bottom-0 left-0 right-0 h-[60%] bg-zinc-900 border-t border-white/10 rounded-t-[2rem] z-50 flex flex-col p-5 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="font-bold text-sm">Comentários ({commentsCount})</span>
                <button 
                  onClick={() => setShowComments(false)}
                  className="text-slate-400 hover:text-white text-xs font-semibold px-2.5 py-1 rounded hover:bg-white/5"
                >
                  Fechar
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-4 no-scrollbar">
                {commentsLoading ? (
                  <div className="flex justify-center items-center h-full py-8">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>
                ) : comments.length > 0 ? (
                  comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full border border-primary/40 overflow-hidden bg-white/5 flex-shrink-0">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user?.full_name || 'user'}`} 
                          alt="Avatar" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs text-slate-200">
                            {c.user?.full_name || 'Usuário'}
                          </span>
                          {c.user?.role === 'admin' && (
                            <span className="bg-primary/20 text-primary text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                              Admin
                            </span>
                          )}
                          {!c.is_approved && (
                            <span className="bg-yellow-500/10 text-yellow-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase border border-yellow-500/20">
                              Pendente
                            </span>
                          )}
                          <span className="text-[9px] text-slate-400">
                            {new Date(c.created_at).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 break-words mt-0.5">
                          {c.content}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 py-8 text-center">
                    <MessageCircle className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-xs">Nenhum comentário ainda. Seja o primeiro!</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmitComment} className="pt-3 border-t border-white/5 flex gap-2">
                <input
                  type="text"
                  placeholder={profile ? "Adicione um comentário..." : "Faça login para comentar..."}
                  value={newComment}
                  disabled={!profile || isSubmittingComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-primary placeholder-slate-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!profile || !newComment.trim() || isSubmittingComment}
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-xl disabled:opacity-50 transition-colors"
                >
                  Enviar
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Share Drawer/Sheet */}
      <AnimatePresence>
        {showShareOptions && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-40 rounded-[2.5rem]"
              onClick={(e) => {
                e.stopPropagation();
                setShowShareOptions(false);
              }}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="absolute bottom-0 left-0 right-0 bg-zinc-900 border-t border-white/10 rounded-t-[2rem] z-50 flex flex-col p-6 text-white cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
                <span className="font-bold text-sm">Compartilhar Vídeo</span>
                <button 
                  onClick={() => setShowShareOptions(false)}
                  className="text-slate-400 hover:text-white text-xs font-semibold px-2.5 py-1 rounded hover:bg-white/5"
                >
                  Fechar
                </button>
              </div>

              {/* Grid of sharing options */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent((video.description || 'Confira este vídeo no Orgino Group!') + " " + getShareUrl())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowShareOptions(false)}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-[#25D366] fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.858-4.42 9.86-9.864.001-2.636-1.02-5.11-2.871-6.963C16.6 2.167 14.124 1.17 11.487 1.17c-5.43 0-9.852 4.418-9.855 9.862-.001 1.69.441 3.336 1.28 4.796L1.874 21.9l6.22-1.63c-1.5-.83-1.45-.78-.73-.39h.01zM17.5 14.5c-.28-.14-1.67-.82-1.92-.91-.25-.09-.44-.14-.62.14-.18.28-.7 1.26-.86 1.44-.16.18-.32.2-.6.06-2.58-1.29-3.23-2.18-4.38-4.15-.3-.52.3-.48.86-1.6.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.05-.23-.55-.47-.48-.65-.49-.17-.01-.36-.01-.56-.01-.2 0-.52.07-.79.37-.27.3-1.02 1-1.02 2.44 0 1.44 1.05 2.84 1.2 3.03.15.19 2.07 3.16 5.02 4.44.7.3 1.25.48 1.68.62.7.22 1.34.19 1.84.11.56-.08 1.67-.68 1.9-1.34.23-.66.23-1.22.16-1.34-.07-.12-.25-.26-.53-.4z"/>
                    </svg>
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-white transition-colors">WhatsApp</span>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowShareOptions(false)}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-[#1877F2]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-white transition-colors">Facebook</span>
                </a>

                {/* Twitter / X */}
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(video.description || 'Confira este vídeo no Orgino Group!')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowShareOptions(false)}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.1177z"/>
                    </svg>
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-white transition-colors">Twitter (X)</span>
                </a>

                {/* Telegram */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(video.description || 'Confira este vídeo no Orgino Group!')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowShareOptions(false)}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-[#0088cc]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-[#0088cc] fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.97-.74 3.79-1.65 6.32-2.73 7.59-3.25 3.61-1.48 4.36-1.74 4.85-1.75.11 0 .35.03.5.16.13.12.17.29.19.41z"/>
                    </svg>
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-white transition-colors">Telegram</span>
                </a>
              </div>

              {/* Copy Link Row */}
              <button
                onClick={copyToClipboard}
                className="w-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors p-3.5 rounded-xl flex items-center justify-between text-xs font-semibold"
              >
                <div className="flex items-center gap-3">
                  <Link2 size={16} className="text-primary" />
                  <span>Copiar link do vídeo</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono overflow-hidden text-ellipsis max-w-[150px] whitespace-nowrap">
                  {getShareUrl()}
                </span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function VideoFeed() {
  const { profile, loading: authLoading } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      if (authLoading) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('videos_feed')
          .select(`
            *,
            user:user_profiles (full_name)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Filtragem por Estado da Segmentação Regional
        let filteredData = data || [];
        if (profile?.state) {
          const userState = profile.state.toUpperCase();
          filteredData = (data || []).filter((video: any) => {
            // Se o vídeo não tiver estados segmentados ou a lista estiver vazia, exibe para todos
            if (!video.target_states || video.target_states.length === 0) return true;
            // Se o estado do usuário estiver na lista de estados destino do vídeo
            return video.target_states.map((s: string) => s.toUpperCase()).includes(userState);
          });
        } else {
          // Se o usuário não tiver estado cadastrado, exibe apenas os vídeos que NÃO possuem restrição
          filteredData = (data || []).filter((video: any) => !video.target_states || video.target_states.length === 0);
        }

        setVideos(filteredData as any);
        if (filteredData && filteredData.length > 0) {
          setActiveId(filteredData[0].id.toString());
        } else {
          setActiveId(null);
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [authLoading, profile]);

  useEffect(() => {
    if (loading || videos.length === 0) return;

    const options = {
      root: containerRef.current,
      threshold: 0.6,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("data-video-id");
          setActiveId(id);
        }
      });
    }, options);

    const cards = containerRef.current?.querySelectorAll(".video-snap-card");
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [loading, videos]);

  return (
    <Layout>
      <div className="max-w-md mx-auto h-[calc(100vh-160px)] relative">
        {loading ? (
          <div className="flex items-center justify-center h-full bg-black rounded-[2.5rem] border border-white/10">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div 
            ref={containerRef}
            className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar rounded-[2.5rem] border border-white/10 bg-black relative shadow-2xl"
          >
            {videos.length > 0 ? (
              videos.map((video) => (
                <div key={video.id} data-video-id={video.id} className="h-full w-full snap-start video-snap-card">
                  <VideoCard 
                    video={video} 
                    isActive={activeId === video.id.toString()} 
                  />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center">
                <Play className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-bold text-white mb-2">Nenhum vídeo disponível</p>
                <p className="text-sm text-slate-400 mb-6">Não encontramos vídeos recomendados para o seu estado.</p>
                {!profile?.state && (
                  <Link 
                    to="/dashboard"
                    className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-all animate-pulse"
                  >
                    Cadastrar meu Endereço
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
