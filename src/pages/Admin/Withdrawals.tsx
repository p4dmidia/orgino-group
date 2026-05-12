import React from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { motion } from "motion/react";
import { 
  ArrowUpCircle, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  AlertCircle,
  FileText
} from "lucide-react";

const mockWithdrawals = [
  { id: "TX1024", user: "Marcos Oliveira", amount: "R$ 1.200,00", bank: "Nubank", pix: "123.456.789-00", date: "Há 2 horas", status: "pending" },
  { id: "TX1025", user: "Juliana Costa", amount: "R$ 850,00", bank: "Inter", pix: "juliana@email.com", date: "Há 4 horas", status: "pending" },
  { id: "TX1026", user: "Ricardo Silva", amount: "R$ 2.450,00", bank: "Itaú", pix: "11988887766", date: "Há 5 horas", status: "pending" },
  { id: "TX1020", user: "Ana Paula", amount: "R$ 3.100,00", bank: "Santander", pix: "anapaula@pix.com", date: "Ontem", status: "approved" },
  { id: "TX1019", user: "Lucas Ferreira", amount: "R$ 450,00", bank: "Bradesco", pix: "99887766554", date: "Ontem", status: "rejected" },
];

export default function AdminWithdrawals() {
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <ArrowUpCircle className="text-yellow-400" />
              Gestão de Saques
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Aprovação e monitoramento de retiradas via PIX.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 border border-white/5 transition-all">
              <FileText size={20} />
              Exportar Relatório
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Clock size={64} className="text-yellow-400" />
            </div>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-2">Pendentes</p>
            <h3 className="text-4xl font-bold text-white">32</h3>
            <p className="text-yellow-400 text-sm font-bold mt-2">R$ 14.200,00 aguardando</p>
          </div>

          <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <CheckCircle size={64} className="text-emerald-400" />
            </div>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-2">Pagos (Hoje)</p>
            <h3 className="text-4xl font-bold text-white">128</h3>
            <p className="text-emerald-400 text-sm font-bold mt-2">R$ 52.840,00 processados</p>
          </div>

          <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <AlertCircle size={64} className="text-red-400" />
            </div>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-2">Rejeitados</p>
            <h3 className="text-4xl font-bold text-white">4</h3>
            <p className="text-red-400 text-sm font-bold mt-2">Inconsistência de dados</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-yellow-400 transition-colors" />
            <input
              type="text"
              placeholder="Buscar por usuário, ID de transação ou chave PIX..."
              className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="bg-zinc-900/50 border border-white/10 rounded-2xl px-6 py-3.5 text-zinc-300 flex items-center gap-2 hover:bg-zinc-800 transition-colors font-bold">
              <Filter className="w-5 h-5" />
              Filtrar Status
            </button>
          </div>
        </div>

        {/* Withdrawals List */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500">ID / Data</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500">Usuário</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500">Dados de Pagamento</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500">Valor</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockWithdrawals.map((w, index) => (
                  <motion.tr 
                    key={w.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-mono text-zinc-400">#{w.id}</span>
                        <span className="text-xs text-zinc-600">{w.date}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-white">{w.user}</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-zinc-300">{w.bank}</span>
                        <span className="text-xs text-zinc-500 font-mono mt-1">{w.pix}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1 text-lg font-black text-emerald-400">
                        <span className="text-xs">R$</span>
                        {w.amount.replace("R$ ", "")}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                        w.status === "approved" ? "bg-emerald-500/10 text-emerald-500" :
                        w.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
                        "bg-red-500/10 text-red-500"
                      }`}>
                        {w.status === "approved" ? "Pago" : w.status === "pending" ? "Aguardando" : "Recusado"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2">
                        {w.status === "pending" ? (
                          <>
                            <button className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl transition-all shadow-lg shadow-emerald-500/10" title="Aprovar Pagamento">
                              <CheckCircle size={20} />
                            </button>
                            <button className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all shadow-lg shadow-red-500/10" title="Recusar Saque">
                              <XCircle size={20} />
                            </button>
                          </>
                        ) : (
                          <button className="p-2.5 bg-white/5 text-zinc-500 rounded-xl cursor-not-allowed">
                            <FileText size={20} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
