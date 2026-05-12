import React from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { motion } from "motion/react";
import { 
  Users as UsersIcon, 
  Search, 
  Filter, 
  MoreVertical, 
  Shield, 
  Mail, 
  Calendar,
  ChevronRight,
  UserPlus
} from "lucide-react";

const mockUsers = [
  { id: 1, name: "Alex Rivera", email: "alex@example.com", level: 4, role: "Influencer", joinDate: "12/05/2024", status: "Ativo" },
  { id: 2, name: "Maria Silva", email: "maria@example.com", level: 2, role: "Partner", joinDate: "10/05/2024", status: "Ativo" },
  { id: 3, name: "João Pedro", email: "joao@example.com", level: 5, role: "Producer", joinDate: "08/05/2024", status: "Pendente" },
  { id: 4, name: "Carla Souza", email: "carla@example.com", level: 1, role: "User", joinDate: "05/05/2024", status: "Inativo" },
  { id: 5, name: "Roberto Lima", email: "roberto@example.com", level: 3, role: "Influencer", joinDate: "01/05/2024", status: "Ativo" },
];

export default function AdminUsers() {
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <UsersIcon className="text-red-500" />
              Gestão de Usuários
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Gerencie todos os membros da plataforma Orgino Group.</p>
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-600/20">
            <UserPlus size={20} />
            Novo Usuário
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Membros", value: "24.502", color: "text-blue-400" },
            { label: "Ativos Hoje", value: "12.100", color: "text-emerald-400" },
            { label: "Novos (7d)", value: "+842", color: "text-purple-400" },
            { label: "Taxa Retenção", value: "94%", color: "text-orange-400" },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou ID..."
              className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="bg-zinc-900/50 border border-white/10 rounded-2xl px-6 py-3.5 text-zinc-300 flex items-center gap-2 hover:bg-zinc-800 transition-colors font-bold">
              <Filter className="w-5 h-5" />
              Filtrar
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500">Usuário</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500">Nível / Role</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500">Data Cadastro</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockUsers.map((user, index) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="" />
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-red-500 transition-colors">{user.name}</p>
                          <p className="text-xs text-zinc-500 flex items-center gap-1">
                            <Mail size={12} />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white flex items-center gap-1">
                          <Shield size={14} className="text-red-500" />
                          Nível {user.level}
                        </span>
                        <span className="text-xs text-zinc-500 uppercase font-black tracking-tighter mt-1">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <Calendar size={14} />
                        {user.joinDate}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                        user.status === "Ativo" ? "bg-emerald-500/10 text-emerald-500" :
                        user.status === "Pendente" ? "bg-yellow-500/10 text-yellow-500" :
                        "bg-red-500/10 text-red-500"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                          <ChevronRight size={18} />
                        </button>
                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
            <p className="text-xs text-zinc-500 font-medium">Mostrando 5 de 24.502 usuários</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold disabled:opacity-50" disabled>Anterior</button>
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold">Próxima</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
