import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout/Layout";
import { motion, AnimatePresence } from "motion/react";
import { Heart, MessageCircle, Share2, Bookmark, Music, Plus, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Link } from "react-router-dom";
import { mockVideos } from "../../mocks/videoData";

const VideoCard = ({ video, isActive }: { video: any, isActive: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showIcon, setShowIcon] = useState<"play" | "pause" | "volume" | "mute" | null>(null);

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

  return (
    <div 
      className="h-full w-full snap-start relative flex flex-col justify-end p-6 group overflow-hidden cursor-pointer"
      onClick={togglePlay}
    >
      {/* Background Content */}
      <div className="absolute inset-0 w-full h-full">
        {video.type === "youtube" ? (
          isActive ? (
            <iframe
              ref={iframeRef}
              src={`${video.url}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&playlist=${video.url.split("/").pop()}&enablejsapi=1`}
              className="absolute inset-0 w-full h-full object-cover scale-[1.5] pointer-events-none"
              allow="autoplay; encrypted-media"
              title="YouTube Video"
            />
          ) : (
            <div className="absolute inset-0 bg-black" />
          )
        ) : (
          <video 
            ref={videoRef}
            src={video.url} 
            loop 
            muted={isMuted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
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
      <div className="absolute right-4 bottom-24 flex flex-col gap-6 z-20">
        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={toggleMute}
            className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} className="text-primary" />}
          </button>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer group/icon">
            <Heart size={24} className="group-hover/icon:text-red-500 transition-colors" />
          </div>
          <span className="text-xs font-bold">{video.likes}</span>
        </div>
        
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
            <MessageCircle size={24} />
          </div>
          <span className="text-xs font-bold">{video.comments}</span>
        </div>

        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
          <Bookmark size={24} />
        </div>
      </div>

      {/* Info Area */}
      <div className="relative z-20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.user}`} alt="Avatar" />
          </div>
          <div>
            <h4 className="font-bold text-lg flex items-center gap-2">
              {video.user}
              <button className="bg-primary px-3 py-1 rounded-full text-[10px] uppercase font-black">Seguir</button>
            </h4>
          </div>
        </div>
        
        <p className="text-sm text-slate-200 line-clamp-2">
          {video.description}
        </p>

        <div className="flex items-center gap-2 text-primary font-bold text-xs">
          <Music size={14} className="animate-spin-slow" />
          <span>Som original - Orgino Beats</span>
        </div>
      </div>
    </div>
  );
};

export default function VideoFeed() {
  const [activeId, setActiveId] = useState<number>(mockVideos[0].id);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options = {
      root: containerRef.current,
      threshold: 0.6,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = Number(entry.target.getAttribute("data-video-id"));
          setActiveId(id);
        }
      });
    }, options);

    const cards = containerRef.current?.querySelectorAll(".video-snap-card");
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <Layout>
      <div 
        ref={containerRef}
        className="max-w-md mx-auto h-[calc(100vh-160px)] overflow-y-scroll snap-y snap-mandatory no-scrollbar rounded-[2.5rem] border border-white/10 bg-black relative shadow-2xl"
      >
        {mockVideos.map((video) => (
          <div key={video.id} data-video-id={video.id} className="h-full w-full snap-start video-snap-card">
            <VideoCard 
              video={video} 
              isActive={activeId === video.id} 
            />
          </div>
        ))}

        {/* Create Post Float Button */}
        <Link 
          to="/videos/upload"
          className="absolute top-6 right-6 w-12 h-12 bg-purple-gradient rounded-full flex items-center justify-center shadow-xl shadow-primary/30 z-30 hover:scale-110 transition-transform"
        >
          <Plus size={24} />
        </Link>
      </div>
    </Layout>
  );
}
