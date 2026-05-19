import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { motion, AnimatePresence } from "motion/react";
import { Search, MapPin, Tag, ChevronRight, Filter, CreditCard, Loader2, Sparkles, Building2, Phone } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Tables } from "../../types/database";

type Company = Tables<'companies'> & {
  company_cashback_config?: { cashback_percentage: number } | null;
  company_categories?: { category_id: string }[];
};

type Category = Tables<'categories'>;

export default function Partners() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | "Todos">("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const { data: catData } = await supabase.from('categories').select('*').order('name');
        if (catData) setCategories(catData);

        // Fetch companies with cashback and categories
        const { data: compData, error: compError } = await supabase
          .from('companies')
          .select(`
            *,
            company_cashback_config (cashback_percentage),
            company_categories (category_id)
          `)
          .eq('is_active', true);

        if (compError) throw compError;
        setCompanies(compData as any || []);
      } catch (err) {
        console.error('Error fetching partners:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.nome_fantasia?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategoryId === "Todos" || 
                           company.company_categories?.some(cc => cc.category_id === selectedCategoryId);

    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="space-y-12 pb-20">
        {/* Hero Section Premium */}
        <section className="relative h-80 w-full rounded-[3.5rem] overflow-hidden group shadow-2xl">
           <div className="absolute inset-0 bg-purple-gradient opacity-90" />
           <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-zinc-950" />
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
           
           <div className="absolute inset-0 p-12 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-4 max-w-xl text-center md:text-left">
                 <div className="flex items-center justify-center md:justify-start gap-2">
                    <Sparkles size={20} className="text-yellow-500" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Benefícios Exclusivos</span>
                 </div>
                 <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">Clube de Vantagens Orgino</h2>
                 <p className="text-white/70 font-medium">Economize em milhares de estabelecimentos parceiros com descontos reais direto no seu CPF.</p>
              </div>
              <button className="bg-white text-primary px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center gap-3">
                 <CreditCard size={18} />
                 Ver meu Cartão
              </button>
           </div>
           <Building2 size={300} className="absolute -right-20 -bottom-20 text-white/5 rotate-12 group-hover:rotate-45 transition-all duration-[2s]" />
        </section>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar parceiros ou especialidades..."
              className="w-full bg-zinc-900/50 border border-white/5 rounded-[2rem] py-5 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold placeholder:text-zinc-700 shadow-xl"
            />
          </div>
          <button className="bg-zinc-900/50 border border-white/5 rounded-2xl px-8 py-5 text-zinc-400 font-bold flex items-center gap-3 hover:text-white transition-all shadow-xl">
            <Filter size={20} />
            Filtros Avançados
          </button>
        </div>

        {/* Categories Carousel */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          <button
            onClick={() => setSelectedCategoryId("Todos")}
            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap shadow-lg ${
              selectedCategoryId === "Todos" 
                ? "bg-primary border-primary text-white shadow-primary/20" 
                : "bg-zinc-900/50 border-white/5 text-zinc-500 hover:text-white"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap shadow-lg ${
                selectedCategoryId === cat.id 
                  ? "bg-primary border-primary text-white shadow-primary/20" 
                  : "bg-zinc-900/50 border-white/5 text-zinc-500 hover:text-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredCompanies.map((partner, index) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-zinc-900/40 hover:bg-zinc-900/80 border border-white/5 rounded-[3rem] p-8 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-20 h-20 bg-white rounded-[1.5rem] overflow-hidden flex items-center justify-center border-4 border-zinc-800 shadow-xl group-hover:scale-110 transition-transform duration-500">
                      <img 
                        src={partner.thumbnail_url || `https://ui-avatars.com/api/?name=${partner.nome_fantasia}&background=random`} 
                        alt={partner.nome_fantasia} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-3 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest">
                      {partner.company_cashback_config?.cashback_percentage || 5}% Cashback
                    </div>
                  </div>

                  <div className="space-y-6 flex-1 flex flex-col">
                    <div>
                      <h3 className="text-2xl font-black text-white group-hover:text-primary transition-colors truncate tracking-tighter">
                        {partner.nome_fantasia}
                      </h3>
                      <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">
                        <Tag className="w-3 h-3" />
                        {partner.cnpj}
                      </div>
                    </div>

                    <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed flex-1">
                      {partner.description || "Estabelecimento parceiro Orgino Group. Benefício exclusivo para membros ativos."}
                    </p>

                    <div className="space-y-3 pt-6 border-t border-white/5">
                      <div className="flex items-center gap-3 text-zinc-500 text-xs font-medium">
                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                        <span className="truncate">{partner.address_city || "Cidade"}, {partner.address_state || "UF"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-500 text-xs font-medium">
                        <Phone className="w-4 h-4 text-primary shrink-0" />
                        <span>{partner.whatsapp || partner.telefone || "Contato indisponível"}</span>
                      </div>
                    </div>

                    <button className="w-full bg-white/5 hover:bg-primary text-zinc-400 hover:text-white font-black text-[10px] uppercase tracking-[0.2em] py-5 rounded-2xl border border-white/10 flex items-center justify-center gap-3 transition-all active:scale-95">
                      Gerar Voucher
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredCompanies.length === 0 && (
              <div className="col-span-full py-20 text-center bg-zinc-900/20 rounded-[3.5rem] border border-dashed border-white/5">
                 <p className="text-zinc-500 font-bold">Nenhum parceiro encontrado nesta categoria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
