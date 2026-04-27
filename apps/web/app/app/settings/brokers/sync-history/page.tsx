"use client";

import React from "react";
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Search,
  Filter,
  Calendar,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const SYNC_HISTORY = [
  { id: "s1", broker: "ZERODHA", date: new Date(), count: 12, status: "SUCCESS" },
  { id: "s2", broker: "FYERS", date: new Date(Date.now() - 86400000), count: 0, status: "ERROR", error: "Authentication failed. Token expired." },
  { id: "s3", broker: "ZERODHA", date: new Date(Date.now() - 86400000 * 2), count: 4, status: "SUCCESS" },
  { id: "s4", broker: "UPSTOX", date: new Date(Date.now() - 86400000 * 3), count: 8, status: "SUCCESS" },
  { id: "s5", broker: "ZERODHA", date: new Date(Date.now() - 86400000 * 4), count: 15, status: "SUCCESS" },
];

export default function SyncHistoryPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/app/settings/brokers" className="p-2 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400 hover:text-white transition-all">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-heading text-white">Sync History</h1>
          <p className="text-zinc-500 mt-1">Audit log of all broker data imports and background syncs.</p>
        </div>
      </div>

      <div className="bg-[#09090b] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
         <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950/50">
            <div className="relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
               <input 
                 placeholder="Search by broker or date..." 
                 className="pl-11 pr-6 py-3 bg-zinc-900 border border-white/5 rounded-2xl text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all w-full md:w-80"
               />
            </div>
            <div className="flex items-center gap-3">
               <button className="h-11 px-6 bg-zinc-900 border border-white/5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-all flex items-center gap-2">
                 <Filter size={14} /> All Brokers
               </button>
               <button className="h-11 px-6 bg-zinc-900 border border-white/5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-all flex items-center gap-2">
                 <Calendar size={14} /> Last 30 Days
               </button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-zinc-950 border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                     <th className="px-8 py-6 font-black">Broker</th>
                     <th className="px-8 py-6 font-black">Sync Date</th>
                     <th className="px-8 py-6 font-black text-center">Trades Imported</th>
                     <th className="px-8 py-6 font-black">Status</th>
                     <th className="px-8 py-6 font-black"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {SYNC_HISTORY.map((sync) => (
                     <tr key={sync.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center font-black text-[10px] text-white border border-white/5">
                                 {sync.broker.charAt(0)}
                              </div>
                              <span className="text-sm font-bold text-white">{sync.broker}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-xs font-medium text-zinc-400">{format(sync.date, "MMM dd, yyyy • hh:mm a")}</span>
                        </td>
                        <td className="px-8 py-6 text-center">
                           <span className="text-sm font-bold font-mono text-zinc-300">{sync.count}</span>
                        </td>
                        <td className="px-8 py-6">
                           <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                             sync.status === 'SUCCESS' ? 'text-emerald-500' : 'text-red-500'
                           }`}>
                              {sync.status === 'SUCCESS' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                              {sync.status}
                           </div>
                           {sync.error && <p className="text-[10px] text-red-500/50 mt-1 max-w-[200px] truncate">{sync.error}</p>}
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button className="p-2 text-zinc-600 hover:text-brand-primary transition-colors opacity-0 group-hover:opacity-100">
                              <ExternalLink size={16} />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <div className="p-8 border-t border-white/5 bg-zinc-950/20 text-center">
            <p className="text-[10px] font-black uppercase tracking-tighter text-zinc-700">Displaying last 20 sync operations</p>
         </div>
      </div>
    </div>
  );
}
