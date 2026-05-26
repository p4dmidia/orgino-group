import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Search, Bell, Menu, X, Loader2 } from "lucide-react";
import { useNotifications } from "../../contexts/NotificationContext";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading: loadingNotifications } = useNotifications();

  return (
    <div className="flex min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <header className="h-20 border-b border-white/10 px-4 md:px-8 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (Notification.permission === "default") {
                    toast((t) => (
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded-lg">
                          <Bell className="text-primary" size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Ativar Notificações?</p>
                          <p className="text-xs text-zinc-500">Receba alertas de novos vídeos e ganhos!</p>
                          <div className="flex gap-2 mt-2">
                            <button 
                              onClick={() => {
                                Notification.requestPermission();
                                toast.dismiss(t.id);
                              }}
                              className="bg-primary text-white px-3 py-1 rounded-md text-[10px] font-bold"
                            >
                              Ativar
                            </button>
                            <button 
                              onClick={() => toast.dismiss(t.id)}
                              className="text-zinc-500 px-3 py-1 text-[10px] font-bold"
                            >
                              Agora não
                            </button>
                          </div>
                        </div>
                      </div>
                    ), { duration: 10000 });
                  }
                }}
                className="relative p-2 text-slate-400 hover:text-white transition-colors"
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-black">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowNotifications(false)}
                      className="fixed inset-0 z-40"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 md:w-96 bg-zinc-900 border border-white/10 rounded-[2rem] shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h3 className="font-bold text-lg">Notificações</h3>
                        <button 
                          onClick={() => markAllAsRead()}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          Lidas
                        </button>
                      </div>

                      <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                        {loadingNotifications ? (
                          <div className="p-10 flex flex-col items-center justify-center text-zinc-500 gap-3">
                            <Loader2 className="animate-spin" size={24} />
                            <p className="text-sm">Buscando...</p>
                          </div>
                        ) : notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div 
                              key={notif.id}
                              onClick={() => {
                                markAsRead(Number(notif.id));
                                if (notif.link) window.location.href = notif.link;
                              }}
                              className={`p-5 border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors relative ${!notif.is_read ? "bg-primary/5" : ""}`}
                            >
                              {!notif.is_read && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                              )}
                              <p className="font-bold text-sm text-white mb-1">{notif.title}</p>
                              <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{notif.message}</p>
                              <p className="text-[10px] text-zinc-600 mt-2 font-medium">
                                {new Date(notif.created_at).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="p-12 text-center text-zinc-600">
                            <Bell className="mx-auto mb-3 opacity-20" size={32} />
                            <p className="text-sm">Nenhuma notificação por aqui.</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
