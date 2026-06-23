import React, { useState, useEffect } from "react";
import PublicLayout from "../../components/Layout/PublicLayout";
import { motion, AnimatePresence } from "motion/react";
import { 
  CreditCard, 
  Loader2, 
  AlertCircle, 
  User, 
  Mail, 
  Lock, 
  ChevronRight, 
  CheckCircle,
  QrCode,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { createInfinitePayCheckoutLink } from "../../services/infinitePay";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function Checkout() {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [paying, setPaying] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Auth Forms States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    whatsapp: "",
    cpfCnpj: "",
    cep: "",
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    sponsorCode: ""
  });
  const [cepLoading, setCepLoading] = useState(false);

  useEffect(() => {
    // Carrega código de indicação do ref se houver
    const ref = searchParams.get("ref") || localStorage.getItem("sponsor_code");
    if (ref) {
      setRegisterForm(prev => ({ ...prev, sponsorCode: ref }));
    }
  }, [searchParams]);

  // Cep auto-completing
  const handleCepChange = async (cepValue: string) => {
    const cleanCep = cepValue.replace(/\D/g, "");
    setRegisterForm(prev => ({ ...prev, cep: cleanCep }));

    if (cleanCep.length === 8) {
      setCepLoading(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setRegisterForm(prev => ({
            ...prev,
            address: data.logradouro || "",
            neighborhood: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || "",
          }));
          toast.success("Endereço preenchido automaticamente!");
        } else {
          toast.error("CEP não encontrado.");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCepLoading(false);
      }
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSubmitting(true);
    setFormError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) throw error;
      toast.success("Conectado com sucesso!");
      await refreshProfile();
    } catch (err: any) {
      setFormError(err.message || "Erro de login");
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSubmitting(true);
    setFormError(null);

    if (registerForm.password.length < 6) {
      setFormError("A senha deve ter pelo menos 6 caracteres.");
      setAuthSubmitting(false);
      return;
    }

    try {
      // Validate Sponsor Code (Optional)
      let finalSponsorId = null;
      if (registerForm.sponsorCode) {
        const { data: sponsorData, error: sponsorError } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("referral_code", registerForm.sponsorCode)
          .maybeSingle();

        if (sponsorError || !sponsorData) {
          setFormError("Código de indicação inválido.");
          setAuthSubmitting(false);
          return;
        }
        finalSponsorId = sponsorData.id;
      }

      // Check if username taken
      const { data: userCheck } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("referral_code", registerForm.username)
        .maybeSingle();

      if (userCheck) {
        setFormError("Este nome de usuário já está em uso.");
        setAuthSubmitting(false);
        return;
      }

      // Check if CPF taken
      const { data: cpfCheck } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("cpf", registerForm.cpfCnpj)
        .maybeSingle();

      if (cpfCheck) {
        setFormError("Este CPF/CNPJ já está cadastrado.");
        setAuthSubmitting(false);
        return;
      }

      const nameParts = registerForm.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: registerForm.email,
        password: registerForm.password,
        options: {
          data: {
            sponsor_code: registerForm.sponsorCode,
            login: registerForm.username,
            firstName: firstName,
            lastName: lastName,
            whatsapp: registerForm.whatsapp,
            cpfCnpj: registerForm.cpfCnpj,
            cep: registerForm.cep,
            address: registerForm.address,
            number: registerForm.number,
            complement: registerForm.complement,
            neighborhood: registerForm.neighborhood,
            city: registerForm.city,
            state: registerForm.state,
          },
        },
      });

      if (signUpError) throw signUpError;
      
      if (data.user && data.session) {
        toast.success("Cadastro realizado com sucesso!");
        await refreshProfile();
      } else {
        toast.success("Verifique seu e-mail para ativar a conta!");
        setActiveTab("login");
      }
    } catch (err: any) {
      setFormError(err.message || "Erro ao realizar cadastro.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handlePay = async () => {
    if (!profile) return;
    setPaying(true);
    try {
      // 1. Create order in database
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: profile.id,
          total_amount: 30.00,
          status: "pending",
          payment_method: "infinitepay",
          affiliate_id: profile.sponsor_id || null
        })
        .select("id")
        .single();

      if (orderError) throw orderError;

      // 2. Generate InfinitePay checkout link
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const checkoutUrl = await createInfinitePayCheckoutLink({
        orderId: order.id.toString(),
        description: "Plano de Adesão Orgino Group - Ativação",
        amountInCents: 3000,
        redirectUrl
      });

      // 3. Clear Cart
      localStorage.removeItem("orgino_cart");

      // 4. Redirect user to InfinitePay
      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Falha ao processar checkout.");
      setPaying(false);
    }
  };

  if (authLoading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen pt-32 pb-24 px-6 relative bg-radial-dark overflow-hidden">
        {/* Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 relative z-10">
          {/* Main area: Auth or Payment info */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <CreditCard size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-display font-black text-white tracking-tight">Finalizar Assinatura</h1>
                <p className="text-slate-400 text-sm">
                  {profile ? "Confirme seus dados e prossiga para o pagamento." : "Identifique-se ou crie sua conta para finalizar."}
                </p>
              </div>
            </div>

            {formError && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-sm">
                <AlertCircle size={18} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {!profile ? (
              /* Tabbed Auth Form */
              <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-white/5 bg-white/[0.02]">
                  <button
                    onClick={() => { setActiveTab("login"); setFormError(null); }}
                    className={`flex-1 py-5 font-bold text-sm uppercase tracking-widest transition-colors ${
                      activeTab === "login" ? "text-white border-b-2 border-primary bg-black/40" : "text-slate-500 hover:text-white"
                    }`}
                  >
                    Fazer Login
                  </button>
                  <button
                    onClick={() => { setActiveTab("register"); setFormError(null); }}
                    className={`flex-1 py-5 font-bold text-sm uppercase tracking-widest transition-colors ${
                      activeTab === "register" ? "text-white border-b-2 border-primary bg-black/40" : "text-slate-500 hover:text-white"
                    }`}
                  >
                    Criar Nova Conta
                  </button>
                </div>

                <div className="p-8">
                  {activeTab === "login" ? (
                    /* Login Form */
                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-300 ml-1">E-mail</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                          <input
                            type="email"
                            required
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="seu@email.com"
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-300 ml-1">Senha</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                          <input
                            type="password"
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={authSubmitting}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 group transition-all shadow-xl shadow-primary/20"
                      >
                        {authSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            Acessar Conta
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    /* Register Form (Simplified for checkout but complete) */
                    <form onSubmit={handleRegisterSubmit} className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-zinc-300 ml-1">Nome Completo</label>
                          <input
                            type="text"
                            required
                            placeholder="Nome"
                            value={registerForm.fullName}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, fullName: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-zinc-300 ml-1">Usuário</label>
                          <input
                            type="text"
                            required
                            placeholder="nome_usuario"
                            value={registerForm.username}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-zinc-300 ml-1">CPF/CNPJ</label>
                          <input
                            type="text"
                            required
                            placeholder="000.000.000-00"
                            value={registerForm.cpfCnpj}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, cpfCnpj: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-zinc-300 ml-1">WhatsApp</label>
                          <input
                            type="text"
                            required
                            placeholder="(00) 00000-0000"
                            value={registerForm.whatsapp}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-zinc-300 ml-1">CEP</label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              placeholder="00000-000"
                              value={registerForm.cep}
                              onChange={(e) => handleCepChange(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                            />
                            {cepLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-zinc-300 ml-1">Estado</label>
                          <select
                            value={registerForm.state}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, state: e.target.value }))}
                            className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-3.5 px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all h-[48px]"
                            required
                          >
                            <option value="" disabled>UF</option>
                            {BRAZILIAN_STATES.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-zinc-300 ml-1">Cidade</label>
                          <input
                            type="text"
                            required
                            placeholder="Cidade"
                            value={registerForm.city}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-zinc-300 ml-1">Bairro</label>
                          <input
                            type="text"
                            required
                            placeholder="Bairro"
                            value={registerForm.neighborhood}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, neighborhood: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-zinc-300 ml-1">Rua / Av</label>
                          <input
                            type="text"
                            required
                            placeholder="Rua"
                            value={registerForm.address}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-zinc-300 ml-1">Número</label>
                          <input
                            type="text"
                            required
                            placeholder="123"
                            value={registerForm.number}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, number: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-zinc-300 ml-1">Código de Indicação</label>
                          <input
                            type="text"
                            placeholder="Indicação (Opcional)"
                            value={registerForm.sponsorCode}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, sponsorCode: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-300 ml-1">E-mail</label>
                        <input
                          type="email"
                          required
                          placeholder="seu@email.com"
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-300 ml-1">Senha</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={authSubmitting}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 group transition-all shadow-xl shadow-primary/20"
                      >
                        {authSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            Criar Conta e Prosseguir
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              /* Logged In Billing Details */
              <div className="space-y-6">
                <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-6">
                  <h3 className="text-xl font-bold text-white font-display">Dados do Assinante</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-1">
                      <p className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Nome Completo</p>
                      <p className="text-white font-semibold">{profile.full_name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">E-mail</p>
                      <p className="text-white font-semibold">{profile.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Documento (CPF/CNPJ)</p>
                      <p className="text-white font-semibold">{profile.cpf || "Não cadastrado"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Telefone</p>
                      <p className="text-white font-semibold">{profile.phone || "Não cadastrado"}</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-6">
                  <h3 className="text-xl font-bold text-white font-display">Método de Pagamento</h3>
                  
                  <div className="bg-primary/5 border border-primary/30 p-6 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                        <QrCode size={24} />
                      </div>
                      <div>
                        <p className="text-white font-bold">PIX / Cartão via InfinitePay</p>
                        <p className="text-slate-400 text-xs mt-0.5">Pagamento seguro, instantâneo e sem taxas extras.</p>
                      </div>
                    </div>
                    <CheckCircle className="text-primary fill-primary/20" size={24} />
                  </div>

                  <div className="flex gap-3 items-start bg-white/5 p-4 rounded-xl text-xs text-zinc-500">
                    <ShieldCheck className="text-primary shrink-0" size={16} />
                    <span>
                      Você será redirecionado com segurança para o ambiente da InfinitePay para efetuar o pagamento.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-8 rounded-[2.5rem] border-primary/30 bg-primary/5 shadow-2xl shadow-primary/10 space-y-6">
              <h3 className="text-xl font-bold text-white font-display">Resumo</h3>
              
              <div className="space-y-4 text-sm font-semibold">
                <div className="flex justify-between items-start text-white">
                  <div>
                    <p className="font-bold">Plano de Adesão</p>
                    <p className="text-xs text-slate-400 mt-0.5">Orgino Group (Anual)</p>
                  </div>
                  <span>R$ 30,00</span>
                </div>
                
                <div className="border-t border-white/5 pt-4 flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>R$ 30,00</span>
                </div>
                
                <div className="flex justify-between text-slate-400">
                  <span>Taxa do Gateway</span>
                  <span className="text-emerald-400">Grátis</span>
                </div>

                <div className="border-t border-white/5 pt-4 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total a Pagar</p>
                    <p className="text-3xl font-black text-white font-display mt-1">R$ 30,00</p>
                  </div>
                </div>
              </div>

              {profile && (
                <button
                  onClick={handlePay}
                  disabled={paying}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-sm uppercase tracking-widest disabled:opacity-50"
                >
                  {paying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Redirecionando...
                    </>
                  ) : (
                    <>
                      Pagar R$ 30,00
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
