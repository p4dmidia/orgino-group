import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  PlayCircle, 
  GraduationCap, 
  CreditCard, 
  Wallet, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldAlert,
  BarChart3
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "Início", path: "/dashboard" },
  { icon: BarChart3, label: "Desempenho", path: "/dashboard/afiliado" },
  { icon: Users, label: "Minha Rede", path: "/rede" },
  { icon: PlayCircle, label: "Vídeos", path: "/videos" },
  { icon: GraduationCap, label: "Treinamentos", path: "/cursos" },
  { icon: CreditCard, label: "Cartão Orgino", path: "/beneficios-membros" },
  { icon: Wallet, label: "Financeiro", path: "/financeiro" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-black border-r border-white/10 flex flex-col h-screen transition-transform duration-300 lg:sticky lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-8 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full p-[6px] bg-gradient-to-tr from-[#00A3FF] via-[#7000FF] to-[#FF00D6]">
              <div className="w-full h-full rounded-full bg-black" />
            </div>
            <span className="text-3xl font-display font-black tracking-tight text-white">RGINO</span>
          </Link>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <LogOut className="w-6 h-6 rotate-180" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${
                  isActive 
                    ? "bg-purple-gradient text-white shadow-lg shadow-primary/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={22} className={isActive ? "text-white" : "group-hover:text-primary transition-colors"} />
                  <span className="font-semibold">{item.label}</span>
                </div>
                {isActive && <motion.div layoutId="active-pill"><ChevronRight size={16} /></motion.div>}
              </Link>
            );
          })}
          
          {/* Administração removida conforme solicitado */}
        </nav>

        <div className="p-4 mt-auto">
          <div className="glass-card p-4 rounded-2xl border-white/5 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-gradient p-[2px]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.full_name || user?.user_metadata?.firstName || 'user'}`} alt="User" />
                </div>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{profile?.full_name || `${user?.user_metadata?.firstName || ''} ${user?.user_metadata?.lastName || ''}`.trim() || 'Usuário'}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  {profile?.role === 'admin' ? 'Administrador' : `Parceiro • ${profile?.referral_code || user?.user_metadata?.login || '---'}`}
                </p>
              </div>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "10%" }}
                className="h-full bg-purple-gradient"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-2 text-right">Iniciando jornada</p>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 text-slate-400 hover:text-red-400 transition-colors group"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="font-semibold">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
