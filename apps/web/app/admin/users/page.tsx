"use client";

import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ShieldCheck, 
  ShieldAlert,
  UserPlus,
  ArrowRight,
  UserX,
  CreditCard,
  Eye,
  Download
} from "lucide-react";
import { format } from "date-fns";

const MOCK_USERS = [
  { id: "u1", name: "Vikas Mohata", email: "vikas@example.com", plan: "prop_mentor", status: "ACTIVE", trades: 1450, joined: "2025-10-12", lastActive: "2 mins ago" },
  { id: "u2", name: "Aarav Sharma", email: "aarav.s@gmail.com", plan: "quant_builder", status: "ACTIVE", trades: 840, joined: "2026-01-05", lastActive: "4 hours ago" },
  { id: "u3", name: "Ishaan Singh", email: "ishaan@outlook.com", plan: "solo", status: "SUSPENDED", trades: 12, joined: "2026-03-20", lastActive: "12 days ago" },
  { id: "u4", name: "Kaira Gupta", email: "kaira.g@traders.in", plan: "prop_mentor", status: "ACTIVE", trades: 2100, joined: "2026-02-14", lastActive: "Just now" },
];

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">User Management</h1>
          <p className="text-zinc-500 font-medium">Oversee all active traders and manage subscription entitlements.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="h-11 px-6 bg-zinc-900 border border-white/5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-all flex items-center gap-2">
              <Download size={14} /> Export CSV
           </button>
           <button className="h-11 px-6 bg-brand-primary text-black text-xs font-black rounded-xl hover:shadow-[0_0_20px_rgba(192,132,252,0.3)] transition-all flex items-center gap-2">
              <UserPlus size={16} /> Force Add User
           </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <AdminStatCard title="Total Users" value="12,450" subtext="+420 this week" icon={<Users className="text-zinc-500" />} />
         <AdminStatCard title="Active Subs" value="8,120" subtext="65% retention rate" icon={<CreditCard className="text-emerald-500" />} />
         <AdminStatCard title="Suspended" value="45" subtext="0.3% of total" icon={<UserX className="text-red-500" />} />
         <AdminStatCard title="Today's Active" value="2,140" subtext="Concurrent peak" icon={<ShieldCheck className="text-brand-primary" />} />
      </div>

      {/* Main Users Table */}
      <div className="bg-[#09090b] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl mt-10">
         <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950/30">
            <div className="relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
               <input 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="Search by name, email or Clerk ID..." 
                 className="pl-11 pr-6 py-3.5 bg-zinc-900 border border-white/5 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-brand-primary/50 transition-all w-full md:w-[400px]"
               />
            </div>
            <div className="flex items-center gap-2">
               <button className="h-11 px-6 bg-zinc-900 border border-white/5 rounded-xl text-xs font-bold text-zinc-500 hover:text-white transition-all">
                  Filter by Plan
               </button>
               <button className="h-11 px-6 bg-zinc-900 border border-white/5 rounded-xl text-xs font-bold text-zinc-500 hover:text-white transition-all">
                  Sort: Recent
               </button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-zinc-950/50 border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                     <th className="px-8 py-6">Trader</th>
                     <th className="px-8 py-6">Status</th>
                     <th className="px-8 py-6">Plan</th>
                     <th className="px-8 py-6 text-center">Trades</th>
                     <th className="px-8 py-6">Last Active</th>
                     <th className="px-8 py-6"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {MOCK_USERS.map((user) => (
                     <tr key={user.id} className="group hover:bg-white/[0.01] transition-colors">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center font-black text-white text-xs">
                                 {user.name.charAt(0)}
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-white mb-0.5">{user.name}</p>
                                 <p className="text-[10px] text-zinc-500 font-medium">{user.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full ${
                             user.status === 'ACTIVE' 
                             ? 'bg-emerald-500/10 text-emerald-500' 
                             : 'bg-red-500/10 text-red-500'
                           }`}>
                              {user.status}
                           </span>
                        </td>
                        <td className="px-8 py-6">
                           <span className={`text-[10px] font-bold text-zinc-400 border border-white/10 px-3 py-1 rounded-lg uppercase tracking-wider ${
                             user.plan === 'prop_mentor' ? 'border-brand-primary/30 text-brand-primary' : ''
                           }`}>
                              {user.plan.replace('_', ' ')}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                           <span className="text-xs font-black font-mono text-zinc-300">{user.trades.toLocaleString()}</span>
                        </td>
                        <td className="px-8 py-6 text-xs text-zinc-500 font-medium whitespace-nowrap">
                           {user.lastActive}
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="flex items-center gap-2 h-9 px-4 bg-zinc-900 border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-brand-primary hover:border-brand-primary/30 transition-all">
                                 <Eye size={12} /> Impersonate
                              </button>
                              <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                                 <MoreHorizontal size={18} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <div className="p-8 bg-zinc-950/30 text-center">
            <button className="text-xs font-black uppercase tracking-[0.2em] text-zinc-700 hover:text-brand-primary transition-colors">
               Load More Users
            </button>
         </div>
      </div>
    </div>
  );
}

const AdminStatCard = ({ title, value, subtext, icon }: any) => (
  <div className="p-8 bg-[#09090b] border border-white/5 rounded-[2rem] hover:border-white/10 transition-all">
     <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">{title}</h3>
        {icon}
     </div>
     <div className="text-3xl font-black text-white tracking-tighter mb-1">{value}</div>
     <p className="text-[10px] font-bold text-zinc-500">{subtext}</p>
  </div>
);
