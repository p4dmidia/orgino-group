import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Search, Bell, Menu, X } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

            <div className="hidden md:flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl w-64 lg:w-96">
              <Search size={18} className="text-slate-500" />
              <input 
                type="text" 
                placeholder="Buscar na plataforma..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button className="md:hidden p-2 text-slate-400 hover:text-white transition-colors">
              <Search size={22} />
            </button>

            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </button>
            
            <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
            
            <button className="bg-purple-gradient px-4 md:px-6 py-2 rounded-xl font-bold text-xs md:text-sm shadow-lg shadow-primary/20 hover:brightness-110 transition-all whitespace-nowrap">
              Novo Post
            </button>
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
