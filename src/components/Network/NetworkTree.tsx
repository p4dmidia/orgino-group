import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronDown, User, TrendingUp, Users, DollarSign, X } from "lucide-react";

interface NodeData {
  id: string;
  name: string;
  level: string;
  referrals: number;
  earnings: string;
  children?: NodeData[];
}

interface NetworkTreeProps {
  data: NodeData;
}

const TreeNode = ({ node, depth = 0 }: { node: NodeData; depth?: number }) => {
  const [isExpanded, setIsExpanded] = useState(depth < 1);
  const [showInfo, setShowInfo] = useState(false);

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Node Container */}
      <div className="relative flex flex-col items-center group">
        {/* Node Circle */}
        <motion.div
          layout
          onClick={() => setShowInfo(true)}
          className={`relative z-10 w-16 h-16 rounded-full p-[2px] cursor-pointer transition-all hover:scale-110 shadow-lg ${
            depth === 0 
              ? "bg-purple-gradient shadow-primary/30" 
              : "bg-zinc-800 border border-white/10 hover:border-primary/50"
          }`}
        >
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${node.name}`} 
              alt={node.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Level Badge */}
          <div className="absolute -bottom-1 -right-1 bg-zinc-900 border border-white/10 rounded-full px-2 py-0.5 text-[8px] font-black uppercase text-primary">
            N{depth}
          </div>
        </motion.div>

        {/* Label */}
        <div className="mt-3 text-center">
          <p className="text-xs font-bold text-white whitespace-nowrap">{node.name}</p>
          <p className="text-[10px] text-zinc-500 font-medium">{node.level}</p>
        </div>

        {/* Expand/Collapse Toggle */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="mt-2 w-6 h-6 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:border-primary/50 transition-all z-20"
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}

        {/* Connecting Line Down (if expanded) */}
        {hasChildren && isExpanded && (
          <div className="h-10 w-px bg-gradient-to-b from-primary/50 to-transparent" />
        )}
      </div>

      {/* Children Section */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative pt-4"
          >
            {/* Horizontal Connector Line */}
            <div className="absolute top-0 left-0 right-0 flex justify-center">
              <div className="h-px bg-white/10 w-[calc(100%-4rem)]" />
            </div>

            <div className="flex gap-8 px-4">
              {node.children?.map((child) => (
                <div key={child.id} className="relative">
                  {/* Vertical line up to horizontal connector */}
                  <div className="absolute top-[-1rem] left-1/2 -translate-x-1/2 h-4 w-px bg-white/10" />
                  <TreeNode node={child} depth={depth + 1} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfo(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              {/* Header Profile */}
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-8 pt-12 text-center relative">
                <button 
                  onClick={() => setShowInfo(false)}
                  className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="w-24 h-24 rounded-full bg-purple-gradient p-1 mx-auto mb-4 shadow-xl">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${node.name}`} 
                      alt={node.name} 
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-display font-bold text-white">{node.name}</h3>
                <p className="text-primary font-bold text-xs uppercase tracking-widest mt-1">{node.level}</p>
              </div>

              {/* Stats Grid */}
              <div className="p-8 grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-zinc-500 mb-1">
                    <Users size={14} />
                    <span className="text-[10px] font-black uppercase">Diretos</span>
                  </div>
                  <p className="text-xl font-bold">{node.referrals}</p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-zinc-500 mb-1">
                    <TrendingUp size={14} />
                    <span className="text-[10px] font-black uppercase">Nível</span>
                  </div>
                  <p className="text-xl font-bold">Lvl {depth}</p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 col-span-2">
                  <div className="flex items-center gap-2 text-zinc-500 mb-1">
                    <DollarSign size={14} />
                    <span className="text-[10px] font-black uppercase">Ganhos Totais</span>
                  </div>
                  <p className="text-2xl font-display font-bold text-emerald-400">{node.earnings}</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-8 pb-8">
                <button className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl border border-white/10 transition-all text-sm">
                  Ver Perfil Detalhado
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function NetworkTree({ data }: NetworkTreeProps) {
  return (
    <div className="w-full overflow-x-auto pb-20 pt-10 scrollbar-hide">
      <div className="min-w-max px-20">
        <TreeNode node={data} />
      </div>
    </div>
  );
}
