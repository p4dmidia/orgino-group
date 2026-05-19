import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  X,
  Image as ImageIcon,
  Trash2,
  Loader2,
  Settings,
  MapPin,
  Tag,
  Briefcase,
  ExternalLink,
  Phone,
  Mail,
  Save,
  ChevronRight
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Tables } from "../../types/database";
import { toast } from "sonner";

type Company = Tables<'companies'> & {
  company_cashback_config?: { cashback_percentage: number } | null;
  categories?: { id: string; name: string }[];
};

type Category = Tables<'categories'>;

export default function AdminPartners() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nome_fantasia: "",
    razao_social: "",
    cnpj: "",
    email: "",
    telefone: "",
    responsavel: "",
    endereco: "",
    address_city: "",
    address_state: "",
    description: "",
    whatsapp: "",
    thumbnail_url: "",
    cashback_percentage: 5,
    selected_categories: [] as string[]
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Fetch categories
      const { data: catData } = await supabase.from('categories').select('*').order('name');
      if (catData) setCategories(catData);

      // 2. Fetch companies with cashback
      const { data: compData, error } = await supabase
        .from('companies')
        .select(`
          *,
          company_cashback_config (cashback_percentage),
          company_categories (category_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(compData as any || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const resetForm = () => {
    setFormData({
      nome_fantasia: "",
      razao_social: "",
      cnpj: "",
      email: "",
      telefone: "",
      responsavel: "",
      endereco: "",
      address_city: "",
      address_state: "",
      description: "",
      whatsapp: "",
      thumbnail_url: "",
      cashback_percentage: 5,
      selected_categories: []
    });
    setThumbnailFile(null);
    setEditingId(null);
  };

  const handleEdit = (company: Company) => {
    setFormData({
      nome_fantasia: company.nome_fantasia || "",
      razao_social: company.razao_social || "",
      cnpj: company.cnpj || "",
      email: company.email || "",
      telefone: company.telefone || "",
      responsavel: company.responsavel || "",
      endereco: company.endereco || "",
      address_city: company.address_city || "",
      address_state: company.address_state || "",
      description: company.description || "",
      whatsapp: company.whatsapp || "",
      thumbnail_url: company.thumbnail_url || "",
      cashback_percentage: company.company_cashback_config?.cashback_percentage || 5,
      selected_categories: company.company_categories?.map((cc: any) => cc.category_id) || []
    });
    setEditingId(company.id.toString());
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este parceiro?")) return;
    
    try {
      const { error } = await supabase.from('companies').delete().eq('id', id);
      if (error) throw error;
      toast.success("Parceiro excluído!");
      fetchInitialData();
    } catch (err) {
      console.error('Error deleting:', err);
      toast.error("Erro ao excluir parceiro.");
    }
  };

  const uploadThumbnail = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('company-logos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('company-logos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!formData.nome_fantasia || !formData.cnpj) {
      return toast.error("Nome Fantasia e CNPJ são obrigatórios.");
    }

    setIsSaving(true);
    try {
      let finalThumbnailUrl = formData.thumbnail_url;

      if (thumbnailFile) {
        finalThumbnailUrl = await uploadThumbnail(thumbnailFile);
      }

      const companyPayload = {
        nome_fantasia: formData.nome_fantasia,
        razao_social: formData.razao_social,
        cnpj: formData.cnpj,
        email: formData.email,
        telefone: formData.telefone,
        responsavel: formData.responsavel,
        endereco: formData.endereco,
        address_city: formData.address_city,
        address_state: formData.address_state,
        description: formData.description,
        whatsapp: formData.whatsapp,
        thumbnail_url: finalThumbnailUrl,
        senha_hash: editingId ? undefined : 'temp123' // Only for new
      };

      let companyId: any;

      if (editingId) {
        const { error } = await supabase
          .from('companies')
          .update(companyPayload)
          .eq('id', editingId);
        if (error) throw error;
        companyId = editingId;
      } else {
        const { data, error } = await supabase
          .from('companies')
          .insert([companyPayload])
          .select()
          .single();
        if (error) throw error;
        companyId = data.id;
      }

      // Upsert Cashback Config
      const { error: cashbackError } = await supabase
        .from('company_cashback_config')
        .upsert({
          company_id: companyId,
          cashback_percentage: formData.cashback_percentage,
          is_active: true
        }, { onConflict: 'company_id' });

      if (cashbackError) throw cashbackError;

      // 3. Update Categories
      if (formData.selected_categories.length >= 0) {
        // Delete old associations
        await supabase.from('company_categories').delete().eq('company_id', companyId);
        
        if (formData.selected_categories.length > 0) {
          const categoryAssociations = formData.selected_categories.map(catId => ({
            company_id: companyId,
            category_id: catId
          }));
          const { error: catError } = await supabase.from('company_categories').insert(categoryAssociations);
          if (catError) throw catError;
        }
      }

      toast.success(editingId ? "Parceiro atualizado!" : "Novo parceiro cadastrado!");
      setIsModalOpen(false);
      resetForm();
      fetchInitialData();
    } catch (err: any) {
      console.error('Error saving:', err);
      toast.error("Erro ao salvar: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.nome_fantasia?.toLowerCase().includes(search.toLowerCase()) ||
    c.cnpj?.includes(search)
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Building2 className="text-primary" />
              Gestão de Parceiros
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Empresas conveniadas e descontos para membros.</p>
          </div>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="bg-primary hover:bg-primary/80 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95"
          >
            <Plus size={20} />
            Novo Parceiro
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Pesquisar por nome ou CNPJ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <button className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl text-zinc-400 hover:text-white transition-all">
            <Filter size={20} />
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompanies.map((company) => (
              <motion.div 
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-primary/30 transition-all flex flex-col"
              >
                <div className="p-8 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden border-4 border-zinc-800 shadow-xl">
                      <img 
                        src={company.thumbnail_url || `https://ui-avatars.com/api/?name=${company.nome_fantasia}&background=random`} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="relative">
                      <button 
                        onClick={() => setActiveMenuId(activeMenuId === company.id.toString() ? null : company.id.toString())}
                        className="p-2 text-zinc-500 hover:text-white transition-colors"
                      >
                        <MoreVertical size={20} />
                      </button>
                      <AnimatePresence>
                        {activeMenuId === company.id.toString() && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden"
                          >
                            <button 
                              onClick={() => handleEdit(company)}
                              className="w-full px-4 py-3 text-left text-sm text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-all"
                            >
                              <Settings size={14} />
                              Editar Dados
                            </button>
                            <button 
                              onClick={() => handleDelete(company.id.toString())}
                              className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2 transition-all"
                            >
                              <Trash2 size={14} />
                              Excluir Parceiro
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-white line-clamp-1">{company.nome_fantasia}</h3>
                      <div className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {company.company_cashback_config?.cashback_percentage || 0}% OFF
                      </div>
                    </div>
                    <p className="text-zinc-500 text-xs font-medium">{company.cnpj}</p>
                  </div>

                  <p className="text-zinc-400 text-sm line-clamp-2 min-h-[40px]">
                    {company.description || "Sem descrição informada."}
                  </p>

                  <div className="space-y-3 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 text-zinc-500 text-xs">
                      <MapPin size={14} />
                      <span>{company.address_city}, {company.address_state}</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-500 text-xs">
                      <Phone size={14} />
                      <span>{company.telefone}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal Builder */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                onClick={() => !isSaving && setIsModalOpen(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                    {editingId ? "Editar Parceiro" : "Cadastrar Novo Parceiro"}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-xl text-zinc-500 transition-all">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                  {/* Thumbnail Upload */}
                  <div className="flex flex-col items-center gap-4">
                    <div 
                      onClick={() => document.getElementById('logo-upload')?.click()}
                      className="w-32 h-32 bg-zinc-900 border-2 border-dashed border-white/10 rounded-3xl overflow-hidden group cursor-pointer hover:border-primary/50 transition-all relative flex items-center justify-center"
                    >
                      {thumbnailFile ? (
                        <img src={URL.createObjectURL(thumbnailFile)} className="w-full h-full object-cover" alt="" />
                      ) : formData.thumbnail_url ? (
                        <img src={formData.thumbnail_url} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="text-zinc-600 group-hover:text-primary transition-all text-center p-4">
                          <ImageIcon size={32} className="mx-auto mb-2" />
                          <span className="text-[10px] font-black uppercase">Logo</span>
                        </div>
                      )}
                      <input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nome Fantasia</label>
                      <input 
                        type="text" value={formData.nome_fantasia} 
                        onChange={e => setFormData({...formData, nome_fantasia: e.target.value})}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-primary/50 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">CNPJ</label>
                      <input 
                        type="text" value={formData.cnpj} 
                        onChange={e => setFormData({...formData, cnpj: e.target.value})}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-primary/50 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Desconto (%)</label>
                      <input 
                        type="number" value={formData.cashback_percentage} 
                        onChange={e => setFormData({...formData, cashback_percentage: Number(e.target.value)})}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-primary/50 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">WhatsApp</label>
                      <input 
                        type="text" value={formData.whatsapp} 
                        onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-primary/50 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Cidade</label>
                      <input 
                        type="text" value={formData.address_city} 
                        onChange={e => setFormData({...formData, address_city: e.target.value})}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-primary/50 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Estado (UF)</label>
                      <input 
                        type="text" value={formData.address_state} 
                        onChange={e => setFormData({...formData, address_state: e.target.value})}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-primary/50 font-bold"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Descrição do Benefício</label>
                      <textarea 
                        rows={3} value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-primary/50 font-bold resize-none"
                      />
                    </div>

                    {/* Categories Selector */}
                    <div className="md:col-span-2 space-y-4">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Categorias</label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              const isSelected = formData.selected_categories.includes(cat.id);
                              setFormData({
                                ...formData,
                                selected_categories: isSelected 
                                  ? formData.selected_categories.filter(id => id !== cat.id)
                                  : [...formData.selected_categories, cat.id]
                              });
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                              formData.selected_categories.includes(cat.id)
                                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                : "bg-zinc-900 border-white/5 text-zinc-500 hover:border-white/20"
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-white/5 flex gap-4">
                  <button 
                    disabled={isSaving}
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    disabled={isSaving}
                    onClick={handleSave}
                    className="flex-[2] bg-primary hover:bg-primary/80 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    Salvar Parceiro
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
