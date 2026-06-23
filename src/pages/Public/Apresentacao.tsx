import React from "react";
import PublicLayout from "../../components/Layout/PublicLayout";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export default function Apresentacao() {
  return (
    <PublicLayout>
      <div className="min-h-[85vh] flex flex-col items-center justify-center py-16 px-6 relative overflow-hidden">
        {/* Background glow matching the site aesthetics */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-primary/10 blur-[100px] md:blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl w-full text-center space-y-8 relative z-10">
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-accent"
          >
            <Sparkles size={12} className="animate-pulse text-accent" />
            Apresentação Oficial
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold leading-tight"
          >
            Descubra o <span className="text-gradient">Orgino Group</span>
          </motion.h1>

          {/* Intro Copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
          >
            O Orgino Group é o maior ecossistema de crescimento coletivo e monetização digital. 
            Nossa missão é equilibrar a Creator Economy através da união, gerando impacto real, 
            liberdade financeira e desenvolvimento sustentável para todos os membros da nossa rede. 
            Assista à nossa apresentação institucional completa abaixo.
          </motion.p>

          {/* Interactive Iframe Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full flex justify-center pt-6"
          >
            <div className="w-full max-w-[724px] rounded-3xl p-3 bg-zinc-950/40 border border-white/5 shadow-2xl shadow-primary/10 backdrop-blur-sm hover:border-primary/25 transition-colors duration-300">
              <div className="w-full overflow-hidden rounded-2xl flex justify-center bg-black">
                <iframe
                  src="https://gamma.app/embed/0p7mznvk0hkafgq"
                  style={{ width: "700px", maxWidth: "100%", height: "450px" }}
                  allow="fullscreen"
                  title="Untitled"
                  className="border-none"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
}
