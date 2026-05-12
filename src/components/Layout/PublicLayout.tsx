import React from "react";
import { Link } from "react-router-dom";
import { Users, Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import logoImg from "../../assets/logo.png";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-3 group">
            <div className="relative flex items-center justify-center h-12 w-12 md:h-16 md:w-16 bg-black">
              {/* The 'O' Icon - Thicker version */}
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full p-[6px] md:p-[8px] bg-gradient-to-tr from-[#00A3FF] via-[#7000FF] to-[#FF00D6] group-hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                <div className="w-full h-full rounded-full bg-black" />
              </div>
            </div>
            <span className="text-2xl md:text-4xl font-display font-black tracking-tighter text-white group-hover:translate-x-1 transition-transform">RGINO</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/como-funciona" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Como Funciona</Link>
            <Link to="/sobre" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Sobre Nós</Link>
            <Link to="/beneficios" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Benefícios</Link>
            <Link to="/auth/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Entrar</Link>
            <Link 
              to="/auth/register" 
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              Criar Conta
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 text-zinc-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black pt-20 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 py-10">
              <Link to="/como-funciona" className="text-2xl font-bold" onClick={() => setIsMenuOpen(false)}>Como Funciona</Link>
              <Link to="/sobre" className="text-2xl font-bold" onClick={() => setIsMenuOpen(false)}>Sobre Nós</Link>
              <Link to="/beneficios" className="text-2xl font-bold" onClick={() => setIsMenuOpen(false)}>Benefícios</Link>
              <div className="h-px bg-white/5 my-4" />
              <Link to="/auth/login" className="text-xl font-medium text-zinc-400" onClick={() => setIsMenuOpen(false)}>Entrar</Link>
              <Link 
                to="/auth/register" 
                className="bg-primary text-white py-4 rounded-2xl text-center font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                Começar Agora
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900/50 border-t border-white/5 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <Users className="text-primary w-8 h-8" />
              <span className="text-2xl font-display font-bold">Orgino</span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed">
              O maior ecossistema digital de crescimento coletivo para influenciadores e criadores de conteúdo.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Plataforma</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link to="/como-funciona" className="hover:text-primary transition-colors">Como Funciona</Link></li>
              <li><Link to="/cursos" className="hover:text-primary transition-colors">Marketplace</Link></li>
              <li><Link to="/beneficios" className="hover:text-primary transition-colors">Benefícios</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Empresa</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link to="/sobre" className="hover:text-primary transition-colors">Sobre Nós</Link></li>
              <li><Link to="/contato" className="hover:text-primary transition-colors">Contato</Link></li>
              <li><Link to="/termos" className="hover:text-primary transition-colors">Privacidade</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold">Newsletter</h4>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Seu melhor email" 
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="absolute right-2 top-1.5 p-1.5 bg-primary rounded-lg">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-20 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 mt-20">
          <p className="text-zinc-600 text-xs">© 2024 Orgino Group Platform. Todos os direitos reservados.</p>
          <div className="flex gap-6 text-zinc-600 text-xs uppercase font-black tracking-widest">
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">YouTube</a>
            <a href="#" className="hover:text-white">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
