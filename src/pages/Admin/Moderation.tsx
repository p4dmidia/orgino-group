import React from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { motion } from "motion/react";
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Play, 
  MessageSquare,
  ShieldAlert,
  Eye,
  Flag
} from "lucide-react";

const mockReports = [
  { id: 1, type: "video", user: "@fake_news_01", reporter: "@user_99", reason: "Desinformação", time: "Há 10m", status: "pending", preview: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=600&fit=crop" },
  { id: 2, type: "comment", user: "@hater_pro", reporter: "@clara_style", reason: "Spam / Ódio", time: "Há 15m", status: "pending", content: "Isso é uma farsa! Não acreditem em nada disso..." },
  { id: 3, type: "video", user: "@scam_master", reporter: "@roberto_dev", reason: "Conteúdo Impróprio", time: "Há 1h", status: "pending", preview: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop" },
  { id: 4, type: "video", user: "@influencer_ok", reporter: "@system", reason: "Copyright detectado", time: "Há 2h", status: "reviewed", preview: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop" },
];

export default function AdminModeration() {
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <AlertTriangle className="text-red-500" />
              Fila de Moderação
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Gerencie denúncias de conteúdo e mantenha a comunidade segura.</p>
          </div>
          <div className="flex gap-2 bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5">
            <button className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-red-600/20">Pendentes</button>
            <button className="text-zinc-500 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">Resolvidos</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Denúncias Hoje", value: "48", color: "text-red-500" },
            { label: "Tempo de Resposta", value: "12min", color: "text-blue-400" },
            { label: "Usuários Banidos", value: "14", color: "text-zinc-400" },
            { label: "Nível de Risco", value: "Baixo", color: "text-emerald-400" },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900/40 border border-white/5 p-5 rounded-3xl">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {mockReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-6 flex flex-col md:flex-row gap-6 hover:border-red-500/30 transition-all group"
            >
              {/* Media Preview / Icon */}
              <div className="w-full md:w-40 h-56 bg-zinc-800 rounded-[2rem] overflow-hidden relative flex-shrink-0">
                {report.type === "video" ? (
                  <>
                    <img src={report.preview} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                        <Play size={24} fill="currentColor" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                    <MessageSquare size={48} className="text-zinc-700" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${
                    report.type === "video" ? "bg-purple-600 text-white" : "bg-blue-600 text-white"
                  }`}>
                    {report.type}
                  </span>
                </div>
              </div>

              {/* Report Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Infrator: {report.user}</h3>
                      <p className="text-xs text-zinc-500 flex items-center gap-1">
                        <Flag size={12} className="text-red-500" />
                        Denunciado por: <span className="text-zinc-300">{report.reporter}</span>
                      </p>
                    </div>
                    <span className="text-[10px] text-zinc-600 font-bold uppercase">{report.time}</span>
                  </div>

                  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl mb-4">
                    <p className="text-xs text-zinc-500 font-bold uppercase mb-2">Motivo da Denúncia:</p>
                    <p className="text-sm text-zinc-200">{report.reason}</p>
                    {report.content && (
                      <p className="mt-3 text-sm italic text-zinc-400 border-l-2 border-red-500/50 pl-3">
                        "{report.content}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm">
                    <CheckCircle size={18} />
                    Ignorar
                  </button>
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-red-600/10">
                    <XCircle size={18} />
                    Remover
                  </button>
                  <button className="p-3 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-2xl transition-all" title="Ver detalhes do perfil">
                    <Eye size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
