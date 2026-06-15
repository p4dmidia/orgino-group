import React, { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { 
  Play, 
  Volume2, 
  VolumeX, 
  Users, 
  Share2, 
  Loader2, 
  ArrowRight, 
  ChevronLeft,
  Sparkles,
  Check,
  Copy,
  Link2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-hot-toast";

interface VideoData {
  id: number;
  user_id: string;
  video_url: string;
  thumbnail_url: string | null;
  description: string | null;
  likes_count: number;
  comments_count: number;
  type: string;
  views_count: number;
  created_at: string;
}

interface AffiliateProfile {
  id: number;
  full_name: string;
  referral_code: string | null;
  email: string | null;
}

export default function PublicVideo() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const refParam = searchParams.get("ref");
  const navigate = useNavigate();

  const [video, setVideo] = useState<VideoData | null>(null);
  const [affiliate, setAffiliate] = useState<AffiliateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [copied, setCopied] = useState(false);
  const [viewLogged, setViewLogged] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Fetch Video and Affiliate Profile
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch Video details
        const { data: videoData, error: videoError } = await supabase
          .from("videos_feed")
          .select("*")
          .eq("id", parseInt(id))
          .maybeSingle();

        if (videoError) throw videoError;
        if (!videoData) {
          setError("Vídeo não encontrado ou indisponível.");
          setLoading(false);
          return;
        }

        setVideo(videoData as any);

        // 2. Fetch Affiliate/Sponsor profile if ref parameter is present
        if (refParam) {
          const isNumericId = /^\d+$/.test(refParam);
          const query = supabase
            .from("user_profiles")
            .select("id, full_name, referral_code, email");

          const { data: profileData, error: profileError } = await (isNumericId
            ? query.eq("id", parseInt(refParam))
            : query.eq("referral_code", refParam)
          ).maybeSingle();

          if (profileError) {
            console.warn("Error fetching affiliate profile:", profileError);
          } else if (profileData) {
            setAffiliate(profileData as AffiliateProfile);
          }
        }
      } catch (err: any) {
        console.error("PublicVideo loading error:", err);
        setError("Ocorreu um erro ao carregar o vídeo.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, refParam]);

  // Record video view log (only once per video load)
  useEffect(() => {
    if (!video || viewLogged) return;

    const logView = async () => {
      try {
        const affiliateId = affiliate?.id || null;
        
        // Execute RPC to log views safely and prevent ip spamming (24h lock)
        const { data: recorded, error: rpcError } = await (supabase as any).rpc("record_video_view", {
          p_video_id: video.id,
          p_affiliate_id: affiliateId
        });

        if (rpcError) {
          console.warn("View logging RPC warning:", rpcError);
        } else {
          console.log("View log recorded successfully:", recorded);
          setViewLogged(true);
        }
      } catch (err) {
        console.error("Failed to call record_video_view RPC:", err);
      }
    };

    logView();
  }, [video, affiliate, viewLogged]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const copyPageLink = () => {
    const pageUrl = window.location.href;
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    toast.success("Link do vídeo copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.split("/").pop() || "";
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&enablejsapi=1`;
  };

  const handleSignUpClick = () => {
    // Redirect to register with affiliate referral code or default to register
    const referralCode = affiliate?.referral_code || "";
    if (referralCode) {
      navigate(`/auth/register?ref=${encodeURIComponent(referralCode)}`);
    } else {
      navigate("/auth/register");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-radial-dark flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Carregando conteúdo premium...</p>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-radial-dark flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
          <ChevronLeft size={32} />
        </div>
        <h2 className="text-2xl font-bold font-display mb-3">{error || "Vídeo Indisponível"}</h2>
        <p className="text-slate-400 max-w-sm mb-8">O link acessado pode ter expirado ou o vídeo foi removido pelo criador.</p>
        <button 
          onClick={() => navigate("/")}
          className="bg-purple-gradient text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
        >
          Ir para Página Inicial
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-radial-dark flex flex-col items-center justify-center py-4 px-2 md:p-6 text-white relative overflow-hidden select-none">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0047FF]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00d2ff]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Floating Logo */}
      <div className="absolute top-4 left-6 z-40 hidden md:flex items-center gap-3">
        <div className="w-8 h-8 rounded-full p-[4px] bg-gradient-to-tr from-[#0047FF] to-[#00d2ff]">
          <div className="w-full h-full rounded-full bg-black" />
        </div>
        <span className="text-xl font-display font-black tracking-tight text-white">RGINO</span>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[450px] aspect-[9/16] h-[92vh] max-h-[850px] relative glass-card rounded-[2.5rem] overflow-hidden flex flex-col justify-between shadow-2xl border-white/10 z-10">
        
        {/* Video Frame */}
        <div className="absolute inset-0 w-full h-full bg-black z-0">
          {video.type === "youtube" ? (
            <iframe
              ref={iframeRef}
              src={getYoutubeEmbedUrl(video.video_url)}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              allow="autoplay; encrypted-media; picture-in-picture"
              title={video.description || "Video Player"}
              frameBorder="0"
            />
          ) : (
            <video
              ref={videoRef}
              src={video.video_url}
              loop
              autoPlay
              muted={isMuted}
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Dark scrims */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />
        </div>

        {/* Top Controls Overlay */}
        <div className="relative z-20 flex justify-between items-center p-6">
          <button 
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {video.type !== "youtube" && (
              <button 
                onClick={toggleMute}
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            )}

            <button 
              onClick={copyPageLink}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            >
              {copied ? <Check size={18} className="text-emerald-400" /> : <Share2 size={18} />}
            </button>
          </div>
        </div>

        {/* Bottom Content Overlay */}
        <div className="relative z-20 p-6 space-y-6 flex flex-col justify-end bg-gradient-to-t from-black via-black/40 to-transparent pt-20">
          
          {/* Video Description */}
          {video.description && (
            <p className="text-sm font-medium text-white/90 line-clamp-3 leading-relaxed drop-shadow-md pr-4">
              {video.description}
            </p>
          )}

          {/* Affiliate Attribution & CTA Card */}
          <div className="glass-card p-5 rounded-3xl border-white/10 bg-black/65 backdrop-blur-lg space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-gradient p-[2px] shadow-lg shadow-purple-500/20">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white font-bold text-sm">
                  {affiliate?.full_name?.substring(0, 2).toUpperCase() || <Users size={16} />}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Recomendado por</p>
                <p className="text-sm font-bold text-white leading-tight">
                  {affiliate?.full_name || "Parceiro Orgino Group"}
                </p>
              </div>
              <Sparkles size={16} className="text-purple-400 ml-auto animate-pulse" />
            </div>

            <button
              onClick={handleSignUpClick}
              className="w-full bg-purple-gradient text-white py-3.5 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 group shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] hover:shadow-primary/30 transition-all cursor-pointer"
            >
              <span>Fazer Cadastro Agora</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <p className="text-[10px] text-center text-slate-500 tracking-wider uppercase font-bold">
            Orgino Group • Vídeo de Influenciador
          </p>
        </div>
      </div>
    </div>
  );
}
