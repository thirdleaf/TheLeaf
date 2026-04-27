"use client";

import React, { useState } from "react";
import { 
  Users, 
  Search, 
  MoreVertical, 
  Mail, 
  Briefcase, 
  ArrowUpRight, 
  ExternalLink,
  Plus,
  Filter,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { formatIndianCurrency } from "@thirdleaf/utils";

// Mock Data
const MOCK_CLIENTS = [
  {
    id: "c1",
    name: "Ravi Kumar",
    company: "Capital Growth Ltd",
    email: "ravi@growth.in",
    broker: "Zerodha",
    activeProjects: 1,
    totalBilled: 120000 * 100, // paise
    totalPaid: 105000 * 100,
    status: "ACTIVE"
  },
  {
    id: "c2",
    name: "Priya Singh",
    company: "Singh Algotech",
    email: "priya@singh.in",
    broker: "Fyers",
    activeProjects: 2,
    totalBilled: 45000 * 100,
    totalPaid: 45000 * 100,
    status: "ACTIVE"
  },
  {
    id: "c3",
    name: "Suresh Gupta",
    company: "Gupta Traders",
    email: "suresh@gupta.in",
    broker: "Upstox",
    activeProjects: 0,
    totalBilled: 250000 * 100,
    totalPaid: 250000 * 100,
    status: "INACTIVE"
  }
];

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-heading text-white">Clients & Partners</h1>
          <p className="text-zinc-500 mt-1">Manage your professional relationships and revenue streams.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-zinc-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search clients..." 
                className="bg-zinc-900 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button className="h-11 px-6 bg-brand-primary text-black font-bold rounded-xl flex items-center gap-2 hover:bg-brand-primary/90 transition-all shadow-lg">
             <Plus size={18} /> Add Client
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatsSummaryCard title="Total Clients" value="42" change="+3 this month" icon={<Users className="text-brand-primary" />} />
         <StatsSummaryCard title="Active Projects" value="12" change="86% delivery rate" icon={<Briefcase className="text-amber-500" />} />
         <StatsSummaryCard title="Revenue (MTD)" value={formatIndianCurrency(450000)} change="+12% vs last month" icon={<DollarSign className="text-emerald-500" />} />
         <StatsSummaryCard title="Pending Invoices" value={formatIndianCurrency(85000)} change="3 overdue items" icon={<ArrowUpRight className="text-red-500" />} />
      </div>

      <div className="bg-[#09090b] border border-white/5 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
         <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/50 text-zinc-500 font-bold uppercase text-[10px] tracking-widest border-b border-white/5">
              <tr>
                 <th className="px-8 py-5">Client Information</th>
                 <th className="px-8 py-5">Broker</th>
                 <th className="px-8 py-5">Active Work</th>
                 <th className="px-8 py-5">Billing (Total)</th>
                 <th className="px-8 py-5">Status</th>
                 <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {MOCK_CLIENTS.map(client => (
                  <tr key={client.id} className="hover:bg-white/5 transition-colors group">
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-blue-500 flex items-center justify-center font-black text-black">
                             {client.name.charAt(0)}
                           </div>
                           <div>
                              <p className="font-bold text-white group-hover:text-brand-primary transition-colors">{client.name}</p>
                              <p className="text-xs text-zinc-500 flex items-center gap-1"><Mail size={12} /> {client.email}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <span className="text-[10px] font-bold bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full uppercase tracking-wider">{client.broker}</span>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-bold text-zinc-200">{client.activeProjects} Projects</span>
                           {client.activeProjects > 0 && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <p className="text-sm font-bold text-white font-mono">{formatIndianCurrency(client.totalPaid / 100)}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">/ {formatIndianCurrency(client.totalBilled / 100)}</p>
                     </td>
                     <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          client.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500" : "bg-zinc-800 text-zinc-500"
                        }`}>
                           <div className={`w-1 h-1 rounded-full ${client.status === "ACTIVE" ? "bg-emerald-500" : "bg-zinc-500"}`} />
                           {client.status}
                        </span>
                     </td>
                     <td className="px-8 py-6 text-right">
                        <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                           <MoreVertical size={18} />
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}

const StatsSummaryCard = ({ title, value, change, icon }: any) => (
  <div className="bg-[#09090b] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all shadow-lg group">
    <div className="flex items-center justify-between mb-4">
       <div className="p-2 bg-zinc-900 border border-white/5 rounded-xl group-hover:scale-110 transition-transform">
         {icon}
       </div>
       <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{change}</span>
    </div>
    <div className="space-y-1">
       <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{title}</p>
       <h3 className="text-2xl font-black text-white font-mono">{value}</h3>
    </div>
  </div>
);
