import React from "react";
import Layout from "../../components/Layout/Layout";
import { motion } from "motion/react";
import { Search, MapPin, Tag, ChevronRight, Filter, CreditCard } from "lucide-react";
import { mockPartners } from "../../mocks/partnerData";

export default function Partners() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-br from-primary/10 to-accent/10 p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2">Cartão de Descontos</h1>
            <p className="text-zinc-400">Acesse benefícios exclusivos em milhares de estabelecimentos parceiros.</p>
          </div>
          <div className="flex gap-3 relative z-10">
            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl border border-white/10 flex items-center gap-2 transition-all">
              <CreditCard className="w-5 h-5 text-primary" />
              Ver meu Cartão
            </button>
          </div>
          {/* Abstract Shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] -mr-32 -mt-32 rounded-full" />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Buscar parceiros ou categorias..."
              className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="bg-zinc-900/50 border border-white/10 rounded-2xl px-6 py-3.5 text-zinc-300 flex items-center gap-2 hover:bg-zinc-800 transition-colors">
              <Filter className="w-5 h-5" />
              Filtros
            </button>
          </div>
        </div>

        {/* Categories Quick Links */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {["Todos", "Saúde", "Alimentação", "Educação", "Moda", "Lazer", "Serviços"].map((cat) => (
            <button
              key={cat}
              className={`px-6 py-2 rounded-full border border-white/10 whitespace-nowrap transition-all ${
                cat === "Todos" ? "bg-primary text-white border-primary" : "bg-white/5 text-zinc-400 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {mockPartners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-zinc-900/40 hover:bg-zinc-800/50 border border-white/10 rounded-3xl p-6 transition-all hover:translate-y-[-4px] hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden flex items-center justify-center border-4 border-zinc-800">
                  <img src={partner.logo} alt={partner.name} className="w-full h-full object-cover" />
                </div>
                <div className="bg-primary/20 text-primary text-xs font-bold px-3 py-1.5 rounded-lg border border-primary/20">
                  {partner.discount}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{partner.name}</h3>
                  <div className="flex items-center gap-2 text-zinc-500 text-sm mt-1">
                    <Tag className="w-4 h-4" />
                    {partner.category}
                  </div>
                </div>

                <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed">
                  {partner.description}
                </p>

                <div className="flex items-center gap-2 text-zinc-500 text-xs">
                  <MapPin className="w-4 h-4" />
                  {partner.address}
                </div>

                <button className="w-full mt-2 bg-white/5 hover:bg-primary hover:text-white text-zinc-300 font-semibold py-3 rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-all">
                  Usar Benefício
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
